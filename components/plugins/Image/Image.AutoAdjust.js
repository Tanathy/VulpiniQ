






(function() {
    
    const originalImage = Q.Image;
    
    
    Q.Image = function(options = {}) {
        
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        
        Image.AutoAdjust = function(autoAdjustOptions = {}) {
            
            const defaultOptions = {
                contrastStretch: true,       
                contrastPercentile: 0.5,     
                autoWhiteBalance: true,      
                autoLevels: true,            
                autoBrightness: true,        
                strength: 1.0,               
                preserveHue: true,           
                clamp: true                  
            };
            
            const finalOptions = Object.assign({}, defaultOptions, autoAdjustOptions);
            
            
            const ctx = canvas_node.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
            const pixels = imageData.data;
            const pixelCount = pixels.length / 4;
            
            
            const histogram = {
                r: new Array(256).fill(0),
                g: new Array(256).fill(0),
                b: new Array(256).fill(0),
                luminance: new Array(256).fill(0)
            };
            
            let totalR = 0, totalG = 0, totalB = 0;
            let minR = 255, minG = 255, minB = 255;
            let maxR = 0, maxG = 0, maxB = 0;
            
            
            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                
                
                histogram.r[r]++;
                histogram.g[g]++;
                histogram.b[b]++;
                
                
                const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                histogram.luminance[luminance]++;
                
                
                totalR += r;
                totalG += g;
                totalB += b;
                
                
                minR = Math.min(minR, r);
                minG = Math.min(minG, g);
                minB = Math.min(minB, b);
                
                maxR = Math.max(maxR, r);
                maxG = Math.max(maxG, g);
                maxB = Math.max(maxB, b);
            }
            
            
            const avgR = totalR / pixelCount;
            const avgG = totalG / pixelCount;
            const avgB = totalB / pixelCount;
            
            
            const stretchRanges = calculateStretchRanges(histogram, finalOptions.contrastPercentile);
            
            
            for (let i = 0; i < pixels.length; i += 4) {
                let r = pixels[i];
                let g = pixels[i + 1];
                let b = pixels[i + 2];
                
                
                if (finalOptions.contrastStretch) {
                    r = stretchChannel(r, stretchRanges.r.min, stretchRanges.r.max);
                    g = stretchChannel(g, stretchRanges.g.min, stretchRanges.g.max);
                    b = stretchChannel(b, stretchRanges.b.min, stretchRanges.b.max);
                }
                
                
                if (finalOptions.autoWhiteBalance) {
                    
                    const avgIntensity = (avgR + avgG + avgB) / 3;
                    const rScale = avgIntensity / avgR;
                    const gScale = avgIntensity / avgG;
                    const bScale = avgIntensity / avgB;
                    
                    
                    const wbStrength = finalOptions.strength;
                    r = lerp(r, r * rScale, wbStrength);
                    g = lerp(g, g * gScale, wbStrength);
                    b = lerp(b, b * bScale, wbStrength);
                }
                
                
                if (finalOptions.autoLevels) {
                    
                    const levelsStrength = finalOptions.strength * 0.5; 
                    
                    
                    r = lerp(r, equalizeChannel(r, histogram.r), levelsStrength);
                    g = lerp(g, equalizeChannel(g, histogram.g), levelsStrength);
                    b = lerp(b, equalizeChannel(b, histogram.b), levelsStrength);
                }
                
                
                if (finalOptions.autoBrightness) {
                    
                    const currentLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
                    const targetLuminance = 128;
                    const brightnessAdjust = (targetLuminance - currentLuminance) * finalOptions.strength * 0.5;
                    
                    r += brightnessAdjust;
                    g += brightnessAdjust;
                    b += brightnessAdjust;
                }
                
                
                if (finalOptions.clamp) {
                    r = Math.min(255, Math.max(0, r));
                    g = Math.min(255, Math.max(0, g));
                    b = Math.min(255, Math.max(0, b));
                }
                
                
                pixels[i] = r;
                pixels[i + 1] = g;
                pixels[i + 2] = b;
                
            }
            
            
            ctx.putImageData(imageData, 0, 0);
            return Image;
        };
        
        
        function calculateStretchRanges(histogram, percentile) {
            const result = {
                r: { min: 0, max: 255 },
                g: { min: 0, max: 255 },
                b: { min: 0, max: 255 }
            };
            
            const channels = ['r', 'g', 'b'];
            const pixelCount = histogram.r.reduce((sum, count) => sum + count, 0);
            const threshold = pixelCount * (percentile / 100);
            
            channels.forEach(channel => {
                let min = 0;
                let max = 255;
                
                
                let count = 0;
                for (let i = 0; i < 256; i++) {
                    count += histogram[channel][i];
                    if (count > threshold) {
                        min = i;
                        break;
                    }
                }
                
                
                count = 0;
                for (let i = 255; i >= 0; i--) {
                    count += histogram[channel][i];
                    if (count > threshold) {
                        max = i;
                        break;
                    }
                }
                
                
                if (max <= min) max = min + 1;
                
                result[channel].min = min;
                result[channel].max = max;
            });
            
            return result;
        }
        
        
        function stretchChannel(value, min, max) {
            return Math.round(255 * (value - min) / (max - min));
        }
        
        
        function lerp(a, b, t) {
            return a + (b - a) * t;
        }
        
        
        function equalizeChannel(value, histogram) {
            const totalPixels = histogram.reduce((sum, count) => sum + count, 0);
            let cdf = 0;
            
            
            for (let i = 0; i <= value; i++) {
                cdf += histogram[i];
            }
            
            
            return Math.round((cdf / totalPixels) * 255);
        }
        
        return Image;
    };
})();
