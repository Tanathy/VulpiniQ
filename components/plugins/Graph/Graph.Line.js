Graph.prototype.Line = function (options = {}) {
    const defaults = {
        size: {
            width: 600,
            height: 300,
            padding: 40
        },
        background: '#181818',
        range: {
            min: 0,
            max: 100,
            autoscaleX: true,
            autoscaleY: true
        },
        line: {
            type: 'line',
            color: 'rgb(100, 60, 240)',
            thickness: 2,
            fill: null,
            triangle: {
                size: 8,
                fill: null,
                stroke: null,
                strokeWidth: null,
                opacity: null
            }
        },
        dot: {
            radius: 2,
            stroke: '#222',
            strokeWidth: 0
        },
        zeroLine: {
            enabled: false,
            color: '#607d8b',
            thickness: 2,
            dasharray: '',
            point: undefined,
            points: undefined
        },
        grid: {
            resolutionX: 0,
            resolutionY: 0,
            color: '#333',
            thickness: 1,
            dasharray: '2,2',
            showValuesX: false,
            showValuesY: false
        },
        text: {
            value: {
                color: '#bbb',
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 'normal',
                shadow: '',
            },
            axis: {
                color: '#aaa',
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                shadow: '',
            },
            label: {
                color: '#fff',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                shadow: '',
            }
        },
        current: {
            show: false
        },
        average: {
            enabled: true,
            dasharray: '2,2',
            color: '#ff9800',
            thickness: 3,
            label: {
                color: '#ff9800',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                shadow: '',
            }
        },
        hover: {
            value: false,
            onlyPoints: false,
            digits: 5,
            distance: 20,
            wrap: false,
            show: 'both',
            xDigits: 5,
            yDigits: 5,
            dot: {
                radius: 10,
                fill: 'rgb(100, 60, 240)',
                stroke: '#fff',
                strokeWidth: 0
            },
            margin: [0, 20],
            cursor: false,
            padding: [8, 8, 8, 8],
            background: '#111',
            opacity: 1,
            shadow: '',
            text: {
                color: '#fff',
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 'normal',
                shadow: ''
            }
        },
        valueDigits: 2
    };
    const opts = Graph.deepMerge(JSON.parse(JSON.stringify(defaults)), options);
    let dataX = [], dataY = [];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', opts.size.width);
    svg.setAttribute('height', opts.size.height);
    svg.style.background = opts.background;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(g);
    function render() {
        g.innerHTML = '';
        if (!dataY.length) return;
        let xArr = dataX.length ? dataX : dataY.map((_, i) => i);
        let minY = opts.range.autoscaleY ? Math.min(...dataY) : opts.range.min;
        let maxY = opts.range.autoscaleY ? Math.max(...dataY) : opts.range.max;
        let minX = opts.range.autoscaleX ? Math.min(...xArr) : 0;
        let maxX = opts.range.autoscaleX ? Math.max(...xArr) : xArr.length - 1;
        const pad = Graph.getPadding(opts.size.padding);
        const [padT, padR, padB, padL] = pad;
        const w = opts.size.width - padL - padR;
        const h = opts.size.height - padT - padB;
        const scaleX = v => padL + (w) * (v - minX) / (maxX - minX);
        const scaleY = v => opts.size.height - padB - (h) * (v - minY) / (maxY - minY);
        if (opts.grid.resolutionX > 0) {
            let xVal = Math.ceil(minX / opts.grid.resolutionX) * opts.grid.resolutionX;
            for (; xVal <= maxX; xVal += opts.grid.resolutionX) {
                const x = scaleX(xVal);
                const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Q(grid).attr({
                    x1: x,
                    y1: padT,
                    x2: x,
                    y2: opts.size.height - padB,
                    stroke: opts.grid.color,
                    'stroke-width': opts.grid.thickness,
                    'stroke-dasharray': opts.grid.dasharray
                });
                g.appendChild(grid);
                if (opts.grid.showValuesX) {
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    Q(label).attr({
                        x: x,
                        y: opts.size.height - padB + 18,
                        fill: opts.text.value.color,
                        'font-size': opts.text.value.fontSize,
                        'font-family': opts.text.value.fontFamily,
                        'font-weight': opts.text.value.fontWeight
                    });
                    label.textContent = xVal.toFixed(opts.valueDigits);
                    g.appendChild(label);
                }
            }
        }
        if (opts.grid.resolutionY > 0) {
            let yVal = Math.ceil(minY / opts.grid.resolutionY) * opts.grid.resolutionY;
            for (; yVal <= maxY; yVal += opts.grid.resolutionY) {
                const y = scaleY(yVal);
                const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Q(grid).attr({
                    x1: padL,
                    y1: y,
                    x2: opts.size.width - padR,
                    y2: y,
                    stroke: opts.grid.color,
                    'stroke-width': opts.grid.thickness,
                    'stroke-dasharray': opts.grid.dasharray
                });
                g.appendChild(grid);
                if (opts.grid.showValuesY) {
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    Q(label).attr({
                        x: padL - 8,
                        y: y + 4,
                        fill: opts.text.value.color,
                        'font-size': opts.text.value.fontSize,
                        'font-family': opts.text.value.fontFamily,
                        'font-weight': opts.text.value.fontWeight,
                        'text-anchor': 'end'
                    });
                    label.textContent = yVal.toFixed(opts.valueDigits);
                    g.appendChild(label);
                }
            }
        }
        let d = '';
        if (opts.line.type === 'curve' && dataY.length > 2) {
            const points = dataY.map((y, i) => [scaleX(xArr[i]), scaleY(y)]);
            d = Graph.catmullRom2bezier(points);
        } else if (opts.line.type === 'dots') {
            for (let i = 0; i < dataY.length; i++) {
                const x = scaleX(xArr[i]);
                const y = scaleY(dataY[i]);
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                Q(dot).attr({
                    cx: x,
                    cy: y,
                    r: opts.dot.radius,
                    fill: opts.line.color,
                    stroke: opts.dot.stroke,
                    'stroke-width': opts.dot.strokeWidth
                });
                g.appendChild(dot);
            }
            d = '';
        } else {
            for (let i = 0; i < dataY.length; i++) {
                const x = scaleX(xArr[i]);
                const y = scaleY(dataY[i]);
                d += (i === 0 ? 'M' : 'L') + x + ',' + y;
            }
        }
        if (opts.line.fill && d && dataY.length > 1) {
            let areaPath = '';
            let fillColor = typeof opts.line.fill === 'object' ? opts.line.fill.color : opts.line.fill;
            let lowerY = [];
            if (opts.zeroLine && opts.zeroLine.enabled) {
                if (Array.isArray(opts.zeroLine.points) && opts.zeroLine.points.length === dataY.length) {
                    lowerY = opts.zeroLine.points;
                } else if (Array.isArray(opts.zeroLine.point) && opts.zeroLine.point.length === 2) {
                    lowerY = Array(dataY.length).fill(opts.zeroLine.point[1]);
                } else {
                    lowerY = Array(dataY.length).fill(opts.range.min);
                }
            } else {
                lowerY = Array(dataY.length).fill(opts.range.min);
            }
            if (opts.line.type === 'curve' && dataY.length > 2) {
                const points = dataY.map((y, i) => [scaleX(xArr[i]), scaleY(y)]);
                areaPath = Graph.catmullRom2bezier(points);
                for (let i = dataY.length - 1; i >= 0; i--) {
                    areaPath += 'L' + scaleX(xArr[i]) + ',' + scaleY(lowerY[i]);
                }
                areaPath += 'Z';
            } else {
                areaPath = '';
                for (let i = 0; i < dataY.length; i++) {
                    const x = scaleX(xArr[i]);
                    const y = scaleY(dataY[i]);
                    areaPath += (i === 0 ? 'M' : 'L') + x + ',' + y;
                }
                for (let i = dataY.length - 1; i >= 0; i--) {
                    areaPath += 'L' + scaleX(xArr[i]) + ',' + scaleY(lowerY[i]);
                }
                areaPath += 'Z';
            }
            const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            Q(fillPath).attr({
                d: areaPath,
                fill: fillColor
            });
            g.appendChild(fillPath);
        }
        if (d) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            Q(path).attr({
                d: d,
                stroke: opts.line.color,
                'stroke-width': opts.line.thickness,
                fill: 'none'
            });
            g.appendChild(path);
        }
        if (opts.zeroLine && opts.zeroLine.enabled) {
            let nullD = '';
            let started = false;
            for (let i = 0; i < dataY.length; i++) {
                if (dataY[i] === 0) {
                    const x = scaleX(xArr[i]);
                    const y = scaleY(dataY[i]);
                    nullD += (started ? 'L' : 'M') + x + ',' + y;
                    started = true;
                }
            }
            if (nullD) {
                const nullPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                Q(nullPath).attr({
                    d: nullD,
                    stroke: opts.zeroLine.color,
                    'stroke-width': opts.zeroLine.thickness,
                    fill: 'none'
                });
                g.appendChild(nullPath);
            }
            if (Array.isArray(opts.zeroLine.point) && opts.zeroLine.point.length === 2) {
                const [nullX, nullY] = opts.zeroLine.point;
                if (typeof nullX === 'number' && typeof nullY === 'number') {
                    const x = scaleX(nullX);
                    const nullLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    Q(nullLine).attr({
                        x1: x,
                        y1: padT,
                        x2: x,
                        y2: opts.size.height - padB,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullLine);
                    const y = scaleY(nullY);
                    const nullLineH = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    Q(nullLineH).attr({
                        x1: padL,
                        y1: y,
                        x2: opts.size.width - padR,
                        y2: y,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullLineH);
                }
            }
            if (Array.isArray(opts.zeroLine.points) && opts.zeroLine.points.length > 0) {
                const n = opts.zeroLine.points.length;
                if (n === 1) {
                    const y = scaleY(opts.zeroLine.points[0]);
                    const nullLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    Q(nullLine).attr({
                        x1: padL,
                        y1: y,
                        x2: opts.size.width - padR,
                        y2: y,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullLine);
                } else {
                    let points = [];
                    for (let i = 0; i < n; i++) {
                        const x = padL + (w) * (n === 1 ? 0.5 : i / (n - 1));
                        const y = scaleY(opts.zeroLine.points[i]);
                        points.push([x, y]);
                    }
                    let d = '';
                    for (let i = 0; i < points.length; i++) {
                        d += (i === 0 ? 'M' : 'L') + points[i][0] + ',' + points[i][1];
                    }
                    const nullPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    Q(nullPath).attr({
                        d: d,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        fill: 'none',
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullPath);
                }
            }
        }
        if (opts.current.show && dataX.length && dataY.length) {
            const lastX = dataX[dataX.length - 1];
            const lastY = dataY[dataX.length - 1];
            const x = scaleX(lastX);
            const y = scaleY(lastY);
            const triOpts = opts.line.triangle;
            const triXSize = triOpts.size;
            const triYSize = triOpts.size;
            const triX = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            Q(triX).attr({
                points: `${x - triXSize},${opts.size.height - padB} ${x + triXSize},${opts.size.height - padB} ${x},${opts.size.height - padB + triXSize}`,
                fill: triOpts.fill || opts.line.color,
                stroke: triOpts.stroke,
                'stroke-width': triOpts.strokeWidth,
                opacity: triOpts.opacity
            });
            g.appendChild(triX);
            const xValStr = lastX.toFixed(opts.valueDigits);
            const xFont = opts.text.value.fontFamily;
            const xFontSize = opts.text.value.fontSize;
            const xLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            Q(xLabelBg).attr({
                x: x - 22,
                y: opts.size.height - padB + triXSize + 2,
                width: 44,
                height: 22,
                fill: '#111',
                rx: 4
            });
            g.appendChild(xLabelBg);
            const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            Q(xLabel).attr({
                x: x,
                y: opts.size.height - padB + triXSize + 18,
                'text-anchor': 'middle',
                fill: opts.text.value.color,
                'font-size': xFontSize,
                'font-family': xFont
            });
            xLabel.textContent = xValStr;
            g.appendChild(xLabel);
            const triY = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            Q(triY).attr({
                points: `${padL},${y - triYSize} ${padL},${y + triYSize} ${padL - triYSize},${y}`,
                fill: triOpts.fill || opts.line.color,
                stroke: triOpts.stroke,
                'stroke-width': triOpts.strokeWidth,
                opacity: triOpts.opacity
            });
            g.appendChild(triY);
            const yValStr = lastY.toFixed(opts.valueDigits);
            const yFont = opts.text.value.fontFamily;
            const yFontSize = opts.text.value.fontSize;
            const yLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            Q(yLabelBg).attr({
                x: padL - triYSize - 46,
                y: y - 11,
                width: 44,
                height: 22,
                fill: '#111',
                rx: 4
            });
            g.appendChild(yLabelBg);
            const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            Q(yLabel).attr({
                x: padL - triYSize - 24,
                y: y + 6,
                'text-anchor': 'middle',
                fill: opts.text.value.color,
                'font-size': yFontSize,
                'font-family': yFont
            });
            yLabel.textContent = yValStr;
            g.appendChild(yLabel);
        }
        if (opts.average && opts.average.enabled && dataY.length > 0) {
            const avgY = dataY.reduce((a, b) => a + b, 0) / dataY.length;
            const pad = Graph.getPadding(opts.size.padding);
            const [padT, padR, padB, padL] = pad;
            const w = opts.size.width - padL - padR;
            const h = opts.size.height - padT - padB;
            let minY = opts.range.autoscaleY ? Math.min(...dataY) : opts.range.min;
            let maxY = opts.range.autoscaleY ? Math.max(...dataY) : opts.range.max;
            const scaleY = v => opts.size.height - padB - (h) * (v - minY) / (maxY - minY);
            const y = scaleY(avgY);
            const avgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            Q(avgLine).attr({
                x1: padL,
                y1: y,
                x2: opts.size.width - padR,
                y2: y,
                stroke: opts.average.color,
                'stroke-width': opts.average.thickness,
                'stroke-dasharray': opts.average.dasharray
            });
            g.appendChild(avgLine);
            const avgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            Q(avgLabel).attr({
                x: padL - 8,
                y: y + 4,
                fill: opts.average.label.color,
                'font-size': opts.average.label.fontSize,
                'font-family': opts.average.label.fontFamily,
                'font-weight': opts.average.label.fontWeight,
                'text-anchor': 'end',
                opacity: 1
            });
            avgLabel.textContent = avgY.toFixed(typeof opts.valueDigits === 'number' ? opts.valueDigits : 2);
            g.appendChild(avgLabel);
        }
        if (opts.hover.value) {
            svg.onmousemove = function (e) {
                const rect = svg.getBoundingClientRect();
                const pad = Graph.getPadding(opts.size.padding);
                const [padT, padR, padB, padL] = pad;
                const w = opts.size.width - padL - padR;
                const h = opts.size.height - padT - padB;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                let minX = opts.range.autoscaleX ? Math.min(...dataX) : opts.range.min;
                let maxX = opts.range.autoscaleX ? Math.max(...dataX) : dataX.length - 1;
                let minY = opts.range.autoscaleY ? Math.min(...dataY) : opts.range.min;
                let maxY = opts.range.autoscaleY ? Math.max(...dataY) : opts.range.max;
                let xVal = minX + (mouseX - padL) * (maxX - minX) / (w);
                let yVal = maxY - (mouseY - padT) * (maxY - minY) / (h);
                let showX = xVal, showY = yVal, dist = 0;
                if (opts.hover.onlyPoints && dataX.length) {
                    let minDist = Infinity, idx = 0;
                    for (let i = 0; i < dataX.length; i++) {
                        const px = padL + (w) * (dataX[i] - minX) / (maxX - minX);
                        const py = opts.size.height - padB - (h) * (dataY[i] - minY) / (maxY - minY);
                        const d = Math.hypot(mouseX - px, mouseY - py);
                        if (d < minDist) { minDist = d; idx = i; }
                    }
                    showX = dataX[idx];
                    showY = dataY[idx];
                    dist = minDist;
                } else if (dataX.length > 1) {
                    let minDist = Infinity;
                    for (let i = 0; i < dataX.length - 1; i++) {
                        const x1 = padL + (w) * (dataX[i] - minX) / (maxX - minX);
                        const y1 = opts.size.height - padB - (h) * (dataY[i] - minY) / (maxY - minY);
                        const x2 = padL + (w) * (dataX[i + 1] - minX) / (maxX - minX);
                        const y2 = opts.size.height - padB - (h) * (dataY[i + 1] - minY) / (maxY - minY);
                        const t = Math.max(0, Math.min(1, ((mouseX - x1) * (x2 - x1) + (mouseY - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2)));
                        const projX = x1 + t * (x2 - x1);
                        const projY = y1 + t * (x2 - x1);
                        const d = Math.hypot(mouseX - projX, mouseY - projY);
                        if (d < minDist) {
                            minDist = d;
                            showX = dataX[i] + t * (dataX[i + 1] - dataX[i]);
                            showY = dataY[i] + t * (dataY[i + 1] - dataY[i]);
                            dist = d;
                        }
                    }
                }
                if (dist > (opts.hover.distance)) {
                    let old = svg.querySelector('.q-graph-hover-label');
                    if (old) old.remove();
                    svg.style.cursor = opts.hover.cursor === false ? '' : (opts.hover.cursor === true ? 'pointer' : 'auto');
                    return;
                }
                if (opts.hover.cursor === false) {
                    svg.style.cursor = 'none';
                } else if (opts.hover.cursor === true) {
                    svg.style.cursor = 'pointer';
                } else {
                    svg.style.cursor = '';
                }
                const hoverShow = opts.hover.show;
                const xDigits = typeof opts.hover.xDigits === 'number' ? opts.hover.xDigits : (typeof opts.hover.digits === 'number' ? opts.hover.digits : 5);
                const yDigits = typeof opts.hover.yDigits === 'number' ? opts.hover.yDigits : (typeof opts.hover.digits === 'number' ? opts.hover.digits : 5);
                const showXVal = +showX.toFixed(xDigits);
                const showYVal = +showY.toFixed(yDigits);
                let old = svg.querySelector('.q-graph-hover-label');
                if (old) old.remove();
                const gHover = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                gHover.classList.add('q-graph-hover-label');
                const cx = padL + (w) * (showX - minX) / (maxX - minX);
                const cy = opts.size.height - padB - (h) * (showY - minY) / (maxY - minY);
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                const hoverDot = opts.hover.dot;
                Q(dot).attr({
                    cx: cx,
                    cy: cy,
                    r: hoverDot.radius,
                    fill: hoverDot.fill,
                    stroke: hoverDot.stroke,
                    'stroke-width': hoverDot.strokeWidth
                });
                gHover.appendChild(dot);
                const hoverText = opts.hover.text;
                let labelText = '';
                if (hoverShow === 'both') {
                    labelText = opts.hover.wrap ? `x: ${showXVal}\ny: ${showYVal}` : `x: ${showXVal}, y: ${showYVal}`;
                } else if (hoverShow === 'x') {
                    labelText = `x: ${showXVal}`;
                } else if (hoverShow === 'y') {
                    labelText = `y: ${showYVal}`;
                }
                const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                Q(tempText).attr({
                    'font-size': hoverText.fontSize,
                    'font-family': hoverText.fontFamily,
                    'font-weight': hoverText.fontWeight
                });
                if (opts.hover.wrap && labelText.includes('\n')) {
                    const lines = labelText.split('\n');
                    lines.forEach((line, i) => {
                        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        Q(tspan).attr({
                            x: 0,
                            dy: i === 0 ? '0' : (hoverText.fontSize) * 1.2
                        });
                        tspan.textContent = line;
                        tempText.appendChild(tspan);
                    });
                } else {
                    tempText.textContent = labelText;
                }
                svg.appendChild(tempText);
                const bbox = tempText.getBBox();
                svg.removeChild(tempText);
                function getBox(box, def, count) {
                    if (Array.isArray(box)) {
                        if (box.length === 2 && count === 2) return box;
                        if (box.length === 2 && count === 4) return [box[0], box[1], box[0], box[1]];
                        if (box.length === 3) return [box[0], box[1], box[2], box[1]];
                        if (box.length === 4) return box;
                    }
                    return Array(count).fill(def);
                }
                const hoverPadArr = getBox(opts.hover.padding, 8, 4);
                const hoverMarginArr = getBox(opts.hover.margin, 8, 2);
                const labelW = bbox.width + hoverPadArr[1] + hoverPadArr[3];
                const labelH = bbox.height + hoverPadArr[0] + hoverPadArr[2];
                const labelX = cx + hoverMarginArr[1];
                const labelY = cy - labelH / 2 + hoverMarginArr[0];
                const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                Q(labelBg).attr({
                    x: labelX,
                    y: labelY,
                    width: labelW,
                    height: labelH,
                    fill: opts.hover.background,
                    rx: 5,
                    opacity: opts.hover.opacity
                });
                if (opts.hover.shadow) labelBg.setAttribute('filter', `drop-shadow(${opts.hover.shadow})`);
                gHover.appendChild(labelBg);
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                Q(label).attr({
                    fill: hoverText.color,
                    'font-size': hoverText.fontSize,
                    'font-family': hoverText.fontFamily,
                    'font-weight': hoverText.fontWeight,
                    'alignment-baseline': 'middle',
                    'text-anchor': 'middle'
                });
                if (hoverText.shadow) label.setAttribute('filter', `drop-shadow(${hoverText.shadow})`);
                if (opts.hover.wrap && labelText.includes('\n')) {
                    const lines = labelText.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        Q(tspan).attr({
                            x: labelX + labelW / 2,
                            dy: i === 0 ? '0' : (hoverText.fontSize) * 1.2
                        });
                        tspan.textContent = lines[i];
                        label.appendChild(tspan);
                    }
                    label.setAttribute('y', labelY + hoverPadArr[0] + (hoverText.fontSize));
                } else {
                    label.setAttribute('x', labelX + labelW / 2);
                    label.setAttribute('y', labelY + labelH / 2 + (hoverText.fontSize ? hoverText.fontSize / 3 - 2 : 6));
                    label.textContent = labelText;
                }
                gHover.appendChild(label);
                svg.appendChild(gHover);
                svg.style.cursor = 'none';
            };
            svg.onmouseleave = function () {
                let old = svg.querySelector('.q-graph-hover-label');
                if (old) old.remove();
                svg.style.cursor = opts.hover.cursor === false ? '' : (opts.hover.cursor === true ? 'pointer' : 'auto');
            };
        } else {
            svg.style.cursor = '';
            svg.onmousemove = null;
            svg.onmouseleave = null;
        }
    }
    const qsvg = Q(svg);
    qsvg.data = function (arr) {
        if (Array.isArray(arr)) {
            dataY = arr;
            dataX = arr.map((_, i) => i);
        } else if (arr && typeof arr === 'object' && arr.x && arr.y) {
            dataX = arr.x;
            dataY = arr.y;
        }
        render();
        return qsvg;
    };
    qsvg.add = function (val) {
        if (typeof val === 'object' && val.x !== undefined && val.y !== undefined) {
            dataX.push(val.x);
            dataY.push(val.y);
        } else if (typeof val === 'number') {
            dataX.push(dataX.length);
            dataY.push(val);
        }
        render();
        return qsvg;
    };
    render();
    return qsvg;
};
