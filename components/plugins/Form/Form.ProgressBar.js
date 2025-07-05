Form.prototype.ProgressBar = function(min = 0, max = 100, value = 0) {
    if (!Form.progressClassesInitialized) {
        Form.progressClasses = Q.style(null, `
            .progress_bar {
                width: 100%;
                background-color: var(--form-default-background);
                border-radius: var(--form-default-border-radius);
                overflow: hidden;
            }
            .progress_fill {
            position: relative;
                height: var(--form-default-font-size);
                background-color: var(--form-default-accent-color);
                width: 0%;
                border-radius: var(--form-default-border-radius);
            }
            .progress_fill:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.10) 95%, rgba(255, 255, 255, 0.20) 100%);
                background-size: 200% 100%;
                animation: gradient 2s linear infinite;
            }
            @keyframes gradient {
                0% { background-position: 100% 100%; }
                100% { background-position: -100% 100%; }
            }
        `, null, {
            'progress_bar': 'progress_bar',
            'progress_fill': 'progress_fill'
        });
        Form.progressClassesInitialized = true;
    }
    const bar = Q(
        `<div class="${Form.progressClasses.progress_bar}">
            <div class="${Form.progressClasses.progress_fill}"></div>
        </div>`
    );
    let _min = min, _max = max, _val = value;
    const fill = bar.find(`.${Form.progressClasses.progress_fill}`);
    const update = () => {
        const pct = _max > _min
            ? ((_val - _min) / (_max - _min)) * 100
            : 0;
        fill.css('width', Math.min(Math.max(pct, 0), 100) + '%');
    };
    bar.min = function(v) { _min = v; update(); return bar; };
    bar.max = function(v) { _max = v; update(); return bar; };
    bar.val = function(v) {
        if (v === undefined) return _val;
        _val = v; update(); return bar;
    };
    update();
    this.elements.push(bar);
    return bar;
};
