Q.Image.prototype.Blur = function (options = {}) {
  const DEFAULTS = {
    type: 'gaussian',
    radius: 5,
    quality: 1,
    direction: 0,
    distance: 10,
    focalDistance: 0.5,
    shape: 'circle',
    blades: 6,
    bladeCurvature: 0,
    rotation: 0,
    specularHighlights: 0,
    noise: 0
  };
  const settings = Object.assign({}, DEFAULTS, options);
  settings.radius = Math.max(1, Math.floor(settings.radius));
  settings.quality = Math.max(1, Math.round(settings.quality));
  settings.distance = Math.max(1, Math.round(settings.distance));
  settings.blades = Math.min(8, Math.max(5, Math.floor(settings.blades)));
  settings.bladeCurvature = clamp01(settings.bladeCurvature);
  settings.focalDistance = clamp01(settings.focalDistance);
  settings.specularHighlights = clamp01(settings.specularHighlights);
  settings.noise = clamp01(settings.noise);
  const ctx = this.node.getContext('2d', { willReadFrequently: true });
  const { width, height } = this.node;
  const imageData = ctx.getImageData(0, 0, width, height);
  const srcPixels = imageData.data;
  const dstPixels = new Uint8ClampedArray(srcPixels);
  const { kernel, size } = buildKernel(settings);
  for (let i = 0; i < settings.quality; i++) {
    convolve(srcPixels, dstPixels, width, height, kernel, size);
    srcPixels.set(dstPixels);
  }
  imageData.data.set(dstPixels);
  ctx.putImageData(imageData, 0, 0);
  this.saveToHistory();
  return this;
};
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function buildKernel(s) {
  switch (s.type.toLowerCase()) {
    case 'box':
      return createBoxKernel(s.radius);
    case 'motion':
      return createMotionKernel(s.radius, s.distance, s.direction);
    case 'lens':
      return createLensKernel(s);
    case 'gaussian':
    default:
      return createGaussianKernel(s.radius);
  }
}
function createGaussianKernel(radius) {
  radius = Math.max(0, Math.floor(radius));
  const size = 2 * radius + 1;
  if (size < 1 || !Number.isInteger(size)) {
    console.warn("Gaussian kernel: Invalid size derived from radius, using fallback 1x1 kernel.");
    return { kernel: new Float32Array([1]), size: 1 };
  }
  if (radius === 0) {
    return { kernel: new Float32Array([1]), size: 1 };
  }
  const kernel = new Float32Array(size * size);
  const sigma = radius / 3; 
  const twoSigmaSquare = 2 * sigma * sigma;
  let sum = 0;
  const center = radius; 
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const weight = Math.exp(-(dx * dx + dy * dy) / twoSigmaSquare);
      kernel[y * size + x] = weight;
      sum += weight;
    }
  }
  if (sum <= 0 || !isFinite(sum)) {
    console.warn("Gaussian kernel: Sum is zero or non-finite (" + sum + "), using fallback 1x1 kernel.");
    kernel.fill(0);
    const centerIndex = center * size + center;
    if (centerIndex >= 0 && centerIndex < kernel.length) {
      kernel[centerIndex] = 1;
    } else {
      return { kernel: new Float32Array([1]), size: 1 };
    }
    sum = 1; 
  } else {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= sum;
      if (!isFinite(kernel[i])) {
        console.warn("Gaussian kernel: Non-finite value after normalization, resetting to fallback 1x1 kernel.");
        kernel.fill(0);
        kernel[center * size + center] = 1; 
        break; 
      }
    }
  }
  return { kernel, size };
}
function createBoxKernel(radius) {
  const size = 2 * radius + 1;
  const kernel = new Float32Array(size * size).fill(1 / (size * size));
  return { kernel, size };
}
function createMotionKernel(radius, distance, direction) {
  const size = 2 * distance + 1;
  const kernel = new Float32Array(size * size).fill(0);
  const half = Math.floor(size / 2);
  const angle = direction * Math.PI / 180; 
  let totalWeight = 0;
  for (let t = -half; t <= half; t++) {
    const x = Math.round(Math.cos(angle) * t) + half;
    const y = Math.round(Math.sin(angle) * t) + half;
    if (x >= 0 && x < size && y >= 0 && y < size) {
      let weight = 1;
      if (radius > 1) {
        const dist = Math.abs(t) / half;
        weight = Math.exp(-dist * dist / (2 * (radius / distance) * (radius / distance)));
      }
      kernel[y * size + x] = weight;
      totalWeight += weight;
    }
  }
  if (totalWeight > 0) {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= totalWeight;
    }
  }
  return { kernel, size };
}
function createLensKernel({ radius, shape, blades, bladeCurvature, rotation, focalDistance, specularHighlights, noise }) {
  const size = 2 * radius + 1;
  const kernel = new Float32Array(size * size).fill(0);
  const half = radius;
  const rotationRad = rotation * Math.PI / 180; 
  const focalFactor = 1 - focalDistance;
  let totalWeight = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - half;
      const dy = y - half;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= radius) {
        const angle = Math.atan2(dy, dx) + rotationRad;
        let weight = 0;
        switch (shape) {
          case 'hexagon':
          case 'pentagon':
          case 'octagon':
            const bladeAngle = 2 * Math.PI / blades;
            const normalizedAngle = (angle % bladeAngle) / bladeAngle - 0.5;
            const bladeDistance = radius * (1 - bladeCurvature * Math.abs(normalizedAngle));
            weight = distance <= bladeDistance ? 1 : 0;
            break;
          case 'circle':
          default:
            weight = 1;
            const normalizedDist = distance / radius;
            if (normalizedDist > focalFactor) {
              weight *= Math.max(0, 1 - (normalizedDist - focalFactor) / (1 - focalFactor));
            }
            break;
        }
        if (specularHighlights > 0) {
          const highlightFactor = Math.max(0, 1 - distance / radius);
          weight *= 1 + specularHighlights * highlightFactor * 2;
        }
        if (noise > 0) {
          weight *= 1 + (Math.random() - 0.5) * noise;
        }
        kernel[y * size + x] = Math.max(0, weight);
        totalWeight += kernel[y * size + x];
      }
    }
  }
  if (totalWeight > 0) {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= totalWeight;
    }
  }
  return { kernel, size };
}
function convolve(src, dst, width, height, kernel, size) {
  const half = Math.floor(size / 2);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      const dstOff = (y * width + x) * 4;
      let weightSum = 0;
      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          const ny = y + ky - half;
          const nx = x + kx - half;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const srcOff = (ny * width + nx) * 4;
            const weight = kernel[ky * size + kx];
            if (isFinite(weight)) {
              r += src[srcOff] * weight;
              g += src[srcOff + 1] * weight;
              b += src[srcOff + 2] * weight;
              a += src[srcOff + 3] * weight;
              weightSum += weight;
            }
          }
        }
      }
      if (weightSum > 0 && isFinite(weightSum)) {
        dst[dstOff] = r / weightSum;
        dst[dstOff + 1] = g / weightSum;
        dst[dstOff + 2] = b / weightSum;
        dst[dstOff + 3] = a / weightSum;
      } else {
        dst[dstOff] = src[dstOff];
        dst[dstOff + 1] = src[dstOff + 1];
        dst[dstOff + 2] = src[dstOff + 2];
        dst[dstOff + 3] = src[dstOff + 3];
      }
    }
  }
};