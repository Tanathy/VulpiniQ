
    Q.Image.prototype.CRT = function(crtOptions = {}) {
        // Default options
        const defaultOptions = {
            // Original options
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
            vignetteStrength: 0.5,    // Vignette effect strength (0-1),
            
            // Additional options
            scanlineBrightness: 0.5,  // Brightness between scanlines (0-1)
            rgbOffset: 0,             // RGB subpixel separation
            curvature: true,          // Apply CRT screen curvature
            curvatureAmount: 0.1,     // Amount of screen curvature (0-0.3),
            
            // VHS specific options
            verticalWobble: 5,        // Amplitude of vertical wobble
            horizontalWobble: 2,      // Amplitude of horizontal wobble
            wobbleSpeed: 10,          // Speed of wobble effect (1-50)
            colorBleed: 0,            // Amount of color bleeding (0-5)
            jitterChance: 0,          // Chance of frame jitter (0-100)
        };
        
        const finalOptions = Object.assign({}, defaultOptions, crtOptions);
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
        
        // Create a new canvas for applying VHS wobble effects
        let wobbleCanvas = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        
        let wobbleCtx = wobbleCanvas.getContext('2d', { willReadFrequently: true });
        
        // Apply chromatic aberration with RGB subpixel separation
        const tempData = new Uint8ClampedArray(data);
        const redShift = finalOptions.redShift;
        const blueShift = finalOptions.blueShift;
        const rgbOffset = finalOptions.rgbOffset;
        
        if (finalOptions.colorBleed > 0) {
            // Apply color bleeding (VHS style)
            const bleed = Math.floor(finalOptions.colorBleed);
            
            for (let y = 0; y < temp.height; y++) {
                for (let x = 0; x < temp.width; x++) {
                    const currentIndex = (y * temp.width + x) * 4;
                    
                    // Bleed colors horizontally
                    if (x + bleed < temp.width) {
                        const bleedIndex = (y * temp.width + (x + bleed)) * 4;
                        data[bleedIndex] = Math.max(data[bleedIndex], data[currentIndex] * 0.7); // Red bleeds
                    }
                    
                    // Blue channel bleeds upwards
                    if (y > bleed) {
                        const bleedIndex = ((y - bleed) * temp.width + x) * 4 + 2;
                        data[bleedIndex] = Math.max(data[bleedIndex], data[currentIndex + 2] * 0.7); // Blue bleeds
                    }
                }
            }
        }
        
        // Apply the modified image data to the wobble canvas first
        ctx.putImageData(imageData, 0, 0);

        // Standard rendering (no subpixel emulation)
        wobbleCtx.drawImage(temp, 0, 0);

        // Clear the result canvas
        const resultCtx = canvas_node.getContext('2d', { willReadFrequently: true });
        resultCtx.clearRect(0, 0, canvas_node.width, canvas_node.height);
        
        // Apply scanlines later if using subpixel emulation and flag is set
        let applyScanlines = !finalOptions.subpixelEmulation || !finalOptions.applyScanlineAfterSubpixel;

        // Apply VHS wobble effect by sampling from the intermediate canvas
        // Simulate random jitter if enabled
        if (finalOptions.jitterChance > 0 && Math.random() * 100 < finalOptions.jitterChance) {
            // Simulate VHS tracking jump
            const jumpOffset = CRTRandomBetween(5, 20);
            resultCtx.drawImage(wobbleCanvas, 0, jumpOffset, canvas_node.width, canvas_node.height - jumpOffset);
            resultCtx.drawImage(wobbleCanvas, 0, 0, canvas_node.width, jumpOffset, 0, canvas_node.height - jumpOffset, canvas_node.width, jumpOffset);
        } else {
            // Create a distortion pattern for wobble
            const vWobbleAmp = finalOptions.verticalWobble;
            const hWobbleAmp = finalOptions.horizontalWobble;
            const wobbleSpeed = finalOptions.wobbleSpeed / 10;
            
            // Use time-based phase to create dynamic wobble
            const timePhase = Date.now() / 1000 * wobbleSpeed;
            
            // Apply screen curvature if enabled
            if (finalOptions.curvature) {
                const curveAmount = finalOptions.curvatureAmount;
                
                // Draw with curvature distortion
                for (let y = 0; y < canvas_node.height; y++) {
                    // Calculate normalized y position (0 to 1)
                    const ny = y / canvas_node.height * 2 - 1; // -1 to 1
                    
                    // Apply vertical wobble
                    const vWobble = vWobbleAmp * Math.sin(y / 30 + timePhase);
                    
                    for (let x = 0; x < canvas_node.width; x++) {
                        // Calculate normalized x position (-1 to 1)
                        const nx = x / canvas_node.width * 2 - 1; // -1 to 1
                        
                        // Apply horizontal wobble based on x position and time
                        const hWobble = hWobbleAmp * Math.sin(x / 20 + timePhase * 0.7);
                        
                        // Calculate curved position (barrel distortion)
                        const distSq = nx * nx + ny * ny;
                        const distortion = 1 + distSq * curveAmount;
                        
                        // Map back to pixel coordinates with curvature
                        const srcX = Math.round((nx / distortion + 1) / 2 * canvas_node.width + hWobble);
                        const srcY = Math.round((ny / distortion + 1) / 2 * canvas_node.height + vWobble);
                        
                        // Only draw if source pixel is within bounds
                        if (srcX >= 0 && srcX < canvas_node.width && srcY >= 0 && srcY < canvas_node.height) {
                            // Sample RGB channels with offset for RGB subpixel effect
                            if (rgbOffset > 0) {
                                // Sample colors separately with RGB subpixel separation
                                const rOffset = Math.min(canvas_node.width - 1, srcX + Math.floor(rgbOffset));
                                const gOffset = srcX;
                                const bOffset = Math.max(0, srcX - Math.floor(rgbOffset));
                                
                                // Get pixel data from source
                                const rData = wobbleCtx.getImageData(rOffset, srcY, 1, 1).data;
                                const gData = wobbleCtx.getImageData(gOffset, srcY, 1, 1).data;
                                const bData = wobbleCtx.getImageData(bOffset, srcY, 1, 1).data;
                                
                                // Set pixel with RGB separation
                                resultCtx.fillStyle = `rgb(${rData[0]}, ${gData[1]}, ${bData[2]})`;
                                resultCtx.fillRect(x, y, 1, 1);
                            } else {
                                // Normal pixel sampling without RGB separation
                                const pixelData = wobbleCtx.getImageData(srcX, srcY, 1, 1).data;
                                resultCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                                resultCtx.fillRect(x, y, 1, 1);
                            }
                        }
                    }
                }
            } else {
                // No curvature, apply wobble directly
                for (let y = 0; y < canvas_node.height; y++) {
                    // Apply vertical wobble
                    const vWobble = vWobbleAmp * Math.sin(y / 30 + timePhase);
                    
                    for (let x = 0; x < canvas_node.width; x++) {
                        // Apply horizontal wobble based on x position and time
                        const hWobble = hWobbleAmp * Math.sin(x / 20 + timePhase * 0.7);
                        
                        const srcX = Math.round(x + hWobble);
                        const srcY = Math.round(y + vWobble);
                        
                        // Only draw if source pixel is within bounds
                        if (srcX >= 0 && srcX < canvas_node.width && srcY >= 0 && srcY < canvas_node.height) {
                            // Sample colors with RGB subpixel separation
                            if (rgbOffset > 0) {
                                const rOffset = Math.min(canvas_node.width - 1, srcX + Math.floor(rgbOffset));
                                const gOffset = srcX;
                                const bOffset = Math.max(0, srcX - Math.floor(rgbOffset));
                                
                                // Get pixel data from source
                                const rData = wobbleCtx.getImageData(rOffset, srcY, 1, 1).data;
                                const gData = wobbleCtx.getImageData(gOffset, srcY, 1, 1).data;
                                const bData = wobbleCtx.getImageData(bOffset, srcY, 1, 1).data;
                                
                                // Set pixel with RGB separation
                                resultCtx.fillStyle = `rgb(${rData[0]}, ${gData[1]}, ${bData[2]})`;
                                resultCtx.fillRect(x, y, 1, 1);
                            } else {
                                // Normal pixel sampling without RGB separation
                                const pixelData = wobbleCtx.getImageData(srcX, srcY, 1, 1).data;
                                resultCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                                resultCtx.fillRect(x, y, 1, 1);
                            }
                        }
                    }
                }
            }
        }
        
        // Draw horizontal scanlines with brightness adjustment
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
        
        // Apply scanlines over the result - conditionally moved
        if (applyScanlines) {
            drawHorizontalLines(
                resultCtx, 
                canvas_node.width, 
                finalOptions.scanlineHeight, 
                canvas_node.height, 
                finalOptions.scanlineMargin, 
                `rgba(0, 0, 0, ${finalOptions.scanlineOpacity})`,
                finalOptions.scanlineBrightness
            );
        }

        // Apply scanlines now if they were deferred because of subpixel emulation
        if (finalOptions.subpixelEmulation && finalOptions.applyScanlineAfterSubpixel) {
            drawHorizontalLines(
                resultCtx, 
                canvas_node.width, 
                finalOptions.scanlineHeight, 
                canvas_node.height, 
                finalOptions.scanlineMargin, 
                `rgba(0, 0, 0, ${finalOptions.scanlineOpacity})`,
                finalOptions.scanlineBrightness
            );
        }
        
        // Apply vignette effect if enabled
        if (finalOptions.vignette) {
            const centerX = canvas_node.width / 2;
            const centerY = canvas_node.height / 2;
            const radius = Math.max(centerX, centerY);
            
            // Create radial gradient for vignette
            const gradient = resultCtx.createRadialGradient(
                centerX, centerY, radius * 0.5, 
                centerX, centerY, radius * 1.5
            );
            
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, `rgba(0,0,0,${finalOptions.vignetteStrength})`);
            
            resultCtx.fillStyle = gradient;
            resultCtx.globalCompositeOperation = 'multiply';
            resultCtx.fillRect(0, 0, canvas_node.width, canvas_node.height);
            resultCtx.globalCompositeOperation = 'source-over';
        }
        
        return this;
    };