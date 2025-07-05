Q.Image.prototype.LensFlare = function (flareOptions = {}) {
    const presets = {
        cinematic: {
            type: "anamorphic",
            widthModifier: 2.5,
            heightThreshold: 8,
            opacity: 0.18,
            blur: 8,
            falloff: 1.2,
            intensity: 1.1,
            blendMode: "overlay"
        },
        sciFi: {
            type: "starburst",
            points: 12,
            radius: 60,
            opacity: 0.22,
            blur: 6,
            falloff: 1.6,
            intensity: 1.3,
            blendMode: "lighter"
        },
        vintage: {
            type: "polygon",
            points: 6,
            radius: 38,
            opacity: 0.16,
            blur: 4,
            falloff: 1.0,
            intensity: 0.9,
            blendMode: "lighter"
        },
        photo: {
            type: "circular",
            radius: 32,
            opacity: 0.12,
            blur: 10,
            falloff: 1.0,
            intensity: 1.0,
            blendMode: "screen"
        },
        blockbuster: {
            type: "anamorphic",
            widthModifier: 3.5,
            heightThreshold: 12,
            opacity: 0.22,
            blur: 10,
            falloff: 1.4,
            intensity: 1.5,
            blendMode: "lighter",
            starSize: 320,
            starIntensity: 1.2,
            starPoints: 12,
            starRotation: 15,
            starOpacity: 1,
            streakOpacity: 1,
            centerOpacity: 1,
            diagOpacity: 1
        },
        dreamy: {
            type: "circular",
            radius: 80,
            opacity: 0.09,
            blur: 18,
            falloff: 0.7,
            intensity: 0.7,
            blendMode: "screen"
        },
        hardcore: {
            type: "starburst",
            points: 24,
            radius: 120,
            opacity: 0.35,
            blur: 2,
            falloff: 2.0,
            intensity: 2.0,
            blendMode: "lighter",
            starSize: 400,
            starIntensity: 2,
            starPoints: 24,
            starRotation: 0
        },
        minimal: {
            type: "polygon",
            points: 4,
            radius: 20,
            opacity: 0.08,
            blur: 2,
            falloff: 1.0,
            intensity: 0.5,
            blendMode: "overlay"
        },
        blueStreak: {
            type: "anamorphic",
            widthModifier: 4.0,
            heightThreshold: 6,
            opacity: 0.19,
            blur: 12,
            falloff: 1.1,
            intensity: 1.0,
            blendMode: "lighter",
            starColor: "#7cf",
            starSize: 220,
            starIntensity: 1.1,
            starPoints: 8,
            starRotation: 0
        },
        rainbow: {
            type: "circular",
            radius: 60,
            opacity: 0.18,
            blur: 8,
            falloff: 1.0,
            intensity: 1.2,
            blendMode: "lighter"
        },
        classic: {
            type: "starburst",
            points: 8,
            radius: 48,
            opacity: 0.18,
            blur: 4,
            falloff: 1.0,
            intensity: 1.0,
            blendMode: "lighter",
            starSize: 180,
            starIntensity: 1.0,
            starPoints: 8,
            starRotation: 0
        },
        crossStar: {
            type: "anamorphic",
            widthModifier: 1.5,
            heightThreshold: 8,
            opacity: 0.15,
            blur: 6,
            falloff: 1.0,
            intensity: 1.0,
            blendMode: "lighter",
            starSize: 300,
            starIntensity: 1.5,
            starPoints: 4,
            starRotation: 45
        }
    };
    const defaultOptions = {
        preset: null,
        type: "anamorphic",
        brightnessThreshold: 200,
        widthModifier: 1.0,
        heightThreshold: 10,
        maxFlares: 20,
        opacity: 0.2,
        flareColor: null,
        radius: 40,
        points: 6,
        rotation: 0,
        blur: 0,
        falloff: 1.0,
        intensity: 1.0,
        blendMode: "lighter",
        directionX: 100,
        directionY: 100,
        starSize: 180,
        starIntensity: 1.0,
        starColor: null,
        starPoints: 8,
        starRotation: 0,
        starOpacity: 1,
        streakOpacity: 1,
        centerOpacity: 1,
        diagOpacity: 1
    };
    let finalOptions = Object.assign({}, defaultOptions);
    if (flareOptions.preset && presets[flareOptions.preset]) {
        Object.assign(finalOptions, presets[flareOptions.preset]);
    }
    Object.assign(finalOptions, flareOptions);
    const canvas_node = this.node;
    let temp = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let ctx = temp.getContext('2d', { willReadFrequently: true });
    this.saveToHistory();
    ctx.drawImage(canvas_node, 0, 0);
    const sourceData = ctx.getImageData(0, 0, temp.width, temp.height).data;
    let flareColor = finalOptions.flareColor;
    if (!flareColor) {
        const avgColor = { r: 0, g: 0, b: 0, count: 0 };
        for (let y = 0; y < temp.height; y++) {
            for (let x = 0; x < temp.width; x++) {
                const index = (y * temp.width + x) * 4;
                const brightness = (sourceData[index] + sourceData[index + 1] + sourceData[index + 2]) / 3;
                if (brightness >= finalOptions.brightnessThreshold) {
                    avgColor.r += sourceData[index];
                    avgColor.g += sourceData[index + 1];
                    avgColor.b += sourceData[index + 2];
                    avgColor.count++;
                }
            }
        }
        if (avgColor.count > 0) {
            flareColor = [
                Math.round(avgColor.r / avgColor.count),
                Math.round(avgColor.g / avgColor.count),
                Math.round(avgColor.b / avgColor.count)
            ];
        } else {
            flareColor = [255, 255, 255];
        }
    }
    const flareColorR = flareColor[0];
    const flareColorG = flareColor[1];
    const flareColorB = flareColor[2];
    const flares = [];
    for (let y = 0; y < temp.height; y++) {
        for (let x = 0; x < temp.width; x++) {
            const index = (y * temp.width + x) * 4;
            const brightness = (sourceData[index] + sourceData[index + 1] + sourceData[index + 2]) / 3;
            if (brightness >= finalOptions.brightnessThreshold) {
                flares.push({ x, y, brightness });
            }
        }
    }
    flares.sort((a, b) => b.brightness - a.brightness);
    const targetCtx = canvas_node.getContext('2d');
    function applyBlur(ctx, blur) {
        if (blur > 0) {
            ctx.filter = `blur(${blur}px)`;
        } else {
            ctx.filter = "none";
        }
    }
    function getFinalAlpha(baseAlpha, partOpacity = 1) {
        return Math.max(0, Math.min(1, baseAlpha * finalOptions.opacity * partOpacity));
    }
    function drawAnamorphic(flare) {
        const starPoints = finalOptions.starPoints || 8;
        const starSize = finalOptions.starSize || 180;
        const starIntensity = finalOptions.starIntensity || 1.0;
        const starRotation = (finalOptions.starRotation || 0) * Math.PI / 180;
        let starColorStops = [
            { stop: 0.0, color: 'rgba(255,255,255,1)' },
            { stop: 0.5, color: 'rgba(120,180,255,0.7)' },
            { stop: 1.0, color: 'rgba(120,80,255,0.0)' }
        ];
        if (finalOptions.starColor) {
            starColorStops = [
                { stop: 0.0, color: finalOptions.starColor },
                { stop: 1.0, color: 'rgba(0,0,0,0)' }
            ];
        }
        const baseAlpha = (flare.brightness / 255) * finalOptions.intensity * starIntensity;
        const starAlpha = getFinalAlpha(baseAlpha, finalOptions.starOpacity);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        targetCtx.translate(flare.x, flare.y);
        targetCtx.rotate(starRotation);
        for (let i = 0; i < starPoints; i++) {
            const angle = (i / starPoints) * Math.PI * 2;
            targetCtx.save();
            targetCtx.rotate(angle);
            const grad = targetCtx.createLinearGradient(0, 0, 0, -starSize);
            starColorStops.forEach(cs => grad.addColorStop(cs.stop, cs.color.replace(/[\d\.]+\)$/g, starAlpha + ')')));
            targetCtx.beginPath();
            targetCtx.moveTo(-2, 0);
            targetCtx.lineTo(-1, -starSize * 0.15);
            targetCtx.lineTo(0, -starSize);
            targetCtx.lineTo(1, -starSize * 0.15);
            targetCtx.lineTo(2, 0);
            targetCtx.closePath();
            targetCtx.fillStyle = grad;
            targetCtx.shadowColor = 'rgba(120,180,255,0.5)';
            targetCtx.shadowBlur = starSize * 0.12;
            targetCtx.globalAlpha = 1.0;
            targetCtx.fill();
            targetCtx.restore();
        }
        targetCtx.restore();
        const centerRadius = Math.max(30, flare.brightness / finalOptions.brightnessThreshold * 60);
        const centerAlpha = getFinalAlpha(baseAlpha, finalOptions.centerOpacity);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 6);
        let grad = targetCtx.createRadialGradient(flare.x, flare.y, 0, flare.x, flare.y, centerRadius);
        grad.addColorStop(0, `rgba(120,180,255,${centerAlpha})`);
        grad.addColorStop(0.5, `rgba(120,180,255,${centerAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(120,180,255,0)`);
        targetCtx.beginPath();
        targetCtx.arc(flare.x, flare.y, centerRadius, 0, 2 * Math.PI);
        targetCtx.fillStyle = grad;
        targetCtx.fill();
        targetCtx.restore();
        const size = flare.brightness / finalOptions.brightnessThreshold * (400 * (finalOptions.widthModifier || 2.5));
        const height = finalOptions.heightThreshold || 8;
        const streakBaseAlpha = (flare.brightness / 255) * finalOptions.intensity * 0.7;
        const streakAlpha = getFinalAlpha(streakBaseAlpha, finalOptions.streakOpacity);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 2);
        let streakGrad = targetCtx.createLinearGradient(
            flare.x - size / 2, flare.y,
            flare.x + size / 2, flare.y
        );
        streakGrad.addColorStop(0, `rgba(120,180,255,0)`);
        streakGrad.addColorStop(0.45, `rgba(120,180,255,${streakAlpha * 0.2})`);
        streakGrad.addColorStop(0.5, `rgba(120,180,255,${streakAlpha})`);
        streakGrad.addColorStop(0.55, `rgba(120,180,255,${streakAlpha * 0.2})`);
        streakGrad.addColorStop(1, `rgba(120,180,255,0)`);
        targetCtx.beginPath();
        targetCtx.fillStyle = streakGrad;
        targetCtx.fillRect(flare.x - size / 2, flare.y - height / 2, size, height);
        targetCtx.restore();
        const vStreakAlpha = streakAlpha * 0.25 * (finalOptions.streakOpacity || 1);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 1);
        let vStreakGrad = targetCtx.createLinearGradient(
            flare.x, flare.y - size / 2,
            flare.x, flare.y + size / 2
        );
        vStreakGrad.addColorStop(0, `rgba(120,180,255,0)`);
        vStreakGrad.addColorStop(0.45, `rgba(120,180,255,${vStreakAlpha})`);
        vStreakGrad.addColorStop(0.5, `rgba(120,180,255,${vStreakAlpha * 2})`);
        vStreakGrad.addColorStop(0.55, `rgba(120,180,255,${vStreakAlpha})`);
        vStreakGrad.addColorStop(1, `rgba(120,180,255,0)`);
        targetCtx.beginPath();
        targetCtx.fillStyle = vStreakGrad;
        targetCtx.fillRect(flare.x - height / 2, flare.y - size / 2, height, size);
        targetCtx.restore();
        const streakCount = 4;
        const diagAlpha = getFinalAlpha(streakBaseAlpha * 0.12, finalOptions.diagOpacity);
        for (let i = 0; i < streakCount; i++) {
            const angle = (Math.PI / 2) * i + Math.PI / 4;
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            targetCtx.translate(flare.x, flare.y);
            targetCtx.rotate(angle);
            applyBlur(targetCtx, finalOptions.blur);
            let diagGrad = targetCtx.createLinearGradient(
                -size / 2, 0,
                size / 2, 0
            );
            diagGrad.addColorStop(0, `rgba(120,180,255,0)`);
            diagGrad.addColorStop(0.5, `rgba(120,180,255,${diagAlpha})`);
            diagGrad.addColorStop(1, `rgba(120,180,255,0)`);
            targetCtx.beginPath();
            targetCtx.fillStyle = diagGrad;
            targetCtx.fillRect(-size / 2, -height / 2, size, height);
            targetCtx.restore();
        }
    }
    function drawCircular(flare) {
        const w = temp.width, h = temp.height;
        const cx = flare.x, cy = flare.y;
        const centerX = w / 2, centerY = h / 2;
        const dx = centerX - cx, dy = centerY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mainBaseAlpha = (flare.brightness / 255) * finalOptions.intensity;
        const mainAlpha = getFinalAlpha(mainBaseAlpha);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 8);
        let grad = targetCtx.createRadialGradient(cx, cy, 0, cx, cy, finalOptions.radius * 1.2);
        grad.addColorStop(0, `rgba(255,255,255,${mainAlpha})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${mainAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, finalOptions.radius * 1.2, 0, 2 * Math.PI);
        targetCtx.fillStyle = grad;
        targetCtx.fill();
        targetCtx.restore();
        const haloRadii = [finalOptions.radius * 2.2, finalOptions.radius * 1.7, finalOptions.radius * 1.3];
        const haloColors = [
            [180, 220, 255],
            [255, 220, 180],
            [200, 180, 255]
        ];
        for (let i = 0; i < haloRadii.length; i++) {
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            applyBlur(targetCtx, finalOptions.blur + 2 + i);
            let haloGrad = targetCtx.createRadialGradient(cx, cy, haloRadii[i] * 0.7, cx, cy, haloRadii[i]);
            haloGrad.addColorStop(0, `rgba(${haloColors[i][0]},${haloColors[i][1]},${haloColors[i][2]},${mainAlpha * 0.08})`);
            haloGrad.addColorStop(1, `rgba(${haloColors[i][0]},${haloColors[i][1]},${haloColors[i][2]},0)`);
            targetCtx.beginPath();
            targetCtx.arc(cx, cy, haloRadii[i], 0, 2 * Math.PI);
            targetCtx.fillStyle = haloGrad;
            targetCtx.fill();
            targetCtx.restore();
        }
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 1);
        let arcRadius = finalOptions.radius * 2.1;
        let arcCenter = { x: cx, y: cy };
        let arcStart = Math.PI * 0.15, arcEnd = Math.PI * 1.85;
        let arcGrad = targetCtx.createLinearGradient(
            arcCenter.x - arcRadius, arcCenter.y,
            arcCenter.x + arcRadius, arcCenter.y
        );
        arcGrad.addColorStop(0.0, "rgba(255,0,0,0.13)");
        arcGrad.addColorStop(0.2, "rgba(255,255,0,0.13)");
        arcGrad.addColorStop(0.4, "rgba(0,255,0,0.13)");
        arcGrad.addColorStop(0.6, "rgba(0,255,255,0.13)");
        arcGrad.addColorStop(0.8, "rgba(0,0,255,0.13)");
        arcGrad.addColorStop(1.0, "rgba(255,0,255,0.13)");
        targetCtx.beginPath();
        targetCtx.arc(arcCenter.x, arcCenter.y, arcRadius, arcStart, arcEnd, false);
        targetCtx.lineWidth = Math.max(2, finalOptions.radius * 0.08);
        targetCtx.strokeStyle = arcGrad;
        targetCtx.shadowColor = "rgba(255,255,255,0.08)";
        targetCtx.shadowBlur = arcRadius * 0.08;
        targetCtx.stroke();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
        const ghostCount = 4;
        for (let i = 1; i <= ghostCount; i++) {
            const t = i / (ghostCount + 1);
            const gx = cx + dx * t;
            const gy = cy + dy * t;
            const ghostRadius = finalOptions.radius * (0.5 + 0.3 * Math.sin(i));
            const ghostAlpha = mainAlpha * (0.18 + 0.12 * Math.cos(i));
            const ghostColors = [
                [180, 220, 255],
                [255, 180, 220],
                [220, 180, 255],
                [200, 255, 255]
            ];
            const gc = ghostColors[i % ghostColors.length];
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            applyBlur(targetCtx, finalOptions.blur + 1);
            let ghostGrad = targetCtx.createRadialGradient(gx, gy, 0, gx, gy, ghostRadius);
            ghostGrad.addColorStop(0, `rgba(${gc[0]},${gc[1]},${gc[2]},${ghostAlpha * 0.7})`);
            ghostGrad.addColorStop(1, `rgba(${gc[0]},${gc[1]},${gc[2]},0)`);
            targetCtx.beginPath();
            targetCtx.arc(gx, gy, ghostRadius, 0, 2 * Math.PI);
            targetCtx.fillStyle = ghostGrad;
            targetCtx.fill();
            targetCtx.restore();
        }
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, 0);
        let dotArcRadius = finalOptions.radius * 2.3;
        let dotCount = 32;
        for (let i = 0; i < dotCount; i++) {
            const theta = Math.PI * 0.2 + (Math.PI * 1.6) * (i / dotCount);
            const x = cx + Math.cos(theta) * dotArcRadius;
            const y = cy + Math.sin(theta) * dotArcRadius;
            targetCtx.beginPath();
            targetCtx.arc(x, y, 1.2 + Math.sin(i) * 0.7, 0, 2 * Math.PI);
            targetCtx.fillStyle = `rgba(255,255,255,0.13)`;
            targetCtx.fill();
        }
        targetCtx.restore();
    }
    function drawStarburst(flare) {
        const w = temp.width, h = temp.height;
        const dirX = (finalOptions.directionX !== undefined ? finalOptions.directionX : 100) / 100 * w;
        const dirY = (finalOptions.directionY !== undefined ? finalOptions.directionY : 100) / 100 * h;
        const cx = flare.x, cy = flare.y;
        const dx = dirX - cx, dy = dirY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        let color = flareColor;
        if (!finalOptions.flareColor) color = [255, 200, 120];
        const [r, g, b] = color;
        const points = Math.max(4, finalOptions.points || 12);
        const outerRadius = (flare.brightness / finalOptions.brightnessThreshold) * (finalOptions.radius * 1.2);
        const innerRadius = outerRadius * 0.3;
        const angleStep = Math.PI / points;
        const rotation = finalOptions.rotation || 0;
        const baseAlpha = (flare.brightness / 255) * finalOptions.intensity;
        const alpha = getFinalAlpha(baseAlpha);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur);
        targetCtx.translate(cx, cy);
        targetCtx.rotate(rotation * Math.PI / 180 + angle);
        targetCtx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r0 = (i % 2 === 0) ? outerRadius : innerRadius;
            const a = i * angleStep;
            targetCtx.lineTo(Math.cos(a) * r0, Math.sin(a) * r0);
        }
        targetCtx.closePath();
        targetCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        targetCtx.shadowColor = `rgba(${r},${g},${b},0.7)`;
        targetCtx.shadowBlur = outerRadius * 0.5 * finalOptions.falloff;
        targetCtx.fill();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 2);
        targetCtx.beginPath();
        const arcRadius = dist * 0.7;
        const arcStart = angle - Math.PI / 3;
        const arcEnd = angle + Math.PI / 1.5;
        targetCtx.arc(cx, cy, arcRadius, arcStart, arcEnd, false);
        targetCtx.lineWidth = Math.max(2, outerRadius * 0.08);
        targetCtx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.25})`;
        targetCtx.shadowColor = `rgba(${r},${g},${b},0.2)`;
        targetCtx.shadowBlur = arcRadius * 0.08;
        targetCtx.stroke();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
        const ghostCount = 5;
        for (let i = 1; i <= ghostCount; i++) {
            const t = i / (ghostCount + 1);
            const gx = cx + dx * t;
            const gy = cy + dy * t;
            const ghostRadius = outerRadius * (0.18 + 0.12 * Math.sin(i));
            const ghostAlpha = alpha * (0.18 + 0.12 * Math.cos(i));
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            applyBlur(targetCtx, finalOptions.blur + 1);
            targetCtx.translate(gx, gy);
            targetCtx.rotate(angle + Math.PI / 6 * i);
            targetCtx.beginPath();
            for (let j = 0; j < 6; j++) {
                const a = (j / 6) * 2 * Math.PI;
                const x = Math.cos(a) * ghostRadius;
                const y = Math.sin(a) * ghostRadius;
                if (j === 0) targetCtx.moveTo(x, y);
                else targetCtx.lineTo(x, y);
            }
            targetCtx.closePath();
            targetCtx.fillStyle = `rgba(${r},${g},${b},${ghostAlpha})`;
            targetCtx.shadowColor = `rgba(${r},${g},${b},0.18)`;
            targetCtx.shadowBlur = ghostRadius * 0.7;
            targetCtx.fill();
            targetCtx.shadowBlur = 0;
            targetCtx.restore();
        }
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 3);
        let grad = targetCtx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius * 0.7);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, outerRadius * 0.7, 0, 2 * Math.PI);
        targetCtx.fillStyle = grad;
        targetCtx.fill();
        targetCtx.restore();
    }
    function drawPolygon(flare) {
        const sides = Math.max(3, finalOptions.points || 6);
        const radius = (flare.brightness / finalOptions.brightnessThreshold) * finalOptions.radius;
        const rotation = finalOptions.rotation || 0;
        const baseAlpha = (flare.brightness / 255) * finalOptions.intensity;
        const alpha = getFinalAlpha(baseAlpha);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur);
        targetCtx.translate(flare.x, flare.y);
        targetCtx.rotate(rotation * Math.PI / 180);
        targetCtx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) targetCtx.moveTo(x, y);
            else targetCtx.lineTo(x, y);
        }
        targetCtx.closePath();
        targetCtx.fillStyle = `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, ${alpha})`;
        targetCtx.shadowColor = `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, 0.5)`;
        targetCtx.shadowBlur = radius * 0.3 * finalOptions.falloff;
        targetCtx.fill();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
    }
    for (let i = 0; i < Math.min(finalOptions.maxFlares, flares.length); i++) {
        const flare = flares[i];
        switch (finalOptions.type) {
            case "anamorphic":
                drawAnamorphic(flare);
                break;
            case "circular":
                drawCircular(flare);
                break;
            case "starburst":
                drawStarburst(flare);
                break;
            case "polygon":
                drawPolygon(flare);
                break;
            default:
                drawAnamorphic(flare);
        }
    }
    targetCtx.globalCompositeOperation = "source-over";
    targetCtx.filter = "none";
    return this;
};