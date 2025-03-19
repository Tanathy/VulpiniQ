






(function() {
    
    const originalImage = Q.Image;
    
    
    Q.Image = function(options = {}) {
        
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        
        Image.Contrast = function(value, contrastOptions = {}) {
            
            const defaultOptions = {
                preserveHue: true,  
                clamp: true        
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
