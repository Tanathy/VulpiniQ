Q.Image.prototype.AutoAdjust = function(autoAdjustOptions = {}) {
    const defaultOptions = {
        mode: 'autoTone',
        clipPercentage: 0.5,
        targetBrightness: 128,
        neutralizeColors: true,
        enhanceShadows: true,
        enhanceHighlights: true,
        preserveContrast: true,
        strength: 1.0,
        preserveHue: true,
        clamp: true
    };
    const finalOptions = Object.assign({}, defaultOptions, autoAdjustOptions);
    const canvas_node = this.node;
    const ctx = canvas_node.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
    const pixels = imageData.data;
    const pixelCount = pixels.length / 4;
    const imageStats = analyzeImage(pixels, pixelCount);
    switch (finalOptions.mode) {
        case 'autoTone':
            applyAutoTone(pixels, imageStats, finalOptions);
            break;
        case 'autoContrast':
            applyAutoContrast(pixels, imageStats, finalOptions);
            break;
        case 'autoBrightness':
            applyAutoBrightness(pixels, imageStats, finalOptions);
            break;
        case 'autoColor':
            applyAutoColor(pixels, imageStats, finalOptions);
            break;
        default:
            applyAutoTone(pixels, imageStats, finalOptions);
    }
    ctx.putImageData(imageData, 0, 0);
    this.saveToHistory();
    return this;
};
function applyAutoTone(pixels, imageStats, options) {
    const { histogram, avgR, avgG, avgB } = imageStats;
    const clipAmount = Math.floor(imageStats.pixelCount * (options.clipPercentage / 100));
    const blackPoint = {
        r: findBlackPoint(histogram.r, clipAmount, options.enhanceShadows),
        g: findBlackPoint(histogram.g, clipAmount, options.enhanceShadows),
        b: findBlackPoint(histogram.b, clipAmount, options.enhanceShadows)
    };
    const whitePoint = {
        r: findWhitePoint(histogram.r, clipAmount, options.enhanceHighlights),
        g: findWhitePoint(histogram.g, clipAmount, options.enhanceHighlights),
        b: findWhitePoint(histogram.b, clipAmount, options.enhanceHighlights)
    };
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        const originalR = r;
        const originalG = g;
        const originalB = b;
        const originalLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
        r = mapTone(r, blackPoint.r, whitePoint.r);
        g = mapTone(g, blackPoint.g, whitePoint.g);
        b = mapTone(b, blackPoint.b, whitePoint.b);
        r = lerp(originalR, r, options.strength);
        g = lerp(originalG, g, options.strength);
        b = lerp(originalB, b, options.strength);
        if (options.preserveHue && originalLuminance > 0) {
            const newLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (newLuminance > 0) {
                const luminanceRatio = newLuminance / originalLuminance;
                r = originalR * luminanceRatio;
                g = originalG * luminanceRatio;
                b = originalB * luminanceRatio;
            }
        }
        if (options.clamp) {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}
function applyAutoContrast(pixels, imageStats, options) {
    const { histogram } = imageStats;
    const clipAmount = Math.floor(imageStats.pixelCount * (options.clipPercentage / 100));
    const blackPoint = findBlackPoint(histogram.luminance, clipAmount, true);
    const whitePoint = findWhitePoint(histogram.luminance, clipAmount, true);
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        const originalR = r;
        const originalG = g;
        const originalB = b;
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const newLuminance = mapTone(luminance, blackPoint, whitePoint);
        if (luminance > 0) {
            const luminanceRatio = newLuminance / luminance;
            r = r * luminanceRatio;
            g = g * luminanceRatio;
            b = b * luminanceRatio;
        }
        r = lerp(originalR, r, options.strength);
        g = lerp(originalG, g, options.strength);
        b = lerp(originalB, b, options.strength);
        if (options.clamp) {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}
function applyAutoBrightness(pixels, imageStats, options) {
    const { avgLuminance } = imageStats;
    const targetBrightness = options.targetBrightness;
    const brightnessAdjust = targetBrightness - avgLuminance;
    const maxAdjustment = 80;
    const actualAdjustment = Math.max(-maxAdjustment, Math.min(maxAdjustment, 
                             brightnessAdjust * options.strength));
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        pixels[i] = Math.min(255, Math.max(0, r + actualAdjustment));
        pixels[i + 1] = Math.min(255, Math.max(0, g + actualAdjustment));
        pixels[i + 2] = Math.min(255, Math.max(0, b + actualAdjustment));
    }
}
function applyAutoColor(pixels, imageStats, options) {
    const { avgR, avgG, avgB } = imageStats;
    const neutralGray = (avgR + avgG + avgB) / 3;
    const rFactor = neutralGray / avgR;
    const gFactor = neutralGray / avgG;
    const bFactor = neutralGray / avgB;
    const limitFactor = 2.0;
    const rAdjust = Math.max(1/limitFactor, Math.min(limitFactor, rFactor));
    const gAdjust = Math.max(1/limitFactor, Math.min(limitFactor, gFactor));
    const bAdjust = Math.max(1/limitFactor, Math.min(limitFactor, bFactor));
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        const originalR = r;
        const originalG = g;
        const originalB = b;
        const originalLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
        r = r * rAdjust;
        g = g * gAdjust;
        b = b * bAdjust;
        r = lerp(originalR, r, options.strength);
        g = lerp(originalG, g, options.strength);
        b = lerp(originalB, b, options.strength);
        if (options.preserveHue && originalLuminance > 0) {
            const newLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (newLuminance > 0) {
                const luminanceRatio = newLuminance / originalLuminance;
                r = originalR * luminanceRatio;
                g = originalG * luminanceRatio;
                b = originalB * luminanceRatio;
            }
        }
        if (options.clamp) {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}
function analyzeImage(pixels, pixelCount) {
    const histogram = {
        r: new Array(256).fill(0),
        g: new Array(256).fill(0),
        b: new Array(256).fill(0),
        luminance: new Array(256).fill(0)
    };
    let totalR = 0, totalG = 0, totalB = 0, totalLuminance = 0;
    let minR = 255, minG = 255, minB = 255, minLuminance = 255;
    let maxR = 0, maxG = 0, maxB = 0, maxLuminance = 0;
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
        totalLuminance += luminance;
        minR = Math.min(minR, r);
        minG = Math.min(minG, g);
        minB = Math.min(minB, b);
        minLuminance = Math.min(minLuminance, luminance);
        maxR = Math.max(maxR, r);
        maxG = Math.max(maxG, g);
        maxB = Math.max(maxB, b);
        maxLuminance = Math.max(maxLuminance, luminance);
    }
    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;
    const avgLuminance = totalLuminance / pixelCount;
    return {
        histogram,
        pixelCount,
        avgR, avgG, avgB, avgLuminance,
        minR, minG, minB, minLuminance,
        maxR, maxG, maxB, maxLuminance
    };
}
function findBlackPoint(histogram, clipAmount, enhanceShadows) {
    let count = 0;
    let blackPoint = 0;
    for (let i = 0; i < 256; i++) {
        count += histogram[i];
        if (count > clipAmount) {
            blackPoint = i;
            break;
        }
    }
    if (enhanceShadows) {
        blackPoint = Math.max(0, blackPoint - 5);
    }
    return blackPoint;
}
function findWhitePoint(histogram, clipAmount, enhanceHighlights) {
    let count = 0;
    let whitePoint = 255;
    for (let i = 255; i >= 0; i--) {
        count += histogram[i];
        if (count > clipAmount) {
            whitePoint = i;
            break;
        }
    }
    if (enhanceHighlights) {
        whitePoint = Math.min(255, whitePoint + 5);
    }
    return whitePoint;
}
function mapTone(value, blackPoint, whitePoint) {
    if (whitePoint <= blackPoint) {
        whitePoint = blackPoint + 1;
    }
    return 255 * (value - blackPoint) / (whitePoint - blackPoint);
}
function lerp(a, b, t) {
    return a + (b - a) * Math.max(0, Math.min(1, t));
}
Q.Image.prototype.AutoTone = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoTone' }));
};
Q.Image.prototype.AutoContrast = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoContrast' }));
};
Q.Image.prototype.AutoBrightness = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoBrightness' }));
};
Q.Image.prototype.AutoColor = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoColor' }));
};
