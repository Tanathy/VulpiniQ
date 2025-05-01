Q.Image.prototype.Glow = function (glowOptions = {}) {

    const defaultOptions = {
        illuminanceThreshold: 200,
        blurRadius: 10,
        intensity: 1.0,
        color: null,
        blendMode: 'lighter'
    };

    const finalOptions = Object.assign({}, defaultOptions, glowOptions);
    const w = this.node.width, h = this.node.height;
    if (w === 0 || h === 0) return this;
    this.saveToHistory();


    const src = document.createElement('canvas');
    src.width = w; src.height = h;
    const srcCtx = src.getContext('2d');
    srcCtx.drawImage(this.node, 0, 0);


    const thr = document.createElement('canvas');
    thr.width = w; thr.height = h;
    const thrCtx = thr.getContext('2d');
    const img = srcCtx.getImageData(0, 0, w, h);
    const data = img.data;


    let tint = null;
    if (finalOptions.color) {
        const tmp = document.createElement('canvas');
        tmp.width = tmp.height = 1;
        const tctx = tmp.getContext('2d');
        tctx.fillStyle = finalOptions.color;
        tctx.fillRect(0, 0, 1, 1);
        const pd = tctx.getImageData(0, 0, 1, 1).data;
        tint = { r: pd[0], g: pd[1], b: pd[2] };
    }

    for (let i = 0; i < data.length; i += 4) {
        const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (lum <= finalOptions.illuminanceThreshold) {
            data[i + 3] = 0;
        } else if (tint) {
            data[i] = tint.r;
            data[i + 1] = tint.g;
            data[i + 2] = tint.b;

        }
    }
    thrCtx.putImageData(img, 0, 0);


    const glow = document.createElement('canvas');
    glow.width = w; glow.height = h;
    const gctx = glow.getContext('2d');
    gctx.filter = `blur(${finalOptions.blurRadius}px)`;
    gctx.globalAlpha = finalOptions.intensity;
    gctx.drawImage(thr, 0, 0);


    const dst = this.node.getContext('2d');

    dst.drawImage(src, 0, 0);
    dst.globalCompositeOperation = finalOptions.blendMode;
    dst.drawImage(glow, 0, 0);
    dst.globalCompositeOperation = 'source-over';

    return this;
};