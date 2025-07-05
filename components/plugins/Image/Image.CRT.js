Q.Image.prototype.CRT = function (crtOptions = {}) {
    const defaultOptions = {
        noiseStrength: 10,
        strongNoiseStrength: 100,
        strongNoiseCount: 5,
        noiseMaxLength: 20000,
        redShift: 3,
        blueShift: 3,
        scanlineHeight: 1,
        scanlineMargin: 3,
        scanlineOpacity: 0.1,
        vignette: false,
        vignetteStrength: 0.5,
        scanlineBrightness: 0.5,
        rgbOffset: 0,
        curvature: true,
        curvatureAmount: 0.1,
        curvatureX: 50,
        curvatureY: 50,
        curvatureArc: 15,
        curvatureType: "convex",
        zoom: 0,
        autoFill: false,
        verticalWobble: 5,
        horizontalWobble: 2,
        wobbleSpeed: 10,
        colorBleed: 0,
        jitterChance: 0,
    };
    const finalOptions = Object.assign({}, defaultOptions, crtOptions);
    finalOptions.curvatureArc = Math.max(0, Math.min(45, finalOptions.curvatureArc));
    const curvatureAmountFromArc = finalOptions.curvatureArc / 45 * 0.3;
    let curveAmount = Math.min(finalOptions.curvatureAmount, curvatureAmountFromArc);
    if (finalOptions.curvatureType === "concave") {
        curveAmount = -curveAmount;
    }
    finalOptions._effectiveCurvatureAmount = curveAmount;
    let zoom = (typeof finalOptions.zoom === "number" ? finalOptions.zoom : 0) / 100;
    if (finalOptions.autoFill && finalOptions.curvature && finalOptions.curvatureType === "concave") {
        const maxDistSq = 1 * 1 + 1 * 1;
        const absCurve = Math.abs(curveAmount);
        const distortion = 1 + maxDistSq * absCurve;
        zoom = Math.max(zoom, distortion - 1);
    }
    const canvas_node = this.node;
    this.saveToHistory();
    let temp = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let ctx = temp.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(canvas_node, 0, 0);
    const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
    const data = imageData.data;
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function CRTRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const noiseStrength = finalOptions.noiseStrength;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * noiseStrength;
        data[i] = clamp(data[i] + noise, 0, 255);
        data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
        data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
    }
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
            if (i + 2 < data.length) {
                const noise = (Math.random() - 0.4) * strongNoiseStrength;
                data[i] = clamp(data[i] + noise, 0, 255);
                data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
                data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
            }
        }
    }
    let wobbleCanvas = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let wobbleCtx = wobbleCanvas.getContext('2d', { willReadFrequently: true });
    const tempData = new Uint8ClampedArray(data);
    const redShift = finalOptions.redShift;
    const blueShift = finalOptions.blueShift;
    const rgbOffset = finalOptions.rgbOffset;
    if (finalOptions.colorBleed > 0) {
        const bleed = Math.floor(finalOptions.colorBleed);
        for (let y = 0; y < temp.height; y++) {
            for (let x = 0; x < temp.width; x++) {
                const currentIndex = (y * temp.width + x) * 4;
                if (x + bleed < temp.width) {
                    const bleedIndex = (y * temp.width + (x + bleed)) * 4;
                    data[bleedIndex] = Math.max(data[bleedIndex], data[currentIndex] * 0.7);
                }
                if (y > bleed) {
                    const bleedIndex = ((y - bleed) * temp.width + x) * 4 + 2;
                    data[bleedIndex] = Math.max(data[bleedIndex], data[currentIndex + 2] * 0.7);
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    wobbleCtx.drawImage(temp, 0, 0);
    const resultCtx = canvas_node.getContext('2d', { willReadFrequently: true });
    resultCtx.clearRect(0, 0, canvas_node.width, canvas_node.height);
    let applyScanlines = !finalOptions.subpixelEmulation || !finalOptions.applyScanlineAfterSubpixel;
    if (finalOptions.jitterChance > 0 && Math.random() * 100 < finalOptions.jitterChance) {
        const jumpOffset = CRTRandomBetween(5, 20);
        resultCtx.drawImage(wobbleCanvas, 0, jumpOffset, canvas_node.width, canvas_node.height - jumpOffset);
        resultCtx.drawImage(wobbleCanvas, 0, 0, canvas_node.width, jumpOffset, 0, canvas_node.height - jumpOffset, canvas_node.width, jumpOffset);
    } else {
        const vWobbleAmp = finalOptions.verticalWobble;
        const hWobbleAmp = finalOptions.horizontalWobble;
        const wobbleSpeed = finalOptions.wobbleSpeed / 10;
        const timePhase = Date.now() / 1000 * wobbleSpeed;
        if (finalOptions.curvature) {
            const curveAmount = finalOptions._effectiveCurvatureAmount;
            const centerX = Math.round((finalOptions.curvatureX / 100) * canvas_node.width);
            const centerY = Math.round((finalOptions.curvatureY / 100) * canvas_node.height);
            for (let y = 0; y < canvas_node.height; y++) {
                const ny = ((y - centerY) / canvas_node.height) * 2;
                const vWobble = vWobbleAmp * Math.sin(y / 30 + timePhase);
                for (let x = 0; x < canvas_node.width; x++) {
                    const nx = ((x - centerX) / canvas_node.width) * 2;
                    let zx = nx / (1 + zoom);
                    let zy = ny / (1 + zoom);
                    const hWobble = hWobbleAmp * Math.sin(x / 20 + timePhase * 0.7);
                    const distSq = zx * zx + zy * zy;
                    const distortion = 1 + distSq * curveAmount;
                    const srcX = Math.round(centerX + (zx / distortion) * (canvas_node.width / 2) + hWobble);
                    const srcY = Math.round(centerY + (zy / distortion) * (canvas_node.height / 2) + vWobble);
                    if (srcX >= 0 && srcX < canvas_node.width && srcY >= 0 && srcY < canvas_node.height) {
                        if (rgbOffset > 0) {
                            const rOffset = Math.min(canvas_node.width - 1, srcX + Math.floor(rgbOffset));
                            const gOffset = srcX;
                            const bOffset = Math.max(0, srcX - Math.floor(rgbOffset));
                            const rData = wobbleCtx.getImageData(rOffset, srcY, 1, 1).data;
                            const gData = wobbleCtx.getImageData(gOffset, srcY, 1, 1).data;
                            const bData = wobbleCtx.getImageData(bOffset, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgb(${rData[0]}, ${gData[1]}, ${bData[2]})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        } else {
                            const pixelData = wobbleCtx.getImageData(srcX, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
        } else {
            for (let y = 0; y < canvas_node.height; y++) {
                const vWobble = vWobbleAmp * Math.sin(y / 30 + timePhase);
                for (let x = 0; x < canvas_node.width; x++) {
                    const hWobble = hWobbleAmp * Math.sin(x / 20 + timePhase * 0.7);
                    const srcX = Math.round(x + hWobble);
                    const srcY = Math.round(y + vWobble);
                    if (srcX >= 0 && srcX < canvas_node.width && srcY >= 0 && srcY < canvas_node.height) {
                        if (rgbOffset > 0) {
                            const rOffset = Math.min(canvas_node.width - 1, srcX + Math.floor(rgbOffset));
                            const gOffset = srcX;
                            const bOffset = Math.max(0, srcX - Math.floor(rgbOffset));
                            const rData = wobbleCtx.getImageData(rOffset, srcY, 1, 1).data;
                            const gData = wobbleCtx.getImageData(gOffset, srcY, 1, 1).data;
                            const bData = wobbleCtx.getImageData(bOffset, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgb(${rData[0]}, ${gData[1]}, ${bData[2]})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        } else {
                            const pixelData = wobbleCtx.getImageData(srcX, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
        }
    }
    function drawHorizontalLines(ctx, width, height, totalHeight, margin, color, brightnessFactor) {
        ctx.fillStyle = color;
        for (let i = 0; i < totalHeight; i += (height + margin)) {
            ctx.fillRect(0, i, width, height);
            if (brightnessFactor > 0 && i + height < totalHeight) {
                const brightColor = `rgba(255, 255, 255, ${brightnessFactor * 0.1})`;
                ctx.fillStyle = brightColor;
                ctx.fillRect(0, i + height, width, margin);
                ctx.fillStyle = color;
            }
        }
    }
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
    if (finalOptions.vignette) {
        const centerX = canvas_node.width / 2;
        const centerY = canvas_node.height / 2;
        const radius = Math.max(centerX, centerY);
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