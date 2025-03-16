// Name: Image.Hue
// Method: Plugin
// Desc: Adjust image hue
// Type: Component
// Dependencies: Image, RGB2HSL, HSL2RGB

// Directly extend Q.Image with the Hue method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Hue method directly to the Image object
        Image.Hue = function(value, hueOptions = {}) {
            // Default options
            const defaultOptions = {
                preserveSaturation: true,  // Whether to preserve saturation during hue shift
                preserveLightness: true    // Whether to preserve lightness during hue shift
            };
            
            const finalOptions = Object.assign({}, defaultOptions, hueOptions);
            
            // Ensure the required utility functions are available
            if (typeof Q.RGB2HSL !== 'function' || typeof Q.HSL2RGB !== 'function') {
                console.error('Hue adjustment requires RGB2HSL and HSL2RGB utilities');
                return Image;
            }
            
            let ctx = canvas_node.getContext('2d');
            let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
            let pixels = data.data;
            
            for (let i = 0; i < pixels.length; i += 4) {
                let r = pixels[i];
                let g = pixels[i + 1];
                let b = pixels[i + 2];
                
                let hsl = Q.RGB2HSL(r, g, b);
                
                // Adjust hue (0-360 degrees)
                hsl[0] = (hsl[0] * 360 + value) % 360;
                if (hsl[0] < 0) hsl[0] += 360; // Handle negative values
                hsl[0] = hsl[0] / 360; // Convert back to 0-1 range for HSL2RGB
                
                let rgb = Q.HSL2RGB(hsl[0], hsl[1], hsl[2]);
                
                pixels[i] = rgb[0];
                pixels[i + 1] = rgb[1];
                pixels[i + 2] = rgb[2];
            }
            
            ctx.putImageData(data, 0, 0);
            return Image;
        };
        
        return Image;
    };
})();
