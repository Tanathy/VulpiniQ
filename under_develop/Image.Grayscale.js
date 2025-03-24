
    Q.Image.prototype.Grayscale = function(grayOptions = {}) {
        // Default options
        const defaultGrayOptions = {
            algorithm: 'average', // 'average', 'luminance', 'lightness'
            intensity: 1.0       // 0.0 to 1.0 for partial grayscale effect
        };
        
        const finalOptions = Object.assign({}, defaultGrayOptions, grayOptions);
        const canvas_node = this.node;
        
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            
            let gray;
            
            switch (finalOptions.algorithm) {
                case 'luminance':
                    // Human eye perceives colors differently - weighted approach
                    gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    break;
                case 'lightness':
                    // Use the min/max approach
                    gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
                    break;
                case 'average':
                default:
                    // Simple average
                    gray = (r + g + b) / 3;
                    break;
            }
            
            if (finalOptions.intensity < 1.0) {
                // Apply partial grayscale effect by blending
                pixels[i] = r * (1 - finalOptions.intensity) + gray * finalOptions.intensity;
                pixels[i + 1] = g * (1 - finalOptions.intensity) + gray * finalOptions.intensity;
                pixels[i + 2] = b * (1 - finalOptions.intensity) + gray * finalOptions.intensity;
            } else {
                pixels[i] = gray;
                pixels[i + 1] = gray;
                pixels[i + 2] = gray;
            }
        }
        
        canvas_node.getContext('2d').putImageData(data, 0, 0);
        return this;
    };
