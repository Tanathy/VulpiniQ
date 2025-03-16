// Name: Image.Blur
// Method: Plugin
// Desc: Apply standard blur to images
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Blur method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Blur method directly to the Image object
        Image.Blur = function(blurOptions = {}) {
            // Default options
            const defaults = {
                radius: 5,       // Blur radius
                quality: 1       // Number of iterations for higher quality
            };

            const settings = Object.assign({}, defaults, blurOptions);

            const ctx = canvas_node.getContext('2d');
            const data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
            const pixels = data.data;
            const width = canvas_node.width;
            const height = canvas_node.height;

            // Generate Gaussian kernel
            const { kernel, size } = gaussianKernel(settings.radius);
            const half = Math.floor(size / 2);
            const iterations = Math.round(settings.quality);

            // Apply blur multiple times for better quality
            let currentPixels = new Uint8ClampedArray(pixels);
            
            for (let i = 0; i < iterations; i++) {
                currentPixels = applyBlur(currentPixels, width, height, kernel, size, half);
            }

            // Copy final result back to the image data
            for (let i = 0; i < pixels.length; i++) {
                pixels[i] = currentPixels[i];
            }

            ctx.putImageData(data, 0, 0);
            // Save to history after applying the effect
            Image.SaveHistory();
            return Image;
        };
        
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

        // Apply blur to pixels
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
        
        return Image;
    };
})();
