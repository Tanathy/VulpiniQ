Media.prototype.Video = function(container, options = {}) {

    // Q.style: csak CSS, nincs inline style
    if (!Media.videoClassesInitialized) {
        Media.videoClasses = Q.style(`
            --media-video-bg: #000;
            --media-video-seekbar-bg: #222;
            --media-video-seekbar-tr-color: #5af;
            --media-video-seekbar-th-color: #fff;
            --media-video-seekbar-group-bg: rgba(0,0,0,0.1);
        `, `
            .media-video-wrapper {
                width: 100%;
                height: 100%;
                background: var(--media-video-bg, #000);
                position: relative;
                display: block;
                overflow: hidden;
            }
            .media-video-element {
                width: 100%;
                height: 100%;
                display: block;
                background: var(--media-video-bg, #000);
                object-fit: contain;
            }
            .media-video-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .media-video-seek-group {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0;
                margin-bottom: 6px;
                background: var(--media-video-seekbar-group-bg, #000);
            }
            .media-video-seek-scale {
                width: 100%;
                position: relative;
                height: 8px;
            }
            .media-video-seekbar {
                width: 100%;
                height: 10px;
                position: relative;
                cursor: pointer;
                background: var(--media-video-seekbar-bg, #222);
                overflow: hidden;
            }
            .media-video-seekbar-track {
                position: absolute;
                left: 0; top: 0;
                height: 100%;
                background: var(--media-video-seekbar-tr-color, #5af);
                width: 0;
            }
            .media-video-seekbar-thumb {
                position: absolute;
                top: 50%;
                width: 1px;
                height: 20px;
                background: var(--media-video-seekbar-th-color, #fff);
                border-radius: 4px;
                box-shadow: 0 2px 8px #0008;
                transform: translate(-50%,-50%);
            }
            .media-video-seek-info {
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                font-family: monospace;
                color: #ccc;
                margin-top: 2px;
            }
            .media-video-loader-overlay {
                position: absolute;
                left: 0; top: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                flex-direction: column;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.25s;                                                                                                               
            }
            .media-video-loader-overlay.visible {
                opacity: 1;
                pointer-events: auto;
            }
            .media-video-loader {
                --c:no-repeat linear-gradient(white 0 0);
                opacity: 0.5;
                background: 
                    var(--c),var(--c),var(--c),
                    var(--c),var(--c),var(--c),
                    var(--c),var(--c),var(--c);
                background-size: 16px 16px;
                animation: 
                    l32-1 1s infinite,
                    l32-2 1s infinite;
                margin-bottom: 12px;
            }
            @keyframes l32-1 {
                0%,100% {width:45px;height: 45px}
                35%,65% {width:65px;height: 65px}
            }
            @keyframes l32-2 {
                0%,40%  {background-position: 0 0,0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,0 0,  50% 50% }
                60%,100%{background-position: 0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,0 0,  50% 50% }
            }
        `, null, {
            'media-video-wrapper': 'media-video-wrapper',
            'media-video-element': 'media-video-element',
            'media-video-controls': 'media-video-controls',
            'media-video-seek-scale': 'media-video-seek-scale',
            'media-video-seekbar-track': 'media-video-seekbar-track',
            'media-video-seekbar-thumb': 'media-video-seekbar-thumb',
            'media-video-seekbar': 'media-video-seekbar',
            'media-video-seek-info': 'media-video-seek-info',
            'media-video-loader-overlay': 'media-video-loader-overlay',
            'media-video-loader': 'media-video-loader',
            'media-video-seek-group': 'media-video-seek-group',
        },false);
        Media.videoClassesInitialized = true;
    }
    const classes = Media.videoClasses;

    // DOM felépítés Q-val
    const wrapper = Q(`<div class="${classes['media-video-wrapper']}"></div>`);
    const video = Q(`<video class="${classes['media-video-element']}" preload="auto"></video>`);
    wrapper.append(video);
    Q(container).append(wrapper);

    // Loader overlay
    const loaderOverlay = Q(`<div class="${classes['media-video-loader-overlay']}" style="display:none"></div>`);
    const loaderAnim = Q(`<div class="${classes['media-video-loader']}"></div>`);
    loaderOverlay.append(loaderAnim);
    wrapper.append(loaderOverlay);

    // Overlay support
    let _customOverlay = null;

    // Belső állapot
    let _status = "idle";
    let _timetick = null;
    let _statuscb = null;
    let _loop = false;
    let _tickRAF = null;
    let _autostart = false;
    let _playTo = null;
    let _networkTimeout = null;
    let _fpsSamples = [];

    // Loader megjelenítés/eltüntetés animációval és timeout
    function updateLoader(st) {
        // Loader csak loading/buffering/seeking alatt látszik
        if (st === "loading" || st === "buffering" || st === "seeking") {
            if (loaderOverlay.css('display') === 'none') {
                loaderOverlay.css('display', 'flex');
                setTimeout(() => loaderOverlay.addClass('visible'), 10);
            } else {
                loaderOverlay.addClass('visible');
            }
            // 30s timeout csak ha tényleg loading/buffering/seeking
            if (_networkTimeout) clearTimeout(_networkTimeout);
            _networkTimeout = setTimeout(() => {
                // Ha még mindig loading/buffering/seeking, akkor networkfail
                if (_status === "loading" || _status === "buffering" || _status === "seeking") {
                    setStatus("networkfail");
                }
            }, 30000);
        } else {
            // Ha nem loading/buffering/seeking, loader mindig tűnjön el
            loaderOverlay.removeClass('visible');
            loaderOverlay.nodes[0].addEventListener('transitionend', function handler(e) {
                if (!loaderOverlay.hasClass('visible')) {
                    loaderOverlay.css('display', 'none');
                }
                loaderOverlay.nodes[0].removeEventListener('transitionend', handler);
            });
            // Bármilyen más státusznál timeout törlés
            if (_networkTimeout) {
                clearTimeout(_networkTimeout);
                _networkTimeout = null;
            }
        }
    }

    // Status change handler
    const statusMap = {
        "playing": "playing",
        "pause": "paused",
        "ended": "ended",
        "waiting": "buffering",
        "seeking": "seeking",
        "canplay": "ready",
        "canplaythrough": "ready",
        "loadstart": "loading",
        "error": "failed",
        "stalled": "networkfail",
        "suspend": "networkfail"
    };
    function setStatus(st) {
        // Ha ready/play/pause/ended, loader mindig tűnjön el, timeout törlődjön
        if (st === "ready" || st === "playing" || st === "paused" || st === "ended") {
            if (_networkTimeout) {
                clearTimeout(_networkTimeout);
                _networkTimeout = null;
            }
            loaderOverlay.removeClass('visible');
            loaderOverlay.css('display', 'none');
        }
        if (_status !== st) {
            _status = st;
            if (_statuscb) _statuscb(st);
        }
        // Csak akkor hívjuk updateLoader-t, ha nem ready/play/pause/ended
        if (!(st === "ready" || st === "playing" || st === "paused" || st === "ended")) {
            updateLoader(st);
        }
    }

    const updateStatus = (evt) => {
        let st = statusMap[evt.type] || evt.type;
        // Special error handling
        if (evt.type === "error") {
            const err = video.nodes[0].error;
            if (err) {
                if (err.code === 2) st = "networkfail";
                else st = "failed";
            } else {
                st = "failed";
            }
        }
        // Ha loop aktív és ended után azonnal canplay jön, maradjon playing státusz
        if ((evt.type === "canplay" || evt.type === "canplaythrough")) {
            if (_loop && _status === "ended") {
                st = "playing";
            } else if (video.nodes[0].paused) {
                st = "ready";
            } else if (!video.nodes[0].paused) {
                // Ha nem paused, hanem ténylegesen lejátszik, akkor playing
                st = "playing";
            }
        }
        // Ha sebességváltás közben (ratechange) vagyunk, és a video nem paused, akkor is playing
        if (evt.type === "ratechange" && !video.nodes[0].paused) {
            st = "playing";
        }
        setStatus(st);
    };

    ["playing", "pause", "ended", "waiting", "seeking", "canplay", "canplaythrough", "loadstart", "error", "stalled", "suspend", "ratechange"].forEach(ev =>
        video.on(ev, updateStatus)
    );

    // Timetick
    const tick = () => {
        if (_timetick && !video.nodes[0].paused && !video.nodes[0].ended) {
            _timetick(instance.pos());
        }
        // FPS mintavételezés
        const v = video.nodes[0];
        let frames = null;
        if (typeof v.getVideoPlaybackQuality === "function") {
            const q = v.getVideoPlaybackQuality();
            frames = q.totalVideoFrames || q.totalFrameCount || null;
        } else if (typeof v.webkitDecodedFrameCount === "number") {
            frames = v.webkitDecodedFrameCount;
        } else if (typeof v.mozDecodedFrames === "number") {
            frames = v.mozDecodedFrames;
        }
        if (frames !== null) {
            const now = performance.now();
            _fpsSamples.push({ t: now, f: frames });
            // Csak az utolsó 1000ms mintáit tartsuk meg
            while (_fpsSamples.length > 2 && (_fpsSamples[0].t < now - 1000)) {
                _fpsSamples.shift();
            }
        }
        // Play-to logic: from-to limit, loop if needed
        const from = typeof instance._playFrom === "number" ? instance._playFrom : 0;
        const to = typeof instance._playTo === "number" ? instance._playTo : null;
        if (to !== null && !video.nodes[0].paused && !video.nodes[0].ended) {
            if (instance.pos() >= to) {
                if (_loop) {
                    instance.seek(from);
                    video.nodes[0].play();
                } else {
                    video.nodes[0].pause();
                    instance._playTo = null;
                    instance._playFrom = 0;
                }
            }
        }
        _tickRAF = requestAnimationFrame(tick);
    };

    video.on("play", () => {
        if (!_tickRAF) _tickRAF = requestAnimationFrame(tick);
    });
    video.on("pause", () => {
        if (_tickRAF) { cancelAnimationFrame(_tickRAF); _tickRAF = null; }
    });
    video.on("ended", () => {
        if (_tickRAF) { cancelAnimationFrame(_tickRAF); _tickRAF = null; }
        if (_loop) instance.play();
    });

    // Metódusok hozzárendelése a példányhoz (mint Timeline-nál)
    const instance = wrapper;
    instance.load = function(url) {
        // URL csere esetén video újratöltése, buffer ürítése
        video.attr('src', '');
        video.nodes[0].removeAttribute('src');
        video.nodes[0].load();
        video.attr('src', url);
        video.nodes[0].load();
        setStatus("loading");
        if (_autostart) {
            video.nodes[0].play();
        }
        return instance;
    };
    instance.play = function(from, to) {
        // Always allow play() or play(from,to) even during playback
        console.log("play", from, to);
        let videoLen = instance.length();
        if (typeof from === "number") {
            instance.seek(from);
            instance._playFrom = from;
        } else {
            instance._playFrom = 0;
        }
        if (typeof to === "number" && to > (typeof from === "number" ? from : 0)) {
            instance._playTo = Math.min(to, videoLen);
        } else {
            instance._playTo = null;
        }
        video.nodes[0].play();
        return instance;
    };
    instance.stop = function() {
        video.nodes[0].pause();
        instance._playTo = null;
        instance._playFrom = 0;
        instance.seek(0);
        return instance;
    };
    instance.pause = function() {
        video.nodes[0].pause();
        instance._playTo = null;
        instance._playFrom = 0;
        return instance;
    };
    instance.seek = function(ms) {
        video.nodes[0].currentTime = ms / 1000;
        return instance;
    };
    instance.speed = function(val) {
        if (val === undefined) return video.nodes[0].playbackRate;
        video.nodes[0].playbackRate = Math.max(0.1, Math.min(10, val));
        return instance;
    };
    instance.loop = function(enable) {
        if (enable === undefined) return _loop;
        _loop = !!enable;
        video.nodes[0].loop = false; // always false, we handle loop logic for both full and from-to
        return instance;
    };
    instance.volume = function(val) {
        if (val === undefined) return video.nodes[0].volume;
        video.nodes[0].volume = Math.max(0, Math.min(1, val));
        return instance;
    };
    instance.resolution = function() {
        return {
            width: video.nodes[0].videoWidth,
            height: video.nodes[0].videoHeight
        };
    };
    instance.bounds = function() {
        const rect = video.nodes[0].getBoundingClientRect();
        const parent = wrapper.nodes[0].getBoundingClientRect();
        return {
            width: ((rect.width / parent.width) * 100) || 0,
            height: ((rect.height / parent.height) * 100) || 0,
            left: ((rect.left - parent.left) / parent.width * 100) || 0,
            top: ((rect.top - parent.top) / parent.height * 100) || 0
        };
    };
    instance.length = function() {
        return Math.round((video.nodes[0].duration || 0) * 1000);
    };
    instance.pos = function() {
        return Math.round((video.nodes[0].currentTime || 0) * 1000);
    };
    instance.timetick = function(cb) {
        _timetick = typeof cb === "function" ? cb : null;
        return instance;
    };
    instance.status = function(cb) {
        _statuscb = typeof cb === "function" ? cb : null;
        return instance;
    };
    instance.autostart = function(val) {
        if (val === undefined) return _autostart;
        _autostart = !!val;
        return instance;
    };
    instance.control = function() {
        // Minden elem Q-val, csak class, nincs .css()
        const frag = Q(`<div class="${classes['media-video-controls']}"></div>`);
        // Play
        const btnPlay = Q('<button>').text("Play").on('click', () => instance.play());
        // Pause
        const btnPause = Q('<button>').text("Pause").on('click', () => instance.pause());
        // Stop
        const btnStop = Q('<button>').text("Stop").on('click', () => instance.stop());

        // Define a single Q.Form instance for all controls
        const form = Q.Form ? new Q.Form() : null;

        // Volume - csak Form.Slider
        let volSlider = null;
        if (form && form.Slider) {
            volSlider = form.Slider(instance.volume(), { min: 0, max: 1 });
            volSlider.change(function(val) {
                instance.volume(parseFloat(val));
            });
            video.on('volumechange', function() {
                volSlider.val(instance.volume());
            });
        }

        // Speed dropdown Q.Form - max 5x
        const speedValues = [
            { value: 0.1, text: "0.1x" },
            { value: 0.25, text: "0.25x" },
            { value: 0.5, text: "0.5x" },
            { value: 0.75, text: "0.75x" },
            { value: 1, text: "1x" },
            { value: 1.5, text: "1.5x" },
            { value: 2, text: "2x" },
            { value: 2.5, text: "2.5x" },
            { value: 5, text: "5x" }
        ];
        let initialSpeedIdx = speedValues.findIndex(v => v.value === instance.speed());
        if (initialSpeedIdx === -1) initialSpeedIdx = 4; // default 1x

        let speedDropdown = null;
        if (form && form.Dropdown) {
            speedDropdown = form.Dropdown({
                values: speedValues.map((v, i) => ({
                    value: v.value,
                    text: v.text,
                    default: i === initialSpeedIdx
                })),
                change: function(val) {
                    instance.speed(parseFloat(val));
                }
            });
        }

        // Loop
        const loop = Q('<input type="checkbox">')
            .prop('checked', instance.loop())
            .attr('title', 'Loop')
            .on('change', function() { instance.loop(this.checked); });
        const loopLbl = Q('<label>').append(loop, document.createTextNode(" Loop"));

        // Autostart
        const auto = Q('<input type="checkbox">')
            .prop('checked', instance.autostart())
            .attr('title', 'Autostart')
            .on('change', function() { instance.autostart(this.checked); });
        const autoLbl = Q('<label>').append(auto, document.createTextNode(" Autostart"));

        // Default sorrend: Play, Pause, Stop, Volume, Speed, Loop, Autostart
        if (btnPlay) frag.append(btnPlay);
        if (btnPause) frag.append(btnPause);
        if (btnStop) frag.append(btnStop);
        if (volSlider) frag.append(volSlider);
        if (speedDropdown) frag.append(speedDropdown);
        frag.append(loopLbl);
        frag.append(autoLbl);

        // --- SEEKBAR + SCALE ---
        // Helper: idő formázás
        function fmt(ms) {
            ms = Math.max(0, Math.round(ms));
            let s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
            let ms3 = (ms % 1000).toString().padStart(3, '0');
            s = s % 60; m = m % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms3}`;
        }

        // Seekbar scale (skála)
        const seekScale = Q(`<div class="${classes['media-video-seek-scale']}"></div>`);
        function renderScale() {
            seekScale.html('');
            const len = instance.length();
            const scaleDiv = Q('<div style="position:absolute;left:0;top:0;width:100%;height:100%;"></div>');
            const scaleHeight = parseFloat(seekScale.css('height')) || 8;
            for (let ms = 0; ms <= len; ms += 30000) {
                const isMinute = ms % 60000 === 0;
                const left = (ms / len * 100).toFixed(2) + '%';
                const height = isMinute ? scaleHeight : scaleHeight * 0.5;
                const top = isMinute ? 0 : (scaleHeight * 0.5) + 'px';
                const mark = Q('<div>')
                    .css({
                        position: 'absolute',
                        left: left,
                        top: top,
                        width: '1px',
                        height: height + 'px',
                        background: isMinute ? '#fff' : '#aaa',
                        opacity: isMinute ? 0.8 : 0.5
                    });
                scaleDiv.append(mark);
            }
            seekScale.append(scaleDiv);
        }

        // Seekbar (custom, nem Form.Slider)
        const seekBar = Q(`<div class="${classes['media-video-seekbar']}"></div>`);
        const seekTrack = Q(`<div class="${classes['media-video-seekbar-track']}"></div>`);
        const seekThumb = Q(`<div class="${classes['media-video-seekbar-thumb']}"></div>`);
        seekBar.append(seekTrack, seekThumb);

        // Seek info (alatta)
        const seekInfo = Q(`<div class="${classes['media-video-seek-info']}"></div>`);
        const seekLeft = Q('<div>').css({flex:'1',textAlign:'left'});
        const seekCenter = Q('<div>').css({flex:'1',textAlign:'center'});
        const seekRight = Q('<div>').css({flex:'1',textAlign:'right'});
        seekInfo.append(seekLeft, seekCenter, seekRight);

        // Seek group wrapper
        const seekGroup = Q(`<div class="${classes['media-video-seek-group']}"></div>`);
        seekGroup.append(seekScale, seekBar, seekInfo);

        // Seekbar frissítés
        function updateSeekUI() {
            const len = instance.length();
            const pos = instance.pos();
            const pct = len > 0 ? pos / len : 0;
            seekTrack.css('width', (pct * 100) + '%');
            seekThumb.css('left', (pct * 100) + '%');
            seekLeft.text(fmt(0) + ' / ' + fmt(pos));
            seekRight.text(fmt(len));
            seekCenter.text('');
        }

        // Seekbar interakció
        let dragging = false;
        function seekToClientX(clientX) {
            const rect = seekBar.nodes[0].getBoundingClientRect();
            let rel = (clientX - rect.left) / rect.width;
            rel = Math.max(0, Math.min(1, rel));
            const len = instance.length();
            const ms = Math.round(len * rel);
            instance.seek(ms);
            updateSeekUI();
        }
        seekBar.on('mousedown', function(e) {
            dragging = true;
            seekToClientX(e.clientX);
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (dragging) {
                seekToClientX(e.clientX);
            }
        });
        document.addEventListener('mouseup', function(e) {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
            }
        });

        // Frissítés minden ticknél
        video.on('timeupdate', updateSeekUI);
        video.on('loadedmetadata', function() {
            renderScale();
            updateSeekUI();
        });
        // Ha videó hossza változik (pl. új videó)
        video.on('durationchange', function() {
            renderScale();
            updateSeekUI();
        });

        // Első render
        setTimeout(() => {
            renderScale();
            updateSeekUI();
        }, 0);

        // --- Vezérlők összerakása ---
        // Default sorrend: seekGroup, vezérlők
        frag.append(seekGroup);
        if (btnPlay) frag.append(btnPlay);
        if (btnPause) frag.append(btnPause);
        if (btnStop) frag.append(btnStop);
        if (volSlider) frag.append(volSlider);
        if (speedDropdown) frag.append(speedDropdown);
        frag.append(loopLbl);
        frag.append(autoLbl);

        // Return object with all controls for custom arrangement
        return {
            seekGroup,
            seekScale,
            seekBar,
            seekInfo,
            playButton: btnPlay,
            pauseButton: btnPause,
            stopButton: btnStop,
            volumeSlider: volSlider,
            speedSelector: speedDropdown,
            loop: loopLbl,
            autoPlay: autoLbl,
            controlPanel: frag
        };
    };

    instance.overlay = function(qobj) {
        // Remove previous overlay if exists
        if (_customOverlay) {
            Q(_customOverlay).remove();
            _customOverlay = null;
        }
        // Add new overlay if qobj is Q object (or HTMLElement)
        if (qobj && typeof qobj === "object" && qobj.nodes && qobj.nodes[0]) {
            wrapper.append(qobj);
            _customOverlay = qobj.nodes[0];
        }
        // If qobj is "", just remove overlay
        return instance;
    };

    // Extra: wrapper és video DOM eléréséhez
    instance.wrapper = wrapper.nodes[0];
    instance.video = video.nodes[0];

    instance.fps = function() {
        if (_fpsSamples.length < 2) return null;
        const first = _fpsSamples[0], last = _fpsSamples[_fpsSamples.length - 1];
        const dt = (last.t - first.t) / 1000;
        const df = last.f - first.f;
        if (dt > 0 && df >= 0) {
            return df / dt;
        }
        return null;
    };

    return instance;
};