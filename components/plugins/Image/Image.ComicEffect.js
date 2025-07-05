Q.Image.prototype.ComicEffect = function (colorSteps = 4, effectOptions = {}) {
    const defaultOptions = {
        redSteps: colorSteps,
        greenSteps: colorSteps,
        blueSteps: colorSteps,
        edgeDetection: false,
        edgeThickness: 1,
        edgeThreshold: 20,
        saturation: 1.2
    };
    const finalOptions = Object.assign({}, defaultOptions, effectOptions);
    const canvas_node = this.node;
    this.saveToHistory();
    let temp = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let ctx = temp.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(canvas_node, 0, 0);
    const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
    const pixels = imageData.data;
    const redIntervalSize = 256 / finalOptions.redSteps;
    const greenIntervalSize = 256 / finalOptions.greenSteps;
    const blueIntervalSize = 256 / finalOptions.blueSteps;
    for (let i = 0; i < pixels.length; i += 4) {
        if (finalOptions.saturation !== 1.0) {
            let r = pixels[i] / 255;
            let g = pixels[i + 1] / 255;
            let b = pixels[i + 2] / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
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
            s = Math.min(1, s * finalOptions.saturation);
            if (s === 0) {
                r = g = b = l;
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            pixels[i] = Math.round(r * 255);
            pixels[i + 1] = Math.round(g * 255);
            pixels[i + 2] = Math.round(b * 255);
        }
        const redIndex = Math.floor(pixels[i] / redIntervalSize);
        const greenIndex = Math.floor(pixels[i + 1] / greenIntervalSize);
        const blueIndex = Math.floor(pixels[i + 2] / blueIntervalSize);
        pixels[i] = redIndex * redIntervalSize;
        pixels[i + 1] = greenIndex * greenIntervalSize;
        pixels[i + 2] = blueIndex * blueIntervalSize;
    }
    if (finalOptions.edgeDetection) {
        const edgeImageData = new ImageData(
            new Uint8ClampedArray(pixels),
            temp.width,
            temp.height
        );
        for (let y = finalOptions.edgeThickness; y < temp.height - finalOptions.edgeThickness; y++) {
            for (let x = finalOptions.edgeThickness; x < temp.width - finalOptions.edgeThickness; x++) {
                const pos = (y * temp.width + x) * 4;
                let edgeDetected = false;
                const leftPos = (y * temp.width + (x - finalOptions.edgeThickness)) * 4;
                const rightPos = (y * temp.width + (x + finalOptions.edgeThickness)) * 4;
                const topPos = ((y - finalOptions.edgeThickness) * temp.width + x) * 4;
                const bottomPos = ((y + finalOptions.edgeThickness) * temp.width + x) * 4;
                const diffH = Math.abs(pixels[leftPos] - pixels[rightPos]) +
                    Math.abs(pixels[leftPos + 1] - pixels[rightPos + 1]) +
                    Math.abs(pixels[leftPos + 2] - pixels[rightPos + 2]);
                const diffV = Math.abs(pixels[topPos] - pixels[bottomPos]) +
                    Math.abs(pixels[topPos + 1] - pixels[bottomPos + 1]) +
                    Math.abs(pixels[topPos + 2] - pixels[bottomPos + 2]);
                if (diffH > finalOptions.edgeThreshold || diffV > finalOptions.edgeThreshold) {
                    edgeImageData.data[pos] = 0;
                    edgeImageData.data[pos + 1] = 0;
                    edgeImageData.data[pos + 2] = 0;
                }
            }
        }
        ctx.putImageData(edgeImageData, 0, 0);
    } else {
        ctx.putImageData(imageData, 0, 0);
    }
    canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
    canvas_node.getContext('2d').drawImage(temp, 0, 0);
    return this;
};
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}