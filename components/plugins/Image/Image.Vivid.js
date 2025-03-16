// Name: Image.Vivid
// Method: Plugin
// Desc: Adjust image vividness/saturation
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Vivid method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Vivid method directly to the Image object
        Image.Vivid = function(value, vividOptions = {}) {
            // Default options
            const defaultOptions = {
                method: 'multiply',  // 'multiply', 'hsl'
                clamp: true          // Whether to clamp values to 0-255 range
            };
            
            const finalOptions = Object.assign({}, defaultOptions, vividOptions);
            
            let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
            let pixels = data.data;
            
            if (finalOptions.method === 'hsl' && typeof Q.RGB2HSL === 'function' && typeof Q.HSL2RGB === 'function') {
                // Use HSL conversion for more accurate saturation adjustment
                for (let i = 0; i < pixels.length; i += 4) {
                    let r = pixels[i];
                    let g = pixels[i + 1];
                    let b = pixels[i + 2];
                    
                    let hsl = Q.RGB2HSL(r, g, b);
                    hsl[1] *= value; // Adjust saturation
                    
                    if (finalOptions.clamp) {
                        hsl[1] = Math.min(1, Math.max(0, hsl[1]));
                    }
                    
                    let rgb = Q.HSL2RGB(hsl[0], hsl[1], hsl[2]);
                    
                    pixels[i] = rgb[0];
                    pixels[i + 1] = rgb[1];
                    pixels[i + 2] = rgb[2];
                }
            } else {
                // Use simple multiplication method
                for (let i = 0; i < pixels.length; i += 4) {
                    // Get luminance
                    let luminance = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
                    
                    // Adjust each channel relative to luminance
                    pixels[i] = luminance + (pixels[i] - luminance) * value;
                    pixels[i + 1] = luminance + (pixels[i + 1] - luminance) * value;
                    pixels[i + 2] = luminance + (pixels[i + 2] - luminance) * value;
                    
                    if (finalOptions.clamp) {
                        pixels[i] = Math.min(255, Math.max(0, pixels[i]));
                        pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1]));
                        pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2]));
                    }
                }
            }
            
            canvas_node.getContext('2d').putImageData(data, 0, 0);
            return Image;
        };
        
        return Image;
    };
})();
