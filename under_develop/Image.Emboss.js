
    Q.Image.prototype.Emboss = function(embossOptions = {}) {
        // Default options
        const defaults = {
            strength: 1,              // Effect strength
            direction: 'top-left',    // Direction of embossing: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
            blend: true,              // Blend with original image
            grayscale: true           // Convert to grayscale
        };

        const settings = Object.assign({}, defaults, embossOptions);
        const canvas_node = this.node;

        const ctx = canvas_node.getContext('2d');
        const data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        const pixels = data.data;
        const width = canvas_node.width;
        const height = canvas_node.height;

        // Create a copy for processing
        const dataCopy = new Uint8ClampedArray(pixels);

        // Emboss kernels for different directions
        const kernels = {
            'top-left': [-2, -1, 0, -1, 1, 1, 0, 1, 2],
            'top-right': [0, -1, -2, 1, 1, -1, 2, 1, 0],
            'bottom-left': [0, 1, 2, -1, 1, 1, -2, -1, 0],
            'bottom-right': [2, 1, 0, 1, 1, -1, 0, -1, -2]
        };

        // Select kernel based on direction
        const kernel = kernels[settings.direction] || kernels['top-left'];
        const kernelSize = Math.sqrt(kernel.length);
        const half = Math.floor(kernelSize / 2);

        // Apply convolution
        const strength = settings.strength;
        const divisor = 1;
        const offset = 128; // Middle gray for emboss effect

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                const dstOff = (y * width + x) * 4;

                // Apply convolution kernel
                for (let cy = 0; cy < kernelSize; cy++) {
                    for (let cx = 0; cx < kernelSize; cx++) {
                        const scy = y + cy - half;
                        const scx = x + cx - half;

                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            const srcOff = (scy * width + scx) * 4;
                            const wt = kernel[cy * kernelSize + cx];

                            r += dataCopy[srcOff] * wt;
                            g += dataCopy[srcOff + 1] * wt;
                            b += dataCopy[srcOff + 2] * wt;
                        }
                    }
                }

                // Apply strength and offset
                r = (r / divisor) * strength + offset;
                g = (g / divisor) * strength + offset;
                b = (b / divisor) * strength + offset;

                // Apply grayscale if needed
                if (settings.grayscale) {
                    const avg = (r + g + b) / 3;
                    r = g = b = avg;
                }

                // Clamp values
                r = Math.min(Math.max(r, 0), 255);
                g = Math.min(Math.max(g, 0), 255);
                b = Math.min(Math.max(b, 0), 255);

                // Blend with original or replace
                if (settings.blend) {
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
        // Save to history after applying the effect
        this.SaveHistory();
        return this;
    };

