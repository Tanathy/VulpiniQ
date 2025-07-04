Q.Image.prototype.Brightness = function (value, brightOptions = {}) {
    const defaultOptions = {
        preserveAlpha: true,
        clamp: true
    };
    const finalOptions = Object.assign({}, defaultOptions, brightOptions);
    const canvas_node = this.node;
    let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
    let pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] += value;
        pixels[i + 1] += value;
        pixels[i + 2] += value;
        if (finalOptions.clamp) {
            pixels[i] = Math.min(255, Math.max(0, pixels[i]));
            pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1]));
            pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2]));
        }
    }
    canvas_node.getContext('2d').putImageData(data, 0, 0);
    this.saveToHistory();
    return this;
};
