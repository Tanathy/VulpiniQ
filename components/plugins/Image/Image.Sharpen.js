Q.Image.prototype.Sharpen = function (options = {}) {

    const DEFAULTS = {
        amount: 1.0,    // 0.0–4.0
        radius: 1.0,    // blur radius
        threshold: 0,      // edge threshold
        details: 0.5     // 0.0–1.0
    };

    const s = Object.assign({}, DEFAULTS, options);
    // clamp & sanitize
    s.amount = Math.min(4, Math.max(0, s.amount));
    s.radius = Math.max(0, s.radius);
    s.threshold = Math.max(0, s.threshold);
    s.details = Math.min(1, Math.max(0, s.details));

    const ctx = this.node.getContext('2d', { willReadFrequently: true });
    const { width, height } = this.node;
    const imgData = ctx.getImageData(0, 0, width, height);
    const src = imgData.data;
    const blurred = new Uint8ClampedArray(src);

    // blur copy via Gaussian convolution
    const { kernel, size } = createGaussianKernel(s.radius);
    convolve(src, blurred, width, height, kernel, size);

    // smart‑sharpen loop: operate on luminance
    const amountFactor = s.amount * 0.75;
    const detailFactor = s.details * 2;
    for (let i = 0; i < src.length; i += 4) {
        // original & blurred RGB
        const r = src[i],     g = src[i+1],     b = src[i+2];
        const rB = blurred[i], gB = blurred[i+1], bB = blurred[i+2];

        // compute luminance
        const Y  = 0.299*r  + 0.587*g  + 0.114*b;
        const Yb = 0.299*rB + 0.587*gB + 0.114*bB;
        const diff = Y - Yb;

        // threshold check on luminance difference
        if (Math.abs(diff) > s.threshold) {
            const f    = amountFactor + detailFactor * (Math.abs(diff)/255);
            const Ynew = Y + diff * f;
            const ratio = Y > 0 ? Ynew / Y : 1;

            imgData.data[i]     = clamp255(r * ratio);
            imgData.data[i + 1] = clamp255(g * ratio);
            imgData.data[i + 2] = clamp255(b * ratio);
        }
        // alpha unchanged
    }

    ctx.putImageData(imgData, 0, 0);
    this.saveToHistory();
    return this;
};

function clamp255(v) {
    return v < 0 ? 0 : v > 255 ? 255 : v;
}

// Duplicate of Gaussian kernel generator from Image.Blur.js
function createGaussianKernel(radius) {
    radius = Math.floor(Math.max(0, radius));
    const size = 2 * radius + 1;
    if (size < 1) return { kernel: new Float32Array([1]), size: 1 };
    if (radius === 0) return { kernel: new Float32Array([1]), size: 1 };

    const kernel = new Float32Array(size * size);
    const sigma = radius / 3;
    const twoSigma2 = 2 * sigma * sigma;
    let sum = 0, idx = 0, center = radius;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++, idx++) {
            const dx = x - center, dy = y - center;
            const w = Math.exp(-(dx * dx + dy * dy) / twoSigma2);
            kernel[idx] = w;
            sum += w;
        }
    }
    if (sum <= 0 || !isFinite(sum)) {
        kernel.fill(0);
        kernel[center * size + center] = 1;
        return { kernel, size: 1 };
    }
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] = isFinite(kernel[i] / sum) ? kernel[i] / sum : 0;
    }
    return { kernel, size };
}

// Duplicate of convolve() from Image.Blur.js
function convolve(src, dst, width, height, kernel, size) {
    const half = Math.floor(size / 2);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0, wsum = 0;
            const off = (y * width + x) * 4;
            for (let ky = 0; ky < size; ky++) {
                for (let kx = 0; kx < size; kx++) {
                    const ny = y + ky - half;
                    const nx = x + kx - half;
                    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                        const w = kernel[ky * size + kx];
                        const i = (ny * width + nx) * 4;
                        if (isFinite(w)) {
                            r += src[i] * w;
                            g += src[i + 1] * w;
                            b += src[i + 2] * w;
                            a += src[i + 3] * w;
                            wsum += w;
                        }
                    }
                }
            }
            if (wsum > 0) {
                dst[off] = r / wsum;
                dst[off + 1] = g / wsum;
                dst[off + 2] = b / wsum;
                dst[off + 3] = a / wsum;
            } else {
                dst[off] = src[off];
                dst[off + 1] = src[off + 1];
                dst[off + 2] = src[off + 2];
                dst[off + 3] = src[off + 3];
            }
        }
    }
};