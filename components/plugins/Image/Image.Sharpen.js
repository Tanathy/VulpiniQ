// Name: Image.Sharpen
// Method: Plugin
// Desc: Apply smart sharpening to images
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Sharpen method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Sharpen method directly to the Image object
        Image.Sharpen = function(sharpenOptions = {}) {
            // Default options
            const defaults = {
                amount: 1.0,     // Sharpening amount (0.0 to 4.0)
                radius: 1.0,     // Sharpening radius
                threshold: 0,    // Edge threshold
                details: 0.5     // Detail preservation (0.0 to 1.0)
            };

            const settings = Object.assign({}, defaults, sharpenOptions);
            
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
            // Save to history after applying the effect
            Image.SaveHistory();
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
        
        return Image;
    };
})();
