Media.prototype.Selector = function(container, options = {}) {
    // CSS injection (Q.style)
    if (!Media.selectorClassesInitialized) {
        Media.selectorClasses = Q.style(`
            --media-selector-bg: rgba(0,0,0,0.15);
            --media-selector-rect: #4caf50;
            --media-selector-rect-active: #ff9800;
            --media-selector-dot: #fff;
            --media-selector-dot-border: #333;
        `, `
            .media-selector-canvas {
                position: absolute;
                left: 0; top: 0; width: 100%; height: 100%;
                pointer-events: auto;
                z-index: 20;
                background: var(--media-selector-bg, rgba(0,0,0,0.15));
                cursor: crosshair;
                user-select: none;
            }
            .media-selector-rect {
                position: absolute;
                border: 2px solid var(--media-selector-rect, #4caf50);
                background: rgba(76,175,80,0.08);
                box-sizing: border-box;
                pointer-events: auto;
            }
            .media-selector-rect.active {
                border-color: var(--media-selector-rect-active, #ff9800);
                background: rgba(255,152,0,0.08);
            }
            .media-selector-dot {
                position: absolute;
                width: 12px; height: 12px;
                border-radius: 50%;
                background: var(--media-selector-dot, #fff);
                border: 2px solid var(--media-selector-dot-border, #333);
                right: -8px; bottom: -8px;
                cursor: nwse-resize;
                z-index: 2;
            }
        `, null, {
            'media-selector-canvas': 'media-selector-canvas',
            'media-selector-rect': 'media-selector-rect',
            'media-selector-dot': 'media-selector-dot'
        }, false);
        Media.selectorClassesInitialized = true;
    }
    const classes = Media.selectorClasses;
    // DOM structure
    const wrapper = Q(container);
    // Ensure wrapper is position:relative
    if (window.getComputedStyle(wrapper.nodes[0]).position === 'static') {
        wrapper.css('position', 'relative');
    }
    // New: canvas element
    const canvas = Q('<canvas class="' + classes['media-selector-canvas'] + '"></canvas>');
    wrapper.append(canvas);
    // State
    let selection = null;
    let defaultDims = { x: 10, y: 10, w: 30, h: 30 }; // percent
    // Helper: get video/image rect relative to wrapper
    function getMediaRect() {
        const media = wrapper.find('video') || wrapper.find('img');
        if (!media || !media.nodes[0]) {
            // fallback: use wrapper itself
            const rect = wrapper.nodes[0].getBoundingClientRect();
            return { left: 0, top: 0, width: rect.width, height: rect.height };
        }
        const mediaRect = media.nodes[0].getBoundingClientRect();
        const wrapperRect = wrapper.nodes[0].getBoundingClientRect();
        return {
            left: mediaRect.left - wrapperRect.left,
            top: mediaRect.top - wrapperRect.top,
            width: mediaRect.width,
            height: mediaRect.height
        };
    }
    // Helper: percent <-> px, now relative to media area
    function percentToPx({x, y, w, h}) {
        const mediaRect = getMediaRect();
        return {
            x: mediaRect.left + mediaRect.width * x / 100,
            y: mediaRect.top + mediaRect.height * y / 100,
            w: mediaRect.width * w / 100,
            h: mediaRect.height * h / 100
        };
    }
    function pxToPercent({x, y, w, h}) {
        const mediaRect = getMediaRect();
        return {
            x: mediaRect.width ? ((x - mediaRect.left) / mediaRect.width * 100) : 0,
            y: mediaRect.height ? ((y - mediaRect.top) / mediaRect.height * 100) : 0,
            w: mediaRect.width ? (w / mediaRect.width * 100) : 0,
            h: mediaRect.height ? (h / mediaRect.height * 100) : 0
        };
    }
    // Draw the selection (only one allowed)
    function renderSelections() {
        // Sizing
        const el = canvas.nodes[0];
        const rect = wrapper.nodes[0].getBoundingClientRect();
        // Set both canvas CSS and attribute size
        el.width = rect.width;
        el.height = rect.height;
        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
        const ctx = el.getContext('2d');
        ctx.clearRect(0, 0, el.width, el.height);
        if (!selection) {
            return;
        }
        const dimsPx = percentToPx(selection);
        // Shading: whole area dark, selection area transparent
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, el.width, el.height);
        ctx.clearRect(dimsPx.x, dimsPx.y, dimsPx.w, dimsPx.h);
        ctx.restore();
        // Border
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(dimsPx.x, dimsPx.y, dimsPx.w, dimsPx.h);
        ctx.restore();
        // Resize dot (bottom right corner) - square, 6x6px, 0.8px border
        ctx.save();
        // First clear at dot position so no shadow/line below
        ctx.clearRect(dimsPx.x + dimsPx.w - 3, dimsPx.y + dimsPx.h - 3, 6, 6);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.8;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.rect(dimsPx.x + dimsPx.w - 3, dimsPx.y + dimsPx.h - 3, 6, 6);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    // Mouse events for drawing new selection or moving/resizing
    let drawing = null;
    let drag = null;
    // For mouse events, detect click on dot:
    // Instead of rectDiv and dot:
    canvas.on('mousedown', function(e) {
        const rect = wrapper.nodes[0].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (selection) {
            const dimsPx = percentToPx(selection);
            // Dot detection (8px radius circle)
            const dx = x - (dimsPx.x + dimsPx.w);
            const dy = y - (dimsPx.y + dimsPx.h);
            if (dx*dx + dy*dy <= 64) {
                drag = {
                    type: 'resize',
                    startX: e.clientX,
                    startY: e.clientY,
                    orig: {...selection}
                };
                document.body.style.userSelect = 'none';
                e.stopPropagation();
                return;
            }
            // Move selection
            if (
                x >= dimsPx.x && x <= dimsPx.x + dimsPx.w &&
                y >= dimsPx.y && y <= dimsPx.y + dimsPx.h
            ) {
                drag = {
                    type: 'move',
                    startX: e.clientX,
                    startY: e.clientY,
                    orig: {...selection}
                };
                document.body.style.userSelect = 'none';
                e.stopPropagation();
                return;
            }
        }
        // Draw new selection
        drawing = { startX: x, startY: y, endX: x, endY: y };
    });
    document.addEventListener('mousemove', function(e) {
        // Drawing new selection
        if (drawing) {
            const rect = wrapper.nodes[0].getBoundingClientRect();
            drawing.endX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            drawing.endY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
            // Temporary selection drawing
            renderSelections();
            const x = Math.min(drawing.startX, drawing.endX);
            const y = Math.min(drawing.startY, drawing.endY);
            const w = Math.abs(drawing.endX - drawing.startX);
            const h = Math.abs(drawing.endY - drawing.startY);
            // Temporary selection on canvas: border
            const el = canvas.nodes[0];
            const ctx = el.getContext('2d');
            ctx.save();
            ctx.strokeStyle = '#ff9800';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
            ctx.restore();
        }
        // Drag/resize existing
        if (drag && selection) {
            const sel = selection;
            const mediaRect = getMediaRect();
            if (drag.type === 'resize') {
                let dx = (e.clientX - drag.startX) / mediaRect.width * 100;
                let dy = (e.clientY - drag.startY) / mediaRect.height * 100;
                let newW = Math.max(2, drag.orig.w + dx);
                let newH = Math.max(2, drag.orig.h + dy);
                newW = Math.min(newW, 100 - drag.orig.x);
                newH = Math.min(newH, 100 - drag.orig.y);
                selection = {
                    x: drag.orig.x,
                    y: drag.orig.y,
                    w: newW,
                    h: newH
                };
                renderSelections();
            } else if (drag.type === 'move') {
                let dx = (e.clientX - drag.startX) / mediaRect.width * 100;
                let dy = (e.clientY - drag.startY) / mediaRect.height * 100;
                selection = {
                    x: Math.max(0, Math.min(100 - sel.w, drag.orig.x + dx)),
                    y: Math.max(0, Math.min(100 - sel.h, drag.orig.y + dy)),
                    w: sel.w,
                    h: sel.h
                };
                renderSelections();
            }
        }
    });
    document.addEventListener('mouseup', function(e) {
        // Finish drawing
        if (drawing) {
            const rect = wrapper.nodes[0].getBoundingClientRect();
            const x = Math.min(drawing.startX, drawing.endX);
            const y = Math.min(drawing.startY, drawing.endY);
            const w = Math.abs(drawing.endX - drawing.startX);
            const h = Math.abs(drawing.endY - drawing.startY);
            if (w > 10 && h > 10) {
                const perc = pxToPercent({x, y, w, h});
                add(perc.x, perc.y, perc.w, perc.h);
            }
            drawing = null;
            renderSelections();
        }
        // Finish drag/resize
        if (drag) {
            drag = null;
        }
        document.body.style.userSelect = '';
    });
    // Redraw selection on resize to keep correct position/sizes
    function handleResize() {
        renderSelections();
    }
    // Listen for window resize and also for wrapper resize (if ResizeObserver is available)
    window.addEventListener('resize', handleResize);
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(handleResize);
        ro.observe(wrapper.nodes[0]);
        // Also observe the video/image if present
        const media = wrapper.find('video') || wrapper.find('img');
        if (media && media.nodes[0]) {
            ro.observe(media.nodes[0]);
        }
    }
    // API
    function add(x, y, w, h) {
        selection = {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            w: Math.max(2, Math.min(100, w)),
            h: Math.max(2, Math.min(100, h))
        };
        renderSelections();
        return true;
    }
    function remove() {
        if (selection) {
            selection = null;
            renderSelections();
        }
    }
    function get() {
        if (!selection) return null;
        return {...selection};
    }
    function dimensions(x, y, w, h) {
        if (x === undefined) return {...defaultDims};
        defaultDims = {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            w: Math.max(2, Math.min(100, w)),
            h: Math.max(2, Math.min(100, h))
        };
        renderSelections();
        return instance;
    }
    // New: programmatic setter
    function set(x, y, w, h) {
        selection = {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            w: Math.max(2, Math.min(100, w)),
            h: Math.max(2, Math.min(100, h))
        };
        renderSelections();
        return instance;
    }
    // New: aspect ratio setter/getter
    function aspectRatio(ratio) {
        // If no parameter, return current selection ratio
        if (!ratio) {
            if (!selection) return null;
            return (selection.w / selection.h).toFixed(4);
        }
        // Calculate from ratio string (e.g. "16:9", "4:3", "1:1", "3:4", etc.)
        let [rw, rh] = ratio.split(':').map(Number);
        if (!rw || !rh) return instance;
        const mediaRect = getMediaRect();
        const mediaW = mediaRect.width;
        const mediaH = mediaRect.height;
        if (!mediaW || !mediaH) return instance;
        // What would be the desired aspect rectangle on the full area?
        let targetW = mediaW, targetH = mediaW * rh / rw;
        if (targetH > mediaH) {
            // If too tall, fit to height
            targetH = mediaH;
            targetW = mediaH * rw / rh;
        }
        // Percent values
        const wPerc = (targetW / mediaW) * 100;
        const hPerc = (targetH / mediaH) * 100;
        const xPerc = (100 - wPerc) / 2;
        const yPerc = (100 - hPerc) / 2;
        set(xPerc, yPerc, wPerc, hPerc);
        return instance;
    }
    // Expose API
    const instance = canvas;
    instance.add = add;
    instance.remove = remove;
    instance.get = get;
    instance.dimensions = dimensions;
    instance.set = set; // <-- new method
    instance.aspectRatio = aspectRatio; // <-- new method
    // Optionally set initial dimensions
    if (options.default) {
        dimensions(options.default.x, options.default.y, options.default.w, options.default.h);
    }
    // Optionally add initial selection
    if (options.init) {
        add(options.init.x, options.init.y, options.init.w, options.init.h);
    }
    // Initial render
    renderSelections();
    return instance;
};
