// Name: Image.CRT
// Method: Plugin
// Desc: Apply CRT (old TV) effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the CRT method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add CRT method directly to the Image object
        Image.CRT = function(crtOptions = {}) {
            // Default options
            const defaultOptions = {
                noiseStrength: 10,        // Base noise strength
                strongNoiseStrength: 100, // Stronger noise patches strength
                strongNoiseCount: 5,      // Number of stronger noise patches
                noiseMaxLength: 20000,    // Maximum length of noise patch
                redShift: 3,              // Red channel shift (for chromatic aberration)
                blueShift: 3,             // Blue channel shift (for chromatic aberration)
                scanlineHeight: 1,        // Height of scanlines
                scanlineMargin: 3,        // Space between scanlines
                scanlineOpacity: 0.1,     // Opacity of scanlines
                vignette: false,          // Apply vignette effect
                vignetteStrength: 0.5     // Vignette effect strength (0-1)
            };
            
            const finalOptions = Object.assign({}, defaultOptions, crtOptions);

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
            const data = imageData.data;
            
            // Helper function to clamp values
            function clamp(value, min, max) {
                return Math.min(Math.max(value, min), max);
            }
            
            // Helper function for random number between min and max
            function CRTRandomBetween(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            // Add base overlay noise to each pixel
            const noiseStrength = finalOptions.noiseStrength;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * noiseStrength;
                data[i] = clamp(data[i] + noise, 0, 255);        // Red channel
                data[i + 1] = clamp(data[i + 1] + noise, 0, 255); // Green channel
                data[i + 2] = clamp(data[i + 2] + noise, 0, 255); // Blue channel
            }
            
            // Add stronger noise patches
            const strongNoiseStrength = finalOptions.strongNoiseStrength;
            const strongNoiseCount = finalOptions.strongNoiseCount;
            const noiseMaxLength = finalOptions.noiseMaxLength;
            
            for (let i0 = 0; i0 < strongNoiseCount; i0++) {
                const startPos = CRTRandomBetween(
                    CRTRandomBetween(0, data.length - noiseMaxLength), 
                    data.length - noiseMaxLength
                );
                const endPos = startPos + CRTRandomBetween(0, noiseMaxLength);
                
                for (let i = startPos; i < endPos; i += 4) {
                    if (i + 2 < data.length) {  // Ensure we're within bounds
                        const noise = (Math.random() - 0.4) * strongNoiseStrength;
                        data[i] = clamp(data[i] + noise, 0, 255);        // Red channel
                        data[i + 1] = clamp(data[i + 1] + noise, 0, 255); // Green channel
                        data[i + 2] = clamp(data[i + 2] + noise, 0, 255); // Blue channel
                    }
                }
            }
            
            // Apply chromatic aberration
            // First, create a copy of the data array to avoid modifying data while reading from it
            const tempData = new Uint8ClampedArray(data);
            const redShift = finalOptions.redShift;
            const blueShift = finalOptions.blueShift;
            
            for (let i = 0; i < data.length; i += 4) {
                // Shift red channel
                if (i + redShift * 4 < data.length) {
                    data[i] = tempData[i + redShift * 4];
                }
                
                // Shift blue channel
                if (i + 2 + blueShift * 4 < data.length) {
                    data[i + 2] = tempData[i + 2 + blueShift * 4];
                }
            }
            
            // Put the modified image data back to the canvas
            ctx.putImageData(imageData, 0, 0);
            
            // Draw horizontal scanlines
            function drawHorizontalLines(ctx, width, height, totalHeight, margin, color) {
                ctx.fillStyle = color;
                for (let i = 0; i < totalHeight; i += (height + margin)) {
                    ctx.fillRect(0, i, width, height);
                }
            }
            
            drawHorizontalLines(
                ctx, 
                temp.width, 
                finalOptions.scanlineHeight, 
                temp.height, 
                finalOptions.scanlineMargin, 
                `rgba(0, 0, 0, ${finalOptions.scanlineOpacity})`
            );
            
            // Apply vignette effect if enabled
            if (finalOptions.vignette) {
                const centerX = temp.width / 2;
                const centerY = temp.height / 2;
                const radius = Math.max(centerX, centerY);
                
                // Create radial gradient for vignette
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, radius * 0.5, 
                    centerX, centerY, radius * 1.5
                );
                
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, `rgba(0,0,0,${finalOptions.vignetteStrength})`);
                
                ctx.fillStyle = gradient;
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillRect(0, 0, temp.width, temp.height);
                ctx.globalCompositeOperation = 'source-over';
            }
            
            // Copy the result back to the original canvas
            canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
            canvas_node.getContext('2d').drawImage(temp, 0, 0);
            
            return Image;
        };
        
        return Image;
    };
})();
