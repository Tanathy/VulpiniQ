// Name: Image.Glow
// Method: Plugin
// Desc: Apply a glow effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Glow method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Glow method directly to the Image object
        Image.Glow = function(glowOptions = {}) {
            // Default options
            const defaultOptions = {
                illuminanceThreshold: 200,  // Brightness threshold for glow (0-255)
                blurRadius: 10,             // Radius of the glow blur
                intensity: 1.0,             // Intensity multiplier for the glow
                color: null                 // Optional color tint for the glow (null for original colors)
            };
            
            const finalOptions = Object.assign({}, defaultOptions, glowOptions);
            
            // Create a temporary canvas for the source image
            let sourceCanvas = Q('<canvas>', { 
                width: canvas_node.width, 
                height: canvas_node.height 
            }).nodes[0];
            
            // Create a temporary canvas for the glow effect
            let glowCanvas = Q('<canvas>', { 
                width: canvas_node.width, 
                height: canvas_node.height 
            }).nodes[0];
            
            // Draw the current image to the source canvas
            sourceCanvas.getContext('2d').drawImage(canvas_node, 0, 0);
            
            // Get context for the glow canvas
            const glowCtx = glowCanvas.getContext('2d', { willReadFrequently: true });
            
            // Extract bright pixels
            const imageData = sourceCanvas.getContext('2d').getImageData(
                0, 0, sourceCanvas.width, sourceCanvas.height
            );
            const data = imageData.data;
            
            // Collect the brightest pixels into the glow canvas
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                const alpha = data[i + 3];
                
                // Calculate perceived brightness using the luminance formula
                const brightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
                
                if (brightness > finalOptions.illuminanceThreshold) {
                    // Calculate pixel position
                    const x = (i / 4) % sourceCanvas.width;
                    const y = Math.floor((i / 4) / sourceCanvas.width);
                    
                    // Apply color tint if specified
                    if (finalOptions.color) {
                        // Parse the color into RGB components
                        let tintColor;
                        if (typeof finalOptions.color === 'string') {
                            // Convert color string to RGB values
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = 1;
                            tempCanvas.height = 1;
                            const tempCtx = tempCanvas.getContext('2d');
                            tempCtx.fillStyle = finalOptions.color;
                            tempCtx.fillRect(0, 0, 1, 1);
                            const tempData = tempCtx.getImageData(0, 0, 1, 1).data;
                            tintColor = {
                                r: tempData[0],
                                g: tempData[1],
                                b: tempData[2]
                            };
                        } else if (typeof finalOptions.color === 'object') {
                            // Use object with r, g, b properties
                            tintColor = finalOptions.color;
                        }
                        
                        if (tintColor) {
                            glowCtx.fillStyle = `rgba(${tintColor.r}, ${tintColor.g}, ${tintColor.b}, ${(alpha / 255) * finalOptions.intensity})`;
                        }
                    } else {
                        // Use original color
                        glowCtx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${(alpha / 255) * finalOptions.intensity})`;
                    }
                    
                    glowCtx.fillRect(x, y, 1, 1);
                }
            }
            
            // Apply blur to the glow canvas
            applyBoxBlur(glowCanvas, finalOptions.blurRadius);
            
            // Draw the original image to the result canvas
            const ctx = canvas_node.getContext('2d');
            ctx.drawImage(sourceCanvas, 0, 0);
            
            // Apply the glow using 'lighter' composite operation
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(glowCanvas, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            
            return Image;
            
            // Helper function for box blur
            function applyBoxBlur(canvas, radius) {
                const context = canvas.getContext('2d', { willReadFrequently: true });
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                const width = imageData.width;
                const height = imageData.height;
                const totalPixels = width * height;
                
                // Create a copy of the pixel data for reading from
                const pixelsCopy = new Uint8ClampedArray(pixels);
                
                for (let i = 0; i < totalPixels; i++) {
                    let blurValueR = 0;
                    let blurValueG = 0;
                    let blurValueB = 0;
                    let blurValueA = 0;
                    let blurCount = 0;
                    
                    const startY = Math.max(0, Math.floor(i / width) - radius);
                    const endY = Math.min(height - 1, Math.floor(i / width) + radius);
                    const startX = Math.max(0, (i % width) - radius);
                    const endX = Math.min(width - 1, (i % width) + radius);
                    
                    for (let y = startY; y <= endY; y++) {
                        for (let x = startX; x <= endX; x++) {
                            const index = (y * width + x) * 4;
                            blurValueR += pixelsCopy[index];
                            blurValueG += pixelsCopy[index + 1];
                            blurValueB += pixelsCopy[index + 2];
                            blurValueA += pixelsCopy[index + 3];
                            blurCount++;
                        }
                    }
                    
                    const currentIndex = i * 4;
                    pixels[currentIndex] = blurValueR / blurCount;
                    pixels[currentIndex + 1] = blurValueG / blurCount;
                    pixels[currentIndex + 2] = blurValueB / blurCount;
                    pixels[currentIndex + 3] = blurValueA / blurCount;
                }
                
                context.putImageData(imageData, 0, 0);
            }
        };
        
        return Image;
    };
})();
