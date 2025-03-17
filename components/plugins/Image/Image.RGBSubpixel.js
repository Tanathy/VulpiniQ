// Name: Image.RGBSubpixel
// Method: Plugin
// Desc: Apply RGB subpixel emulation effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the RGBSubpixel method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add RGBSubpixel method directly to the Image object
        Image.RGBSubpixel = function(subpixelOptions = {}) {
            // Default options
            const defaultOptions = {
                subpixelLayout: 'rgb',         // Subpixel layout: 'rgb', 'bgr', 'vrgb' (vertical)
                subpixelScale: 3.0,            // Scale factor for subpixel rendering (3 = each pixel becomes 3 subpixels)
                phosphorSize: 0.8,             // Size of phosphor dots (0-1, where 1 fills the whole subpixel)
                phosphorBloom: 0.2,            // Bloom effect around phosphors (0-1)
                maxResolution: 640,            // Maximum "native resolution" width to simulate
                resolutionScale: 1.0,          // Scale factor for the final resolution (1 = use maxResolution)
                brightness: 1.0,               // Brightness adjustment for subpixels (0.5-2.0)
                applyNoise: false,             // Apply CRT-like noise
                noiseAmount: 5,                // Amount of noise to apply
                fastMode: true,                // Use faster rendering algorithm (less authentic but much faster)
                scanlines: false,              // Whether to apply scanlines
                scanlineHeight: 1,             // Height of scanlines
                scanlineMargin: 3,             // Space between scanlines
                scanlineOpacity: 0.1,          // Opacity of scanlines
                scanlineBrightness: 0.5        // Brightness between scanlines (0-1)
            };
            
            const finalOptions = Object.assign({}, defaultOptions, subpixelOptions);

            // Create a temporary canvas for processing
            let temp = Q('<canvas>', { 
                width: canvas_node.width, 
                height: canvas_node.height 
            }).nodes[0];
            
            let ctx = temp.getContext('2d', { willReadFrequently: true });
            
            // Draw the current canvas content to our temp canvas
            ctx.drawImage(canvas_node, 0, 0);
            
            // Create a canvas for the final output
            const resultCanvas = canvas_node;
            const resultCtx = resultCanvas.getContext('2d', { willReadFrequently: true });
            
            // Fast subpixel mode (optimized approach)
            if (finalOptions.fastMode) {
                // Create a pattern for the subpixels based on the layout
                const patternSize = finalOptions.subpixelLayout === 'vrgb' ? 1 : 3;
                const patternCanvas = document.createElement('canvas');
                patternCanvas.width = patternSize;
                patternCanvas.height = 1;
                const patternCtx = patternCanvas.getContext('2d');
                
                // Create RGB pattern based on layout
                if (finalOptions.subpixelLayout === 'rgb') {
                    patternCtx.fillStyle = `rgba(255,0,0,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(0, 0, 1, 1);
                    patternCtx.fillStyle = `rgba(0,255,0,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(1, 0, 1, 1);
                    patternCtx.fillStyle = `rgba(0,0,255,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(2, 0, 1, 1);
                } else if (finalOptions.subpixelLayout === 'bgr') {
                    patternCtx.fillStyle = `rgba(0,0,255,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(0, 0, 1, 1);
                    patternCtx.fillStyle = `rgba(0,255,0,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(1, 0, 1, 1);
                    patternCtx.fillStyle = `rgba(255,0,0,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(2, 0, 1, 1);
                } else if (finalOptions.subpixelLayout === 'vrgb') {
                    // Create vertical pattern in a different canvas
                    patternCanvas.width = 1;
                    patternCanvas.height = 3;
                    patternCtx.fillStyle = `rgba(255,0,0,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(0, 0, 1, 1);
                    patternCtx.fillStyle = `rgba(0,255,0,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(0, 1, 1, 1);
                    patternCtx.fillStyle = `rgba(0,0,255,${finalOptions.phosphorSize})`;
                    patternCtx.fillRect(0, 2, 1, 1);
                }
                
                // Create properly sized canvas for the target resolution
                const targetWidth = Math.min(temp.width, finalOptions.maxResolution);
                const targetHeight = Math.round(temp.height * (targetWidth / temp.width));
                
                // Scale the input image to the target size first
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = targetWidth;
                scaledCanvas.height = targetHeight;
                const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });
                scaledCtx.drawImage(temp, 0, 0, targetWidth, targetHeight);
                
                // Create a canvas for the RGB separation
                let rgbCanvas;
                let rgbCtx;
                
                if (finalOptions.subpixelLayout === 'vrgb') {
                    // Vertical layout - triple height
                    rgbCanvas = document.createElement('canvas');
                    rgbCanvas.width = targetWidth;
                    rgbCanvas.height = targetHeight * 3;
                    rgbCtx = rgbCanvas.getContext('2d', { willReadFrequently: true });
                    
                    // Red channel (top third)
                    rgbCtx.drawImage(scaledCanvas, 0, 0);
                    rgbCtx.fillStyle = 'rgba(0, 255, 255, 1.0)'; // Cyan (removes red)
                    rgbCtx.globalCompositeOperation = 'multiply';
                    rgbCtx.fillRect(0, 0, targetWidth, targetHeight);
                    
                    // Green channel (middle third)
                    rgbCtx.globalCompositeOperation = 'source-over';
                    rgbCtx.drawImage(scaledCanvas, 0, targetHeight);
                    rgbCtx.fillStyle = 'rgba(255, 0, 255, 1.0)'; // Magenta (removes green)
                    rgbCtx.globalCompositeOperation = 'multiply';
                    rgbCtx.fillRect(0, targetHeight, targetWidth, targetHeight);
                    
                    // Blue channel (bottom third)
                    rgbCtx.globalCompositeOperation = 'source-over';
                    rgbCtx.drawImage(scaledCanvas, 0, targetHeight * 2);
                    rgbCtx.fillStyle = 'rgba(255, 255, 0, 1.0)'; // Yellow (removes blue)
                    rgbCtx.globalCompositeOperation = 'multiply';
                    rgbCtx.fillRect(0, targetHeight * 2, targetWidth, targetHeight);
                } else {
                    // Horizontal layout - triple width
                    rgbCanvas = document.createElement('canvas');
                    rgbCanvas.width = targetWidth * 3;
                    rgbCanvas.height = targetHeight;
                    rgbCtx = rgbCanvas.getContext('2d', { willReadFrequently: true });
                    
                    // Apply the scaled image to each channel with offset
                    // Red channel
                    rgbCtx.globalCompositeOperation = 'source-over';
                    rgbCtx.drawImage(scaledCanvas, 0, 0);
                    rgbCtx.fillStyle = 'rgba(0, 255, 255, 1.0)'; // Cyan (removes red)
                    rgbCtx.globalCompositeOperation = 'multiply';
                    rgbCtx.fillRect(0, 0, targetWidth, targetHeight);
                    
                    // Green channel
                    rgbCtx.globalCompositeOperation = 'source-over';
                    rgbCtx.drawImage(scaledCanvas, targetWidth, 0);
                    rgbCtx.fillStyle = 'rgba(255, 0, 255, 1.0)'; // Magenta (removes green)
                    rgbCtx.globalCompositeOperation = 'multiply';
                    rgbCtx.fillRect(targetWidth, 0, targetWidth, targetHeight);
                    
                    // Blue channel
                    rgbCtx.globalCompositeOperation = 'source-over';
                    rgbCtx.drawImage(scaledCanvas, targetWidth * 2, 0);
                    rgbCtx.fillStyle = 'rgba(255, 255, 0, 1.0)'; // Yellow (removes blue)
                    rgbCtx.globalCompositeOperation = 'multiply';
                    rgbCtx.fillRect(targetWidth * 2, 0, targetWidth, targetHeight);
                }
                
                // Apply pattern to the RGB canvas
                rgbCtx.globalCompositeOperation = 'destination-in';
                const pattern = patternCtx.createPattern(patternCanvas, 'repeat');
                rgbCtx.fillStyle = pattern;
                rgbCtx.fillRect(0, 0, rgbCanvas.width, rgbCanvas.height);
                
                // Apply noise if enabled
                if (finalOptions.applyNoise) {
                    // Create a noise canvas
                    const noiseCanvas = document.createElement('canvas');
                    noiseCanvas.width = rgbCanvas.width;
                    noiseCanvas.height = rgbCanvas.height;
                    const noiseCtx = noiseCanvas.getContext('2d', { willReadFrequently: true });
                    
                    const noiseData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
                    const noisePixels = noiseData.data;
                    
                    for (let i = 0; i < noisePixels.length; i += 4) {
                        const noise = (Math.random() - 0.5) * finalOptions.noiseAmount;
                        noisePixels[i] = noisePixels[i + 1] = noisePixels[i + 2] = 128 + noise;
                        noisePixels[i + 3] = 30; // Low alpha for subtle noise
                    }
                    
                    noiseCtx.putImageData(noiseData, 0, 0);
                    
                    // Blend the noise with the RGB canvas
                    rgbCtx.globalCompositeOperation = 'overlay';
                    rgbCtx.drawImage(noiseCanvas, 0, 0);
                }
                
                // Scale the RGB subpixel image back to the original size with appropriate brightness
                resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
                resultCtx.globalAlpha = finalOptions.brightness;
                resultCtx.drawImage(
                    rgbCanvas, 0, 0, rgbCanvas.width, rgbCanvas.height,
                    0, 0, resultCanvas.width, resultCanvas.height
                );
                resultCtx.globalAlpha = 1.0;
            }
            else {
                // Original detailed subpixel implementation
                // Create a canvas for subpixel rendering
                let subpixelCanvas = Q('<canvas>', { 
                    width: Math.ceil(temp.width * finalOptions.subpixelScale), 
                    height: Math.ceil(temp.height * finalOptions.subpixelScale) 
                }).nodes[0];
                
                let subpixelCtx = subpixelCanvas.getContext('2d', { willReadFrequently: true });
                
                // Determine target resolution
                const targetWidth = Math.min(temp.width, finalOptions.maxResolution);
                const targetHeight = Math.round(temp.height * (targetWidth / temp.width));
                
                // Scale factor based on target resolution
                const resolutionScale = targetWidth / temp.width * finalOptions.resolutionScale;
                
                // Draw the source image (with any previous effects) to the subpixel canvas
                subpixelCtx.drawImage(temp, 0, 0, subpixelCanvas.width, subpixelCanvas.height);
                
                // Get subpixel canvas image data for processing
                const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
                const subpixelData = subpixelCtx.getImageData(0, 0, subpixelCanvas.width, subpixelCanvas.height);
                
                // Create a new canvas for the processed subpixel image
                let processedCanvas = document.createElement('canvas');
                processedCanvas.width = subpixelCanvas.width;
                processedCanvas.height = subpixelCanvas.height;
                
                let processedCtx = processedCanvas.getContext('2d', { willReadFrequently: true });
                processedCtx.clearRect(0, 0, processedCanvas.width, processedCanvas.height);
                
                // Calculate phosphor parameters
                const subpixelWidth = Math.ceil(finalOptions.subpixelScale / 3);
                const phosphorWidth = Math.ceil(subpixelWidth * finalOptions.phosphorSize);
                const phosphorBloom = finalOptions.phosphorBloom * subpixelWidth;
                
                // Pre-create colors for the phosphors
                const colorRed = `rgba(255,0,0,1)`;
                const colorGreen = `rgba(0,255,0,1)`;
                const colorBlue = `rgba(0,0,255,1)`;
                const colors = [colorRed, colorGreen, colorBlue];
                
                // Only create a limited number of gradients to reuse them
                const intensityLevels = 10; // Use 10 intensity levels instead of 256
                const gradients = {
                    'red': [],
                    'green': [],
                    'blue': []
                };
                
                // Pre-calculate gradients for different intensity levels
                for (let level = 0; level < intensityLevels; level++) {
                    const intensity = level / (intensityLevels - 1);
                    
                    // For each color
                    ['red', 'green', 'blue'].forEach((color, colorIndex) => {
                        // Create a gradient for this color and intensity
                        const gradientSize = phosphorWidth + (phosphorBloom * 2);
                        const centerX = subpixelWidth / 2;
                        const centerY = subpixelWidth / 2;
                        const gradient = processedCtx.createRadialGradient(
                            centerX, centerY, 0,
                            centerX, centerY, gradientSize / 2
                        );
                        
                        gradient.addColorStop(0, `rgba(${colors[colorIndex].replace(/[^\d,]/g, '')},${intensity})`);
                        gradient.addColorStop(phosphorWidth / gradientSize, 
                            `rgba(${colors[colorIndex].replace(/[^\d,]/g, '')},${intensity * 0.7})`);
                        gradient.addColorStop(1, `rgba(${colors[colorIndex].replace(/[^\d,]/g, '')},0)`);
                        
                        gradients[color].push(gradient);
                    });
                }
                
                // For horizontal layouts
                if (finalOptions.subpixelLayout === 'rgb' || finalOptions.subpixelLayout === 'bgr') {
                    const isRGB = finalOptions.subpixelLayout === 'rgb';
                    const colorOrder = isRGB ? [0, 1, 2] : [2, 1, 0]; // RGB or BGR
                    const batchHeight = 20; // Process 20 rows at a time
                    
                    for (let y = 0; y < temp.height; y += batchHeight) {
                        const maxY = Math.min(temp.height, y + batchHeight);
                        
                        for (let cy = y; cy < maxY; cy++) {
                            for (let x = 0; x < temp.width; x++) {
                                const srcIndex = (cy * temp.width + x) * 4;
                                
                                // Get source pixel color
                                const r = imageData.data[srcIndex];
                                const g = imageData.data[srcIndex + 1];
                                const b = imageData.data[srcIndex + 2];
                                
                                // Calculate subpixel positions
                                const baseX = Math.floor(x * finalOptions.subpixelScale);
                                const baseY = Math.floor(cy * finalOptions.subpixelScale);
                                
                                // Draw R, G, B phosphors
                                const components = [r, g, b];
                                
                                for (let i = 0; i < 3; i++) {
                                    // Map intensity to pre-calculated gradients
                                    const intensity = components[colorOrder[i]] / 255;
                                    const gradientIndex = Math.floor(intensity * (intensityLevels - 1));
                                    const colorName = i === 0 ? 'red' : (i === 1 ? 'green' : 'blue');
                                    
                                    const subpixelX = baseX + (i * subpixelWidth);
                                    processedCtx.fillStyle = gradients[colorName][gradientIndex];
                                    processedCtx.fillRect(
                                        subpixelX, baseY, 
                                        subpixelWidth, finalOptions.subpixelScale
                                    );
                                }
                            }
                        }
                    }
                } 
                else if (finalOptions.subpixelLayout === 'vrgb') {
                    // Vertical RGB layout handling
                    for (let y = 0; y < temp.height; y++) {
                        for (let x = 0; x < temp.width; x++) {
                            const srcIndex = (y * temp.width + x) * 4;
                            
                            // Get source pixel color
                            const r = imageData.data[srcIndex];
                            const g = imageData.data[srcIndex + 1];
                            const b = imageData.data[srcIndex + 2];
                            
                            // Calculate subpixel positions
                            const baseX = Math.floor(x * finalOptions.subpixelScale);
                            const baseY = Math.floor(y * finalOptions.subpixelScale);
                            
                            // Draw vertical R, G, B phosphor lines
                            const components = [r, g, b];
                            
                            for (let i = 0; i < 3; i++) {
                                const intensity = components[i] / 255;
                                const gradientIndex = Math.floor(intensity * (intensityLevels - 1));
                                const colorName = i === 0 ? 'red' : (i === 1 ? 'green' : 'blue');
                                
                                const subpixelY = baseY + (i * subpixelWidth);
                                
                                processedCtx.fillStyle = gradients[colorName][gradientIndex];
                                processedCtx.fillRect(
                                    baseX, subpixelY, 
                                    finalOptions.subpixelScale, subpixelWidth
                                );
                            }
                        }
                    }
                }
                
                // Apply noise if enabled
                if (finalOptions.applyNoise) {
                    const noiseData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
                    const noisePixels = noiseData.data;
                    
                    for (let i = 0; i < noisePixels.length; i += 4) {
                        if (noisePixels[i+3] > 0) { // Only apply to visible pixels
                            const noise = (Math.random() - 0.5) * finalOptions.noiseAmount;
                            noisePixels[i] = Math.min(255, Math.max(0, noisePixels[i] + noise));
                            noisePixels[i+1] = Math.min(255, Math.max(0, noisePixels[i+1] + noise));
                            noisePixels[i+2] = Math.min(255, Math.max(0, noisePixels[i+2] + noise));
                        }
                    }
                    
                    processedCtx.putImageData(noiseData, 0, 0);
                }
                
                // Scale the processed image back to target resolution
                resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
                resultCtx.globalAlpha = finalOptions.brightness;
                resultCtx.drawImage(
                    processedCanvas, 0, 0, 
                    processedCanvas.width, processedCanvas.height,
                    0, 0, resultCanvas.width, resultCanvas.height
                );
                resultCtx.globalAlpha = 1.0;
            }
            
            // Draw horizontal scanlines if enabled
            if (finalOptions.scanlines) {
                function drawHorizontalLines(ctx, width, height, totalHeight, margin, color, brightnessFactor) {
                    ctx.fillStyle = color;
                    
                    // Draw lines between the scanlines with brightness adjustment
                    for (let i = 0; i < totalHeight; i += (height + margin)) {
                        // Draw the dark scanline
                        ctx.fillRect(0, i, width, height);
                        
                        // Draw brighter area between scanlines if brightness is adjusted
                        if (brightnessFactor > 0 && i + height < totalHeight) {
                            const brightColor = `rgba(255, 255, 255, ${brightnessFactor * 0.1})`;
                            ctx.fillStyle = brightColor;
                            ctx.fillRect(0, i + height, width, margin);
                            ctx.fillStyle = color; // Reset to scanline color
                        }
                    }
                }
                
                drawHorizontalLines(
                    resultCtx, 
                    resultCanvas.width, 
                    finalOptions.scanlineHeight, 
                    resultCanvas.height, 
                    finalOptions.scanlineMargin, 
                    `rgba(0, 0, 0, ${finalOptions.scanlineOpacity})`,
                    finalOptions.scanlineBrightness
                );
            }
            
            return Image;
        };
        
        return Image;
    };
})();
