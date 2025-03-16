// Name: Image.ComicEffect
// Method: Plugin
// Desc: Apply a comic book style effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the ComicEffect method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add ComicEffect method directly to the Image object
        Image.ComicEffect = function(colorSteps = 4, effectOptions = {}) {
            // Default options
            const defaultOptions = {
                redSteps: colorSteps,      // Number of color steps for red channel
                greenSteps: colorSteps,    // Number of color steps for green channel
                blueSteps: colorSteps,     // Number of color steps for blue channel
                edgeDetection: false,      // Whether to add edge detection
                edgeThickness: 1,          // Edge thickness (when edge detection is enabled)
                edgeThreshold: 20,         // Edge detection threshold
                saturation: 1.2            // Saturation enhancement factor (1.0 = no change)
            };
            
            const finalOptions = Object.assign({}, defaultOptions, effectOptions);
            
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
            
            // Calculate the interval sizes for each color channel
            const redIntervalSize = 256 / finalOptions.redSteps;
            const greenIntervalSize = 256 / finalOptions.greenSteps;
            const blueIntervalSize = 256 / finalOptions.blueSteps;
            
            // Apply the comic effect using the specified color steps
            for (let i = 0; i < pixels.length; i += 4) {
                // If saturation enhancement is enabled, convert to HSL and adjust
                if (finalOptions.saturation !== 1.0) {
                    // Convert RGB to HSL
                    let r = pixels[i] / 255;
                    let g = pixels[i + 1] / 255;
                    let b = pixels[i + 2] / 255;
                    
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    let h, s, l = (max + min) / 2;
                    
                    if (max === min) {
                        h = s = 0; // achromatic
                    } else {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        
                        switch (max) {
                            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                            case g: h = (b - r) / d + 2; break;
                            case b: h = (r - g) / d + 4; break;
                        }
                        
                        h /= 6;
                    }
                    
                    // Adjust saturation
                    s = Math.min(1, s * finalOptions.saturation);
                    
                    // Convert back to RGB
                    if (s === 0) {
                        r = g = b = l; // achromatic
                    } else {
                        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                        const p = 2 * l - q;
                        
                        r = hue2rgb(p, q, h + 1/3);
                        g = hue2rgb(p, q, h);
                        b = hue2rgb(p, q, h - 1/3);
                    }
                    
                    // Store the adjusted values back
                    pixels[i] = Math.round(r * 255);
                    pixels[i + 1] = Math.round(g * 255);
                    pixels[i + 2] = Math.round(b * 255);
                }
                
                // Calculate the index of the closest color in the gradient for each channel
                const redIndex = Math.floor(pixels[i] / redIntervalSize);
                const greenIndex = Math.floor(pixels[i + 1] / greenIntervalSize);
                const blueIndex = Math.floor(pixels[i + 2] / blueIntervalSize);
                
                // Map each channel value to the corresponding value in the gradient based on the index
                pixels[i] = redIndex * redIntervalSize;         // Red channel
                pixels[i + 1] = greenIndex * greenIntervalSize; // Green channel
                pixels[i + 2] = blueIndex * blueIntervalSize;   // Blue channel
                // Alpha channel remains unchanged (pixels[i + 3])
            }
            
            // Apply edge detection if enabled
            if (finalOptions.edgeDetection) {
                // Create a copy of the current pixels for edge detection processing
                const edgeImageData = new ImageData(
                    new Uint8ClampedArray(pixels), 
                    temp.width, 
                    temp.height
                );
                
                // Simple edge detection using a Sobel-like approach
                for (let y = finalOptions.edgeThickness; y < temp.height - finalOptions.edgeThickness; y++) {
                    for (let x = finalOptions.edgeThickness; x < temp.width - finalOptions.edgeThickness; x++) {
                        // Calculate pixel position
                        const pos = (y * temp.width + x) * 4;
                        
                        // Check surrounding pixels for edges
                        let edgeDetected = false;
                        
                        // Check horizontal neighbors
                        const leftPos = (y * temp.width + (x - finalOptions.edgeThickness)) * 4;
                        const rightPos = (y * temp.width + (x + finalOptions.edgeThickness)) * 4;
                        
                        // Check vertical neighbors
                        const topPos = ((y - finalOptions.edgeThickness) * temp.width + x) * 4;
                        const bottomPos = ((y + finalOptions.edgeThickness) * temp.width + x) * 4;
                        
                        // Calculate differences
                        const diffH = Math.abs(pixels[leftPos] - pixels[rightPos]) +
                                     Math.abs(pixels[leftPos + 1] - pixels[rightPos + 1]) +
                                     Math.abs(pixels[leftPos + 2] - pixels[rightPos + 2]);
                                     
                        const diffV = Math.abs(pixels[topPos] - pixels[bottomPos]) +
                                     Math.abs(pixels[topPos + 1] - pixels[bottomPos + 1]) +
                                     Math.abs(pixels[topPos + 2] - pixels[bottomPos + 2]);
                        
                        // If the difference exceeds threshold, mark as edge
                        if (diffH > finalOptions.edgeThreshold || diffV > finalOptions.edgeThreshold) {
                            edgeImageData.data[pos] = 0;
                            edgeImageData.data[pos + 1] = 0;
                            edgeImageData.data[pos + 2] = 0;
                        }
                    }
                }
                
                // Put the edge-detected image data back
                ctx.putImageData(edgeImageData, 0, 0);
            } else {
                // Put the updated image data back to the canvas
                ctx.putImageData(imageData, 0, 0);
            }
            
            // Copy the temp canvas back to the original
            canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
            canvas_node.getContext('2d').drawImage(temp, 0, 0);
            
            return Image;
        };
        
        // Helper function for HSL to RGB conversion
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        return Image;
    };
})();
