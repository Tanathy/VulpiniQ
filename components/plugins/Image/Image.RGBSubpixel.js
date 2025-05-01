Q.Image.prototype.RGBSubpixel = function(subpixelOptions = {}) {
    // Default options
    const defaultOptions = {
        subpixelSizeX: 2,
        subpixelSizeY: 3,
        padding: 1,
        subpixelLayout: 'rgb', // 'rgb', 'bgr', 'vrgb', 'vbgr', 'quad'
        subpixelGlow: false,
        glowStrength: 0.4,
        glowRadius: 2,
        screenBleed: false,
        bleedOpacity: 0.15,
        bleedSize: 24
    };
    const opts = Object.assign({}, defaultOptions, subpixelOptions);

    const canvas_node = this.node;
    const w = canvas_node.width, h = canvas_node.height;
    if (w === 0 || h === 0) return this;
    this.saveToHistory();

    // Determine subpixel count and block size
    let subpixelCountX = 3, subpixelCountY = 1;
    if (opts.subpixelLayout === 'quad') { subpixelCountX = 2; subpixelCountY = 2; }
    else if (opts.subpixelLayout === 'vrgb' || opts.subpixelLayout === 'vbgr') { subpixelCountX = 1; subpixelCountY = 3; }

    const blockSizeX = opts.subpixelSizeX * subpixelCountX + opts.padding;
    const blockSizeY = opts.subpixelSizeY * subpixelCountY + opts.padding;

    // 1. Sample the original image in blockSizeX x blockSizeY blocks
    const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
    const srcData = ctx.getImageData(0, 0, w, h).data;
    const blocksX = Math.ceil(w / blockSizeX);
    const blocksY = Math.ceil(h / blockSizeY);

    // 2. Create a temporary canvas for the subpixel mapping
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = blocksX * blockSizeX;
    tempCanvas.height = blocksY * blockSizeY;
    const tempCtx = tempCanvas.getContext('2d');
    const tempImg = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);
    const tempData = tempImg.data;

    // Helper: layout mapping
    function getSubpixelColor(sx, sy, r, g, b, a, layout) {
        // sx, sy: position within the block
        if (layout === 'rgb') {
            // 3 subpixels horizontally
            const idx = Math.floor(sx / opts.subpixelSizeX);
            if (idx === 0) return [r, 0, 0, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [0, 0, b, a];
        } else if (layout === 'bgr') {
            const idx = Math.floor(sx / opts.subpixelSizeX);
            if (idx === 0) return [0, 0, b, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [r, 0, 0, a];
        } else if (layout === 'vrgb') {
            // 3 subpixels vertically
            const idx = Math.floor(sy / opts.subpixelSizeY);
            if (idx === 0) return [r, 0, 0, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [0, 0, b, a];
        } else if (layout === 'vbgr') {
            const idx = Math.floor(sy / opts.subpixelSizeY);
            if (idx === 0) return [0, 0, b, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [r, 0, 0, a];
        } else if (layout === 'quad') {
            // 2x2 quad: TL=R, TR=G, BL=B, BR=black
            const qx = Math.floor(sx / opts.subpixelSizeX);
            const qy = Math.floor(sy / opts.subpixelSizeY);
            if (qx === 0 && qy === 0) return [r, 0, 0, a];
            if (qx === 1 && qy === 0) return [0, g, 0, a];
            if (qx === 0 && qy === 1) return [0, 0, b, a];
            // BR: black
            return [0, 0, 0, a];
        }
        // fallback: original color
        return [r, g, b, a];
    }

    // 3. For each block, average the color and map to subpixels
    for (let by = 0; by < blocksY; ++by) {
        for (let bx = 0; bx < blocksX; ++bx) {
            // Average color in blockSizeX x blockSizeY block
            let r = 0, g = 0, b = 0, a = 0, count = 0;
            for (let dy = 0; dy < blockSizeY; ++dy) {
                for (let dx = 0; dx < blockSizeX; ++dx) {
                    const sx = bx * blockSizeX + dx;
                    const sy = by * blockSizeY + dy;
                    if (sx < w && sy < h) {
                        const idx = (sy * w + sx) * 4;
                        r += srcData[idx];
                        g += srcData[idx + 1];
                        b += srcData[idx + 2];
                        a += srcData[idx + 3];
                        count++;
                    }
                }
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            a = Math.round(a / count);

            // subpixel grid, padding only at the end of the block!
            for (let sy = 0; sy < blockSizeY; ++sy) {
                for (let sx = 0; sx < blockSizeX; ++sx) {
                    const tx = bx * blockSizeX + sx;
                    const ty = by * blockSizeY + sy;
                    const tidx = (ty * tempCanvas.width + tx) * 4;
                    // Padding: only the last column/row
                    if (sx >= blockSizeX - opts.padding || sy >= blockSizeY - opts.padding) {
                        tempData[tidx] = 0;
                        tempData[tidx + 1] = 0;
                        tempData[tidx + 2] = 0;
                        tempData[tidx + 3] = 255;
                    } else {
                        const [cr, cg, cb, ca] = getSubpixelColor(sx, sy, r, g, b, a, opts.subpixelLayout);
                        tempData[tidx] = cr;
                        tempData[tidx + 1] = cg;
                        tempData[tidx + 2] = cb;
                        tempData[tidx + 3] = ca;
                    }
                }
            }
        }
    }
    tempCtx.putImageData(tempImg, 0, 0);

    // 4. Subpixel glow (soft glow around subpixels, only on subpixel area, not border)
    if (opts.subpixelGlow) {
        // Separate glow canvas, only subpixel pixels (no padding)
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = tempCanvas.width;
        glowCanvas.height = tempCanvas.height;
        const glowCtx = glowCanvas.getContext('2d');
        const glowImg = glowCtx.createImageData(tempCanvas.width, tempCanvas.height);
        const glowData = glowImg.data;

        // Copy only subpixel pixels (no padding)
        for (let by = 0; by < blocksY; ++by) {
            for (let bx = 0; bx < blocksX; ++bx) {
                for (let sy = 0; sy < blockSizeY - opts.padding; ++sy) {
                    for (let sx = 0; sx < blockSizeX - opts.padding; ++sx) {
                        const tx = bx * blockSizeX + sx;
                        const ty = by * blockSizeY + sy;
                        const tidx = (ty * tempCanvas.width + tx) * 4;
                        glowData[tidx]     = tempData[tidx];
                        glowData[tidx + 1] = tempData[tidx + 1];
                        glowData[tidx + 2] = tempData[tidx + 2];
                        glowData[tidx + 3] = tempData[tidx + 3];
                    }
                }
            }
        }
        glowCtx.putImageData(glowImg, 0, 0);

        tempCtx.save();
        tempCtx.globalAlpha = opts.glowStrength;
        tempCtx.globalCompositeOperation = "lighten";
        tempCtx.filter = `blur(${opts.glowRadius}px)`;
        tempCtx.drawImage(glowCanvas, 0, 0);
        tempCtx.filter = "none";
        tempCtx.globalAlpha = 1.0;
        tempCtx.globalCompositeOperation = "source-over";
        tempCtx.restore();
    }

    // 5. Screen bleeding (backlight simulation at edges)
    if (opts.screenBleed) {
        tempCtx.save();
        tempCtx.globalAlpha = opts.bleedOpacity;
        // Top
        let grad = tempCtx.createLinearGradient(0, 0, 0, opts.bleedSize);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(0, 0, tempCanvas.width, opts.bleedSize);
        // Bottom
        grad = tempCtx.createLinearGradient(0, tempCanvas.height - opts.bleedSize, 0, tempCanvas.height);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "#fff");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(0, tempCanvas.height - opts.bleedSize, tempCanvas.width, opts.bleedSize);
        // Left
        grad = tempCtx.createLinearGradient(0, 0, opts.bleedSize, 0);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(0, 0, opts.bleedSize, tempCanvas.height);
        // Right
        grad = tempCtx.createLinearGradient(tempCanvas.width - opts.bleedSize, 0, tempCanvas.width, 0);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "#fff");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(tempCanvas.width - opts.bleedSize, 0, opts.bleedSize, tempCanvas.height);
        tempCtx.globalAlpha = 1.0;
        tempCtx.restore();
    }

    // 6. Resize the temporary canvas to the original canvas size
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);

    return this;
};
