
    Q.Image.prototype.Noise = function(noiseOptions = {}) {
        // Default options
        const defaultOptions = {
            threshold: 30,          // Maximum noise intensity
            isBlackAndWhite: false, // Whether to apply the same noise to all color channels
            mode: 'add',            // Mode: 'add', 'subtract', or 'mix'
            intensity: 1.0,         // Overall noise intensity multiplier (0-1)
            seed: Math.random()     // Random seed for noise generation
        };
        
        const finalOptions = Object.assign({}, defaultOptions, noiseOptions);
        const canvas_node = this.node;
        
        // Create a temporary canvas for processing
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        
        let ctx = temp.getContext('2d', { willReadFrequently: true });
        
        // Draw the current canvas content to our temp canvas
        ctx.drawImage(canvas_node, 0, 0);
        
        // Get the image data for processing
        const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
        const pixels = imageData.data;
        
        // Helper function to get random noise
        function getRandomNoise(threshold) {
            // Apply the intensity modifier to threshold
            const adjustedThreshold = threshold * finalOptions.intensity;
            
            // Generate noise based on the mode
            switch(finalOptions.mode) {
                case 'subtract':
                    return -Math.floor(Math.random() * (adjustedThreshold + 1));
                case 'mix':
                    return Math.floor(Math.random() * (adjustedThreshold * 2 + 1)) - adjustedThreshold;
                case 'add':
                default:
                    return Math.floor(Math.random() * (adjustedThreshold + 1));
            }
        }
        
        // Apply noise to each pixel
        for (let i = 0; i < pixels.length; i += 4) {
            let red = pixels[i];
            let green = pixels[i + 1];
            let blue = pixels[i + 2];
            
            if (finalOptions.isBlackAndWhite) {
                // Same noise value for all channels
                const noise = getRandomNoise(finalOptions.threshold);
                red = Math.min(255, Math.max(0, red + noise));
                green = Math.min(255, Math.max(0, green + noise));
                blue = Math.min(255, Math.max(0, blue + noise));
            } else {
                // Different noise for each channel
                const noiseRed = getRandomNoise(finalOptions.threshold);
                const noiseGreen = getRandomNoise(finalOptions.threshold);
                const noiseBlue = getRandomNoise(finalOptions.threshold);
                
                red = Math.min(255, Math.max(0, red + noiseRed));
                green = Math.min(255, Math.max(0, green + noiseGreen));
                blue = Math.min(255, Math.max(0, blue + noiseBlue));
            }
            
            // Update pixel data
            pixels[i] = red;
            pixels[i + 1] = green;
            pixels[i + 2] = blue;
            // Alpha channel remains unchanged (pixels[i + 3])
        }
        
        // Put the processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Copy the result back to the original canvas
        canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        
        return this;
    };

