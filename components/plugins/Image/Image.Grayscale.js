Q.Image.prototype.Grayscale = function(grayOptions = {}) {
    // Default options
    const defaultGrayOptions = {
        algorithm: 'average', // 'average', 'luminance', 'lightness', 'desaturation', 'red', 'green', 'blue'
        intensity: 1.0,       // 0.0 to 1.0 for partial grayscale effect
        threshold: null       // optional: 0-255, if set, output is black/white
    };
    const finalOptions = Object.assign({}, defaultGrayOptions, grayOptions);
    // Clamp intensity
    finalOptions.intensity = Math.max(0, Math.min(1, finalOptions.intensity));
    const ctx = this.node.getContext('2d');
    this.saveToHistory(); // Save the current state to history
    let data = ctx.getImageData(0, 0, this.node.width, this.node.height);
    let pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let gray;
        switch (finalOptions.algorithm) {
            case 'luminance':
                gray = 0.299 * r + 0.587 * g + 0.114 * b;
                break;
            case 'lightness':
                gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
                break;
            case 'desaturation':
                gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
                break;
            case 'red':
                gray = r;
                break;
            case 'green':
                gray = g;
                break;
            case 'blue':
                gray = b;
                break;
            case 'average':
            default:
                gray = (r + g + b) / 3;
                break;
        }
        // Threshold mode (black/white)
        if (finalOptions.threshold !== null && !isNaN(finalOptions.threshold)) {
            gray = gray >= finalOptions.threshold ? 255 : 0;
        }
        if (finalOptions.intensity < 1.0) {
            // Partial grayscale blending, round to integer
            pixels[i]     = Math.round(r * (1 - finalOptions.intensity) + gray * finalOptions.intensity);
            pixels[i + 1] = Math.round(g * (1 - finalOptions.intensity) + gray * finalOptions.intensity);
            pixels[i + 2] = Math.round(b * (1 - finalOptions.intensity) + gray * finalOptions.intensity);
        } else {
            pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round(gray);
        }
        // pixels[i + 3] (alpha) unchanged
    }
    ctx.putImageData(data, 0, 0);
    return this;
};
