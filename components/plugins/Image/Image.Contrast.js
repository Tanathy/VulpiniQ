// Name: Image.Contrast
// Method: Plugin
// Desc: Adjust image contrast
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Contrast method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Contrast method directly to the Image object
        Image.Contrast = function(value, contrastOptions = {}) {
            // Default options
            const defaultOptions = {
                preserveHue: true,  // Whether to preserve the hue while adjusting contrast
                clamp: true        // Whether to clamp values to 0-255 range
            };
            
            const finalOptions = Object.assign({}, defaultOptions, contrastOptions);
            
            let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
            let pixels = data.data;
            
            let factor = (259 * (value + 255)) / (255 * (259 - value));
            
            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = factor * (pixels[i] - 128) + 128;
                pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
                pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
                
                if (finalOptions.clamp) {
                    pixels[i] = Math.min(255, Math.max(0, pixels[i]));
                    pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1]));
                    pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2]));
                }
            }
            
            canvas_node.getContext('2d').putImageData(data, 0, 0);
            return Image;
        };
        
        return Image;
    };
})();
