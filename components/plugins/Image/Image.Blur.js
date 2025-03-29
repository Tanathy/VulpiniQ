Q.Image.prototype.Blur = function(blurOptions = {}) {
        // Default options
        const defaults = {
            type: 'gaussian', // gaussian, box, motion, lens
            radius: 5,         // Basic blur radius
            quality: 1,        // Number of iterations for higher quality
            // Motion blur specific
            direction: 0,      // Angle in degrees
            distance: 10,      // Distance of motion
            // Lens blur specific
            focalDistance: 0.5,  // 0-1, center of focus
            shape: 'circle',     // circle, hexagon, pentagon, octagon
            blades: 6,           // Number of aperture blades (5-8)
            bladeCurvature: 0,   // 0-1, curvature of blades
            rotation: 0,         // Rotation angle of the aperture in degrees
            specularHighlights: 0, // 0-1, brightness of highlights
            noise: 0              // 0-1, amount of noise
        };
        const settings = Object.assign({}, defaults, blurOptions);
        const canvas_node = this.node;
        // Add willReadFrequently option to optimize for multiple readback operations
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        const pixels = data.data;
        const width = canvas_node.width;
        const height = canvas_node.height;
        let blurredPixels;
        // Apply the appropriate blur based on type
        switch(settings.type.toLowerCase()) {
            case 'box':
                blurredPixels = applyBoxBlur(pixels, width, height, settings);
                break;
            case 'motion':
                blurredPixels = applyMotionBlur(pixels, width, height, settings);
                break;
            case 'lens':
                blurredPixels = applyLensBlur(pixels, width, height, settings);
                break;
            case 'gaussian':
            default:
                blurredPixels = applyGaussianBlur(pixels, width, height, settings);
                break;
        }
        // Copy final result back to the image data
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = blurredPixels[i];
        }
        ctx.putImageData(data, 0, 0);
        // Save to history after applying the effect
        this.saveToHistory();
        return this;
    };
    // Apply Gaussian blur
    function applyGaussianBlur(pixels, width, height, settings) {
        // Generate Gaussian kernel
        const { kernel, size } = gaussianKernel(settings.radius);
        const half = Math.floor(size / 2);
        const iterations = Math.round(settings.quality);
        // Apply blur multiple times for better quality
        let currentPixels = new Uint8ClampedArray(pixels);
        for (let i = 0; i < iterations; i++) {
            currentPixels = applyBlur(currentPixels, width, height, kernel, size, half);
        }
        return currentPixels;
    }
    // Apply Box blur - simpler and faster than Gaussian
    function applyBoxBlur(pixels, width, height, settings) {
        const radius = Math.round(settings.radius);
        const iterations = Math.round(settings.quality);
        const size = 2 * radius + 1;
        const half = radius;
        // Create a uniform box kernel
        const kernel = new Float32Array(size * size);
        const weight = 1 / (size * size);
        for (let i = 0; i < size * size; i++) {
            kernel[i] = weight;
        }
        // Apply blur multiple times for better quality
        let currentPixels = new Uint8ClampedArray(pixels);
        for (let i = 0; i < iterations; i++) {
            currentPixels = applyBlur(currentPixels, width, height, kernel, size, half);
        }
        return currentPixels;
    }
    // Apply Motion blur
    function applyMotionBlur(pixels, width, height, settings) {
        const radius = Math.max(1, Math.round(settings.radius));
        const distance = Math.max(1, Math.round(settings.distance));
        const angle = settings.direction * Math.PI / 180; // Convert to radians
        // Create a motion blur kernel
        const size = 2 * distance + 1;
        const kernel = new Float32Array(size * size).fill(0);
        const half = Math.floor(size / 2);
        // Generate the motion kernel along the specified angle
        let totalWeight = 0;
        // Draw a line through the kernel center
        for (let t = -half; t <= half; t++) {
            const x = Math.round(Math.cos(angle) * t) + half;
            const y = Math.round(Math.sin(angle) * t) + half;
            if (x >= 0 && x < size && y >= 0 && y < size) {
                // Apply a gaussian weight if radius > 1
                let weight = 1;
                if (radius > 1) {
                    const dist = Math.abs(t) / half;
                    weight = Math.exp(-dist * dist / (2 * (radius / distance) * (radius / distance)));
                }
                kernel[y * size + x] = weight;
                totalWeight += weight;
            }
        }
        // Normalize kernel
        if (totalWeight > 0) {
            for (let i = 0; i < kernel.length; i++) {
                kernel[i] /= totalWeight;
            }
        }
        // Apply the blur
        return applyBlur(pixels, width, height, kernel, size, half);
    }
    // Apply Lens blur (more complex, bokeh-like effect)
    function applyLensBlur(pixels, width, height, settings) {
        const radius = Math.max(1, Math.round(settings.radius));
        const size = 2 * radius + 1;
        const half = radius;
        // Create a lens kernel based on the specified shape
        const kernel = new Float32Array(size * size).fill(0);
        const rotation = settings.rotation * Math.PI / 180; // Convert to radians
        const blades = Math.max(5, Math.min(8, settings.blades));
        const curvature = Math.max(0, Math.min(1, settings.bladeCurvature));
        // Generate the lens shape kernel
        let totalWeight = 0;
        const focalFactor = 1 - settings.focalDistance;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // Convert to polar coordinates (centered)
                const dx = x - half;
                const dy = y - half;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    // Calculate angle for polygon shapes
                    const angle = Math.atan2(dy, dx) + rotation;
                    let weight = 0;
                    // Apply different shapes
                    switch (settings.shape) {
                        case 'hexagon':
                        case 'pentagon':
                        case 'octagon':
                            // Calculate polygon shape
                            const bladeAngle = 2 * Math.PI / blades;
                            const normalizedAngle = (angle % bladeAngle) / bladeAngle - 0.5;
                            const bladeDistance = radius * (1 - curvature * Math.abs(normalizedAngle));
                            weight = distance <= bladeDistance ? 1 : 0;
                            break;
                        case 'circle':
                        default:
                            // Circular shape with optional specular highlights
                            weight = 1;
                            // Apply focal distance effect (center has more weight)
                            const normalizedDist = distance / radius;
                            if (normalizedDist > focalFactor) {
                                weight *= Math.max(0, 1 - (normalizedDist - focalFactor) / (1 - focalFactor));
                            }
                            break;
                    }
                    // Apply specular highlights (brighter center)
                    if (settings.specularHighlights > 0) {
                        const highlightFactor = Math.max(0, 1 - distance / radius);
                        weight *= 1 + settings.specularHighlights * highlightFactor * 2;
                    }
                    // Add noise if specified
                    if (settings.noise > 0) {
                        weight *= 1 + (Math.random() - 0.5) * settings.noise;
                    }
                    kernel[y * size + x] = Math.max(0, weight);
                    totalWeight += kernel[y * size + x];
                }
            }
        }
        // Normalize kernel
        if (totalWeight > 0) {
            for (let i = 0; i < kernel.length; i++) {
                kernel[i] /= totalWeight;
            }
        }
        // Apply the blur
        return applyBlur(pixels, width, height, kernel, size, half);
    }
    // Helper function to create a gaussian kernel
    function gaussianKernel(radius) {
        const size = 2 * radius + 1;
        const kernel = new Float32Array(size * size);
        const sigma = radius / 3;
        let sum = 0;
        const center = radius;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - center;
                const dy = y - center;
                const weight = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
                kernel[y * size + x] = weight;
                sum += weight;
            }
        }
        // Normalize kernel
        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }
        return { kernel, size };
    }
    // Apply blur to pixels using a kernel
    function applyBlur(pixels, width, height, kernel, size, half) {
        const output = new Uint8ClampedArray(pixels.length);
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
                            r += pixels[srcOff] * weight;
                            g += pixels[srcOff + 1] * weight;
                            b += pixels[srcOff + 2] * weight;
                            a += pixels[srcOff + 3] * weight;
                            weightSum += weight;
                        }
                    }
                }
                // Normalize by weight sum to handle edge cases
                if (weightSum > 0) {
                    r /= weightSum;
                    g /= weightSum;
                    b /= weightSum;
                    a /= weightSum;
                }
                output[dstOff] = r;
                output[dstOff + 1] = g;
                output[dstOff + 2] = b;
                output[dstOff + 3] = a;
            }
        }
        return output;
    }
