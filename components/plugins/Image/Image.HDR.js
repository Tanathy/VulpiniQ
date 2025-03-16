// Name: Image.HDR
// Method: Plugin
// Desc: Apply an HDR-like effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the HDR method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add HDR method directly to the Image object
        Image.HDR = function(hdrOptions = {}) {
            // Default options
            const defaultOptions = {
                shadowAdjust: 15,        // Shadow level adjustment
                brightnessAdjust: 10,    // Brightness adjustment
                contrastAdjust: 1.2,     // Contrast adjustment
                vibrance: 0.2,           // Vibrance adjustment (saturation for less saturated colors)
                highlights: -10,         // Highlight level adjustment
                clarity: 10,             // Clarity/local contrast enhancement
                tonal: true              // Apply tonal balancing
            };
            
            const finalOptions = Object.assign({}, defaultOptions, hdrOptions);
            
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
            
            // First pass - gather statistics for tonal balancing if enabled
            let minBrightness = 255;
            let maxBrightness = 0;
            let avgBrightness = 0;
            
            if (finalOptions.tonal) {
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // Calculate perceived brightness
                    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    
                    minBrightness = Math.min(minBrightness, brightness);
                    maxBrightness = Math.max(maxBrightness, brightness);
                    avgBrightness += brightness;
                }
                
                avgBrightness /= (data.length / 4);
            }
            
            // Apply HDR effect to each pixel
            for (let i = 0; i < data.length; i += 4) {
                // Get pixel color values
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                
                // Calculate perceived brightness
                const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                
                // Apply shadow adjustment - more effective on darker pixels
                const shadowFactor = Math.max(0, 1 - brightness / 128);
                r += finalOptions.shadowAdjust * shadowFactor;
                g += finalOptions.shadowAdjust * shadowFactor;
                b += finalOptions.shadowAdjust * shadowFactor;
                
                // Apply highlights adjustment - more effective on brighter pixels
                const highlightFactor = Math.max(0, brightness / 128 - 1);
                r += finalOptions.highlights * highlightFactor;
                g += finalOptions.highlights * highlightFactor;
                b += finalOptions.highlights * highlightFactor;
                
                // Apply brightness adjustment
                r += finalOptions.brightnessAdjust;
                g += finalOptions.brightnessAdjust;
                b += finalOptions.brightnessAdjust;
                
                // Apply contrast adjustment
                r = (r - 128) * finalOptions.contrastAdjust + 128;
                g = (g - 128) * finalOptions.contrastAdjust + 128;
                b = (b - 128) * finalOptions.contrastAdjust + 128;
                
                // Apply vibrance (smart saturation)
                if (finalOptions.vibrance !== 0) {
                    // Convert to HSL
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const lightness = (max + min) / 510; // Normalize to 0-1
                    
                    // Only adjust saturation if it's not already highly saturated
                    if (max - min < 100) {  // Lower values = less saturated
                        const satAdjust = finalOptions.vibrance * (1 - (max - min) / 100);
                        
                        if (max === r) {
                            g = g - satAdjust * (g - min);
                            b = b - satAdjust * (b - min);
                        } else if (max === g) {
                            r = r - satAdjust * (r - min);
                            b = b - satAdjust * (b - min);
                        } else {
                            r = r - satAdjust * (r - min);
                            g = g - satAdjust * (g - min);
                        }
                    }
                }
                
                // Apply tonal balancing
                if (finalOptions.tonal && maxBrightness > minBrightness) {
                    // Calculate how to redistribute the tone
                    const normalizedBrightness = (brightness - minBrightness) / (maxBrightness - minBrightness);
                    const tonalFactor = (normalizedBrightness < 0.5) ? 
                        2 * normalizedBrightness : 2 - 2 * normalizedBrightness;
                    
                    // Apply balanced adjustment
                    const tonalAdjust = finalOptions.clarity * tonalFactor;
                    r += tonalAdjust;
                    g += tonalAdjust;
                    b += tonalAdjust;
                }
                
                // Clamp values to valid range
                data[i] = Math.min(255, Math.max(0, r));
                data[i + 1] = Math.min(255, Math.max(0, g));
                data[i + 2] = Math.min(255, Math.max(0, b));
            }
            
            // Put the processed image data back
            ctx.putImageData(imageData, 0, 0);
            
            // Copy the result back to the original canvas
            canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
            canvas_node.getContext('2d').drawImage(temp, 0, 0);
            
            return Image;
        };
        
        return Image;
    };
})();
