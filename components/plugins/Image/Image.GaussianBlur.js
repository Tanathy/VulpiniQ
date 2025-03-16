// Name: Image.GaussianBlur
// Method: Plugin
// Desc: Apply high-quality Gaussian blur to images
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the GaussianBlur method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add GaussianBlur method directly to the Image object
        Image.GaussianBlur = function(radius = 5, blurOptions = {}) {
            // Default options
            const defaultOptions = {
                sigma: radius / 2.0,         // Standard deviation of the Gaussian distribution
                iterations: 1,               // Number of iterations (higher = stronger blur)
                preserveAlpha: true,         // Whether to preserve alpha channel
                separableKernel: true        // Use separable kernel for better performance
            };
            
            const finalOptions = Object.assign({}, defaultOptions, blurOptions);
            
            // Get image data
            const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
            const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
            const pixels = imageData.data;
            const width = canvas_node.width;
            const height = canvas_node.height;
            
            // Create the Gaussian kernel
            const kernel = createGaussianKernel(radius, finalOptions.sigma);
            
            // Apply blur multiple times if requested
            for (let i = 0; i < finalOptions.iterations; i++) {
                if (finalOptions.separableKernel) {
                    // Separate horizontal and vertical passes (much faster)
                    applySeparableGaussianBlur(pixels, width, height, kernel.kernel1D, kernel.size, finalOptions.preserveAlpha);
                } else {
                    // Full 2D convolution (higher quality for some kernels)
                    apply2DGaussianBlur(pixels, width, height, kernel.kernel2D, kernel.size, finalOptions.preserveAlpha);
                }
            }
            
            // Update canvas with processed data
            ctx.putImageData(imageData, 0, 0);
            
            return Image;
        };
        
        // Generate a Gaussian blur kernel
        function createGaussianKernel(radius, sigma) {
            const size = Math.ceil(radius) * 2 + 1;
            const center = Math.floor(size / 2);
            
            // Create 2D kernel
            const kernel2D = new Float32Array(size * size);
            let sum = 0;
            
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const distance = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
                    const value = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                    
                    kernel2D[y * size + x] = value;
                    sum += value;
                }
            }
            
            // Normalize 2D kernel
            for (let i = 0; i < kernel2D.length; i++) {
                kernel2D[i] /= sum;
            }
            
            // Create 1D kernel for separable convolution
            const kernel1D = new Float32Array(size);
            sum = 0;
            
            for (let i = 0; i < size; i++) {
                const distance = Math.abs(i - center);
                const value = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                
                kernel1D[i] = value;
                sum += value;
            }
            
            // Normalize 1D kernel
            for (let i = 0; i < size; i++) {
                kernel1D[i] /= sum;
            }
            
            return { kernel1D, kernel2D, size };
        }
        
        // Apply a 2D Gaussian blur
        function apply2DGaussianBlur(pixels, width, height, kernel, kernelSize, preserveAlpha) {
            const tempPixels = new Uint8ClampedArray(pixels.length);
            const half = Math.floor(kernelSize / 2);
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0, a = 0;
                    const index = (y * width + x) * 4;
                    
                    // Apply convolution
                    for (let ky = 0; ky < kernelSize; ky++) {
                        for (let kx = 0; kx < kernelSize; kx++) {
                            const pixelY = Math.min(height - 1, Math.max(0, y + ky - half));
                            const pixelX = Math.min(width - 1, Math.max(0, x + kx - half));
                            const pixelIndex = (pixelY * width + pixelX) * 4;
                            const kernelValue = kernel[ky * kernelSize + kx];
                            
                            r += pixels[pixelIndex] * kernelValue;
                            g += pixels[pixelIndex + 1] * kernelValue;
                            b += pixels[pixelIndex + 2] * kernelValue;
                            if (!preserveAlpha) {
                                a += pixels[pixelIndex + 3] * kernelValue;
                            }
                        }
                    }
                    
                    tempPixels[index] = r;
                    tempPixels[index + 1] = g;
                    tempPixels[index + 2] = b;
                    tempPixels[index + 3] = preserveAlpha ? pixels[index + 3] : a;
                }
            }
            
            // Copy back to original array
            for (let i = 0; i < pixels.length; i++) {
                pixels[i] = tempPixels[i];
            }
        }
        
        // Apply separable Gaussian blur (much faster)
        function applySeparableGaussianBlur(pixels, width, height, kernel, kernelSize, preserveAlpha) {
            const tempPixels = new Uint8ClampedArray(pixels.length);
            const half = Math.floor(kernelSize / 2);
            
            // Horizontal pass
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0, a = 0;
                    const index = (y * width + x) * 4;
                    
                    for (let k = 0; k < kernelSize; k++) {
                        const pixelX = Math.min(width - 1, Math.max(0, x + k - half));
                        const pixelIndex = (y * width + pixelX) * 4;
                        const kernelValue = kernel[k];
                        
                        r += pixels[pixelIndex] * kernelValue;
                        g += pixels[pixelIndex + 1] * kernelValue;
                        b += pixels[pixelIndex + 2] * kernelValue;
                        if (!preserveAlpha) {
                            a += pixels[pixelIndex + 3] * kernelValue;
                        }
                    }
                    
                    tempPixels[index] = r;
                    tempPixels[index + 1] = g;
                    tempPixels[index + 2] = b;
                    tempPixels[index + 3] = preserveAlpha ? pixels[index + 3] : a;
                }
            }
            
            // Copy temp results back to pixels array
            for (let i = 0; i < pixels.length; i++) {
                pixels[i] = tempPixels[i];
            }
            
            // Vertical pass
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0, a = 0;
                    const index = (y * width + x) * 4;
                    
                    for (let k = 0; k < kernelSize; k++) {
                        const pixelY = Math.min(height - 1, Math.max(0, y + k - half));
                        const pixelIndex = (pixelY * width + x) * 4;
                        const kernelValue = kernel[k];
                        
                        r += pixels[pixelIndex] * kernelValue;
                        g += pixels[pixelIndex + 1] * kernelValue;
                        b += pixels[pixelIndex + 2] * kernelValue;
                        if (!preserveAlpha) {
                            a += pixels[pixelIndex + 3] * kernelValue;
                        }
                    }
                    
                    tempPixels[index] = r;
                    tempPixels[index + 1] = g;
                    tempPixels[index + 2] = b;
                    tempPixels[index + 3] = preserveAlpha ? pixels[index + 3] : a;
                }
            }
            
            // Copy results back to original pixel array
            for (let i = 0; i < pixels.length; i++) {
                pixels[i] = tempPixels[i];
            }
        }
        
        return Image;
    };
})();
