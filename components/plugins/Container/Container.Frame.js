Container.prototype.Frame = function(options = {}) {
    const self = this;

    // All possible settings/options for Container.Frame
    const defaultOptions = {
        direction: 'horizontal', // 'horizontal' or 'vertical'
        id: "ok",                // unique id for saving/restoring positions
        savePosition: true,      // save/restore frame sizes in localStorage
        minSize: 20,             // minimum size in px for a frame section
        responsive: true,
        responsivesMaxCount: 5, // maximum number of responsive frames
        responsiveAnimation: 250,
        responsiveAnimationEasing: 'ease-in-out',
        storageKey: "settings.frames"
    };

    // Merge defaultOptions with user-provided options (user options override defaults)
    options = Object.assign({}, defaultOptions, options);

    // CSS classes via Q.style
    if (!Container.frameClassesInitialized) {
        Container.frameClasses = Q.style('', `
            .frame_root {
                display: flex;
                width: 100%;
                height: 100%;
                min-height: 100px;
                min-width: 100px;
                border-radius: 6px;
                overflow: hidden;
                position: relative;
            }
            .frame_horizontal {
                flex-direction: row;
            }
            .frame_vertical {
                flex-direction: column;
            }
            .frame_section {
                position: relative;
                overflow: auto;
                min-width: 20px;
                min-height: 20px;
            }
            .frame_resizer {
                background: var(--form-default-accent-color, #444);
                opacity: 0.2;
                z-index: 10;
                position: relative;
                user-select: none;
            }
            .frame_resizer_horizontal {
                width: 3px;
                cursor: col-resize;
            }
            .frame_resizer_vertical {
                height: 3px;
                cursor: row-resize;
            }
            .frame_resizer:hover {
                opacity: 0.5;
            }

        `, null, {
            'frame_root': 'frame_root',
            'frame_horizontal': 'frame_horizontal',
            'frame_vertical': 'frame_vertical',
            'frame_section': 'frame_section',
            'frame_resizer': 'frame_resizer',
            'frame_resizer_horizontal': 'frame_resizer_horizontal',
            'frame_resizer_vertical': 'frame_resizer_vertical'
        },false);
        Container.frameClassesInitialized = true;
    }

    let direction = options.direction === 'vertical' ? 'vertical' : 'horizontal';
    const root = Q('<div>', { class: Container.frameClasses.frame_root });
    root.addClass(direction === 'horizontal' ? Container.frameClasses.frame_horizontal : Container.frameClasses.frame_vertical);

    // --- Új: azonosító és mentés opciók ---
    const frameId = options.id || null;
    const savePosition = !!options.savePosition;
    const storageKey = options.storageKey;
    const minSize = options.minSize;
    const responsive = !!options.responsive;
    const responsivesMaxCount = options.responsivesMaxCount || 5;

    // Helper: get/set/törlés a localStorage-ból Q.Storage segítségével
    function getSavedFrames() {
        return Q.Storage(storageKey) || {};
    }
    function saveFrames(framesObj) {
        console.log('Saving frames:', framesObj);
        Q.Storage(storageKey, framesObj);
    }
    function clearFramePos(id) {
        const all = getSavedFrames();
        if (all[id]) {
            delete all[id];
            saveFrames(all);
        }
    }

    // Helper: get current screen size (width or height), bucketed by 100
    function getScreenSizeBucket() {
        const px = direction === 'horizontal'
            ? window.innerWidth
            : window.innerHeight;
        return Math.floor(px / 100); // pl. 1842 -> 18
    }

    // Helper: find saved size by bucket
    function findSavedSizeByBucket(saved, bucket) {
        if (!saved || !Array.isArray(saved) || saved.length === 0) return null;
        for (let i = 0; i < saved.length; ++i) {
            const entry = saved[i];
            if (entry && typeof entry.screenSizeBucket === 'number' && entry.screenSizeBucket === bucket) {
                return entry;
            }
        }
        return null;
    }

    // API: frame.direction(...)
    root.direction = function(dir) {
        direction = dir === 'vertical' ? 'vertical' : 'horizontal';
        root.removeClass(Container.frameClasses.frame_horizontal + ' ' + Container.frameClasses.frame_vertical);
        root.addClass(direction === 'horizontal' ? Container.frameClasses.frame_horizontal : Container.frameClasses.frame_vertical);
        return this;
    };

    // --- Új: clearPos metódus ---
    root.clearPos = function() {
        if (frameId) clearFramePos(frameId);
        return this;
    };

    // API: frame.frames([...])
    root.frames = function(frameDefs) {
        root.empty();
        const frameMap = {};
        let totalFlex = 0;

        // Store frameDefs in a private property on root for later access
        root._frameDefs = frameDefs;

        // Pre-calc flex basis for frames with size
        frameDefs.forEach(def => {
            if (def.size && typeof def.size === 'string' && def.size.endsWith('%')) {
                totalFlex += parseFloat(def.size);
            }
        });
        // If no size, default to equal split
        const defaultSize = frameDefs.length > 0 ? (100 - totalFlex) / frameDefs.filter(f => !f.size).length : 100;

        // --- Új: betöltjük a mentett pozíciókat ---
        let savedSizes = null;
        let savedResponsiveList = null;
        let currentScreenSizeBucket = getScreenSizeBucket();
        if (savePosition && frameId) {
            const all = getSavedFrames();
            if (all[frameId]) {
                if (responsive && Array.isArray(all[frameId].responsive)) {
                    savedResponsiveList = all[frameId].responsive;
                    const found = findSavedSizeByBucket(savedResponsiveList, currentScreenSizeBucket);
                    if (found && Array.isArray(found.sizes) && found.sizes.length === frameDefs.length) {
                        savedSizes = found.sizes;
                    }
                } else if (Array.isArray(all[frameId].sizes) && all[frameId].sizes.length === frameDefs.length) {
                    savedSizes = all[frameId].sizes;
                }
            }
        }

        // Store Q objects for each section and resizer
        const sections = [];
        const resizers = [];
        frameDefs.forEach((def, idx) => {
            const section = Q('<div>', { class: Container.frameClasses.frame_section });
            // Remove data-name for security, use frameMap and root._frameDefs for lookup
            // section.attr('data-name', def.name || ('frame' + idx));
            // Set initial size
            let sizeVal = null;
            if (savedSizes && savedSizes[idx]) {
                sizeVal = savedSizes[idx];
            } else if (def.size) {
                sizeVal = def.size;
            } else {
                sizeVal = defaultSize + '%';
            }
            if (direction === 'horizontal') section.css('width', sizeVal);
            else section.css('height', sizeVal);

            // Store for API
            frameMap[def.name] = section;
            sections.push(section);

            // Append section
            root.append(section);

            // Add resizer if needed (not after last frame)
            if (def.resize && idx < frameDefs.length - 1) {
                const resizer = Q('<div>', { class: Container.frameClasses.frame_resizer });
                resizer.addClass(direction === 'horizontal' ? Container.frameClasses.frame_resizer_horizontal : Container.frameClasses.frame_resizer_vertical);

                // Drag logic
                resizer.on('mousedown', function(e) {
                    e.preventDefault();
                    const prev = section;
                    const next = sections[idx + 1];
                    if (!prev || !next) return;

                    // Get parent size for percent calculations
                    const parent = root.nodes[0];
                    const isHorizontal = direction === 'horizontal';

                    // Initial sizes in px and percent
                    const prevRect = prev.nodes[0].getBoundingClientRect();
                    const nextRect = next.nodes[0].getBoundingClientRect();
                    const parentPx = isHorizontal ? parent.clientWidth : parent.clientHeight;

                    // Initial percent sizes
                    const prevPercent = (isHorizontal ? prevRect.width : prevRect.height) / parentPx * 100;
                    const nextPercent = (isHorizontal ? nextRect.width : nextRect.height) / parentPx * 100;

                    const startX = e.clientX, startY = e.clientY;

                    function onMove(ev) {
                        // Calculate delta in px
                        let deltaPx = isHorizontal ? ev.clientX - startX : ev.clientY - startY;
                        // Calculate new percent sizes
                        let newPrevPercent = prevPercent + (deltaPx / parentPx) * 100;
                        let newNextPercent = nextPercent - (deltaPx / parentPx) * 100;
                        // Minimum size in percent
                        const minPercent = minSize / parentPx * 100;
                        if (newPrevPercent < minPercent) {
                            newNextPercent -= (minPercent - newPrevPercent);
                            newPrevPercent = minPercent;
                        }
                        if (newNextPercent < minPercent) {
                            newPrevPercent -= (minPercent - newNextPercent);
                            newNextPercent = minPercent;
                        }
                        // Apply new sizes
                        if (isHorizontal) {
                            prev.css('width', newPrevPercent + '%');
                            next.css('width', newNextPercent + '%');
                        } else {
                            prev.css('height', newPrevPercent + '%');
                            next.css('height', newNextPercent + '%');
                        }
                    }
                    function onUp() {
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                        // Use the single saveCurrentSizes function
                        saveCurrentSizes();
                    }
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                });
                root.append(resizer);
                resizers.push(resizer); // Store reference
            }
        });

        // --- Responsive resize handler ---
        if (responsive && frameId) {
            let lastScreenSizeBucket = currentScreenSizeBucket;
            let lastFrameDefs = frameDefs;
            Q.Resize(function handleResize() {
                Q.Debounce('frame-resize-' + frameId, 250, function () {
                    const newScreenSizeBucket = getScreenSizeBucket();
                    if (newScreenSizeBucket !== lastScreenSizeBucket) {
                        const all = getSavedFrames();
                        let responsiveArr = (all[frameId] && Array.isArray(all[frameId].responsive)) ? all[frameId].responsive : [];
                        const found = findSavedSizeByBucket(responsiveArr, newScreenSizeBucket);
                        if (found && Array.isArray(found.sizes) && found.sizes.length === lastFrameDefs.length) {
                            // Apply saved sizes with animation
                            for (let i = 0; i < sections.length; ++i) {
                                const sec = sections[i];
                                const sizeVal = found.sizes[i];
                                if (direction === 'horizontal') {
                                    sec.css({
                                        transition: `width ${options.responsiveAnimation}ms ${options.responsiveAnimationEasing}`
                                    });
                                    sec.css('width', sizeVal);
                                } else {
                                    sec.css({
                                        transition: `height ${options.responsiveAnimation}ms ${options.responsiveAnimationEasing}`
                                    });
                                    sec.css('height', sizeVal);
                                }
                                // Remove transition after animation completes
                                setTimeout(() => {
                                    if (direction === 'horizontal') {
                                        sec.css('transition', '');
                                    } else {
                                        sec.css('transition', '');
                                    }
                                }, options.responsiveAnimation + 10);
                            }
                        } else {
                            // Nincs találat: állítsd vissza az alapértelmezett méretet animációval
                            let totalFlex = 0;
                            lastFrameDefs.forEach(def => {
                                if (def.size && typeof def.size === 'string' && def.size.endsWith('%')) {
                                    totalFlex += parseFloat(def.size);
                                }
                            });
                            const defaultSize = lastFrameDefs.length > 0 ? (100 - totalFlex) / lastFrameDefs.filter(f => !f.size).length : 100;
                            for (let i = 0; i < sections.length; ++i) {
                                let sizeVal = lastFrameDefs[i].size ? lastFrameDefs[i].size : (defaultSize + '%');
                                const sec = sections[i];
                                if (direction === 'horizontal') {
                                    sec.css({
                                        transition: `width ${options.responsiveAnimation}ms ${options.responsiveAnimationEasing}`
                                    });
                                    sec.css('width', sizeVal);
                                } else {
                                    sec.css({
                                        transition: `height ${options.responsiveAnimation}ms ${options.responsiveAnimationEasing}`
                                    });
                                    sec.css('height', sizeVal);
                                }
                                setTimeout(() => {
                                    if (direction === 'horizontal') {
                                        sec.css('transition', '');
                                    } else {
                                        sec.css('transition', '');
                                    }
                                }, options.responsiveAnimation + 10);
                            }
                        }
                        lastScreenSizeBucket = newScreenSizeBucket;
                    }
                });
            });
        }

        // --- Save sizes helper (single definition) ---
        function saveCurrentSizes() {
            if (savePosition && frameId) {
                const sizes = sections.map(sec => {
                    if (direction === 'horizontal') {
                        const px = sec.nodes[0].getBoundingClientRect().width;
                        const parentPx = root.nodes[0].clientWidth;
                        return (px / parentPx * 100) + '%';
                    } else {
                        const px = sec.nodes[0].getBoundingClientRect().height;
                        const parentPx = root.nodes[0].clientHeight;
                        return (px / parentPx * 100) + '%';
                    }
                });
                const all = getSavedFrames();
                if (responsive) {
                    let responsiveArr = (all[frameId] && Array.isArray(all[frameId].responsive)) ? all[frameId].responsive : [];
                    const screenSizeBucket = getScreenSizeBucket();
                    // Remove any entry with same bucket
                    responsiveArr = responsiveArr.filter(entry => entry.screenSizeBucket !== screenSizeBucket);
                    // Limit to responsivesMaxCount - 1 before push (so after push it's max)
                    if (responsiveArr.length >= responsivesMaxCount) {
                        // Remove the oldest (first) entry
                        responsiveArr.shift();
                    }
                    responsiveArr.push({ screenSizeBucket, sizes });
                    all[frameId] = { responsive: responsiveArr };
                } else {
                    all[frameId] = { sizes };
                }
                saveFrames(all);
            }
        }

        // Attach sections and frameMap for programmatic access
        root._frameSections = sections;
        root._frameMap = frameMap;

        // Új: resize metódus a példányon
        root.resize = function(name, size) {
            if (root._frameMap && root._frameMap[name]) {
                const section = root._frameMap[name].nodes[0];
                const isHorizontal = root.hasClass(Container.frameClasses.frame_horizontal);
                if (isHorizontal) {
                    section.style.width = typeof size === 'number' ? size + 'px' : size;
                } else {
                    section.style.height = typeof size === 'number' ? size + 'px' : size;
                }
            }
            return this;
        };

        // API: frames["name"].append(...), .empty(), .html(), etc. (Q methods)
        // No need to override .append, just return the Q object for each frame

        return frameMap;
    };

    this.elements.push(root);
    return root;
};
