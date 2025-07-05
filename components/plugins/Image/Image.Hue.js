Q.Image.prototype.Hue = function (angle = 0, options = {}) {
    // Default options
    const defaultOptions = {
        clamp: true // Clamp RGB values to [0,255]
    };
    const finalOptions = Object.assign({}, defaultOptions, options);
    const canvas_node = this.node;
    this.saveToHistory();
    const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
    const data = imageData.data;
    // Convert angle to [0,1] range for HSL
    const hueShift = ((angle % 360) + 360) % 360 / 360;
    for (let i = 0; i < data.length; i += 4) {
        // Convert RGB to HSL
        let r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        // Shift hue
        h = (h + hueShift) % 1;
        if (h < 0) h += 1;
        // Convert HSL back to RGB
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        let rr = hue2rgb(p, q, h + 1 / 3);
        let gg = hue2rgb(p, q, h);
        let bb = hue2rgb(p, q, h - 1 / 3);
        data[i] = finalOptions.clamp ? Math.min(255, Math.max(0, Math.round(rr * 255))) : Math.round(rr * 255);
        data[i + 1] = finalOptions.clamp ? Math.min(255, Math.max(0, Math.round(gg * 255))) : Math.round(gg * 255);
        data[i + 2] = finalOptions.clamp ? Math.min(255, Math.max(0, Math.round(bb * 255))) : Math.round(bb * 255);
        // alpha unchanged
    }
    ctx.putImageData(imageData, 0, 0);
    return this;
};
