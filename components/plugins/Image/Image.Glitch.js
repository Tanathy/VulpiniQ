Q.Image.prototype.Glitch = function (options = {}) {

    const defaults = {
        minDistance: 10,
        maxDistance: 80,
        type: "datamosh",
        angle: 0,
        counts: 12,
        minWidth: 10,
        maxWidth: 80,
        minHeight: 2,
        maxHeight: 30,

        corruptedBlockSize: 16,
        corruptedIntensity: 0.3,
        corruptedChannelShift: 8,

        macroblockBlockSize: 32,
        macroblockIntensity: 0.5,
        macroblockBlend: 0.3,
        macroblockShift: 24,
        macroblockNoise: 0.1,

        pixelsortAxis: "vertical",
        pixelsortSortBy: "brightness",
        pixelsortStrength: 1,
        pixelsortRandom: 0,

        pixelsortEdge: false,
        pixelsortEdgeThreshold: 0.2,
        pixelsortMass: false,
        pixelsortEdgeInside: true,

        waveAmplitude: 24,
        waveFrequency: 2,
        wavePhase: 0,
        waveDirection: "horizontal"
    };
    const opts = Object.assign({}, defaults, options);

    const canvas = this.node;
    const w = canvas.width, h = canvas.height;
    if (w === 0 || h === 0) return this;
    this.saveToHistory();


    const angleRad = opts.angle * Math.PI / 180;
    const diag = Math.ceil(Math.sqrt(w * w + h * h));
    const temp1 = document.createElement('canvas');
    temp1.width = diag;
    temp1.height = diag;
    const ctx1 = temp1.getContext('2d', { willReadFrequently: true });

    ctx1.save();
    ctx1.translate(diag / 2, diag / 2);
    ctx1.rotate(angleRad);
    ctx1.drawImage(canvas, -w / 2, -h / 2);
    ctx1.restore();



    {
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        for (let y = 0; y < diag; y++) {
            for (let x = 0; x < diag; x++) {

                let cx = x - diag / 2;
                let cy = y - diag / 2;

                let rx = Math.cos(-angleRad) * cx - Math.sin(-angleRad) * cy + w / 2;
                let ry = Math.sin(-angleRad) * cx + Math.cos(-angleRad) * cy + h / 2;
                if (rx < 0 || rx >= w || ry < 0 || ry >= h) {
                    const idx = (y * diag + x) * 4;
                    data[idx + 3] = 0;
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    }


    if (opts.type === "datamosh") {
        for (let i = 0; i < opts.counts; i++) {
            const gw = Math.floor(Math.random() * (opts.maxWidth - opts.minWidth + 1)) + opts.minWidth;
            const gh = Math.floor(Math.random() * (opts.maxHeight - opts.minHeight + 1)) + opts.minHeight;
            const gx = Math.floor(Math.random() * (diag - gw));
            const gy = Math.floor(Math.random() * (diag - gh));
            let distance = Math.floor(Math.random() * (opts.maxDistance - opts.minDistance + 1)) + opts.minDistance;
            if (Math.random() < 0.5) distance *= -1;
            let nx = gx + distance;
            if (nx < 0) nx = 0;
            if (nx + gw > diag) nx = diag - gw;
            const imageData = ctx1.getImageData(gx, gy, gw, gh);
            ctx1.putImageData(imageData, nx, gy);
        }
    } else if (opts.type === "corrupted") {
        const blockSize = opts.corruptedBlockSize;
        const intensity = opts.corruptedIntensity;
        const channelShift = opts.corruptedChannelShift;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        for (let i = 0; i < opts.counts; i++) {
            const bx = Math.floor(Math.random() * (diag - blockSize));
            const by = Math.floor(Math.random() * (diag - blockSize));
            for (let y = 0; y < blockSize; y++) {
                for (let x = 0; x < blockSize; x++) {
                    const px = bx + x;
                    const py = by + y;
                    const idx = (py * diag + px) * 4;
                    if (Math.random() < intensity) {
                        const rx = bx + Math.floor(Math.random() * blockSize);
                        const ry = by + Math.floor(Math.random() * blockSize);
                        const ridx = (ry * diag + rx) * 4;
                        for (let c = 0; c < 4; c++) {
                            const tmp = data[idx + c];
                            data[idx + c] = data[ridx + c];
                            data[ridx + c] = tmp;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < opts.counts; i++) {
            const bx = Math.floor(Math.random() * (diag - blockSize));
            const by = Math.floor(Math.random() * (diag - blockSize));
            const shiftR = Math.floor((Math.random() - 0.5) * 2 * channelShift);
            const shiftG = Math.floor((Math.random() - 0.5) * 2 * channelShift);
            const shiftB = Math.floor((Math.random() - 0.5) * 2 * channelShift);
            for (let y = 0; y < blockSize; y++) {
                for (let x = 0; x < blockSize; x++) {
                    const px = bx + x;
                    const py = by + y;
                    const idx = (py * diag + px) * 4;
                    let rIdx = ((py) * diag + Math.min(diag - 1, Math.max(0, px + shiftR))) * 4;
                    let gIdx = ((py) * diag + Math.min(diag - 1, Math.max(0, px + shiftG))) * 4;
                    let bIdx = ((py) * diag + Math.min(diag - 1, Math.max(0, px + shiftB))) * 4;
                    data[idx] = data[rIdx];
                    data[idx + 1] = data[gIdx + 1];
                    data[idx + 2] = data[bIdx + 2];
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    } else if (opts.type === "macroblock") {
        const blockSize = opts.macroblockBlockSize;
        const intensity = opts.macroblockIntensity;
        const blend = opts.macroblockBlend;
        const shift = opts.macroblockShift;
        const noise = opts.macroblockNoise;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        for (let by = 0; by < diag; by += blockSize) {
            for (let bx = 0; bx < diag; bx += blockSize) {
                if (Math.random() < intensity) {
                    let sx = bx + Math.floor((Math.random() - 0.5) * 2 * shift);
                    let sy = by + Math.floor((Math.random() - 0.5) * 2 * shift);
                    sx = Math.max(0, Math.min(diag - blockSize, sx));
                    sy = Math.max(0, Math.min(diag - blockSize, sy));
                    for (let y = 0; y < blockSize; y++) {
                        for (let x = 0; x < blockSize; x++) {
                            const dstX = bx + x;
                            const dstY = by + y;
                            const srcX = sx + x;
                            const srcY = sy + y;
                            if (dstX < diag && dstY < diag && srcX < diag && srcY < diag) {
                                const dstIdx = (dstY * diag + dstX) * 4;
                                const srcIdx = (srcY * diag + srcX) * 4;
                                for (let c = 0; c < 3; c++) {
                                    data[dstIdx + c] = Math.round(
                                        data[srcIdx + c] * blend + data[dstIdx + c] * (1 - blend)
                                    );
                                }
                                if (noise > 0) {
                                    for (let c = 0; c < 3; c++) {
                                        data[dstIdx + c] = Math.min(255, Math.max(0, data[dstIdx + c] + (Math.random() - 0.5) * 255 * noise));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    } else if (opts.type === "pixelsort") {

        const axis = opts.pixelsortAxis;
        const sortBy = opts.pixelsortSortBy;
        const strength = Math.max(0, Math.min(1, opts.pixelsortStrength));
        const randomness = Math.max(0, Math.min(1, opts.pixelsortRandom));
        const edgeEnabled = !!opts.pixelsortEdge;
        const edgeThreshold = Math.max(0, Math.min(1, opts.pixelsortEdgeThreshold || 0.2));
        const massMode = !!opts.pixelsortMass;
        const edgeInside = opts.pixelsortEdgeInside !== undefined ? !!opts.pixelsortEdgeInside : true;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;

        function getSortValue(r, g, b) {
            if (sortBy === "brightness") {
                return 0.299 * r + 0.587 * g + 0.114 * b;
            } else if (sortBy === "intensity") {
                return (r + g + b) / 3;
            } else if (sortBy === "hue") {

                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h = 0;
                if (max === min) h = 0;
                else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
                else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
                else if (max === b) h = (60 * ((r - g) / (max - min)) + 240) % 360;
                return h;
            }
            return 0;
        }


        let edgeMap = null;
        if (edgeEnabled) {
            edgeMap = new Float32Array(diag * diag);

            const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
            const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
            for (let y = 1; y < diag - 1; y++) {
                for (let x = 1; x < diag - 1; x++) {
                    let sx = 0, sy = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * diag + (x + kx)) * 4;

                            let v;
                            if (sortBy === "brightness") {
                                v = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                            } else if (sortBy === "intensity") {
                                v = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                            } else if (sortBy === "hue") {

                                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                                let h = 0;
                                if (max === min) h = 0;
                                else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
                                else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
                                else if (max === b) h = (60 * ((r - g) / (max - min)) + 240) % 360;
                                v = h;
                            } else {
                                v = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                            }
                            const kIdx = (ky + 1) * 3 + (kx + 1);
                            sx += gx[kIdx] * v;
                            sy += gy[kIdx] * v;
                        }
                    }
                    const mag = Math.sqrt(sx * sx + sy * sy) / 1448;
                    edgeMap[y * diag + x] = mag;
                }
            }
        }


        function getEdgeMask(lineIdx, axis) {
            const mask = [];
            if (!edgeMap) return null;
            for (let i = 0; i < diag; i++) {
                let idx = axis === "vertical" ? (i * diag + lineIdx) : (lineIdx * diag + i);
                mask.push(edgeMap[idx] > edgeThreshold);
            }
            return mask;
        }


        function countEdges(lineIdx, axis) {
            if (!edgeMap) return 0;
            let count = 0;
            for (let i = 0; i < diag; i++) {
                let idx = axis === "vertical" ? (i * diag + lineIdx) : (lineIdx * diag + i);
                if (edgeMap[idx] > edgeThreshold) count++;
            }
            return count;
        }


        let massLine = -1;
        if (edgeEnabled && massMode) {
            let maxCount = -1;
            for (let i = 0; i < diag; i++) {
                const cnt = countEdges(i, axis);
                if (cnt > maxCount) {
                    maxCount = cnt;
                    massLine = i;
                }
            }
        }

        if (axis === "vertical") {

            for (let x = 0; x < diag; x++) {
                if (Math.random() > strength) continue;
                if (massMode && x !== massLine) continue;
                let pixels = [];
                let mask = edgeEnabled ? getEdgeMask(x, "vertical") : null;
                for (let y = 0; y < diag; y++) {
                    const idx = (y * diag + x) * 4;
                    pixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        a: data[idx + 3],
                        sort: getSortValue(data[idx], data[idx + 1], data[idx + 2]) + (Math.random() - 0.5) * 255 * randomness,
                        edge: mask ? mask[y] : false
                    });
                }
                if (edgeEnabled) {
                    let first = pixels.findIndex(p => p.edge);
                    let last = -1;
                    for (let i = diag - 1; i >= 0; i--) {
                        if (pixels[i].edge) { last = i; break; }
                    }
                    if (first !== -1 && last !== -1 && last > first) {
                        if (edgeInside) {

                            let segment = pixels.slice(first, last + 1);
                            segment.sort((a, b) => a.sort - b.sort);
                            for (let i = first; i <= last; i++) {
                                pixels[i] = segment[i - first];
                            }
                        } else {

                            if (first > 0) {
                                let segment = pixels.slice(0, first);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = 0; i < first; i++) {
                                    pixels[i] = segment[i];
                                }
                            }

                            if (last < diag - 1) {
                                let segment = pixels.slice(last + 1);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = last + 1; i < diag; i++) {
                                    pixels[i] = segment[i - (last + 1)];
                                }
                            }
                        }
                    }
                } else {
                    pixels.sort((a, b) => a.sort - b.sort);
                }

                for (let y = 0; y < diag; y++) {



                    let cx = x - diag / 2;
                    let cy = y - diag / 2;
                    let rx = Math.cos(-angleRad) * cx - Math.sin(-angleRad) * cy + w / 2;
                    let ry = Math.sin(-angleRad) * cx + Math.cos(-angleRad) * cy + h / 2;
                    if (rx >= 0 && rx < w && ry >= 0 && ry < h) {
                        const idx = (y * diag + x) * 4;
                        data[idx] = pixels[y].r;
                        data[idx + 1] = pixels[y].g;
                        data[idx + 2] = pixels[y].b;
                        data[idx + 3] = pixels[y].a;
                    }
                }
            }
        } else {

            for (let y = 0; y < diag; y++) {
                if (Math.random() > strength) continue;
                if (massMode && y !== massLine) continue;
                let pixels = [];
                let mask = edgeEnabled ? getEdgeMask(y, "horizontal") : null;
                for (let x = 0; x < diag; x++) {
                    const idx = (y * diag + x) * 4;
                    pixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        a: data[idx + 3],
                        sort: getSortValue(data[idx], data[idx + 1], data[idx + 2]) + (Math.random() - 0.5) * 255 * randomness,
                        edge: mask ? mask[x] : false
                    });
                }
                if (edgeEnabled) {
                    let first = pixels.findIndex(p => p.edge);
                    let last = -1;
                    for (let i = diag - 1; i >= 0; i--) {
                        if (pixels[i].edge) { last = i; break; }
                    }
                    if (first !== -1 && last !== -1 && last > first) {
                        if (edgeInside) {
                            let segment = pixels.slice(first, last + 1);
                            segment.sort((a, b) => a.sort - b.sort);
                            for (let i = first; i <= last; i++) {
                                pixels[i] = segment[i - first];
                            }
                        } else {

                            if (first > 0) {
                                let segment = pixels.slice(0, first);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = 0; i < first; i++) {
                                    pixels[i] = segment[i];
                                }
                            }

                            if (last < diag - 1) {
                                let segment = pixels.slice(last + 1);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = last + 1; i < diag; i++) {
                                    pixels[i] = segment[i - (last + 1)];
                                }
                            }
                        }
                    }
                } else {
                    pixels.sort((a, b) => a.sort - b.sort);
                }

                for (let x = 0; x < diag; x++) {

                    let cx = x - diag / 2;
                    let cy = y - diag / 2;
                    let rx = Math.cos(-angleRad) * cx - Math.sin(-angleRad) * cy + w / 2;
                    let ry = Math.sin(-angleRad) * cx + Math.cos(-angleRad) * cy + h / 2;
                    if (rx >= 0 && rx < w && ry >= 0 && ry < h) {
                        const idx = (y * diag + x) * 4;
                        data[idx] = pixels[x].r;
                        data[idx + 1] = pixels[x].g;
                        data[idx + 2] = pixels[x].b;
                        data[idx + 3] = pixels[x].a;
                    }
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    } else if (opts.type === "wave") {


        const amplitude = opts.waveAmplitude;
        const frequency = opts.waveFrequency;
        const phase = opts.wavePhase;
        const direction = opts.waveDirection;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        const out = ctx1.createImageData(diag, diag);
        const outData = out.data;

        if (direction === "horizontal") {

            for (let y = 0; y < diag; y++) {

                const shift = Math.round(
                    Math.sin(2 * Math.PI * frequency * y / diag + phase) * amplitude
                );
                for (let x = 0; x < diag; x++) {
                    let sx = x + shift;
                    if (sx < 0 || sx >= diag) continue;
                    const srcIdx = (y * diag + sx) * 4;
                    const dstIdx = (y * diag + x) * 4;
                    outData[dstIdx] = data[srcIdx];
                    outData[dstIdx + 1] = data[srcIdx + 1];
                    outData[dstIdx + 2] = data[srcIdx + 2];
                    outData[dstIdx + 3] = data[srcIdx + 3];
                }
            }
        } else {

            for (let x = 0; x < diag; x++) {
                const shift = Math.round(
                    Math.sin(2 * Math.PI * frequency * x / diag + phase) * amplitude
                );
                for (let y = 0; y < diag; y++) {
                    let sy = y + shift;
                    if (sy < 0 || sy >= diag) continue;
                    const srcIdx = (sy * diag + x) * 4;
                    const dstIdx = (y * diag + x) * 4;
                    outData[dstIdx] = data[srcIdx];
                    outData[dstIdx + 1] = data[srcIdx + 1];
                    outData[dstIdx + 2] = data[srcIdx + 2];
                    outData[dstIdx + 3] = data[srcIdx + 3];
                }
            }
        }
        ctx1.putImageData(out, 0, 0);
    }


    const temp2 = document.createElement('canvas');
    temp2.width = w;
    temp2.height = h;
    const ctx2 = temp2.getContext('2d', { willReadFrequently: true });

    ctx2.save();
    ctx2.clearRect(0, 0, w, h);
    ctx2.translate(w / 2, h / 2);
    ctx2.rotate(-angleRad);
    ctx2.drawImage(temp1, -diag / 2, -diag / 2);
    ctx2.restore();


    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(temp2, 0, 0);

    return this;
};
