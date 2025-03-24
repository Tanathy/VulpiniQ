
    Q.Image.prototype.LensFlareAnamorphic = function(flareOptions = {}) {
        // Default options
        const defaultOptions = {
            brightnessThreshold: 200,  // Minimum brightness to consider as a flare source
            widthModifier: 1.0,        // Size multiplier for the flare width
            heightThreshold: 10,       // Height of the flare
            maxFlares: 20,             // Maximum number of flares to render
            opacity: 0.2,              // Opacity reduction factor (subtracted from brightness)
            flareColor: null           // Optional fixed color for flares [r, g, b]
        };
        
        const finalOptions = Object.assign({}, defaultOptions, flareOptions);
        const canvas_node = this.node;
        
        // Create a temporary canvas for processing
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        
        let ctx = temp.getContext('2d', { willReadFrequently: true });
        
        // Draw the current canvas content to our temp canvas
        ctx.drawImage(canvas_node, 0, 0);
        
        // Get the image data for analysis
        const sourceData = ctx.getImageData(0, 0, temp.width, temp.height).data;
        
        // Extract flare color if not specified
        let flareColor = finalOptions.flareColor;
        if (!flareColor) {
            const avgColor = { r: 0, g: 0, b: 0, count: 0 };
            
            // Calculate the average color of bright pixels
            for (let y = 0; y < temp.height; y++) {
                for (let x = 0; x < temp.width; x++) {
                    const index = (y * temp.width + x) * 4;
                    const brightness = (sourceData[index] + sourceData[index + 1] + sourceData[index + 2]) / 3;
                    
                    if (brightness >= finalOptions.brightnessThreshold) {
                        avgColor.r += sourceData[index];
                        avgColor.g += sourceData[index + 1];
                        avgColor.b += sourceData[index + 2];
                        avgColor.count++;
                    }
                }
            }
            
            // Calculate the average color or use white if no bright pixels found
            if (avgColor.count > 0) {
                flareColor = [
                    Math.round(avgColor.r / avgColor.count),
                    Math.round(avgColor.g / avgColor.count),
                    Math.round(avgColor.b / avgColor.count)
                ];
            } else {
                flareColor = [255, 255, 255]; // Default to white if no bright spots
            }
        }
        
        const flareColorR = flareColor[0];
        const flareColorG = flareColor[1];
        const flareColorB = flareColor[2];
        
        // Find the brightest points
        const flares = [];
        for (let y = 0; y < temp.height; y++) {
            for (let x = 0; x < temp.width; x++) {
                const index = (y * temp.width + x) * 4;
                const brightness = (sourceData[index] + sourceData[index + 1] + sourceData[index + 2]) / 3;
                
                if (brightness >= finalOptions.brightnessThreshold) {
                    flares.push({ x, y, brightness });
                }
            }
        }
        
        // Sort the flares by brightness (in descending order)
        flares.sort((a, b) => b.brightness - a.brightness);
        
        // Draw the lens flares onto the source canvas
        const targetCtx = canvas_node.getContext('2d');
        
        // Draw the lens flares
        for (let i = 0; i < Math.min(finalOptions.maxFlares, flares.length); i++) {
            const flare = flares[i];
            const size = flare.brightness / finalOptions.brightnessThreshold * (100 * finalOptions.widthModifier);
            const height = finalOptions.heightThreshold;
            
            // Draw the anamorphic lens flare (blurred gradient line horizontally)
            const gradient = targetCtx.createLinearGradient(
                flare.x - size / 2, flare.y, 
                flare.x + size / 2, flare.y
            );
            
            gradient.addColorStop(0, `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, 0)`);
            gradient.addColorStop(0.5, `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, ${(flare.brightness / 255) - finalOptions.opacity})`);
            gradient.addColorStop(1, `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, 0)`);
            
            // Set the blending mode to "overlay"
            targetCtx.globalCompositeOperation = "overlay";
            
            targetCtx.beginPath();
            targetCtx.fillStyle = gradient;
            targetCtx.fillRect(flare.x - size / 2, flare.y - height / 2, size, height);
        }
        
        // Reset the blending mode to default
        targetCtx.globalCompositeOperation = "source-over";
        
        return this;
    };