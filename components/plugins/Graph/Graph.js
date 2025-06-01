function Graph(options = {}) {
    if (!(this instanceof Graph)) {
        return new Graph(options);
    }
    if (!Graph.initialized) {
        // Media colors as root variables
        Q.style(`
        `);
        Graph.initialized = true;
    }
    return this;
};

Graph.deepMerge = function(target, src) {
    for (const k in src) {
        if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
            if (!target[k]) target[k] = {};
            Graph.deepMerge(target[k], src[k]);
        } else {
            target[k] = src[k];
        }
    }
    return target;
};

Graph.getPadding = function(pad) {
    if (Array.isArray(pad)) {
        if (pad.length === 2) return [pad[0], pad[1], pad[0], pad[1]];
        if (pad.length === 3) return [pad[0], pad[1], pad[2], pad[1]];
        if (pad.length === 4) return pad;
    }
    return [pad, pad, pad, pad];
};

Graph.catmullRom2bezier = function(points) {
    let d = '';
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        if (i === 0) d += `M${p1[0]},${p1[1]}`;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
};

Q.Graph = Graph;