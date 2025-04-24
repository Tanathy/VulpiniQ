Media.prototype.Timeline = function(container, options = {}) {

    if (!Media.timelineClassesInitialized) {
        Media.timelineClasses = Q.style(`
            --media-timeline-segment-height: 8px;
            --media-timeline-segment-margin: 2px;
            --media-timeline-track-gap: 0px;
        `, `
            .media-timeline-wrapper {
                width: 100%;
                background: var(--media-timeline-bg, #232323);
                position: relative;
                user-select: none;
                display: block;
            }
            .media-timeline-bar {
                width: 100%; height: 100%; position: relative; z-index: 2;
            }
            .media-timeline-tracks {
                position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 1;
                pointer-events: none;
            }
            .media-timeline-track-row {
                position: absolute; left: 0; width: 100%;
                border-bottom: 1px solid var(--media-timeline-track-border, #3338);
                box-sizing: border-box;
            }
            .media-timeline-track-label {
                position: absolute; left: 4px; top: 0; font-size: 10px; color: #888; z-index: 3;
                pointer-events: none;
            }
            .media-timeline-segment {
                position: absolute;
                border-radius: 5px;
                min-width: 1px;
                cursor: pointer;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: box-shadow 0.1s;
                margin-top: var(--media-timeline-segment-margin, 2px);
                margin-bottom: var(--media-timeline-segment-margin, 2px);
                background: var(--media-timeline-segment-normal, #4caf50);
                overflow: hidden;
                height: var(--media-timeline-segment-height, 8px);
                opacity: 0.5;
            }
            .media-timeline-segment.normal { background: var(--media-timeline-segment-normal, #4caf50); }
            .media-timeline-segment.alert { background: var(--media-timeline-segment-alert, #ff9800); }
            .media-timeline-segment.warning { background: var(--media-timeline-segment-warning, #f44336); }
            .media-timeline-segment.selected {z-index: 2; opacity: 1; }
            .media-timeline-handle {
                width: 5px; height: 100%; background: var(--media-timeline-handle-bg, #fff4); cursor: ew-resize; z-index: 3;
            }
        `, null, {
            'media-timeline-wrapper': 'media-timeline-wrapper',
            'media-timeline-bar': 'media-timeline-bar',
            'media-timeline-tracks': 'media-timeline-tracks',
            'media-timeline-track-row': 'media-timeline-track-row',
            'media-timeline-track-label': 'media-timeline-track-label',
            'media-timeline-segment': 'media-timeline-segment',
            'media-timeline-handle': 'media-timeline-handle',
            'selected': 'selected',
            'normal': 'normal',
            'alert': 'alert',
            'warning': 'warning',
            'left': 'left',
            'right': 'right'
        });
        Media.timelineClassesInitialized = true;
    }

    const classes = Media.timelineClasses;

    const timeline = Q(`<div class="${classes['media-timeline-wrapper']}"></div>`);
    const bar = Q(`<div class="${classes['media-timeline-bar']}"></div>`);
    const tracksBar = Q(`<div class="${classes['media-timeline-tracks']}"></div>`);
    timeline.append(bar, tracksBar);
    Q(container).append(timeline);

    timeline._length = 10000;
    timeline._segments = [];
    timeline._selected = null;
    timeline._changeCb = null;
    timeline._idCounter = 1;
    timeline._maxTracks = null; // unlimited by default

    timeline.length = function(ms) {
        if (typeof ms === 'undefined') return this._length;
        this._length = Math.max(1, ms);
        this._render();
        return this;
    };

    timeline.add = function(from, to, type = 'normal', trackIndex) {
        from = Math.max(0, Math.min(from, this._length));
        to = Math.max(from, Math.min(to, this._length));
        const id = 'seg_' + (this._idCounter++);
        const seg = { id, from, to, type };
        if (typeof trackIndex === 'number' && trackIndex >= 0) {
            seg._forceTrack = trackIndex;
        }
        this._segments.push(seg);
        this._render();
        this._triggerChange();
        return id;
    };

    // Módosított modify: direction paraméter
    timeline.modify = function(id, from, to, direction) {
        const seg = this._segments.find(s => s.id === id);
        if (!seg) return false;
        seg.from = Math.max(0, Math.min(from, this._length));
        seg.to = Math.max(seg.from, Math.min(to, this._length));
        this._render();
        this._triggerChange(direction);
        return true;
    };

    timeline.remove = function(id) {
        this._segments = this._segments.filter(s => s.id !== id);
        if (this._selected === id) this._selected = null;
        this._render();
        this._triggerChange();
        return this;
    };

    timeline.clear = function() {
        this._segments = [];
        this._selected = null;
        this._render();
        this._triggerChange();
        return this;
    };

    timeline.clone = function(id, from) {
        const seg = this._segments.find(s => s.id === id);
        if (!seg) return null;
        const len = seg.to - seg.from;
        let newFrom = Math.max(0, Math.min(from, this._length - len));
        let newTo = newFrom + len;
        return this.add(newFrom, newTo, seg.type);
    };

    timeline.change = function(cb) {
        this._changeCb = cb;
        return this;
    };

    timeline.select = function(id) {
        this._selected = id;
        this._render();
        this._triggerChange(); // <-- change callback hívás
        return this;
    };

    timeline.deselect = function() {
        this._selected = null;
        this._render();
        this._triggerChange(); // <-- change callback hívás
        return this;
    };

    timeline.selected = function(cb) {
        const seg = this._segments.find(s => s.id === this._selected);
        if (seg && typeof cb === 'function') {
            cb(seg.id, seg.from, seg.to, seg.type);
        }
        return seg;
    };

    // Új: track setter/getter
    timeline.track = function(number) {
        if (typeof number === 'undefined') return this._maxTracks;
        this._maxTracks = Math.max(1, parseInt(number, 10));
        this._render();
        return this;
    };

    // Módosított _triggerChange: direction paraméter
    timeline._triggerChange = function(direction) {
        if (typeof this._changeCb === 'function') {
            this._changeCb(this._segments.slice(), direction);
        }
    };

    // Segmensek sávba rendezése (track assignment)
    function assignTracks(segments, maxTracks, movingId = null, movingFrom = null, movingTo = null) {
        let tracks = [];
        // Először minden szegmensnek töröljük a _track-et
        segments.forEach(seg => { seg._track = undefined; });

        // Mozgatott szegmens adatai, ha van
        let movingSeg = null;
        if (movingId && movingFrom !== null && movingTo !== null) {
            movingSeg = segments.find(s => s.id === movingId);
            if (movingSeg) {
                movingSeg._pendingFrom = movingFrom;
                movingSeg._pendingTo = movingTo;
            }
        }

        // Először a NEM mozgatott szegmenseket helyezzük el
        segments.forEach(seg => {
            if (movingSeg && seg.id === movingSeg.id) return; // kihagyjuk a mozgatottat
            let placed = false;
            if (typeof seg._forceTrack === 'number' && seg._forceTrack >= 0 && maxTracks) {
                let t = seg._forceTrack;
                if (t < maxTracks) {
                    if (!tracks[t]) tracks[t] = [];
                    let overlap = tracks[t].some(other =>
                        !(seg.to <= other.from || seg.from >= other.to)
                    );
                    if (!overlap) {
                        seg._track = t;
                        tracks[t].push(seg);
                        placed = true;
                    }
                }
            }
            if (!placed) {
                let limit = maxTracks || (tracks.length + 1);
                for (let t = 0; t < limit; t++) {
                    if (!tracks[t]) tracks[t] = [];
                    let overlap = tracks[t].some(other =>
                        !(seg.to <= other.from || seg.from >= other.to)
                    );
                    if (!overlap) {
                        seg._track = t;
                        tracks[t].push(seg);
                        placed = true;
                        break;
                    }
                }
            }
            if (!placed) {
                seg._track = -1;
            }
        });

        // Most a mozgatott szegmenst próbáljuk elhelyezni, csak oda, ahol nem lenne teljes overlap
        if (movingSeg) {
            let placed = false;
            let limit = maxTracks || (tracks.length + 1);
            for (let t = 0; t < limit; t++) {
                if (!tracks[t]) tracks[t] = [];
                let overlap = tracks[t].some(other =>
                    !(
                        (movingTo <= (other._pendingFrom ?? other.from)) ||
                        (movingFrom >= (other._pendingTo ?? other.to))
                    )
                );
                if (!overlap) {
                    movingSeg._track = t;
                    tracks[t].push(movingSeg);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                movingSeg._track = -1;
            }
            // Takarítsuk el a _pendingFrom/_pendingTo-t
            delete movingSeg._pendingFrom;
            delete movingSeg._pendingTo;
        }

        return tracks.length;
    }

    // --- Global drag/resize event cleanup ---
    let globalMouseMove = null, globalMouseUp = null;

    function cleanupListeners() {
        if (globalMouseMove) {
            document.removeEventListener('mousemove', globalMouseMove, true);
            globalMouseMove = null;
        }
        if (globalMouseUp) {
            document.removeEventListener('mouseup', globalMouseUp, true);
            globalMouseUp = null;
        }
        document.body.style.userSelect = '';
    }

    timeline._render = function() {
        bar.html('');
        tracksBar.html('');
        this._segments.sort((a, b) => a.from - b.from);

        // --- CSS-ből olvassuk ki a szegmens magasságot és margót ---
        const tempDiv = document.createElement('div');
        tempDiv.className = classes['media-timeline-segment'];
        document.body.appendChild(tempDiv);
        const segHeight = parseFloat(getComputedStyle(tempDiv).height) || 8;
        const segMargin = parseFloat(getComputedStyle(tempDiv).marginTop) || 2;
        document.body.removeChild(tempDiv);

        // Ha épp mozgatunk vagy resize-olunk, adjuk át a mozgatott szegmens adatait
        let movingId = null, movingFrom = null, movingTo = null;
        if (timeline._movingSeg) {
            movingId = timeline._movingSeg.id;
            movingFrom = timeline._movingSeg.from;
            movingTo = timeline._movingSeg.to;
        }

        // Track assignment minden render előtt
        const trackCount = assignTracks(
            this._segments,
            this._maxTracks,
            movingId,
            movingFrom,
            movingTo
        );

        // Sáv magasságok
        const maxTracks = this._maxTracks || trackCount || 1;
        const trackHeight = segHeight + 2 * segMargin + (parseFloat(getComputedStyle(document.body).getPropertyValue('--media-timeline-track-gap')) || 0);

        // Wrapper magasság automatikusan:
        const wrapperHeight = maxTracks * trackHeight;
        timeline.css('height', wrapperHeight + 'px');

        // Track vizuális sávok
        for (let t = 0; t < maxTracks; t++) {
            const top = (t * trackHeight) + 'px';
            const height = trackHeight + 'px';
            const row = Q(`<div class="${classes['media-timeline-track-row']}" style="top:${top};height:${height};"></div>`);
            const label = Q(`<div class="${classes['media-timeline-track-label']}" style="top:${top};">${t + 1}</div>`);
            tracksBar.append(row);
            tracksBar.append(label);
        }

        // Deselect if clicking on empty track area
        bar.off('mousedown', bar._timelineDeselectHandler);
        bar._timelineDeselectHandler = function(e) {
            // Only deselect if not on a segment or handle
            if (
                !e.target.classList.contains(classes['media-timeline-segment']) &&
                !e.target.classList.contains(classes['media-timeline-handle'])
            ) {
                timeline.deselect();
            }
        };
        bar.on('mousedown', bar._timelineDeselectHandler);

        // Build a map of current segment nodes
        const barChildren = bar.children();
        const segNodeMap = {};
        if (barChildren && barChildren.nodes) {
            for (let i = 0; i < barChildren.nodes.length; i++) {
                const n = barChildren.nodes[i];
                if (n.dataset && n.dataset.segId) segNodeMap[n.dataset.segId] = n;
            }
        }
        const used = {};

        for (const seg of this._segments) {
            if (seg._track === -1 || typeof seg._track !== 'number') continue;
            const left = (seg.from / this._length * 100).toFixed(2) + '%';
            const width = ((seg.to - seg.from) / this._length * 100).toFixed(2) + '%';
            const top = (seg._track * trackHeight) + 'px';
            const height = segHeight + 'px';

            // --- Apply all mapped classes for type and selection ---
            const typeClass = classes[seg.type] || '';
            const selectedClass = this._selected === seg.id ? classes['selected'] : '';
            const segClass = [
                classes['media-timeline-segment'],
                typeClass,
                selectedClass
            ].filter(Boolean).join(' ');

            let segDiv = segNodeMap && segNodeMap[seg.id];
            if (segDiv) {
                Q(segDiv).css({ left, width, top, height });
                segDiv.className = segClass;
                used[seg.id] = true;
            } else {
                segDiv = Q(`<div class="${segClass}" style="left:${left};width:${width};top:${top};height:${height};"></div>`);
                const handleL = Q(`<div class="${classes['media-timeline-handle']} ${classes['left']}"></div>`);
                const handleR = Q(`<div class="${classes['media-timeline-handle']} ${classes['right']}"></div>`);
                segDiv.append(handleL, handleR);

                // --- Left handle resize ---
                handleL.on('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    cleanupListeners();
                    timeline.select(seg.id); // always select on handle
                    let startX = e.clientX, startFrom = seg.from;
                    document.body.style.userSelect = 'none';
                    globalMouseMove = ev => {
                        let dx = ev.clientX - startX;
                        let percent = dx / bar.nodes[0].offsetWidth;
                        let ms = Math.round(startFrom + percent * this._length);
                        ms = Math.max(0, Math.min(ms, seg.to - 1));
                        timeline.modify(seg.id, ms, seg.to, "left");
                    };
                    globalMouseUp = () => {
                        cleanupListeners();
                        timeline._render();
                    };
                    document.addEventListener('mousemove', globalMouseMove, true);
                    document.addEventListener('mouseup', globalMouseUp, true);
                });

                // --- Right handle resize ---
                handleR.on('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    cleanupListeners();
                    timeline.select(seg.id); // always select on handle
                    let startX = e.clientX, startTo = seg.to;
                    document.body.style.userSelect = 'none';
                    globalMouseMove = ev => {
                        let dx = ev.clientX - startX;
                        let percent = dx / bar.nodes[0].offsetWidth;
                        let ms = Math.round(startTo + percent * this._length);
                        ms = Math.max(seg.from + 1, Math.min(ms, this._length));
                        timeline.modify(seg.id, seg.from, ms, "right");
                    };
                    globalMouseUp = () => {
                        cleanupListeners();
                        timeline._render();
                    };
                    document.addEventListener('mousemove', globalMouseMove, true);
                    document.addEventListener('mouseup', globalMouseUp, true);
                });

                // --- Drag & drop szegmens ---
                segDiv.on('mousedown', e => {
                    if (e.target.classList.contains(classes['media-timeline-handle'])) return;
                    cleanupListeners();
                    timeline.select(seg.id);
                    let dragStartX = e.clientX;
                    let origFrom = seg.from, origTo = seg.to;
                    document.body.style.userSelect = 'none';
                    timeline._movingSeg = seg; // Mozgatott szegmens referenciája
                    globalMouseMove = ev => {
                        let dx = ev.clientX - dragStartX;
                        let percent = dx / bar.nodes[0].offsetWidth;
                        let deltaMs = Math.round(percent * this._length);
                        let newFrom = origFrom + deltaMs;
                        let newTo = origTo + deltaMs;
                        if (newFrom < 0) {
                            newTo += -newFrom;
                            newFrom = 0;
                        }
                        if (newTo > this._length) {
                            newFrom -= (newTo - this._length);
                            newTo = this._length;
                        }
                        if (newTo - newFrom < 1) return;
                        seg.from = newFrom;
                        seg.to = newTo;
                        timeline._render();
                    };
                    globalMouseUp = () => {
                        cleanupListeners();
                        // Véglegesítsük a mozgatást
                        delete timeline._movingSeg;
                        timeline.modify(seg.id, seg.from, seg.to, "move");
                    };
                    document.addEventListener('mousemove', globalMouseMove, true);
                    document.addEventListener('mouseup', globalMouseUp, true);
                });

                bar.append(segDiv);
                used[seg.id] = true;
            }
        }

        // Remove unused segment nodes
        for (const segId in segNodeMap) {
            if (!used[segId]) {
                Q(segNodeMap[segId]).remove();
            }
        }
    };

    return timeline;
};

// if (typeof Q.Media === "function") {
//     Q.Media.prototype.Timeline = function(container, options) {
//         return Q.Media.Timeline(container, options);
//     };
// }