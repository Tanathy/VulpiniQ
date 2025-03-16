// Name: Image.NoiseSmooth
// Method: Plugin
// Desc: Apply smoothing effect with noise to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the NoiseSmooth method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add NoiseSmooth method directly to the Image object
        Image.NoiseSmooth = function(smoothOptions = {}) {
            // Default options
            const defaultOptions = {
                radius: 1,            // Smoothing radius (pixels)
                strength: 0.5,        // Blend strength between original and smoothed image (0-1)
                noiseAmount: 0,       // Amount of noise to add after smoothing (0 = no noise)
                preserveEdges: false, // Whether to preserve edges while smoothing
                edgeThreshold: 30     // Threshold for edge detection when preserveEdges is true
            };
            
            const finalOptions = Object.assign({}, defaultOptions, smoothOptions);
            
            // Create a temporary canvas for processing
            let temp = Q('<canvas>', { 
                width: canvas_node.width, 
                height: canvas_node.height 
            }).nodes[0];
            
            let ctx = temp.getContext('2d', { willReadFrequently: true });
            
            // Draw the current canvas content to our temp canvas
            ctx.drawImage(canvas_node, 0, 0);
            
            // Get the image data for processing
            const srcImageData = ctx.getImageData(0, 0, temp.width, temp.height);
            const resultImageData = new ImageData(temp.width, temp.height);
            
            const srcData = srcImageData.data;
            const tgtData = resultImageData.data;
            
            const diameter = finalOptions.radius * 2 + 1;
            const area = diameter * diameter;
            const halfRadius = Math.floor(finalOptions.radius);
            
            // Apply smoothing to each pixel
            for (let y = 0; y < temp.height; y++) {
                for (let x = 0; x < temp.width; x++) {
                    let rSum = 0;
                    let gSum = 0;
                    let bSum = 0;
                    let aSum = 0;
                    let weightSum = 0;
                    
                    // Check if we should preserve edges
                    let isEdge = false;
                    if (finalOptions.preserveEdges) {
                        // Simple edge detection
                        if (x > 0 && y > 0 && x < temp.width - 1 && y < temp.height - 1) {
                            const centerIdx = (y * temp.width + x) * 4;
                            
                            // Check horizontal edge
                            const leftIdx = (y * temp.width + (x - 1)) * 4;
                            const rightIdx = (y * temp.width + (x + 1)) * 4;
                            const hDiff = Math.abs(srcData[leftIdx] - srcData[rightIdx]) +
                                          Math.abs(srcData[leftIdx+1] - srcData[rightIdx+1]) +
                                          Math.abs(srcData[leftIdx+2] - srcData[rightIdx+2]);
                            
                            // Check vertical edge
                            const topIdx = ((y - 1) * temp.width + x) * 4;
                            const bottomIdx = ((y + 1) * temp.width + x) * 4;
                            const vDiff = Math.abs(srcData[topIdx] - srcData[bottomIdx]) +
                                          Math.abs(srcData[topIdx+1] - srcData[bottomIdx+1]) +
                                          Math.abs(srcData[topIdx+2] - srcData[bottomIdx+2]);
                            
                            if (hDiff > finalOptions.edgeThreshold || 
                                vDiff > finalOptions.edgeThreshold) {
                                isEdge = true;
                            }
                        }
                    }
                    
                    if (isEdge) {
                        // For edges, just copy the original pixel
                        const idx = (y * temp.width + x) * 4;
                        tgtData[idx] = srcData[idx];
                        tgtData[idx+1] = srcData[idx+1];
                        tgtData[idx+2] = srcData[idx+2];
                        tgtData[idx+3] = srcData[idx+3];
                        continue;
                    }
                    
                    // Apply smoothing by averaging surrounding pixels
                    for (let offsetY = -halfRadius; offsetY <= halfRadius; offsetY++) {
                        for (let offsetX = -halfRadius; offsetX <= halfRadius; offsetX++) {
                            const nx = x + offsetX;
                            const ny = y + offsetY;
                            
                            if (nx >= 0 && ny >= 0 && nx < temp.width && ny < temp.height) {
                                const srcIndex = (ny * temp.width + nx) * 4;
                                const weight = 1;
                                
                                rSum += srcData[srcIndex] * weight;
                                gSum += srcData[srcIndex + 1] * weight;
                                bSum += srcData[srcIndex + 2] * weight;
                                aSum += srcData[srcIndex + 3] * weight;
                                weightSum += weight;
                            }
                        }
                    }
                    
                    const tgtIndex = (y * temp.width + x) * 4;
                    
                    // Calculate smoothed values
                    const smoothedR = rSum / weightSum;
                    const smoothedG = gSum / weightSum;
                    const smoothedB = bSum / weightSum;
                    const smoothedA = aSum / weightSum;
                    
                    // Blend original and smoothed based on strength
                    const origIdx = (y * temp.width + x) * 4;
                    tgtData[tgtIndex] = smoothedR * finalOptions.strength + srcData[origIdx] * (1 - finalOptions.strength);
                    tgtData[tgtIndex + 1] = smoothedG * finalOptions.strength + srcData[origIdx + 1] * (1 - finalOptions.strength);
                    tgtData[tgtIndex + 2] = smoothedB * finalOptions.strength + srcData[origIdx + 2] * (1 - finalOptions.strength);
                    tgtData[tgtIndex + 3] = smoothedA * finalOptions.strength + srcData[origIdx + 3] * (1 - finalOptions.strength);
                    
                    // Add noise if specified
                    if (finalOptions.noiseAmount > 0) {
                        const noise = (Math.random() - 0.5) * finalOptions.noiseAmount * 2;
                        tgtData[tgtIndex] = Math.min(255, Math.max(0, tgtData[tgtIndex] + noise));
                        tgtData[tgtIndex + 1] = Math.min(255, Math.max(0, tgtData[tgtIndex + 1] + noise));
                        tgtData[tgtIndex + 2] = Math.min(255, Math.max(0, tgtData[tgtIndex + 2] + noise));
                    }
                }
            }
            
            // Put the processed image data back
            ctx.putImageData(resultImageData, 0, 0);
            
            // Copy the result back to the original canvas
            canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
            canvas_node.getContext('2d').drawImage(temp, 0, 0);
            
            return Image;
        };
        
        return Image;
    };
})();
