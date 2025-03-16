// Name: Image.Pixelize
// Method: Plugin
// Desc: Apply a pixelation effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Pixelize method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Pixelize method directly to the Image object
        Image.Pixelize = function(pixelizeOptions = {}) {
            // Default options
            const defaultOptions = {
                blockSize: 10,        // Size of each pixel block
                sampleMode: 'corner',  // How to sample pixel color: 'corner', 'center', 'average'
                effect: 'normal',      // Effect type: 'normal', 'mosaic', 'ordered'
                roundedCorners: false, // Whether to round the corners of each pixel block
                cornerRadius: 2,       // Radius for rounded corners
                spacing: 0             // Spacing between pixel blocks
            };
            
            const finalOptions = Object.assign({}, defaultOptions, pixelizeOptions);
            
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
            
            // Clear the original canvas if we're using spacing or special effects
            const resultCtx = canvas_node.getContext('2d');
            resultCtx.clearRect(0, 0, canvas_node.width, canvas_node.height);
            
            // Adjust blockSize if it's invalid
            const blockSize = Math.max(1, finalOptions.blockSize);
            const spacing = Math.max(0, finalOptions.spacing);
            
            // Apply the pixelation effect
            for (let y = 0; y < temp.height; y += blockSize) {
                for (let x = 0; x < temp.width; x += blockSize) {
                    let r, g, b, a;
                    
                    // Determine the color for this pixel block based on sampleMode
                    if (finalOptions.sampleMode === 'center') {
                        // Sample from the center of the block
                        const centerX = Math.min(temp.width - 1, x + Math.floor(blockSize / 2));
                        const centerY = Math.min(temp.height - 1, y + Math.floor(blockSize / 2));
                        const centerIndex = (centerY * temp.width + centerX) * 4;
                        
                        r = pixels[centerIndex];
                        g = pixels[centerIndex + 1];
                        b = pixels[centerIndex + 2];
                        a = pixels[centerIndex + 3];
                    } 
                    else if (finalOptions.sampleMode === 'average') {
                        // Calculate the average color for the block
                        let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
                        let count = 0;
                        
                        for (let by = 0; by < blockSize && y + by < temp.height; by++) {
                            for (let bx = 0; bx < blockSize && x + bx < temp.width; bx++) {
                                const idx = ((y + by) * temp.width + (x + bx)) * 4;
                                rSum += pixels[idx];
                                gSum += pixels[idx + 1];
                                bSum += pixels[idx + 2];
                                aSum += pixels[idx + 3];
                                count++;
                            }
                        }
                        
                        r = Math.round(rSum / count);
                        g = Math.round(gSum / count);
                        b = Math.round(bSum / count);
                        a = Math.round(aSum / count);
                    } 
                    else {
                        // Default: sample from the corner of the block
                        const cornerIndex = (y * temp.width + x) * 4;
                        r = pixels[cornerIndex];
                        g = pixels[cornerIndex + 1];
                        b = pixels[cornerIndex + 2];
                        a = pixels[cornerIndex + 3];
                    }
                    
                    // Apply the color to the block based on the effect type
                    resultCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a/255})`;
                    
                    // Handle different effect types
                    if (finalOptions.effect === 'ordered') {
                        // Ordered pixelation - draws pixels in a grid pattern
                        const actualSize = blockSize - spacing;
                        
                        if (finalOptions.roundedCorners) {
                            resultCtx.beginPath();
                            resultCtx.roundRect(
                                x, y, actualSize, actualSize, 
                                finalOptions.cornerRadius
                            );
                            resultCtx.fill();
                        } else {
                            resultCtx.fillRect(x, y, actualSize, actualSize);
                        }
                    } 
                    else if (finalOptions.effect === 'mosaic') {
                        // Mosaic effect - varying block sizes based on brightness
                        const brightness = (r + g + b) / 3;
                        const sizeVariation = Math.max(1, blockSize * (brightness / 255));
                        
                        if (finalOptions.roundedCorners) {
                            resultCtx.beginPath();
                            resultCtx.roundRect(
                                x, y, sizeVariation, sizeVariation, 
                                finalOptions.cornerRadius
                            );
                            resultCtx.fill();
                        } else {
                            resultCtx.fillRect(x, y, sizeVariation, sizeVariation);
                        }
                    } 
                    else {
                        // Normal pixelation - uniform blocks
                        const actualWidth = Math.min(blockSize, temp.width - x);
                        const actualHeight = Math.min(blockSize, temp.height - y);
                        
                        if (finalOptions.roundedCorners && spacing > 0) {
                            resultCtx.beginPath();
                            resultCtx.roundRect(
                                x, y, 
                                actualWidth - spacing, actualHeight - spacing, 
                                finalOptions.cornerRadius
                            );
                            resultCtx.fill();
                        } else {
                            resultCtx.fillRect(x, y, 
                                actualWidth - spacing, 
                                actualHeight - spacing);
                        }
                    }
                }
            }
            
            return Image;
        };
        
        return Image;
    };
})();
