Form.prototype.Slider = function(initial = 0, options = {}) {
    if (!Form.sliderClassesInitialized) {
        Form.sliderClasses = Q.style(null, `
            .slider { position: relative; width: 100%; height: 8px; background: var(--form-default-input-border-color); cursor: pointer; }
            .slider_track { position: absolute; height:100%; background: var(--form-default-selected-background-color); width:0; }
            .slider_thumb { position: absolute; top:50%; transform:translate(-50%,-50%); width:5px; height:100%; background: var(--form-default-button-background-color); border-radius:50%; }
        `, null, {
            'slider': 'slider',
            'slider_track': 'slider_track',
            'slider_thumb': 'slider_thumb'
        });
        Form.sliderClassesInitialized = true;
    }
    const min = options.min ?? 0, max = options.max ?? 100;
    let val = Math.min(max, Math.max(min, initial)), callbacks = [];
    // build DOM
    const slider = Q(`<div class="${Form.sliderClasses.slider}">
        <div class="${Form.sliderClasses.slider_track}"></div>
        <div class="${Form.sliderClasses.slider_thumb}"></div>
    </div>`);
    const containerEl = slider.nodes[0],
          trackEl     = containerEl.children[0],
          thumbEl     = containerEl.children[1];
    // position helper
    function updateThumb() {
        const pct = (val-min)/(max-min)*100;
        trackEl.style.width = pct+'%';
        thumbEl.style.left = pct+'%';
    }
    updateThumb();
    // mouse interactions
    slider.on('mousedown', e => {
        const rect = containerEl.getBoundingClientRect();
        const setFromX = x => {
            let rel = (x - rect.left)/rect.width;
            rel = Math.max(0,Math.min(1,rel));
            val = min + rel*(max-min);
            updateThumb();
            callbacks.forEach(cb=>cb(val));
        };
        setFromX(e.clientX);
        const move = me=> setFromX(me.clientX),
              up   = ()=>{ document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    });
    // api methods
    slider.min = v => v===undefined ? min : (null, slider);
    slider.max = v => v===undefined ? max : (null, slider);
    slider.val = v => {
        if (v===undefined) return val;
        val = Math.min(max, Math.max(min, v));
        updateThumb();
        callbacks.forEach(cb=>cb(val));
        return slider;
    };
    slider.change = cb => { callbacks.push(cb); return slider; };
    this.elements.push(slider);
    return slider;
};
