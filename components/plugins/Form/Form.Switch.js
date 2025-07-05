Form.prototype.Switch = function (positions = 2, initial = 0) {
    if (!Form.switchClassesInitialized) {
        Form.switchClasses = Q.style(null, `
            .switch {
                display: inline-block;
                position: relative;
                width: 48px;
                height: 24px;
                background: var(--form-default-background, #333);
                border-radius: 12px;
                box-shadow: var(--form-default-shadow, 0 0 4px #0004);
                transition: background 0.2s;
                cursor: pointer;
                user-select: none;
            }
            .switch_disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .switch_track {
                position: absolute;
                top: 50%;
                left: 8px;
                right: 8px;
                height: 4px;
                background: #666;
                border-radius: 2px;
                transform: translateY(-50%);
            }
            .switch_knob {
                position: absolute;
                top: 2px;
                width: 20px;
                height: 20px;
                background: var(--form-default-accent-color, #643cf0);
                border-radius: 50%;
                box-shadow: 0 1px 4px #0004;
                transition: left 0.2s;
                left: 2px;
                z-index: 2;
            }
            .switch_active .switch_knob {
                background: var(--form-default-accent-color, #643cf0);
            }
        `, null, {
            'switch': 'switch',
            'switch_disabled': 'switch_disabled',
            'switch_track': 'switch_track',
            'switch_knob': 'switch_knob',
            'switch_active': 'switch_active'
        });
        Form.switchClassesInitialized = true;
    }
    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
    const sw = Q(`<div class="${Form.switchClasses.switch}"></div>`);
    const knob = Q(`<div class="${Form.switchClasses.switch_knob}"></div>`);
    sw.append(knob);
    let _positions = clamp(parseInt(positions) || 2, 2, 10);
    let _val = clamp(parseInt(initial) || 0, 0, _positions - 1);
    let _disabled = false;
    let _changeHandler = null;
    function updateKnob() {
        const percent = _positions === 1 ? 0 : _val / (_positions - 1);
        const minLeft = 2, maxLeft = 24;
        const left = minLeft + percent * (maxLeft - minLeft);
        knob.css('left', `${left}px`);
        if (_val > 0) sw.addClass(Form.switchClasses.switch_active);
        else sw.removeClass(Form.switchClasses.switch_active);
    }
    function setVal(val, fire = true) {
        const newVal = clamp(parseInt(val) || 0, 0, _positions - 1);
        if (_val !== newVal) {
            _val = newVal;
            updateKnob();
            if (fire && typeof _changeHandler === 'function') {
                _changeHandler(_val);
            }
        } else {
            updateKnob();
        }
    }
    // On every click, increment position, wrap to 0 if at max
    sw.on('click', function (e) {
        if (_disabled) return;
        let next = _val + 1;
        if (next >= _positions) next = 0;
        setVal(next, true);
    });
    sw.attr('tabindex', 0);
    sw.change = function (cb) {
        _changeHandler = cb;
        return sw;
    };
    sw.positions = function (n) {
        if (n === undefined) return _positions;
        _positions = clamp(parseInt(n) || 2, 2, 10);
        if (_val >= _positions) _val = 0;
        updateKnob();
        return sw;
    };
    sw.val = function (v) {
        if (v === undefined) return _val;
        setVal(v, true);
        return sw;
    };
    sw.disabled = function (state) {
        if (typeof state === 'undefined') return _disabled;
        _disabled = !!state;
        if (_disabled) sw.addClass(Form.switchClasses.switch_disabled);
        else sw.removeClass(Form.switchClasses.switch_disabled);
        return sw;
    };
    sw.remove = function () {
        sw.remove();
        return null;
    };
    updateKnob();
    this.elements.push(sw);
    return sw;
};
