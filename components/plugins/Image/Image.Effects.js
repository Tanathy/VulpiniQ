// Name: Image.Effects
// Method: Plugin
// Desc: Advanced effects for image manipulation
// Type: Component
// Dependencies: Image

Q.Image.Effects = function (options = {}) {
    const Image = Q.Image(options);
    const canvas_node = Image.node;

    // Sharpen effect with improved algorithm (Photoshop-like Smart Sharpen)
    Image.Sharpen = function (options = {}) {
        const defaults = {
            amount: 1.0,     // Sharpening amount (0.0 to 4.0)
            radius: 1.0,     // Sharpening radius
            threshold: 0,    // Edge threshold
            details: 0.5     // Detail preservation (0.0 to 1.0)
        };

        const settings = Object.assign({}, defaults, options);
        
        // Clamp amount between 0 and 4
        settings.amount = Math.max(0, Math.min(4, settings.amount));

        const ctx = canvas_node.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        const pixels = imgData.data;
        const width = canvas_node.width;
        const height = canvas_node.height;

        // Create a copy of the image data for unsharp masking
        const dataCopy = new Uint8ClampedArray(pixels);

        // Apply Gaussian blur to the copy for unsharp mask
        applyGaussianBlur(dataCopy, width, height, settings.radius);

        // Apply unsharp mask
        const sharpAmount = settings.amount * 0.75; // Scale for better visual match
        const detailFactor = settings.details * 2; // Amplify detail preservation

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                
                // Calculate difference for each channel
                const diffR = pixels[i] - dataCopy[i];
                const diffG = pixels[i + 1] - dataCopy[i + 1];
                const diffB = pixels[i + 2] - dataCopy[i + 2];
                
                // Calculate edge intensity
                const edgeIntensity = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);
                
                // Apply threshold
                if (edgeIntensity > settings.threshold) {
                    // Apply sharpening with detail preservation
                    const factor = sharpAmount + (detailFactor * edgeIntensity / 255);
                    
                    pixels[i] = clamp(pixels[i] + diffR * factor);
                    pixels[i + 1] = clamp(pixels[i + 1] + diffG * factor);
                    pixels[i + 2] = clamp(pixels[i + 2] + diffB * factor);
                }
            }
        }

        ctx.putImageData(imgData, 0, 0);
        return Image;
    };

    // Helper function for value clamping
    function clamp(value) {
        return Math.min(255, Math.max(0, value));
    }

    // Helper function to apply Gaussian blur
    function applyGaussianBlur(data, width, height, radius) {
        // Simple approximation of Gaussian blur using box blur multiple times
        const iterations = 3; // Multiple passes for better Gaussian approximation
        const size = Math.ceil(radius) * 2 + 1;
        const halfSize = Math.floor(size / 2);
        
        // Temporary buffer for processing
        const temp = new Uint8ClampedArray(data.length);
        
        // Apply horizontal blur
        for (let i = 0; i < iterations; i++) {
            // Horizontal pass
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    let count = 0;
                    
                    for (let j = -halfSize; j <= halfSize; j++) {
                        const cx = Math.min(Math.max(0, x + j), width - 1);
                        const idx = (y * width + cx) * 4;
                        
                        r += data[idx];
                        g += data[idx + 1];
                        b += data[idx + 2];
                        count++;
                    }
                    
                    const idx = (y * width + x) * 4;
                    temp[idx] = r / count;
                    temp[idx + 1] = g / count;
                    temp[idx + 2] = b / count;
                    temp[idx + 3] = data[idx + 3];
                }
            }
            
            // Vertical pass
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let r = 0, g = 0, b = 0;
                    let count = 0;
                    
                    for (let j = -halfSize; j <= halfSize; j++) {
                        const cy = Math.min(Math.max(0, y + j), height - 1);
                        const idx = (cy * width + x) * 4;
                        
                        r += temp[idx];
                        g += temp[idx + 1];
                        b += temp[idx + 2];
                        count++;
                    }
                    
                    const idx = (y * width + x) * 4;
                    data[idx] = r / count;
                    data[idx + 1] = g / count;
                    data[idx + 2] = b / count;
                }
            }
        }
    }

    // Emboss effect
    Image.Emboss = function (options) {
        let defaults = {
            strength: 1,
            direction: 'top-left',
            blend: true,    
            grayscale: true  
        };

        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;

        let dataCopy = new Uint8ClampedArray(pixels);

        let kernels = {
            'top-left': [-2, -1, 0, -1, 1, 1, 0, 1, 2],
            'top-right': [0, -1, -2, 1, 1, -1, 2, 1, 0],
            'bottom-left': [0, 1, 2, -1, 1, 1, -2, -1, 0],
            'bottom-right': [2, 1, 0, 1, 1, -1, 0, -1, -2]
        };

        let kernel = kernels[options.direction] || kernels['top-left'];
        let katet = Math.sqrt(kernel.length); 
        let half = Math.floor(katet / 2);

        let strength = options.strength;
        let divisor = 1; 
        let offset = 128; 

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                let dstOff = (y * width + x) * 4;

                for (let cy = 0; cy < katet; cy++) {
                    for (let cx = 0; cx < katet; cx++) {
                        let scy = y + cy - half;
                        let scx = x + cx - half;

                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            let srcOff = (scy * width + scx) * 4; 
                            let wt = kernel[cy * katet + cx];

                            r += dataCopy[srcOff] * wt;
                            g += dataCopy[srcOff + 1] * wt;
                            b += dataCopy[srcOff + 2] * wt;
                        }
                    }
                }

                r = (r / divisor) * strength + offset;
                g = (g / divisor) * strength + offset;
                b = (b / divisor) * strength + offset;

                if (options.grayscale) {
                    let avg = (r + g + b) / 3;
                    r = g = b = avg;
                }

                r = Math.min(Math.max(r, 0), 255);
                g = Math.min(Math.max(g, 0), 255);
                b = Math.min(Math.max(b, 0), 255);

                if (options.blend) {
                    pixels[dstOff] = (pixels[dstOff] + r) / 2;
                    pixels[dstOff + 1] = (pixels[dstOff + 1] + g) / 2;
                    pixels[dstOff + 2] = (pixels[dstOff + 2] + b) / 2;
                } else {
                    pixels[dstOff] = r;
                    pixels[dstOff + 1] = g;
                    pixels[dstOff + 2] = b;
                }
            }
        }

        ctx.putImageData(data, 0, 0);
        return Image;
    };

    // Blur effect
    Image.Blur = function (options) {
        let defaults = {
            radius: 5, 
            quality: 1 
        };

        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;

        function gaussianKernel(radius) {
            let size = 2 * radius + 1;
            let kernel = new Float32Array(size * size);
            let sigma = radius / 3;
            let sum = 0;
            let center = radius;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let dx = x - center;
                    let dy = y - center;
                    let weight = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
                    kernel[y * size + x] = weight;
                    sum += weight;
                }
            }

            for (let i = 0; i < kernel.length; i++) {
                kernel[i] /= sum;
            }

            return {
                kernel: kernel,
                size: size
            };
        }

        let { kernel, size } = gaussianKernel(options.radius);
        let half = Math.floor(size / 2);
        let iterations = Math.round(options.quality);

        function applyBlur() {
            let output = new Uint8ClampedArray(pixels);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    let dstOff = (y * width + x) * 4;

                    for (let ky = 0; ky < size; ky++) {
                        for (let kx = 0; kx < size; kx++) {
                            let ny = y + ky - half;
                            let nx = x + kx - half;

                            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                let srcOff = (ny * width + nx) * 4;
                                let weight = kernel[ky * size + kx];

                                r += pixels[srcOff] * weight;
                                g += pixels[srcOff + 1] * weight;
                                b += pixels[srcOff + 2] * weight;
                            }
                        }
                    }

                    output[dstOff] = r;
                    output[dstOff + 1] = g;
                    output[dstOff + 2] = b;
                }
            }

            return output;
        }

        for (let i = 0; i < iterations; i++) {
            pixels = applyBlur();
        }

        ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
        return Image;
    };

    return Image;
};
