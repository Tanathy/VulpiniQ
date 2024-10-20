const Q = (() => {
    'use strict';
const _ob = Object, _ar = Array, _ma = Math, _ac = AbortController, _as = AbortSignal, _bo = Boolean, _da = Date, _er = Error, _ev = Event, _pr = Promise, _nu = Number, _re = RegExp, _st = setTimeout, _un = undefined, _n = null, _nl = NodeList, _el = Element, _si = setInterval, _c = console, _f = fetch, _ct = clearTimeout;
    var GLOBAL = {};
    function Q(a, b, c) {
        if (!(this instanceof Q)) {
            return new Q(a, b, c);
        }
        else if (a?.nodeType === 1 || a?.nodeType != _n) {
            this.nodes = [a];
            return;
        }
        else if (a instanceof Q) {
            this.nodes = a.nodes;
            return;
        }
        else if (a?.constructor === _nl) {
            this.nodes = _ar.from(a);
            return;
        }
        else if (typeof a === 'string') {
            let l = !!b || a.includes('<');
            if (l) {
                const e = document.createDocumentFragment();
                const f = document.createElement('div');
                f.innerHTML = a;
                while (f.firstChild) {
                    e.appendChild(f.firstChild);
                }
                this.nodes = _ar.from(e.childNodes);
                if (b) {
                    this.nodes.forEach(m => {
                        for (const [g, h] of _ob.entries(b)) {
                            if (g === 'class') {
                                if (_ar.isArray(h)) {
                                    m.classList.add(...h);
                                }
                                else {
                                    m.classList.add(...h.split(/\s+/));
                                }
                            }
                            else if (g === 'style') {
                                if (typeof h === 'object') {
                                    for (const [i, j] of _ob.entries(h)) {
                                        m.style[i] = j;
                                    }
                                }
                                else {
                                    m.style.cssText = h;
                                }
                            }
                            else if (g === 'text') {
                                m.textContent = h;
                            }
                            else if (g === 'html') {
                                m.innerHTML = h;
                            }
                            else {
                                m.setAttribute(g, h);
                            }
                        }
                    });
                }
                if (c) {
                    this.nodes.forEach(m => {
                        for (const d of c) {
                            m[d] = true;
                        }
                    });
                }
            } else {
                let k = document.querySelectorAll(a);
                this.nodes = _ar.from(k);
            }
        }
    }
    Q.Ext = (n, o) => (Q.prototype[n] = o, Q);
    Q.Ext('addClass', function (a) {
    const b = a.split(' ');
    return this.each(c => this.nodes[c].classList.add(...b));
});
Q.Ext('animate', function (a, b, e) {
    return this.each(g => {
        const f = this.nodes[g];
        const c = _ob.keys(b).map(d => `${d} ${a}ms`).join(', ');
        f.style.transition = c;
        for (const d in b) {
            f.style[d] = b[d];
        }
        if (typeof e === 'function') {
            _st(() => {
                if (e) e.call(f);
            }, a);
        }
    }), this;
});
Q.Ext('append', function (...a) {
    return this.each(el => {
        const b = this.nodes[el];
        a.forEach(c => {
            if (typeof c === 'string') {
                b.insertAdjacentHTML('beforeend', c);
            } else if (c?.nodeType === 1 || c instanceof Q) {
                b.appendChild(c.nodes[0]);
            } else if (_ar.isArray(c) || c?.constructor === _nl) {
                _ar.from(c).forEach(d => b.appendChild(d));
            }
        });
    });
});
Q.Ext('attr', function (a, b) {
    if (typeof a === 'object') {
        return this.each(d => {
            for (let c in a) {
                if (a.hasOwnProperty(c)) {
                    this.nodes[d].setAttribute(c, a[c]);
                }
            }
        });
    } else {
        if (b === _un) {
            return this.nodes[0]?.getAttribute(a) || _n;
        }
        return this.each(d => this.nodes[d].setAttribute(a, b));
    }
});
Q.Ext('bind', function (a, b) {
    if (!this.d) {
        this.d = {};
    }
    if (!this.d[a]) {
        document.addEventListener(a, (e) => {
            this.each(c => {
                if (this.nodes[c].contains(e.target)) {
                    b.call(e.target, e);
                }
            });
        });
        this.d[a] = true;
    }
    return this;
});
Q.Ext('blur', function () {
    return this.each(a => this.nodes[a].blur());
});
Q.Ext('children', function () {
    return new Q(this.nodes[0].children);
});
Q.Ext('click', function () {
    return this.each(el => this.nodes[el].click());
});
Q.Ext('clone', function () {
    return new Q(this.nodes[0].cloneNode(true));
});
Q.Ext('closest', function (selector) {
    let b = this.nodes[0];
    while (b) {
        if (b.matches && b.matches(selector)) {
            return new Q(b);
        }
        b = b.parentElement;
    }
    return _n;
});
Q.Ext('css', function(a, b){
    if (typeof a === 'object') {
        return this.each(d => {
            for (let c in a) {
                if (a.hasOwnProperty(c)) {
                    this.nodes[d].style[c] = a[c];
                }
            }
        });
    } else {
        if (b === _un) {
            return getComputedStyle(this.nodes[0])[a];
        }
        return this.each(d => this.nodes[d].style[a] = b);
    }
});
Q.Ext('data', function (a, b) {
    if (b === _un) {
        return this.nodes[0]?.dataset[a] || _n;
    }
    return this.each(c => this.nodes[c].dataset[a] = b);
});
Q.Ext('each', function (callback) {
    this.nodes.forEach((b, c) => callback.call(b, c, b));
    return this;
});
Q.Ext('empty', function () {
    return this.each(a => this.nodes[a].innerHTML = '');
});
Q.Ext('eq', function (index) {
    return new Q(this.nodes[index]);
});
Q.Ext('fadeIn', function (a = 400, b) {
    return this.each(c => {
        this.nodes[c].style.display = '';
        this.nodes[c].style.transition = `opacity ${a}ms`;
        this.nodes[c].offsetHeight;
        this.nodes[c].style.opacity = 1;
        _st(() => {
            this.nodes[c].style.transition = '';
            if (b) b();
        }, a);
    });
});
Q.Ext('fadeOut', function (a, b) {
    return this.each(c => {
        this.nodes[c].style.transition = `opacity ${a}ms`;
        this.nodes[c].style.opacity = 0;
        _st(() => {
            this.nodes[c].style.transition = '';
            this.nodes[c].style.display = 'none';
            if (b) b();
        }, a);
    });
});
Q.Ext('fadeTo', function (opacity, b, c) {
    return this.each(d => {
        this.nodes[d].style.transition = `opacity ${b}ms`;
        this.nodes[d].offsetHeight;
        this.nodes[d].style.opacity = opacity;
        _st(() => {
            this.nodes[d].style.transition = '';
            if (c) c();
        }, b);
    });
});
Q.Ext('fadeToggle', function (a, b) {
    return this.each(c => {
        if (window.getComputedStyle(this.nodes[c]).opacity === '0') {
            this.fadeIn(a, b);
        } else {
            this.fadeOut(a, b);
        }
    });
});
Q.Ext('find', function (selector) {
    const b = this.nodes[0].querySelectorAll(selector);
    return b.length ? Q(b) : _n;
});
Q.Ext('first', function () {
    return new Q(this.nodes[0]);
});
Q.Ext('focus', function () {
    return this.each(a => this.nodes[a].focus());
});
Q.Ext('hasClass', function (className) {
    return this.nodes[0]?.classList.contains(className) || false;
});
Q.Ext('height', function (a) {
    if (a === _un) {
        return this.nodes[0].offsetHeight;
    }
    return this.each(b => this.nodes[b].style.height = a);
});
Q.Ext('hide', function (duration = 0, b) {
    return this.each(e => {
        const c = this.nodes[e];
        if (duration === 0) {
            c.style.display = 'none';
            if (b) b();
        } else {
            c.style.transition = `opacity ${duration}ms`;
            c.style.opacity = 1;
            _st(() => {
                c.style.opacity = 0;
                c.addEventListener('transitionend', function d() {
                    c.style.display = 'none';
                    c.style.transition = '';
                    c.removeEventListener('transitionend', d);
                    if (b) b();
                });
            }, 0);
        }
    });
});
Q.Ext('html', function (a) {
    if (a === _un) {
        return this.nodes[0]?.innerHTML || _n;
    }
    return this.each(c => {
        c = this.nodes[c];
        c.innerHTML = '';
        a.forEach(b => {
            if (typeof b === 'string') {
                c.insertAdjacentHTML('beforeend', b);
            } else if (b instanceof Q) {
                b.nodes.forEach(d => c.appendChild(d));
            } else if (b?.nodeType === 1) {
                c.appendChild(b);
            } else if (_ar.isArray(b) || b?.constructor === _nl) {
                _ar.from(b).forEach(e => c.appendChild(e));
            }
        });
    });
});
Q.Ext('id', function (a) {
    if (a === _un) {
        return this.nodes[0].id;
    }
    return this.nodes[0].id = a;
});
Q.Ext('index', function (index) {
    if (index === _un) {
        return _ar.from(this.nodes[0].parentNode.children).indexOf(this.nodes[0]);
    }
    return this.each(f => {
        const b = this.nodes[f].parentNode;
        const c = _ar.from(b.children);
        const d = c.indexOf(f);
        const e = c.splice(index, 1)[0];
        if (d < index) {
            b.insertBefore(e, f);
        } else {
            b.insertBefore(e, this.nodes[f].nextSibling);
        }
    });
});
Q.Ext('inside', function (a) {
    return this.nodes[0]?.closest(a) !== _n;
});
Q.Ext('is', function (selector) {
    const b = this.nodes[0];
    if (!b) return false;
    if (typeof selector === 'function') {
        return selector.call(b, 0, b);
    }
    if (typeof selector === 'string') {
        switch (selector) {
            case ':visible':
                return b.offsetWidth > 0 && b.offsetHeight > 0;
            case ':hidden':
                return b.offsetWidth === 0 || b.offsetHeight === 0;
            case ':hover':
                return b === document.querySelector(':hover');
            case ':focus':
                return b === document.activeElement;
            case ':blur':
                return b !== document.activeElement;
            case ':checked':
                return b.checked;
            case ':selected':
                return b.selected;
            case ':disabled':
                return b.disabled;
            case ':enabled':
                return !b.disabled;
            default:
                return b.matches(selector);
        }
    }
    if (selector?.nodeType === 1 || selector?.nodeType != _n) {
        return b === selector;
    }
    if (selector instanceof Q) {
        return b === selector.nodes[0];
    }
    return false;
});
Q.Ext('isExists', function () {
    return document.body.contains(this.nodes[0]);
});
Q.isExists = function (a) {
    return document.querySelector(a) !== _n;
};
Q.Ext('last', function () {
    return new Q(this.nodes[this.nodes.length - 1]);
});
Q.Ext('off', function (a, b, c) {
    const d = {
        capture: false,
        once: false,
        passive: false
    };
    c = { ...d, ...c };
    return this.each(f => {
        a.split(' ').forEach(e => this.nodes[f].removeEventListener(e, b, c));
    });
});
Q.Ext('offset', function () {
    const a = this.nodes[0].getBoundingClientRect();
    return {
        top: a.top + window.scrollY,
        left: a.left + window.scrollX
    };
});
Q.Ext('on', function (a, b, c) {
    const d = {
        capture: false,
        once: false,
        passive: false
    };
    c = { ...d, ...c };
    return this.each(e => {
        a.split(' ').forEach(f => this.nodes[e].addEventListener(f, b, c));
    });
});
Q.Ext('parent', function () {
    return new Q(this.nodes[0].parentNode);
});
Q.Ext('position', function () {
    return {
        top: this.nodes[0].offsetTop,
        left: this.nodes[0].offsetLeft
    };
});
Q.Ext('prepend', function (...a) {
    return this.each(e => {
        const b = this.a[e];
        a.forEach(c => {
            if (typeof c === 'string') {
                b.insertAdjacentHTML('afterbegin', c);
            } else if (c?.nodeType === 1 || c instanceof Q) {
                b.insertBefore(c.a[0], b.firstChild);
            } else if (_ar.isArray(c) || c?.constructor === _nl) {
                _ar.from(c).forEach(d => b.insertBefore(d, b.firstChild));
            }
        });
    });
});
Q.Ext('prop', function (property, b) {
    if (b === _un) {
        return this.nodes[0]?.[property] || _n;
    }
    return this.each(function (d, c) {
        c[property] = b;
    });
});
Q.Ext('remove', function() {
    return this.each(a => this.nodes[a].remove());
});
Q.Ext('removeAttr', function (a) {
    return this.each(b => this.nodes[b].removeAttribute(a));
});
Q.Ext('removeClass', function (a) {
    const b = a.split(' ');
    return this.each(c => this.nodes[c].classList.remove(...b));
});
Q.Ext('removeData', function (key) {
    return this.each(b => delete this.nodes[b].dataset[key]);
});
Q.Ext('removeProp', function (property) {
    return this.each(b => delete this.nodes[b][property]);
});
Q.Ext('removeTransition', function () {
    return this.each(a => this.nodes[a].style.transition = '');
});
Q.Ext('scrollHeight', function () {
    return this.nodes[0].scrollHeight;
});
Q.Ext('scrollLeft', function (a, b) {
    if (a === _un) {
        return this.nodes[0].scrollLeft;
    }
    return this.each(d => {
        const c = this.nodes[d].scrollWidth - this.nodes[d].clientWidth;
        if (b) {
            this.nodes[d].scrollLeft = _ma.min(this.nodes[d].scrollLeft + a, c);
        } else {
            this.nodes[d].scrollLeft = _ma.min(a, c);
        }
    });
});
Q.Ext('scrollTop', function (a, b) {
    if (a === _un) {
        return this.nodes[0].scrollTop;
    }
    return this.each(d => {
        const c = this.nodes[d].scrollHeight - this.nodes[d].clientHeight;
        if (b) {
            this.nodes[d].scrollTop = _ma.min(this.nodes[d].scrollTop + a, c);
        } else {
            this.nodes[d].scrollTop = _ma.min(a, c);
        }
    });
});
Q.Ext('scrollWidth', function () {
    return this.nodes[0].scrollWidth;
});
Q.Ext('show', function (duration = 0, b) {
    return this.each(e => {
        const c = this.nodes[e];
        if (duration === 0) {
            c.style.display = '';
            if (b) b();
        } else {
            c.style.transition = `opacity ${duration}ms`;
            c.style.opacity = 0;
            c.style.display = '';
            _st(() => {
                c.style.opacity = 1;
                c.addEventListener('transitionend', function d() {
                    c.style.transition = '';
                    c.removeEventListener('transitionend', d);
                    if (b) b();
                });
            }, 0);
        }
    });
});
Q.Ext('size', function () {
    return {
        width: this.nodes[0].offsetWidth,
        height: this.nodes[0].offsetHeight
    };
});
Q.Ext('text', function (a) {
    if (a === _un) {
        return this.nodes[0]?.textContent || _n;
    }
    return this.each(b => this.nodes[b].textContent = a);
});
Q.Ext('toggle', function () {
    return this.each(a => this.nodes[a].style.display = this.nodes[a].style.display === 'none' ? '' : 'none');
});
Q.Ext('toggleClass', function (className) {
    return this.each(b => this.nodes[b].classList.toggle(className));
});
Q.Ext('trigger', function (event) {
    return this.each(function (c, b) {
        b.dispatchEvent(new _ev(event));
    });
});
Q.Ext('unwrap', function () {
    return this.each(b => {
        const a = this.nodes[b].parentNode;
        if (a !== document.body) {
            a.replaceWith(...this.nodes);
        }
    });
});
Q.Ext('a', function (a) {
    if (a === _un) {
        return this.nodes[0]?.value || _n;
    }
    return this.each(b => this.nodes[b].value = a);
});
Q.Ext('wait', function (ms) {
    const b = this;
    return new _pr((resolve) => {
        _st(() => {
            resolve(b);
        }, ms);
    });
});
Q.Ext('walk', function (callback, b = false) {
    this.nodes.forEach((e, d) => {
        const c = b ? Q(e) : e;
        callback.call(e, c, d);
    });
    return this;
});
Q.Ext('width', function (a) {
    if (a === _un) {
        return this.nodes[0].offsetWidth;
    }
    return this.each(b => this.nodes[b].style.width = a);
});
Q.Ext('wrap', function (c) {
    return this.each(d => {
        const a = this.nodes[d].parentNode;
        const b = typeof c === 'string' ? document.createElement(c) : c;
        a.insertBefore(b, this.nodes[d]);
        b.appendChild(this.nodes[d]);
    });
});
Q.Ext('wrapAll', function (wrapper) {
    return this.each(e => {
        const b = this.nodes[e].parentNode;
        const c = typeof wrapper === 'string' ? document.createElement(wrapper) : wrapper;
        b.insertBefore(c, this.nodes[0]);
        this.nodes.forEach(d => c.appendChild(d));
    });
});
Q.Ext('zIndex', function (a) {
    if (a === _un) {
        let b = this.nodes[0].style.zIndex;
        if (!b) {
            b = window.getComputedStyle(this.nodes[0]).zIndex;
        }
        return b;
    }
    return this.each(c => this.nodes[c].style.zIndex = a);
});
Q.Done = (function () {
    const a = [];
    window.addEventListener('load', () => {
        a.forEach(b => b());
    });
    return function (b) {
        a.push(b);
    };
})();
Q.Leaving = (function () {
    const a = [];
    window.addEventListener('beforeunload', (b) => {
        a.forEach(c => c(b));
    });
    return function (c) {
        a.push(c);
    };
})();
Q.Ready = (function () {
    const a = [];
    document.addEventListener('DOMContentLoaded', () => {
        a.forEach(b => b());
    }, { once: true });
    return function (b) {
        if (document.readyState === 'loading') {
            a.push(b);
        } else {
            b();
        }
    };
})();
Q.Resize = (function () {
    const a = [];
    window.addEventListener('resize', () => {
        const b = window.innerWidth;
        const c = window.innerHeight;
        a.forEach(d => d(b, c));
    });
    return function (d) {
        a.push(d);
    };
})();
Q.ColorBrightness = function (c, percent) {
    let r, g, b, a = 1;
    let hex = false;
    if (!c.startsWith('#') && !c.startsWith('rgb')) {
        throw new _er('Unsupported c format');
    }
    if (c.startsWith('#')) {
        c = c.replace(/^#/, '');
        if (c.length === 3) {
            r = parseInt(c[0] + c[0], 16);
            g = parseInt(c[1] + c[1], 16);
            b = parseInt(c[2] + c[2], 16);
        }
        if (c.length === 6) {
            r = parseInt(c.substring(0, 2), 16);
            g = parseInt(c.substring(2, 4), 16);
            b = parseInt(c.substring(4, 6), 16);
        }
        hex = true;
    }
    if (c.startsWith('rgb')) {
        const alphaColor = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);
        if (alphaColor) {
            r = parseInt(alphaColor[1]);
            g = parseInt(alphaColor[2]);
            b = parseInt(alphaColor[3]);
            if (alphaColor[4]) {
                a = parseFloat(alphaColor[4]);
            }
        }
    }
    r = _ma.min(255, _ma.max(0, r + (r * percent / 100)));
    g = _ma.min(255, _ma.max(0, g + (g * percent / 100)));
    b = _ma.min(255, _ma.max(0, b + (b * percent / 100)));
    if (hex) {
        return '#' +
            ('0' + _ma.round(r).toString(16)).slice(-2) +
            ('0' + _ma.round(g).toString(16)).slice(-2) +
            ('0' + _ma.round(b).toString(16)).slice(-2);
    } else if (c.startsWith('rgb')) {
        if (a === 1) {
            return `rgb(${_ma.round(r)}, ${_ma.round(g)}, ${_ma.round(b)})`;
        } else {
            return `rgba(${_ma.round(r)}, ${_ma.round(g)}, ${_ma.round(b)}, ${a})`;
        }
    }
}
Q.Debounce = function (id, b, c) {
    GLOBAL = GLOBAL || {};
    GLOBAL.Flood = GLOBAL.Flood || {};
    if (GLOBAL.Flood[id]) {
        _ct(GLOBAL.Flood[id]);
    }
    GLOBAL.Flood[id] = b ? _st(c, b) : c();
};
Q.HSL2RGB = function (h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        let a = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = a(p, q, h + 1 / 3);
        g = a(p, q, h);
        b = a(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
};
Q.ID = function (length = 8, b = '') {
    return b + [..._ar(length)]
        .map(() => _ma.floor(_ma.random() * 16).toString(16))
        .join('');
};
Q.RGB2HSL = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let maximum = _ma.max(r, g, b), minimum = _ma.a(r, g, b);
    let h, s, l = (maximum + minimum) / 2;
    if (maximum === minimum) {
        h = s = 0;
    } else {
        let d = maximum - minimum;
        s = l > 0.5 ? d / (2 - maximum - minimum) : d / (maximum + minimum);
        switch (maximum) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
};
Q.isDarkColor = (color, margin = 20, c = 100) => {
    let r, g, b;
    const parseHex = (f) => {
        if (f.length === 3) {
            return [
                parseInt(f[0] + f[0], 16),
                parseInt(f[1] + f[1], 16),
                parseInt(f[2] + f[2], 16),
            ];
        } else if (f.length === 6) {
            return [
                parseInt(f.slice(0, 2), 16),
                parseInt(f.slice(2, 4), 16),
                parseInt(f.slice(4, 6), 16),
            ];
        }
        throw new _er('Invalid f color format');
    };
    if (color[0] === '#') {
        [r, g, b] = parseHex(color.slice(1));
    } else if (color.startsWith('rgb')) {
        const rgba = color.match(/\d+/g);
        if (rgba && rgba.length >= 3) {
            [r, g, b] = rgba.map(_nu);
        } else {
            throw new _er('Invalid color format');
        }
    } else {
        throw new _er('Unsupported color format');
    }
    const e = _ma.sqrt(
        0.299 * (r ** 2) +
        0.587 * (g ** 2) +
        0.114 * (b ** 2)
    ) + margin;
    return e < c;
};
Q.Container = function (options = {}) {
    let Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' container_icon');
        return iconElement;
    };
    Q.Icons();
    let classes = Q.style(` 
         .container_icon {
             width: 100%;
             height: 100%;
             color: #777; /* Default color */
             pointer-events: none;
             z-index: 1;
         }
          .tab_navigation_buttons {
         box-sizing: border-box;
            width: 20px;
            background-color: #333;
            display: flex;
            justify-content: center;
            padding: 4px;
        }
        .tab_navigation_buttons_vertical {
            width: auto;
            height: 20px;
        }
        .tab_navigation_buttons:hover {
            background-color: #555;
        }
        .tab_container {
            width: 100%;
            height: 300px;
        }
        .tab_container_vertical {
        display: flex;
                }
        .tab_navigation_header {
            background-color: #333;
            display: flex;
        }
        .tab_navigation_header_vertical {
            flex-direction: column;
                width: auto;
        }
        .tab_navigation_tabs {
        user-select: none;
            display: flex;
            flex-direction: row;
            width: 100%;
            overflow: hidden;
        }
        .tab_navigation_tabs_vertical {
            flex-direction: column;
        }
        .tab_active {
            background-color: #555;
            color: #fff;
        }
        .tab {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: default;
            padding: 5px 25px;
        }
        .tab_disabled {
            background-color: #333;
            color: #555;
        }
 `,
        {
            'tab_navigation_buttons': 'tab_navigation_buttons',
            'tab_navigation_buttons_vertical': 'tab_navigation_buttons_vertical',
            'tab_container': 'tab_container',
            'tab_container_vertical': 'tab_container_vertical',
            'tab_navigation_header': 'tab_navigation_header',
            'tab_navigation_header_vertical': 'tab_navigation_header_vertical',
            'tab_navigation_tabs': 'tab_navigation_tabs',
            'tab_navigation_tabs_vertical': 'tab_navigation_tabs_vertical',
            'tab_active': 'tab_active',
            'tab': 'tab',
            'tab_disabled': 'tab_disabled'
        });
    return {
        Tab: function (data, horizontal = true) {
            let wrapper = Q('<div>', { class: classes.tab_container });
            let tabs_wrapper = Q('<div>', { class: classes.tab_navigation_header });
            let tabs_nav_left = Q('<div>', { class: classes.tab_navigation_buttons });
            let tabs_nav_right = Q('<div>', { class: classes.tab_navigation_buttons });
            let tabs = Q('<div>', { class: classes.tab_navigation_tabs });
            tabs_wrapper.append(tabs_nav_left, tabs, tabs_nav_right);
            let content = Q('<div>');
            wrapper.append(tabs_wrapper, content);
            if (!horizontal) {
                wrapper.addClass(classes.tab_container_vertical);
                tabs.addClass(classes.tab_navigation_tabs_vertical);
                tabs_wrapper.addClass(classes.tab_navigation_header_vertical);
                tabs_nav_left.addClass(classes.tab_navigation_buttons_vertical);
                tabs_nav_right.addClass(classes.tab_navigation_buttons_vertical);
                tabs_nav_left.append(Icon('arrow-up'));
                tabs_nav_right.append(Icon('arrow-down'));
            }
            else {
                tabs_nav_left.append(Icon('arrow-left'));
                tabs_nav_right.append(Icon('arrow-right'));
            }
            let data_tabs = {};
            let data_contents = {};
            data.forEach((item) => {
                const tab = Q('<div>', { class: classes.tab, 'data-value': item.value }).text(item.title);
                if (item.disabled) {
                    tab.addClass(classes.tab_disabled);
                }
                data_tabs[item.value] = tab;
                data_contents[item.value] = item.content;
                tab.on('click', function () {
                    if (item.disabled) {
                        return;
                    }
                    let foundTabs = tabs.find('.' + classes.tab_active);
                    if (foundTabs) {
                        foundTabs.removeClass(classes.tab_active);
                    }
                    tab.addClass(classes.tab_active);
                    content.html(data_contents[item.value]);
                });
                tabs.append(tab);
            });
            tabs_nav_left.on('click', function () {
                if (!horizontal) {
                    tabs.scrollTop(-tabs.height(), true);
                } else {
                    tabs.scrollLeft(-tabs.width(), true);
                }
            });
            tabs_nav_right.on('click', function () {
                if (!horizontal) {
                    tabs.scrollTop(tabs.height(), true);
                } else {
                    tabs.scrollLeft(tabs.width(), true);
                }
            });
            wrapper.select = function (value) {
                data_tabs.forEach(tab => {
                    if (tab.data('value') === value) {
                        tab.click();
                    }
                });
            };
            wrapper.disabled = function (value, state) {
                if (data_tabs[value]) {
                    if (state) {
                        data_tabs[value].addClass(classes.tab_disabled);
                    } else {
                        data_tabs[value].removeClass(classes.tab_disabled);
                    }
                }
            };
            return wrapper;
        }
    };
};
Q.Cookie = function (a, b, options = {}) { 
    function h(options) {
        const { d, e, f, g } = options;
        let j = '';
        if (d) {
            const k = new _da();
            k.setTime(k.getTime() + (d * 24 * 60 * 60 * 1000));
            j += `expires=${k.toUTCString()}; `;
        }
        if (e) {
            j += `e=${e}; `;
        }
        if (f) {
            j += `f=${f}; `;
        }
        if (g) {
            j += 'g; ';
        }
        return j;
    }
    function i(j) {
        return j.split(';').reduce((o, n) => {
            const [l, b] = n.split('=').map(c => c.trim());
            o[l] = b;
            return o;
        }, {});
    }
    if (arguments.length === 2) { 
        if (b === _n || b === '') { 
            b = ''; 
            options = { ...options, d: -1 }; 
        }
        return document.cookie = `${a}=${b}; ${h(options)}`; 
    } else if (arguments.length === 1) { 
        return i(document.cookie)[a]; 
    }
};
Q.Fetch = function (url, b, c = {}) {
    const { 
        method = 'GET',
        headers = {},
        body,
        contentType = 'application/json',
        responseType = 'json',
        credentials = 'same-origin',
        retries = 3,
        retryDelay = 1000, 
        timeout = 0, 
        validateResponse = (j) => j
    } = c;
    headers['Content-Type'] = headers['Content-Type'] || contentType;
    const d = new _ac();
    const { e } = d;
    const g = (f) => {
        const h = timeout ? _st(() => d.abort(), timeout) : _n;
        _f(url, { method, headers, body, credentials, e })
            .then(i => {
                if (!i.ok) {
                    throw new _er(`Network i was not ok: ${i.statusText}`);
                }
                switch (responseType) {
                    case 'json': return i.json();
                    case 'text': return i.text();
                    case 'blob': return i.blob();
                    case 'arrayBuffer': return i.arrayBuffer();
                    default: throw new _er('Unsupported i type');
                }
            })
            .then(j => {
                if (h) _ct(h);
                return validateResponse(j);
            })
            .then(j => b(_n, j))
            .catch(k => {
                if (h) _ct(h);
                if (k.name === 'AbortError') {
                    b(new _er('Fetch request was aborted'), _n);
                } else if (f < retries) {
                    _c.warn(`Retrying _f (${f + 1}/${retries}):`, k);
                    _st(() => g(f + 1), retryDelay);
                } else {
                    b(k, _n);
                }
            });
    };
    g(0);
    return {
        abort: () => d.abort()
    };
};
Q.Form = function (options = {}) {
    let Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' form_icon');
        return iconElement;
    };
    let classes = Q.style(`
           .form_icon {
               width: 100%;
               height: 100%;
               color: #fff;
               /* Default color */
               pointer-events: none;
           }
           .q_form {
               box-sizing: border-box;
               font-family: inherit;
               font-size: inherit;
               color: inherit;
               margin: 1px;
           }
           .q_form_disabled {
               opacity: 0.5;
           }
           .q_form_checkbox,
           .q_form_radio {
               display: flex;
               width: fit-content;
               align-items: center;
           }
           .q_form_checkbox .label:empty,
           .q_form_radio .label:empty {
               display: none;
           }
           .q_form_checkbox .label,
           .q_form_radio .label {
               padding-left: 5px;
               user-select: none;
           }
           .q_form_cb {
               position: relative;
               width: 20px;
               height: 20px;
               background-color: #555555;
           }
           .q_form_cb input[type="checkbox"] {
               opacity: 0;
               top: 0;
               left: 0;
               padding: 0;
               margin: 0;
               width: 100%;
               height: 100%;
               position: absolute;
           }
           .q_form_cb input[type="checkbox"]:checked+label:before {
               content: "";
               position: absolute;
               display: block;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background-color: #1DA1F2;
           }
           .q_form_r {
               position: relative;
               width: 20px;
               height: 20px;
               background-color: #555555;
               border-radius: 50%;
               overflow: hidden;
           }
           .q_form_r input[type="radio"] {
               opacity: 0;
               top: 0;
               left: 0;
               padding: 0;
               margin: 0;
               width: 100%;
               height: 100%;
               position: absolute;
               border-radius: 50%;
           }
           .q_form_r input[type="radio"]:checked+label:before {
               content: "";
               position: absolute;
               display: block;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background-color: #1DA1F2;
               border-radius: 50%;
           }
           .q_form_input {
               width: calc(100% - 2px);
               padding: 5px;
               outline: none;
               border: 0;
           }
           .q_form_input:focus,
           .q_form_textarea:focus {
               outline: 1px solid #1DA1F2;
           }
           .q_form_textarea {
               width: calc(100% - 2px);
               padding: 5px;
               outline: none;
               border: 0;
           }
           .q_window {
               position: fixed;
               background-color: #333;
               z-index: 1000;
               box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
               border: 1px solid rgba(255, 255, 255, 0.01);
               border-radius: 5px;
               overflow: hidden;
               display: flex;
               flex-direction: column;
           }
           .q_window_titlebar {
               user-select: none;
               display: flex;
               background-color: #222;
               width: 100%;
               flex-shrink: 0;
           }
           .q_window_buttons {
               display: flex;
           }
           .q_window_button {
               box-sizing: border-box;
               display: flex;
               justify-content: center;
               align-items: center;
               cursor: pointer;
               width: 30px;
               height: 30px;
               padding: 10px;
               background-color: rgba(255, 255, 255, 0.01);
               margin-left: 1px;
           }
           .q_window_button:hover {
               background-color: #424242;
           }
           .q_window_close:hover {
               background-color: #e81123;
           }
           .q_window_titletext {
               flex-grow: 1;
               color: #fff;
               align-content: center;
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
               padding: 0 5px
           }
           .q_window_content {
               width: 100%;
               overflow-y: auto;
               flex: 1;
           }
           .q_slider_wrapper {
               position: relative;
               height: 20px;
               overflow: hidden;
               background-color: #333;
           }
           .q_slider_pos {
               position: absolute;
               top: 0;
               left: 0;
               width: 0;
               height: 100%;
               background-color: #1473e6;
           }
           .q_form_slider {
               width: 100%;
               opacity: 0;
               height: 100%;
               position: absolute;
           }
           .q_form_dropdown {
               user-select: none;
               position: relative;
               background-color: #333;
           }
           .q_form_dropdown_options {
               position: absolute;
               width: 100%;
               background-color: #333;
               z-index: 1;
           }
           .q_form_dropdown_option,
           .q_form_dropdown_selected {
               padding: 5px 0px;
           }
           .q_form_button {
               user-select: none;
               padding: 5px 10px;
               cursor: pointer;
           }
           .q_form_button:hover {
               background-color: #555;
           }
           .q_form_button:active {
               background-color: #777;
           }
           .q_form_file {
               user-select: none;
               position: relative;
               overflow: hidden;
           }
           .q_form_file input[type="file"] {
               position: absolute;
               width: 100%;
               height: 100%;
               opacity: 0;
           }
           .datepicker_wrapper {
               user-select: none;
               width: 100%;
               height: 100%;
               display: flex;
               flex-direction: column;
           }
           .datepicker_header {
               display: flex;
               align-items: center;
               color: #fff;
               justify-content: center;
           }
           .datepicker_header div {
               padding: 15px 5px;
           }
           .datepicker_weekdays {
               display: grid;
               grid-template-columns: repeat(7, 1fr);
           }
           .datepicker_weekdays div {
               display: flex;
               align-items: center;
               justify-content: center;
           }
           .datepicker_days {
               display: grid;
               grid-template-columns: repeat(7, 1fr);
               flex: 1;
           }
           .prev_month,
           .next_month {
               opacity: 0.5;
           }
           .datepicker_body {
               display: flex;
               flex-direction: column;
               flex: 1;
           }
           .days {
               cursor: default;
               display: flex;
               align-items: center;
               justify-content: center;
           }
           .day_selected {
               background-color: #1473e6;
               color: #fff;
           }
           .datepicker_footer {
               display: flex;
               justify-content: flex-end;
           }
           .tag_container {
                display: flex;
                flex-wrap: wrap;
}
.tag_tag {
    display: flex;
    align-items: center;
    border: 1px solid #333;
    color: #fff;
overflow: hidden;
    margin: 2px;
    border-radius: 5px;
}
        .tag_rating {
    display: flex;
    background-color: #333;
    padding: 2px 5px;
    align-items: center;
            }
            .tag_icon {
                width: 10px;
                height: 10px;
}
.tag_icon_small {
    width: 5px;
    height: 5px;
}
.tag_name {
    padding: 2px 8px;
}
.tag_value {
    padding: 0 5px;
    user-select: none;   
}
.tag_close {
    cursor: pointer;
    background-color: #333;
    height: auto;
    width: 20px;
}
.tag_input {
width: content;
    border: 0;
    margin:0;
    background-color: transparent;
    color: #fff;
}
.tag_name[contenteditable="true"] {
    cursor: text;
}
.tag_name[contenteditable="true"]:focus {
    outline: 0;
}
    `, {
        'q_form': 'q_form',
        'q_form_disabled': 'q_form_disabled',
        'q_form_checkbox': 'q_form_checkbox',
        'q_form_radio': 'q_form_radio',
        'q_form_cb': 'q_form_cb',
        'q_form_r': 'q_form_r',
        'q_form_input': 'q_form_input',
        'q_form_textarea': 'q_form_textarea',
        'q_window': 'q_window',
        'q_window_titlebar': 'q_window_titlebar',
        'q_window_buttons': 'q_window_buttons',
        'q_window_button': 'q_window_button',
        'q_window_titletext': 'q_window_titletext',
        'q_window_content': 'q_window_content',
        'q_slider_wrapper': 'q_slider_wrapper',
        'q_slider_pos': 'q_slider_pos',
        'q_form_slider': 'q_form_slider',
        'q_form_dropdown': 'q_form_dropdown',
        'q_form_dropdown_options': 'q_form_dropdown_options',
        'q_form_dropdown_option': 'q_form_dropdown_option',
        'q_form_dropdown_selected': 'q_form_dropdown_selected',
        'q_form_button': 'q_form_button',
        'q_form_progress_bar': 'q_form_progress_bar',
        'q_form_file': 'q_form_file',
        'q_form_progress': 'q_form_progress',
        'q_form_dropdown_active': 'q_form_dropdown_active',
        'q_window_close': 'q_window_close',
        'q_window_minimize': 'q_window_minimize',
        'q_window_maximize': 'q_window_maximize',
        'tag_name': 'tag_name',
        'tag_input': 'tag_input',
        'tag_close': 'tag_close',
        'tag_value': 'tag_value',
        'tag_icon_small': 'tag_icon_small',
        'tag_rating': 'tag_rating',
        'tag_container': 'tag_container',
        'tag_tag': 'tag_tag',
        'tag_icon': 'tag_icon',
        'tag_up': 'tag_up',
        'tag_down': 'tag_down',
    });
    return {
        Tag: function (options = {}) {
            const defaultOptions = {
                min: 0,
                max: 10,
                step: 1,
                value: 0,
                digit: 3,
                flood: 500,
                disabled: false,
                removable: true,
                votes: true,
                readonly: false,
                placeholder: ''
            };
            let { min, max, step, digit, votes, removable, flood } = { ...defaultOptions, ...options };
            if (step.toString().includes('.')) {
                digit = step.toString().split('.')[1].length;
            }
            let data = [];
            let changeCallback = _n;
            const tagContainer = Q('<div>', { class: classes.tag_container });
            const input = Q('<input>', { class: classes.tag_input });
            const malformFix = Q('<input>', { class: classes.tag_input });
            let ID = Q.ID(5, '_');
            const changeTagValue = (tag, delta, currentValue) => {
                let newValue = tag.value + delta;
                newValue = _ma.min(_ma.max(newValue, min), max);
                tag.value = parseFloat(newValue.toFixed(digit));
                currentValue.text(tag.value);
                data = data.map(t => (t.tag === tag.tag ? { ...t, value: tag.value } : t));
                if (changeCallback) Q.Debounce(ID, flood, changeCallback);
            };
            const appendTags = tags => {
                tags.forEach(tag => {
                    const tagElement = Q('<div>', { class: classes.tag_tag });
                    let tagValue = Q('<div>', { class: classes.tag_name }).text(tag.tag);
                    if (votes) {
                        const tagRate = Q('<div>', { class: classes.tag_rating });
                        const upvote = Q('<div>', { class: [classes.tag_icon, classes.tag_up] }).html(Icon('arrow-up'));
                        const currentValue = Q('<div>', { class: classes.tag_value }).text(tag.value);
                        const downvote = Q('<div>', { class: [classes.tag_icon, classes.tag_down] }).html(Icon('arrow-down'));
                        tagRate.append(downvote, currentValue, upvote);
                        tagElement.append(tagRate);
                        upvote.on('click', () => changeTagValue(tag, step, currentValue));
                        downvote.on('click', () => changeTagValue(tag, -step, currentValue));
                    }
                    if (!defaultOptions.readonly) {
                        tagValue.attr('contenteditable', true);
                        tagValue.on('input', function () {
                            malformFix.val(tagValue.text());
                            tagValue.text(malformFix.val());
                            tag.tag = malformFix.val();
                            if (changeCallback) Q.Debounce(ID, flood, changeCallback);
                        });
                    }
                    tagElement.append(tagValue);
                    if (removable) {
                        const close = Q('<div>', { class: [classes.tag_icon_small, classes.tag_close] }).html(Icon('window-close'));
                        close.on('click', () => {
                            data = data.filter(t => t.tag !== tag.tag);
                            tagElement.remove();
                            if (changeCallback) Q.Debounce(ID, flood, changeCallback);
                        });
                        tagElement.append(close);
                    }
                    tagContainer.append(tagElement);
                });
            };
            tagContainer.add = function (taglist) {
                tagContainer.empty();
                if (!_ar.isArray(taglist)) {
                    taglist = [taglist];
                }
                taglist = taglist.map(tag => (typeof tag === 'string' ? { tag, value: 0 } : tag));
                data = [...data, ...taglist];
                appendTags(data);
            };
            tagContainer.get = function () {
                return data;
            };
            tagContainer.change = function (callback) {
                changeCallback = callback;
            };
            return tagContainer;
        },
        DatePicker: function (value = '', locale = window.navigator.language, range = false) {
            let getFirstDayOfWeek = () => {
                let startDate = new _da();
                let dayOfWeek = startDate.getDay();
                startDate.setDate(startDate.getDate() - dayOfWeek);
                return startDate.toLocaleDateString(locale, { weekday: 'short' });
            };
            let daysLocale = (short = true) => {
                let days = [];
                let baseDate = new _da(2021, 0, 4);
                const options = { weekday: short ? 'short' : 'long' };
                let firstDayOfWeek = getFirstDayOfWeek();
                while (baseDate.toLocaleDateString(locale, options) !== firstDayOfWeek) {
                    baseDate.setDate(baseDate.getDate() - 1);
                }
                for (let i = 0; i < 7; i++) {
                    let date = new _da(baseDate);
                    date.setDate(date.getDate() + i);
                    days.push(date.toLocaleDateString(locale, options));
                }
                return days;
            };
            let monthsLocale = (short = true) => {
                let months = [];
                for (let i = 0; i < 12; i++) {
                    let date = new _da(2021, i, 1);
                    months.push(date.toLocaleDateString(locale, { month: short ? 'short' : 'long' }));
                }
                return months;
            };
            let date = value ? new _da(value) : new _da();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let daysInMonth = new _da(year, month, 0).getDate();
            let firstDay = new _da(year, month - 1, 1).getDay();
            let lastDay = new _da(year, month - 1, daysInMonth).getDay();
            let days = daysLocale(true);
            let dayNames = days.map((dayName, i) => {
                let dayElement = Q('<div>');
                dayElement.text(dayName);
                return dayElement;
            });
            let wrapper = Q('<div class="datepicker_wrapper">');
            let header = Q('<div class="datepicker_header">');
            let body = Q('<div class="datepicker_body">');
            let footer = Q('<div class="datepicker_footer">');
            let weekdays = Q('<div class="datepicker_weekdays">');
            let days_wrapper = Q('<div class="datepicker_days">');
            let dateInput = Q('<input type="date">');
            let button_ok = this.Button('OK');
            let button_today = this.Button('Today');
            footer.append(button_today, button_ok);
            body.append(weekdays, days_wrapper);
            wrapper.append(header, body, footer);
            let container_months = Q('<div>');
            let container_years = Q('<div>');
            header.append(container_months, container_years);
            if (wrapper.inside(classes.q_window)) {
                let button_cancel = this.Button('Cancel');
                footer.append(button_cancel);
                button_cancel.click(function () {
                    wrapper.closest('.' + classes.q_window).hide(200);
                });
            }
            container_months.on('click', function () {
            });
            button_today.click(function () {
                date = new _da();
                day = date.getDate();
                month = date.getMonth() + 1;
                year = date.getFullYear();
                daysInMonth = new _da(year, month, 0).getDate();
                firstDay = new _da(year, month - 1, 1).getDay();
                lastDay = new _da(year, month - 1, daysInMonth).getDay();
                populateDays(month, year, day);
                populateHeader(month, year, day);
            });
            const populateHeader = function (month, year, day) {
                let months = monthsLocale(false);
                container_months.text(months[month - 1]);
                container_years.text(year);
            }
            let populateDays = function (month, year, day) {
                days_wrapper.empty();
                let daysInPrevMonth = new _da(year, month - 1, 0).getDate();
                let prevMonthDays = [];
                for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
                    let dayElement = Q('<div>');
                    dayElement.text(i);
                    dayElement.addClass('days prev_month');
                    prevMonthDays.push(dayElement);
                }
                let currentMonthDays = [];
                for (let i = 1; i <= daysInMonth; i++) {
                    let dayElement = Q('<div>');
                    dayElement.text(i);
                    dayElement.addClass('days current_month');
                    if (i === day) {
                        dayElement.addClass('day_selected');
                    }
                    currentMonthDays.push(dayElement);
                }
                let nextMonthDays = [];
                for (let i = 1; i <= 7 - lastDay; i++) {
                    let dayElement = Q('<div>');
                    dayElement.text(i);
                    dayElement.addClass('days next_month');
                    nextMonthDays.push(dayElement);
                }
                days_wrapper.append(...prevMonthDays, ...currentMonthDays, ...nextMonthDays);
            };
            weekdays.append(...dayNames);
            populateDays(month, year, day);
            populateHeader(month, year, day);
            days_wrapper.on('click', function (e) {
                let target = Q(e.target);
                if (target.hasClass('days')) {
                    let day = parseInt(target.text());
                    if (target.hasClass('prev_month')) {
                        if (month === 1) {
                            month = 12;
                            year--;
                        } else {
                            month--;
                        }
                    } else if (target.hasClass('next_month')) {
                        if (month === 12) {
                            month = 1;
                            year++;
                        } else {
                            month++;
                        }
                    }
                    date = new _da(year, month - 1, day);
                    populateDays(month, year, day);
                    populateHeader(month, year, day);
                }
            });
            return wrapper;
        },
        ProgressBar: function (value = 0, min = 0, max = 100, autoKill = 0) {
            let timer = _n;
            const progress = Q('<div class="' + classes.q_form + ' ' + classes.q_form_progress + '">');
            const bar = Q('<div class="' + classes.q_form_progress_bar + '">');
            progress.append(bar);
            function clearAutoKillTimer() {
                if (timer) {
                    _ct(timer);
                    timer = _n;
                }
            }
            function setAutoKillTimer() {
                if (autoKill > 0) {
                    clearAutoKillTimer();
                    timer = _st(() => {
                        progress.hide();
                    }, autoKill);
                }
            }
            progress.value = function (value) {
                const range = max - min;
                const newWidth = ((value - min) / range) * 100 + '%';
                if (bar.css('width') !== newWidth) {
                    bar.css({ width: newWidth });
                }
                progress.show();
                clearAutoKillTimer();
                setAutoKillTimer();
            };
            progress.min = function (value) {
                min = value;
                progress.value(value);
            };
            progress.max = function (value) {
                max = value;
                progress.value(value);
            };
            progress.autoKill = function (delay) {
                autoKill = delay;
                setAutoKillTimer();
            };
            progress.value(value);
            return progress;
        },
        Button: function (text = '') {
            const button = Q(`<div class="${classes.q_form} ${classes.q_form_button}">${text}</div>`);
            button.click = function (callback) {
                button.on('click', callback);
            };
            button.disabled = function (state) {
                if (state) {
                    button.addClass(classes.q_form_disabled);
                }
                else {
                    button.removeClass(classes.q_form_disabled);
                }
            };
            button.text = function (text) {
                button.text(text);
            };
            button.remove = function () {
                button.remove();
            };
            return button;
        },
        File: function (text = '', accept = '*', multiple = false) {
            const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_file + ' ' + classes.q_form_button + '">');
            const input = Q(`<input type="file" accept="${accept}" ${multiple ? 'multiple' : ''}>`);
            const label = Q(`<div>${text}</div>`);
            container.append(input, label);
            input.disabled = function (state) {
                input.prop('disabled', state);
                if (state) {
                    container.addClass(classes.q_form_disabled);
                } else {
                    container.removeClass(classes.q_form_disabled);
                }
            };
            container.change = function (callback) {
                input.on('change', function () {
                    callback(this.files);
                });
            };
            container.image = function (processText = '', size, callback) {
                input.on('change', function () {
                    label.text(processText);
                    let files = this.files;
                    let fileReaders = [];
                    let images = [];
                    for (let i = 0; i < files.length; i++) {
                        if (!files[i].type.startsWith('image/')) {
                            continue;
                        }
                        fileReaders[i] = new FileReader();
                        fileReaders[i].onload = function (e) {
                            let img = new Image();
                            img.onload = function () {
                                if (size !== 'original') {
                                    let canvas = document.createElement('canvas');
                                    let ctx = canvas.getContext('2d');
                                    let width = size;
                                    let height = (img.height / img.width) * width;
                                    canvas.width = width;
                                    canvas.height = height;
                                    ctx.drawImage(img, 0, 0, width, height);
                                    images.push(canvas.toDataURL('image/png'));
                                } else {
                                    images.push(e.target.result);
                                }
                                if (images.length === files.length) {
                                    label.text(text);
                                    callback(images);
                                }
                            };
                            img.src = e.target.result;
                        };
                        fileReaders[i].readAsDataURL(files[i]);
                    }
                });
            };
            return container;
        },
        DropDown: function (data) {
            let wrapper = Q('<div class="' + classes.q_form + ' ' + classes.q_form_dropdown + '">');
            let selected = Q('<div class="' + classes.q_form_dropdown_selected + '">');
            let options = Q('<div class="' + classes.q_form_dropdown_options + '">');
            options.hide();
            wrapper.append(selected, options);
            let valueMap = new Map();
            data.forEach((item, index) => {
                let option = Q('<div class="' + classes.q_form_dropdown_option + '">');
                option.html(item.content);
                if (item.disabled) {
                    option.addClass(classes.q_form_disabled);
                }
                options.append(option);
                valueMap.set(option, item.value);
            });
            selected.html(data[0].content);
            let selectedValue = data[0].value;
            function deselect() {
                options.hide();
                document.removeEventListener('click', deselect);
            }
            options.find('.' + classes.q_form_dropdown_option).first().addClass(classes.q_form_dropdown_active);
            options.on('click', function (e) {
                let target = Q(e.target);
                if (target.hasClass(classes.q_form_dropdown_option) && !target.hasClass(classes.q_form_disabled)) {
                    selected.html(target.html());
                    selectedValue = valueMap.get(target);
                    deselect();
                    options.find('.' + classes.q_form_dropdown_option).removeClass(classes.q_form_dropdown_active);
                    target.addClass(classes.q_form_dropdown_active);
                }
            });
            selected.on('click', function (e) {
                e.stopPropagation();
                options.toggle();
                if (options.is(':visible')) {
                    document.addEventListener('click', deselect);
                } else {
                    document.removeEventListener('click', deselect);
                }
            });
            wrapper.change = function (callback) {
                options.on('click', function (e) {
                    let target = Q(e.target);
                    if (target.hasClass(classes.q_form_dropdown_option) && !target.hasClass(classes.q_form_disabled)) {
                        callback(valueMap.get(target));
                    }
                });
            };
            wrapper.select = function (value) {
                options.find('.' + classes.q_form_dropdown_option).each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        selected.html(option.html());
                        selectedValue = value;
                        deselect();
                        options.find('.' + classes.q_form_dropdown_option).removeClass(classes.q_form_dropdown_active);
                        option.addClass(classes.q_form_dropdown_active);
                    }
                });
            };
            wrapper.disabled = function (value, state) {
                options.find('.' + classes.q_form_dropdown_option).each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        option.prop('disabled', state);
                        if (state) {
                            option.addClass(classes.q_form_disabled);
                        } else {
                            option.removeClass(classes.q_form_disabled);
                        }
                    }
                });
            };
            wrapper.remove = function (value) {
                options.find('.' + classes.q_form_dropdown_option).each(function () {
                    let option = Q(this);
                    if (valueMap.get(option) === value) {
                        option.remove();
                        valueMap.delete(option);
                    }
                });
            };
            wrapper.value = function () {
                return selectedValue;
            };
            return wrapper;
        },
        Slider: function (min = 0, max = 100, value = 50) {
            const slider = Q('<input type="range" class="' + classes.q_form_slider + '">');
            slider.attr('min', min);
            slider.attr('max', max);
            slider.attr('value', value);
            let slider_wrapper = Q('<div class="' + classes.q_form + ' ' + classes.q_slider_wrapper + '">');
            let slider_value = Q('<div class="' + classes.q_slider_pos + '">');
            slider_wrapper.append(slider_value, slider);
            const slider_width = () => {
                let percent = (slider.val() - slider.attr('min')) / (slider.attr('max') - slider.attr('min')) * 100;
                slider_value.css({
                    width: percent + '%'
                });
            };
            slider.on('input', function () {
                slider_width();
            });
            slider_width();
            slider_wrapper.change = function (callback) {
                slider.on('input', function () {
                    callback(this.value);
                });
            };
            slider_wrapper.value = function (value) {
                if (value !== _un) {
                    slider.val(value);
                    slider.trigger('input');
                }
                return slider.val();
            };
            slider_wrapper.disabled = function (state) {
                slider.prop('disabled', state);
                if (state) {
                    slider_wrapper.addClass(classes.q_form_disabled);
                } else {
                    slider_wrapper.removeClass(classes.q_form_disabled);
                }
            };
            slider_wrapper.min = function (value) {
                if (value !== _un) {
                    slider.attr('min', value);
                    slider.trigger('input');
                }
                return slider.attr('min');
            };
            slider_wrapper.max = function (value) {
                if (value !== _un) {
                    slider.attr('max', value);
                    slider.trigger('input');
                }
                return slider.attr('max');
            };
            slider_wrapper.remove = function () {
                slider_wrapper.remove();
            };
            return slider_wrapper;
        },
        Window: function (title = '', data, width = 300, height = 300, x = 100, y = 10) {
            let dimensions = { width, height, x, y };
            let minimized = false;
            let maximized = false;
            let animation_speed = 200;
            let window_wrapper = Q('<div class="' + classes.q_window + '">');
            let titlebar = Q('<div class="' + classes.q_window_titlebar + '">');
            let titletext = Q('<div class="' + classes.q_window_titletext + '">');
            let uniqueButtons = Q('<div class="' + classes.q_window_unique_buttons + '">');
            let default_buttons = Q('<div class="' + classes.q_window_buttons + '">');
            let content = Q('<div class="' + classes.q_window_content + '">');
            let close = Q('<div class="' + classes.q_window_button + ' ' + classes.q_window_close + '">');
            let minimize = Q('<div class="' + classes.q_window_button + ' ' + classes.q_window_minimize + '">');
            let maximize = Q('<div class="' + classes.q_window_button + ' ' + classes.q_window_maximize + '">');
            close.append(Icon('window-close'));
            minimize.html(Icon('window-minimize'));
            maximize.html(Icon('window-full'));
            content.append(data);
            titletext.text(title);
            titletext.attr('title', title);
            titlebar.append(titletext, uniqueButtons, default_buttons);
            default_buttons.append(minimize, maximize, close);
            window_wrapper.append(titlebar, content);
            dimensions.width = dimensions.width > window_wrapper.parent().width() ? window_wrapper.parent().width() : dimensions.width;
            dimensions.height = dimensions.height > window_wrapper.parent().height() ? window_wrapper.parent().height() : dimensions.height;
            dimensions.x = dimensions.x + dimensions.width > window_wrapper.parent().width() ? window_wrapper.parent().width() - dimensions.width : dimensions.x;
            dimensions.y = dimensions.y + dimensions.height > window_wrapper.parent().height() ? window_wrapper.parent().height() - dimensions.height : dimensions.y;
            window_wrapper.css({
                width: dimensions.width + 'px',
                height: dimensions.height + 'px',
                left: dimensions.x + 'px',
                top: dimensions.y + 'px'
            });
            function debounce(func, wait) {
                let timeout;
                return function (...args) {
                    _ct(timeout);
                    timeout = _st(() => func.apply(this, args), wait);
                };
            }
            function handleResize() {
                const browserWidth = window.innerWidth;
                const browserHeight = window.innerHeight;
                const { left: currentX, top: currentY } = window_wrapper.position();
                let { width: currentWidth, height: currentHeight } = window_wrapper.size();
                currentWidth = _ma.min(currentWidth, browserWidth);
                currentHeight = _ma.min(currentHeight, browserHeight);
                const newX = _ma.min(currentX, browserWidth - currentWidth);
                const newY = _ma.min(currentY, browserHeight - currentHeight);
                window_wrapper.css({
                    width: `${currentWidth}px`,
                    height: `${currentHeight}px`,
                    left: `${newX}px`,
                    top: `${newY}px`
                });
            }
            window.addEventListener('resize', debounce(handleResize, 300));
            close.on('click', function () {
                window_wrapper.animate(200, {
                    opacity: 0,
                    transform: 'scale(0.8)'
                }, function () {
                    window_wrapper.hide();
                });
            });
            minimize.on('click', function () {
                content.toggle();
                if (maximized) {
                    maximized = false;
                    maximize.html(Icon('window-full'));
                    window_wrapper.animate(animation_speed, {
                        width: dimensions.width + 'px',
                        height: dimensions.height + 'px',
                        left: dimensions.x + 'px',
                        top: dimensions.y + 'px'
                    }, function () {
                        window_wrapper.removeTransition();
                    });
                }
                if (minimized) {
                    minimize.html(Icon('window-minimize'));
                    window_wrapper.css({
                        height: dimensions.height + 'px'
                    });
                    minimized = false;
                    handleResize();
                } else {
                    minimize.html(Icon('window-windowed'));
                    window_wrapper.css({
                        height: titlebar.height() + 'px'
                    });
                    minimized = true;
                }
            });
            maximize.on('click', function () {
                if (minimized) {
                    minimize.html(Icon('window-minimize'));
                    minimized = false;
                    if (!content.is(':visible')) {
                        content.toggle();
                    }
                }
                if (maximized) {
                    maximized = false;
                    maximize.html(Icon('window-full'));
                    window_wrapper.animate(animation_speed, {
                        width: dimensions.width + 'px',
                        height: dimensions.height + 'px',
                        left: dimensions.x + 'px',
                        top: dimensions.y + 'px'
                    }, function () {
                        window_wrapper.removeTransition();
                        handleResize();
                    });
                } else {
                    maximized = true;
                    maximize.html(Icon('window-windowed'));
                    window_wrapper.animate(animation_speed, {
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        borderRadius: 0
                    }, function () {
                        window_wrapper.removeTransition();
                    });
                }
            });
            const zindex = () => {
                let highestZIndex = 0;
                Q('.q_window').each(function () {
                    let zIndex = parseInt(Q(this).css('z-index'));
                    if (zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                    }
                });
                return highestZIndex + 1;
            };
            titlebar.on('pointerdown', function (e) {
                let offset = window_wrapper.position();
                let x = e.clientX - offset.left;
                let y = e.clientY - offset.top;
                window_wrapper.css({
                    'z-index': zindex()
                });
                const pointerMoveHandler = function (e) {
                    let left = e.clientX - x;
                    let top = e.clientY - y;
                    left = _ma.max(0, left);
                    top = _ma.max(0, top);
                    let currentWidth = window_wrapper.width();
                    let currentHeight = window_wrapper.height();
                    left = _ma.min(window.innerWidth - currentWidth, left);
                    top = _ma.min(window.innerHeight - currentHeight, top);
                    dimensions.x = left;
                    dimensions.y = top;
                    window_wrapper.css({
                        left: dimensions.x + 'px',
                        top: dimensions.y + 'px'
                    });
                };
                const pointerUpHandler = function () {
                    Q(document).off('pointermove', pointerMoveHandler);
                    Q(document).off('pointerup', pointerUpHandler);
                };
                Q(document).on('pointermove', pointerMoveHandler);
                Q(document).on('pointerup', pointerUpHandler);
            });
            window_wrapper.show = function () {
                if (window_wrapper.isExists()) {
                    window_wrapper.fadeIn(200);
                }
                else {
                    Q('body').append(window_wrapper);
                }
            };
            window_wrapper.hide = function () {
                window_wrapper.fadeOut(200);
            };
            window_wrapper.title = function (newTitle) {
                if (newTitle !== _un) {
                    titletext.text(newTitle);
                }
                return titletext.text();
            };
            window_wrapper.content = function (newContent) {
                if (newContent !== _un) {
                    content.html(newContent);
                }
            };
            window_wrapper.close = function () {
                close.click();
            };
            window_wrapper.minimize = function () {
                minimize.click();
            };
            window_wrapper.maximize = function () {
                maximize.click();
            };
            window_wrapper.remove = function () {
                window_wrapper.remove();
            };
            return window_wrapper;
        },
        CheckBox: function (checked = false, text = '') {
            let ID = '_' + Q.ID();
            const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_checkbox + '">');
            const checkbox_container = Q('<div class="' + classes.q_form_cb + '">');
            const input = Q(`<input type="checkbox" id="${ID}">`);
            const label = Q(`<label for="${ID}">${text}</label>`);
            const labeltext = Q(`<div class="label">${text}</div>`);
            checkbox_container.append(input, label);
            container.append(checkbox_container, labeltext);
            container.checked = function (state) {
                input.prop('checked', state);
                if (state) {
                    input.trigger('change');
                }
            };
            container.change = function (callback) {
                input.on('change', function () {
                    callback(this.checked);
                });
            };
            container.disabled = function (state) {
                input.prop('disabled', state);
                if (state) {
                    container.addClass(classes.q_form_disabled);
                } else {
                    container.removeClass(classes.q_form_disabled);
                }
            };
            container.text = function (text) {
                labeltext.text(text);
            };
            return container;
        },
        TextBox: function (type = 'text', value = '', placeholder = '') {
            const input = Q(`<input class="${classes.q_form} ${classes.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);
            input.placeholder = function (text) {
                input.attr('placeholder', text);
            };
            input.disabled = function (state) {
                input.prop('disabled', state);
                if (state) {
                    input.addClass(classes.q_form_disabled);
                } else {
                    input.removeClass(classes.q_form_disabled);
                }
            };
            input.reset = function () {
                input.val('');
            };
            input.change = function (callback) {
                input.on('change', function () {
                    callback(this.value);
                });
            };
            return input;
        },
        TextArea: function (value = '', placeholder = '') {
            const textarea = Q(`<textarea class="${classes.q_form} ${classes.q_form_textarea}" placeholder="${placeholder}">${value}</textarea>`);
            textarea.placeholder = function (text) {
                textarea.attr('placeholder', text);
            };
            textarea.disabled = function (state) {
                textarea.prop('disabled', state);
                if (state) {
                    textarea.addClass(classes.q_form_disabled);
                } else {
                    textarea.removeClass(classes.q_form_disabled);
                }
            };
            textarea.reset = function () {
                textarea.val('');
            };
            textarea.change = function (callback) {
                textarea.on('change', function () {
                    callback(this.value);
                });
            };
            return textarea;
        },
        Radio: function (data) {
            let wrapper = Q('<div class="q_form q_form_radio_wrapper">');
            let radios = [];
            data.forEach((item, index) => {
                let ID = '_' + Q.ID();
                const container = Q('<div class="' + classes.q_form + ' ' + classes.q_form_radio + '">');
                const radio_container = Q('<div class="' + classes.q_form_r + '">');
                const input = Q(`<input type="radio" id="${ID}" name="${item.name}" value="${item.value}">`);
                const label = Q(`<label for="${ID}"></label>`);
                const labeltext = Q(`<div class="label">${item.text}</div>`);
                if (item.disabled) {
                    input.prop('disabled', true);
                    container.addClass(classes.q_form_disabled);
                }
                radios.push({ container, input, labeltext });
                radio_container.append(input, label);
                container.append(radio_container, labeltext);
                wrapper.append(container);
            });
            wrapper.change = function (callback) {
                radios.forEach(radio => {
                    radio.input.on('change', function () {
                        if (this.checked) {
                            callback(this.value);
                        }
                    });
                });
            };
            wrapper.select = function (value) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.input.prop('checked', true).trigger('click');
                    }
                });
            };
            wrapper.disabled = function (value, state) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.input.prop('disabled', state);
                        if (state) {
                            radio.container.addClass(classes.q_form_disabled);
                        } else {
                            radio.container.removeClass(classes.q_form_disabled);
                        }
                    }
                });
            };
            wrapper.text = function (value, text) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.labeltext.text(text);
                    }
                });
            };
            wrapper.remove = function (value) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.container.remove();
                    }
                });
            };
            wrapper.reset = function () {
                radios.forEach(radio => radio.input.prop('checked', false));
            };
            wrapper.checked = function (value, state) {
                radios.forEach(radio => {
                    if (radio.input.val() === value) {
                        radio.input.prop('checked', state);
                    }
                });
            };
            return wrapper;
        }
    };
};
Q.Icons = function (data, classes) {
    let classes = Q.style(`
:root {
    --svg_arrow-down: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 100.93685,31.353867 C 82.480099,48.598492 67.319803,62.707709 67.247301,62.707709 c -0.0725,0 -15.232809,-14.109215 -33.689561,-31.353842 L 3.5365448e-8,6.6845858e-7 H 67.247301 134.4946 Z"/></svg>');
    --svg_arrow-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="M 31.353844,100.93685 C 14.109219,82.480099 1.6018623e-6,67.319803 1.6018623e-6,67.247301 1.6018623e-6,67.174801 14.109217,52.014492 31.353844,33.55774 L 62.70771,0 V 67.247301 134.4946 Z"/></svg>');
    --svg_arrow-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="m 31.353868,33.55775 c 17.244625,18.456749 31.353842,33.617045 31.353842,33.689547 0,0.0725 -14.109215,15.232809 -31.353842,33.689563 L 1.6018623e-6,134.4946 V 67.247297 0 Z"/></svg>');
    --svg_arrow-up: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 33.55775,31.353843 C 52.014499,14.109218 67.174795,6.6845858e-7 67.247297,6.6845858e-7 67.319797,6.6845858e-7 82.480106,14.109216 100.93686,31.353843 L 134.4946,62.707709 H 67.247297 3.5365448e-8 Z"/></svg>');
    --svg_window-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 2.8176856,98.903421 -4.0360052e-7,96.085741 22.611458,73.473146 45.222917,50.860554 22.611458,28.247962 -4.0360052e-7,5.6353711 2.8176856,2.8176851 5.6353716,-9.1835591e-7 28.247963,22.611458 50.860555,45.222916 73.473147,22.611458 96.085743,-9.1835591e-7 98.903423,2.8176851 101.72111,5.6353711 79.109651,28.247962 56.498193,50.860554 79.109651,73.473146 101.72111,96.085741 98.903423,98.903421 96.085743,101.72111 73.473147,79.109651 50.860555,56.498192 28.247963,79.109651 5.6353716,101.72111 Z"/></svg>');
    --svg_window-full: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 H 50.860555 84.417403 V 50.860554 84.417401 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z"/></svg>');
    --svg_window-minimize: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 0.5252846,83.893071 V 79.698469 H 50.860555 101.19582 v 4.194602 4.19461 H 50.860555 0.5252846 Z"/></svg>');
    --svg_window-windowed: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 h 8.389212 8.389212 V 8.9144961 0.52528408 H 67.638978 101.19582 V 34.082131 67.638977 h -8.389207 -8.38921 v 8.389212 8.389212 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z M 92.806613,34.082131 V 8.9144961 H 67.638978 42.471343 v 4.1946059 4.194606 h 20.973029 20.973031 v 20.973029 20.973029 h 4.1946 4.19461 z"/></svg>');
}
.svg_window-close {
    -webkit-mask: var(--svg_window-close) no-repeat center;
    mask: var(--svg_window-close) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_window-full {
    -webkit-mask: var(--svg_window-full) no-repeat center;
    mask: var(--svg_window-full) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_window-minimize {
    -webkit-mask: var(--svg_window-minimize) no-repeat center;
    mask: var(--svg_window-minimize) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_window-windowed {
    -webkit-mask: var(--svg_window-windowed) no-repeat center;
    mask: var(--svg_window-windowed) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_arrow-down {
    -webkit-mask: var(--svg_arrow-down) no-repeat center;
    mask: var(--svg_arrow-down) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_arrow-left {
    -webkit-mask: var(--svg_arrow-left) no-repeat center;
    mask: var(--svg_arrow-left) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_arrow-right {
    -webkit-mask: var(--svg_arrow-right) no-repeat center;
    mask: var(--svg_arrow-right) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_arrow-up {
    -webkit-mask: var(--svg_arrow-up) no-repeat center;
    mask: var(--svg_arrow-up) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
     `, {});
};
Q.Image = function (options) {
    let Canvas = Q('<canvas>');
    let canvas_node = Canvas.nodes[0];
    let defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        size: 'auto',
        quality: 1
    }
    options = _ob.assign(defaultOptions, options);
    Canvas.Load = function (src, callback) {
        let img = new Image();
        img.src = src;
        img.onload = function () {
            canvas_node.width = img.width;
            canvas_node.height = img.height;
            canvas_node.getContext('2d').drawImage(img, 0, 0);
            if (callback) callback();
        };
    }
    Canvas.Get = function (format = options.format, quality = options.quality) {
        if (format === 'jpeg' || format === 'webp') {
            return canvas_node.toDataURL('image/' + format, quality);
        } else {
            return canvas_node.toDataURL('image/' + format);
        }
    }
    Canvas.Save = function (filename, format = options.format, quality = options.quality) {
        let href = Canvas.Get(format, quality);
        let a = Q('<a>', { download: filename, href: href });
        a.click();
    }
    Canvas.Clear = function (fill = options.fill) {
        let ctx = canvas_node.getContext('2d');
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
    }
    Canvas.Resize = function (width, height, size = options.size, keepDimensions = false) {
        options.width = width;
        options.height = height;
        options.size = size;
        _c.log(keepDimensions);
        let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
        let ctx = temp.getContext('2d');
        let ratio = 1;
        let canvasWidth = canvas_node.width;
        let canvasHeight = canvas_node.height;
        if (size === 'contain') {
            if (keepDimensions) {
                let widthRatio = width / canvasWidth;
                let heightRatio = height / canvasHeight;
                ratio = _ma.min(widthRatio, heightRatio);
                let newWidth = canvasWidth * ratio;
                let newHeight = canvasHeight * ratio;
                let xOffset = (width - newWidth) / 2;
                let yOffset = (height - newHeight) / 2;
                ctx.fillStyle = options.fill;
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
            } else {
                let widthRatio = width / canvasWidth;
                let heightRatio = height / canvasHeight;
                ratio = _ma.min(widthRatio, heightRatio);
                let newWidth = canvasWidth * ratio;
                let newHeight = canvasHeight * ratio;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
            }
        } else if (size === 'cover') {
            let widthRatio = width / canvasWidth;
            let heightRatio = height / canvasHeight;
            ratio = _ma.max(widthRatio, heightRatio);
            let newWidth = canvasWidth * ratio;
            let newHeight = canvasHeight * ratio;
            let xOffset = (newWidth - width) / 2;
            let yOffset = (newHeight - height) / 2;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas_node, -xOffset, -yOffset, newWidth, newHeight);
        } else if (size === 'auto') {
            ratio = _ma.min(width / canvasWidth, height / canvasHeight);
            let newWidth = canvasWidth * ratio;
            let newHeight = canvasHeight * ratio;
            ctx.fillStyle = options.fill;
            ctx.fillRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
        }
        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }
    Canvas.Crop = function (x, y, width, height) {
        let temp = Q('<canvas>', { width: width, height: height });
        temp.getContext('2d').drawImage(canvas_node, x, y, width, height, 0, 0, width, height);
        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }
    Canvas.Rotate = function (degrees) {
        let temp = Q('<canvas>', { width: canvas_node.height, height: canvas_node.width });
        let ctx = temp.getContext('2d');
        ctx.translate(canvas_node.height / 2, canvas_node.width / 2);
        ctx.rotate(degrees * _ma.PI / 180);
        ctx.drawImage(canvas_node, -canvas_node.width / 2, -canvas_node.height / 2);
        canvas_node.width = temp.width;
        canvas_node.height = temp.height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }
    Canvas.Flip = function (direction = 'horizontal')
    {
        let temp = Q('<canvas>', { width: canvas_node.width, height: canvas_node.height });
        let ctx = temp.getContext('2d');
        ctx.translate(canvas_node.width, 0);
        ctx.scale(direction == 'horizontal' ? -1 : 1, direction == 'vertical' ? -1 : 1);
        ctx.drawImage(canvas_node, 0, 0);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }
    Canvas.Grayscale = function () {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }
    Canvas.Brightness = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] += value;
            pixels[i + 1] += value;
            pixels[i + 2] += value;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }
    Canvas.Contrast = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let factor = (259 * (value + 255)) / (255 * (259 - value));
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = factor * (pixels[i] - 128) + 128;
            pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
            pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }
    Canvas.Vivid = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = _ma.min(255, pixels[i] * value);
            pixels[i + 1] = _ma.min(255, pixels[i + 1] * value);
            pixels[i + 2] = _ma.min(255, pixels[i + 2] * value);
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }
    Canvas.Hue = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let hsl = Q.RGB2HSL(r, g, b);
            hsl[0] += value;
            let rgb = Q.HSL2RGB(hsl[0], hsl[1], hsl[2]);
            pixels[i] = rgb[0];
            pixels[i + 1] = rgb[1];
            pixels[i + 2] = rgb[2];
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }
    Canvas.Sharpen = function (options) {
        let defaults = {
            amount: 1,
            threshold: 0,
            radius: 1,
            quality: 1
        };
        options = _ob.assign(defaults, options);
        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let weights = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        let katet = _ma.round(_ma.sqrt(weights.length));
        let half = _ma.floor(katet / 2);
        let divisor = weights.reduce((sum, weight) => sum + weight, 0) || 1;
        let offset = 0;
        let dataCopy = new Uint8ClampedArray(pixels);
        let width = canvas_node.width;
        let height = canvas_node.height;
        let iterations = _ma.round(options.quality);
        let iteration = 0;
        while (iteration < iterations) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    let dstOff = (y * width + x) * 4;
                    for (let cy = 0; cy < katet; cy++) {
                        for (let cx = 0; cx < katet; cx++) {
                            let scy = y + cy - half;
                            let scx = x + cx - half;
                            if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                                let srcOff = (scy * width + scx) * 4;
                                let wt = weights[cy * katet + cx];
                                r += dataCopy[srcOff] * wt;
                                g += dataCopy[srcOff + 1] * wt;
                                b += dataCopy[srcOff + 2] * wt;
                            }
                        }
                    }
                    r = _ma.min(_ma.max((r / divisor) + offset, 0), 255);
                    g = _ma.min(_ma.max((g / divisor) + offset, 0), 255);
                    b = _ma.min(_ma.max((b / divisor) + offset, 0), 255);
                    if (_ma.abs(dataCopy[dstOff] - r) > options.threshold) {
                        pixels[dstOff] = r;
                        pixels[dstOff + 1] = g;
                        pixels[dstOff + 2] = b;
                    }
                }
            }
            iteration++;
        }
        ctx.putImageData(data, 0, 0);
    }
    Canvas.Emboss = function (options) {
        let defaults = {
            strength: 1,
            direction: 'top-left',
            blend: true,    
            grayscale: true  
        };
        options = _ob.assign(defaults, options);
        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;
        let dataCopy = new Uint8ClampedArray(pixels);
        let kernels = {
            'top-left': [-2, -1, 0, -1, 1, 1, 0, 1, 2],
            'top-right': [0, -1, -2, 1, 1, -1, 2, 1, 0],
            'bottom-left': [0, 1, 2, -1, 1, 1, -2, -1, 0],
            'bottom-right': [2, 1, 0, 1, 1, -1, 0, -1, -2]
        };
        let kernel = kernels[options.direction] || kernels['top-left'];
        let katet = _ma.sqrt(kernel.length); 
        let half = _ma.floor(katet / 2);
        let strength = options.strength;
        let divisor = 1; 
        let offset = 128; 
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                let dstOff = (y * width + x) * 4;
                for (let cy = 0; cy < katet; cy++) {
                    for (let cx = 0; cx < katet; cx++) {
                        let scy = y + cy - half;
                        let scx = x + cx - half;
                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            let srcOff = (scy * width + scx) * 4; 
                            let wt = kernel[cy * katet + cx];
                            r += dataCopy[srcOff] * wt;
                            g += dataCopy[srcOff + 1] * wt;
                            b += dataCopy[srcOff + 2] * wt;
                        }
                    }
                }
                r = (r / divisor) * strength + offset;
                g = (g / divisor) * strength + offset;
                b = (b / divisor) * strength + offset;
                if (options.grayscale) {
                    let avg = (r + g + b) / 3;
                    r = g = b = avg;
                }
                r = _ma.min(_ma.max(r, 0), 255);
                g = _ma.min(_ma.max(g, 0), 255);
                b = _ma.min(_ma.max(b, 0), 255);
                if (options.blend) {
                    pixels[dstOff] = (pixels[dstOff] + r) / 2;
                    pixels[dstOff + 1] = (pixels[dstOff + 1] + g) / 2;
                    pixels[dstOff + 2] = (pixels[dstOff + 2] + b) / 2;
                } else {
                    pixels[dstOff] = r;
                    pixels[dstOff + 1] = g;
                    pixels[dstOff + 2] = b;
                }
            }
        }
        ctx.putImageData(data, 0, 0);
    }
    Canvas.Blur = function (options) {
        let defaults = {
            radius: 5, 
            quality: 1 
        };
        options = _ob.assign(defaults, options);
        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;
        function gaussianKernel(radius) {
            let size = 2 * radius + 1;
            let kernel = new Float32Array(size * size);
            let sigma = radius / 3;
            let sum = 0;
            let center = radius;
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let dx = x - center;
                    let dy = y - center;
                    let weight = _ma.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
                    kernel[y * size + x] = weight;
                    sum += weight;
                }
            }
            for (let i = 0; i < kernel.length; i++) {
                kernel[i] /= sum;
            }
            return {
                kernel: kernel,
                size: size
            };
        }
        let { kernel, size } = gaussianKernel(options.radius);
        let half = _ma.floor(size / 2);
        let iterations = _ma.round(options.quality);
        function applyBlur() {
            let output = new Uint8ClampedArray(pixels);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    let dstOff = (y * width + x) * 4;
                    for (let ky = 0; ky < size; ky++) {
                        for (let kx = 0; kx < size; kx++) {
                            let ny = y + ky - half;
                            let nx = x + kx - half;
                            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                let srcOff = (ny * width + nx) * 4;
                                let weight = kernel[ky * size + kx];
                                r += pixels[srcOff] * weight;
                                g += pixels[srcOff + 1] * weight;
                                b += pixels[srcOff + 2] * weight;
                            }
                        }
                    }
                    output[dstOff] = r;
                    output[dstOff + 1] = g;
                    output[dstOff + 2] = b;
                }
            }
            return output;
        }
        for (let i = 0; i < iterations; i++) {
            pixels = applyBlur();
        }
        ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
    }
    return Canvas;
}
Q.ImageViewer = function () {
    _c.log('ImageViewer Plugin Loaded');
    let classes = Q.style(`
.image_viewer_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
image_viewer_wrapper .image_wrapper {
    position: relative;
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.left_button, .right_button, .close_button {
    position: absolute;
    background: rgba(255,255,255,0.5);
    border: none;
    cursor: pointer;
    padding: 10px;
}
.left_button {
    left: 10px;
}
.right_button {
    right: 10px;
}
.close_button {
    top: 10px;
    right: 10px;
}
    `, {
        'image_viewer_wrapper': 'image_viewer_wrapper'
    });
    class Viewer {
        constructor() {
            this.selector = _n;
            this.images = []; 
            this.currentIndex = 0;
            this.construct();
            this.eventHandler = this.handleClick.bind(this);
            this.eventListenerActive = false;
            this.addEventListener();
        }
        construct() {
            this.wrapper = Q('<div>', { class: classes.image_viewer_wrapper });
            this.image_wrapper = Q('<div>', { class: 'image_wrapper' });
            this.left_button = Q('<button>', { class: 'left_button', text: 'Prev' });
            this.right_button = Q('<button>', { class: 'right_button', text: 'Next' });
            this.close_button = Q('<button>', { class: 'close_button', text: 'Close' });
            this.wrapper.append(this.left_button, this.image_wrapper, this.right_button, this.close_button);
            this.left_button.on('click', () => this.prev());
            this.right_button.on('click', () => this.next());
            this.close_button.on('click', () => this.close());
            this.left_button.hide();
            this.right_button.hide();
        }
        handleClick(e) {
            if (e.target.closest(this.selector)) {
                const src = e.target.src;
                if (src) {
                    this.open([src]);
                }
            }
        }
        addEventListener() {
            if (!this.eventListenerActive) {
                document.addEventListener('click', this.eventHandler);
                this.eventListenerActive = true;
            }
        }
        removeEventListener() {
            if (this.eventListenerActive) {
                document.removeEventListener('click', this.eventHandler);
                this.eventListenerActive = false;
            }
        }
        open(images) {
            this.construct(); 
            this.images = images;
            this.currentIndex = 0; 
            this.updateImage();
            this.updateNavigation();
            Q('body').append(this.wrapper);
        }
        close() {
            this.wrapper.remove();
        }
        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateImage();
                this.updateNavigation();
            }
        }
        next() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
                this.updateImage();
                this.updateNavigation();
            }
        }
        updateImage() {
            const src = this.images[this.currentIndex];
            this.image_wrapper.empty();
            const img = Q('<img>', { src: src});
            this.image_wrapper.append(img);
        }
        updateNavigation() {
            if (this.images.length > 1) {
                if (this.currentIndex > 0) {
                    this.left_button.show();
                } else {
                    this.left_button.hide();
                }
                if (this.currentIndex < this.images.length - 1) {
                    this.right_button.show();
                } else {
                    this.right_button.hide();
                }
            } else {
                this.left_button.hide();
                this.right_button.hide();
            }
        }
        setSelector(selector) {
            this.selector = selector;
            this.addEventListener();
        }
        remove() {
            this.removeEventListener();
            this.wrapper.remove();
        }
    }
    let viewer = new Viewer();
    return {
        selector: function (selector) {
            viewer.setSelector(selector);
            return this;
        },
        open: function (images) {
            viewer.open(images);
            return this;
        },
        close: function () {
            viewer.close();
            return this;
        },
        remove: function () {
            viewer.remove();
            return this;
        }
    };
}
Q.JSON = function (a) {
    if (!(this instanceof Q.JSON)) {
        return new Q.JSON(a);
    }
    this.json = a;
};
Q.JSON.prototype.Parse = function (options = { modify: false, recursive: false }, e) {
    const process = (b) => {
        if (typeof b === 'object' && b !== _n && !_ar.isArray(b)) {
            for (const c in b) {
                if (b.hasOwnProperty(c)) {
                    const d = e(c, b[c]);
                    if (modify) {
                        b[c] = d;
                    }
                    if (recursive && typeof b[c] === 'object' && b[c] !== _n) {
                        process(b[c]);
                    }
                }
            }
        }
    };
    process(this.json);
    return this.json;
};
Q.JSON.prototype.deflate = function (level) {
    const f = {};
    let g = 1;
    function j(h) {
        if (typeof h === 'object' && h !== _n) {
            for (let c in h) {
                if (typeof h[c] === 'object') {
                    j(h[c]);
                }
                if (c.length >= level) {
                    if (!f[c]) {
                        f[c] = `[${g}]`;
                        g++;
                    }
                    const newKey = f[c];
                    h[newKey] = h[c];
                    delete h[c];
                }
                if (typeof h[c] === 'string' && h[c].length >= level) {
                    if (!f[h[c]]) {
                        f[h[c]] = `[${g}]`;
                        g++;
                    }
                    h[c] = f[h[c]];
                }
            }
        }
    }
    const i = JSON.parse(JSON.stringify(this.json));
    j(i);
    return { b: i, f: f };
};
Q.JSON.prototype.inflate = function (l) {
    const { b, f } = l;
    const m = _ob.fromEntries(_ob.entries(f).f(([k, v]) => [v, k]));
    function p(h) {
        if (typeof h === 'object' && h !== _n) {
            for (let c in h) {
                const n = m[c] || c;
                const o = h[c];
                delete h[c];
                h[n] = o;
                if (typeof h[n] === 'object') {
                    p(h[n]);
                } else if (m[h[n]]) {
                    h[n] = m[h[n]];
                }
            }
        }
    }
    const q = JSON.parse(JSON.stringify(b));
    p(q);
    return q;
};
Q.NodeBlock = function (selector, width, height, options) {
    let classes = Q.style(`
.node_preferences {
    position: absolute;
    width: 350px;
    max-height: 300px;
    background: #181818;
    overflow: hidden;
    overflow-y: scroll;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.pref_content h1, .pref_content h2, .pref_content h3, .pref_content h4, .pref_content h5, .pref_content h6 {
line-break: anywhere;
margin: 0 0 2px 0;
padding: 0;
}
.pref_content h1 { font-size: 150%; }
.pref_content h2 { font-size: 140%; }
.pref_content h3 { font-size: 130%; }
.pref_content h4 { font-size: 120%; }
.pref_content h5 { font-size: 110%; }
.pref_content h6 { font-size: 100%; }
.pref_content p { margin: 0; padding: 0; color: #7a7a7a; }
.pref_content ul { margin: 5px 5px; padding-left: 15px; color: #7a7a7a; }
.pref_content li { padding: 0px; margin: 0px; }
.pref_content table { border-collapse: collapse; width: 100%; }
.pref_content table, th, td { padding: 0; margin: 0; font-size: 90%; line-break: anywhere; border: 1px solid #222; }
.pref_content th, td { padding: 1px; text-align: left; }
.pref_content th { background-color: #222; }
.pref_content tfoot { background-color: #222; }
.pref_title {
    font-size: 12px;
    margin: 5px;
    color: #7a7a7a;
    text-align: center;
}
.node_preferences::-webkit-scrollbar {
    width: 10px;
}
.node_preferences::-webkit-scrollbar-track {
    background: #3a3a3a;
}
.node_preferences::-webkit-scrollbar-thumb {
    background: #242424;
}
.node_preferences::-webkit-scrollbar-thumb:hover {
    background: #555;
}
.pref_content {
    background-color: #1d1d1d;
    border: 0;
    outline: 0;
    color: #7a7a7a;
    font-size: 12px !important;
    padding: 5px 5px;
}
.pref_content img {
    width: 100%;
    height: auto;
}
.connection_content {
    display: flex;
    justify-content: space-between;
}
.left,
.right {
    width: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 5px;
}
.connection_wrapper {
    display: flex;
    justify-content: space-between;
    margin: 1px;
}
.color_wrapper {
    position: relative;
    width: 20px;
    height: 20px;
    overflow: hidden;
    flex-shrink: 0;
}
.color {
    position: absolute;
    width: 100px;
    top: -20px;
    left: -20px;
    height: 100px;
}
.connection {
    font-size: 12px;
padding: 0 5px;
    width: 100%;
    background-color: #1d1d1d;
    border: 0;
    outline: 0;
    color: #7a7a7a;
    font-size: 12px !important;
}
.button_nodes {
    background: #2e2e2e;
    color: #6e6e6e;
    border: 0;
    cursor: pointer;
    font-size: 8px;
    width: 15px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.button_nodes_big {
    background: #2e2e2e;
    color: #6e6e6e;
    border: 0;
    cursor: pointer;
    font-size: 12px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.button_add
{
    margin:1px;
    width: 20px;
    height: 20px;
}
        `, {
        "node_preferences": "node_preferences",
        "pref_title": "pref_title",
        "pref_content": "pref_content",
        "connection_content": "connection_content",
        "left": "left",
        "right": "right",
        "connection_wrapper": "connection_wrapper",
        "color_wrapper": "color_wrapper",
        "connection": "connection",
        "button_nodes": "button_nodes",
        "button_nodes_big": "button_nodes_big",
        "button_add": "button_add",
        "name": "_name",
        "content": "_content",
        "manipulation": "manipulation",
        "color": "color",
        "pref_section": "pref_section",
    }, false);
    class UMLBlock {
        constructor(custom_style, appearance, id, name, text, x, y, width, connLeft = [], connRight = [], connections = []) {
            this.name = name;
            this.text = text;
            this.t_text = "";
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.connections = connections;
            this.connLeft = connLeft;
            this.connRight = connRight;
            this.height = 0;
            this.isDragging = false;
            this.leftConnCoords = [];
            this.rightConnCoords = [];
            this.img = _n;
            this.content = _n;
            this.contentHeight = 0;
            this.unescapedBase64Data = _n;
            this.appearance = appearance;
            this.custom_style = custom_style;
            this.appearance = _ob.assign({}, this.appearance, custom_style);
            this.darkText = '#ffffff';
            this.lightText = '#000000';
            this._processColors();
        }
        _restyle(object) {
            this.custom_style = object;
            this.appearance = _ob.assign({}, this.appearance, object);
            this._processColors();
            this.t_text = '';
        }
        _processColors() {
            this.appearance.titleBackground = Q.ColorBrightness(this.appearance.background, this.appearance.factorTitleBackground);
            const isDark = Q.isDarkColor(this.appearance.background, this.appearance.factorDarkColorMargin, this.appearance.factorDarkColorThreshold);
            const textColor = isDark ? this.appearance.darkTextColor : this.appearance.lightTextColor;
            const borderColor = isDark ? Q.ColorBrightness(this.appearance.background, this.appearance.factorLightColors) : Q.ColorBrightness(this.appearance.background, this.appearance.factorDarkColors);
            this.appearance.titleColor = textColor;
            this.appearance.connectionTextColor = textColor;
            this.appearance.textColor = textColor;
            this.appearance.node_table_color = borderColor;
        }
        _drawContainer(ctx, x, y, width, height) {
            const { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, background, radius } = this.appearance;
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
            ctx.fillStyle = background;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius); 
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.arcTo(x, y, x + radius, y, radius);                
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        _drawTitle(ctx, x, y, width, height, title) {
            ctx.fillStyle = this.appearance.titleBackground;
            ctx.beginPath();
            ctx.moveTo(x + this.appearance.radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, this.appearance.radius);
            ctx.arcTo(x + width, y + height, x, y + height, 0);
            ctx.arcTo(x, y + height, x, y, 0);
            ctx.arcTo(x, y, x + width, y, this.appearance.radius);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = this.appearance.titleColor;
            ctx.font = 'bold ' + this.appearance.fontSizeTitle + 'px ' + this.appearance.font;
            const titleX = x + (width - ctx.measureText(title).width) / 2;
            const titleY = y + (height + this.appearance.fontSizeTitle) / 2;
            ctx.fillText(title, titleX, titleY);
        }
        parseHTML2Canvas(html, callback) {
            html = html.replace(/style="[^"]*"/g, '');
            html = html.replace(/<br>/g, '');
            if (this.t_text == html) {
                callback(this.content, this.contentHeight);
                return;
            }
            this.t_text = html;
            let tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.visibility = 'hidden';
            tempContainer.style.width = (this.width - this.appearance.fontSize) + 'px';
            document.body.appendChild(tempContainer);
            let style = document.createElement('style');
            let st = `
            table {border-collapse: collapse; width: 100%;}
            table, th, td {padding: 0; margin: 0; font-size: ${(this.appearance.fontSize * 0.9)}px; line-break: anywhere;border: 1px solid ${this.appearance.node_table_color};}
            th, td {padding: 1px; text-align: left;}
            th {background-color: ${this.appearance.node_table_color};}
            tfoot {background-color: ${this.appearance.node_table_color};}
            h1, h2, h3, h4, h5, h6 {line-break: anywhere; margin: 0 0 2px 0; padding: 0;}
            h1 {font-size: ${(this.appearance.fontSize * 1.5)}px;}
            h2 {font-size: ${(this.appearance.fontSize * 1.4)}px;}
            h3 {font-size: ${(this.appearance.fontSize * 1.3)}px;}
            h4 {font-size: ${(this.appearance.fontSize * 1.2)}px;}
            h5 {font-size: ${(this.appearance.fontSize * 1.1)}px;}
            h6 {font-size: ${(this.appearance.fontSize * 1.0)}px;}
                            p { margin: 0; padding: 0; color: ${this.appearance.textColor}; }
                            ul { margin: 5px 5px; padding-left: 15px; color: ${this.appearance.textColor}; }
                            li { padding: 0px; margin: 0px; }
                            div {font-family: ${this.appearance.font}, sans-serif; font-size: ${this.appearance.fontSize}px; color: ${this.appearance.textColor}; }
                        `;
            style.innerHTML = st;
            document.head.appendChild(style);
            tempContainer.innerHTML = html;
            this.contentHeight = tempContainer.offsetHeight + this.appearance.padding;
            document.body.removeChild(tempContainer);
            document.head.removeChild(style);
            this.content = document.createElement('canvas');
            this.content.width = this.width;
            this.content.height = this.contentHeight;
            let ctx = this.content.getContext('2d');
            let data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (this.width - (this.appearance.padding * 2)) + '" height="' + this.contentHeight + '">' + // Update SVG height
                '<foreignObject width="100%" height="100%">' +
                '<style>' +
                st +
                '</style>' +
                '<div xmlns="http://www.w3.org/1999/xhtml">' +
                html +
                '</div>' +
                '</foreignObject>' +
                '</svg>';
            let DOMURL = window.URL || window.webkitURL || window;
            let img = new Image();
            let svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            let url = DOMURL.createObjectURL(svg);
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
                callback(this.content, this.contentHeight);
            };
            img.src = url;
        }
        draw(ctx) {
            const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
            const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
            const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
            const maxConnectionsHeight = _ma.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;
            const updateContainerHeight = (contentHeight) => {
                this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
            };
            const drawImageContent = (img, drawX, drawY, drawWidth, drawHeight) => {
                const contentHeight = drawHeight + this.appearance.padding;
                updateContainerHeight(contentHeight);
                this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
                this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
            };
            const isBase64Image = this.text.includes('base64');
            const extractBase64Data = () => {
                const base64Match = this.text.match(/base64,([^"]*)/);
                return base64Match && base64Match[1] ? base64Match[1] : _n;
            };
            if (isBase64Image) {
                const base64Data = extractBase64Data();
                if (!base64Data) return;
                if (this.base64Data === base64Data.length) {
                    const imgWidth = this.img.width;
                    const imgHeight = this.img.height;
                    const aspectRatio = imgHeight / imgWidth;
                    const drawWidth = this.width - (this.appearance.padding * 2);
                    const drawHeight = drawWidth * aspectRatio;
                    const drawX = this.x + this.appearance.padding;
                    const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding) + maxConnectionsHeight;
                    drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
                    return;
                }
                const unescapedBase64Data = 'data:image/png;base64,' + decodeURIComponent(base64Data);
                this.img = new Image();
                this.img.src = unescapedBase64Data;
                this.base64Data = base64Data.length;
                this.img.onload = () => {
                    const imgMatch = this.text.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch && imgMatch[1]) {
                        this.text = `<img src="${imgMatch[1]}"/>`;
                    }
                    const imgWidth = this.img.width;
                    const imgHeight = this.img.height;
                    const aspectRatio = imgHeight / imgWidth;
                    const drawWidth = this.width - (this.appearance.padding * 2);
                    const drawHeight = drawWidth * aspectRatio;
                    const drawX = this.x + this.appearance.padding;
                    const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding) + maxConnectionsHeight;
                    drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
                };
                return;
            } else {
                this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
                    updateContainerHeight(contentHeight);
                    this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
                    this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
                    ctx.drawImage(canvas, this.x + this.appearance.padding, this.y + TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
                    this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
                });
            }
        }
        drawConnectionPoints(ctx, paddingTop, height) {
            const connectionY = this.y + paddingTop;
            const font = `bold ${this.appearance.fontSizeConnection}px ${this.appearance.font}`;
            const pointSize = this.appearance.connectionPointSize;
            const connectionPaddingX = this.appearance.connectionTextPaddingX;
            const middleYOffset = ((pointSize / 2) + (this.appearance.fontSizeConnection / 2)) - this.appearance.connectionTextPaddingY;
            this.leftConnCoords = [];
            this.rightConnCoords = [];
            ctx.font = font;
            const drawConnectionPoints = (connList, coordsArray, baseX, getTextX) => {
                connList.forEach((conn, index) => {
                    const connY = connectionY + index * height;
                    coordsArray.push({ x: baseX, y: connY });
                    ctx.fillStyle = conn.color || this.appearance.connectionColor;
                    ctx.beginPath();
                    ctx.arc(baseX, connY, pointSize, 0, 2 * _ma.PI);
                    ctx.fill();
                    ctx.fillStyle = this.appearance.connectionTextColor;
                    ctx.fillText(conn.title, getTextX(conn.title, baseX), connY + middleYOffset);
                });
            };
            if (_ar.isArray(this.connLeft)) {
                drawConnectionPoints(this.connLeft, this.leftConnCoords, this.x, (title, baseX) => baseX + connectionPaddingX * 2);
            }
            if (_ar.isArray(this.connRight)) {
                drawConnectionPoints(this.connRight, this.rightConnCoords, this.x + this.width, (title, baseX) => baseX - ctx.measureText(title).width - connectionPaddingX * 2);
            }
        }
        addConnection(conn) {
            this.connections.push(conn);
        }
        removeConnection(conn) {
            this.connections = this.connections.filter(c => c.id !== conn.id);
        }
        isMouseOver(mouseX, mouseY) {
            return mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height;
        }
        getAllConnectionCoords() {
            return [...this.leftConnCoords, ...this.rightConnCoords];
        }
        getConnectionCoord(point, index) {
            return point === 'left' ? this.leftConnCoords[index] : this.rightConnCoords[index];
        }
    }
    class UMLCanvas {
        constructor(selector, width, height, appearance, classes) {
            this.element_parent = Q(selector);
            this.canvas = Q('<canvas>', { width: width, height: height });
            this.width = width;
            this.height = height;
            this.element_parent.append(this.canvas);
            this.canvas_context = this.canvas.nodes[0].getContext('2d');
            this.blocks = [];
            this.connections = [];
            this.draggingBlock = _n;
            this.offsetX = 0;
            this.offsetY = 0;
            this.connection_start = _n;
            this.connection_end = _n;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isMenuPreferences = false;
            this.isDraggingBlock = false;
            this.isOverConnection = false;
            this.appearance = appearance;
            this.classes = classes;
            this.canvas.on('click', this._event_click.bind(this));
            this.canvas.on('mousedown', this._event_pointer_down.bind(this));
            this.canvas.on('mousemove', this._event_pointer_move.bind(this));
            this.canvas.on('mouseup', this._event_pointer_up.bind(this));
            this.canvas.on('contextmenu', this._event_click_right.bind(this), false);
        }
        import(uml) {
            const blockCreationPromises = uml.blocks.map(async (block) => {
                const newBlock = new UMLBlock(
                    block.custom_style,
                    this.appearance,
                    block.id, block.name, block.text, block.x, block.y, block.width,
                    block.connLeft.map(conn => ({ id: conn.id, title: conn.title, color: conn.color })),
                    block.connRight.map(conn => ({ id: conn.id, title: conn.title, color: conn.color })),
                    block.connections
                );
                this.addBlock(newBlock);
            });
            _pr.all(blockCreationPromises).then(() => {
                uml.connections.forEach(conn => {
                    const startBlock = this.blocks.find(b => b.id === conn.id);
                    const endBlock = this.blocks.find(b => b.id === conn.target);
                    const startCoords = this._point_coords(startBlock, conn.point);
                    const endCoords = this._point_coords(endBlock, conn.targetPoint);
                    if (startCoords && endCoords) {
                        this._connection_create(
                            { block: startBlock, point: conn.point, x: startCoords.x, y: startCoords.y },
                            { block: endBlock, point: conn.targetPoint, x: endCoords.x, y: endCoords.y }
                        );
                    } else {
                        _c.error('Connection failed to initialize:', startBlock, endBlock);
                    }
                });
            }).catch(err => {
                _c.error('_er during block initialization:', err);
            });
        }
        export() {
            return {
                blocks: this.blocks.map(block => ({
                    custom_style: block.custom_style,
                    id: block.id,
                    name: block.name,
                    text: block.text,
                    x: block.x,
                    y: block.y,
                    width: block.width,
                    connLeft: block.connLeft,
                    connRight: block.connRight,
                    connections: block.connections
                })),
                connections: this.connections.map(conn => ({
                    id: conn.start.block.id,
                    point: conn.start.point,
                    target: conn.end.block.id,
                    targetPoint: conn.end.point
                }))
            };
        }
        async addBlock(block) {
            this.blocks.push(block);
            await this._connections_init(block);
            this.render();
        }
        removeBlock(block) {
            this.blocks = this.blocks.filter(b => b.id !== block.id);
            this.connections = this.connections.filter(conn =>
                conn.start.block.id !== block.id && conn.end.block.id !== block.id
            );
            this.render();
        }
        getJointContent() {
            let block = this.blocks[0];
            let content = block.text;
            let connections = block.connections;
            let nextBlock = _n;
            while (connections.length > 0) {
                let conn = connections[0];
                nextBlock = this.blocks.find(b => b.id === conn.end.block.id);
                content += nextBlock.text;
                connections = nextBlock.connections;
            }
            return content;
        }
        duplicateBlock(block) {
            let id = this._id();
            const newBlock = new UMLBlock(
                block.custom_style,
                this.appearance,
                id, block.name, block.text, block.x + 50, block.y + 50, block.width,
                block.connLeft, block.connRight, []
            );
            this.addBlock(newBlock);
        }
        render_grid() {
            _c.log('Rendering grid');
            let ctx = this.canvas_context;
            let w = this.width;
            let h = this.height;
            let grid_size = this.appearance.gridSize;
            let grid_color = this.appearance.gridColor;
            ctx.strokeStyle = grid_color;
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += grid_size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += grid_size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }
        render() {
            this.canvas_context.clearRect(0, 0, this.width, this.height);
            this.render_grid();
            this.connections.forEach(conn => {
                let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                let endColor = this._getConnectionColor(conn.end.block, conn.end.point);
                this.canvas_context.strokeStyle = 'rgb(150, 150, 150)';
                this.canvas_context.beginPath();
                this.canvas_context.lineWidth = 2;
                let gradient = this.canvas_context.createLinearGradient(conn.start.x, conn.start.y, conn.end.x, conn.end.y);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                this.canvas_context.strokeStyle = gradient;
                this.canvas_context.moveTo(conn.start.x, conn.start.y);
                this.canvas_context.lineTo(conn.end.x, conn.end.y);
                this.canvas_context.stroke();
                let dx = conn.end.x - conn.start.x;
                let dy = conn.end.y - conn.start.y;
                let length = _ma.sqrt(dx * dx + dy * dy);
                let unitDx = dx / length;
                let unitDy = dy / length;
                let arrowLength = 10;
                let arrowWidth = 5;
                for (let i = 100; i < length; i += 200) {
                    let x = conn.start.x + unitDx * i;
                    let y = conn.start.y + unitDy * i;
                    this.canvas_context.beginPath();
                    this.canvas_context.moveTo(x, y);
                    this.canvas_context.lineTo(x - arrowLength * unitDx + arrowWidth * unitDy, y - arrowLength * unitDy - arrowWidth * unitDx);
                    this.canvas_context.lineTo(x - arrowLength * unitDx - arrowWidth * unitDy, y - arrowLength * unitDy + arrowWidth * unitDx);
                    this.canvas_context.closePath();
                    this.canvas_context.fillStyle = gradient;
                    this.canvas_context.fill();
                }
            });
            if (this.connection_start && this.connection_end === _n) {
                let startColor = this._getConnectionColor(this.connection_start.block, this.connection_start.point);
                let gradient = this.canvas_context.createLinearGradient(this.connection_start.x, this.connection_start.y, this.mouseX, this.mouseY);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, "rgb(150, 150, 150)");
                this.canvas_context.strokeStyle = gradient;
                this.canvas_context.beginPath();
                this.canvas_context.moveTo(this.connection_start.x, this.connection_start.y);
                this.canvas_context.lineTo(this.mouseX, this.mouseY);
                this.canvas_context.stroke();
            }
            this.blocks.forEach(block => {
                block.draw(this.canvas_context);
            });
        }
        _getConnectionColor(block, pointId) {
            for (let i = 0; i < block.connLeft.length; i++) {
                if (block.connLeft[i].id === pointId) {
                    return block.connLeft[i].color;
                }
            }
            for (let i = 0; i < block.connRight.length; i++) {
                if (block.connRight[i].id === pointId) {
                    return block.connRight[i].color;
                }
            }
        }
        updateConnections(block) {
            let preferences = Q('.' + classes.node_preferences);
            let left = preferences.find('.' + classes.left);
            let right = preferences.find('.' + classes.right);
            let leftConnections = block.connLeft;
            let rightConnections = block.connRight;
            let newLeftConnections = [];
            left.find('.' + classes.connection_wrapper).walk((element) => {
                let id = element.id();
                let title = element.find('.' + classes.connection).val();
                let color = element.find('.' + classes.color).val();
                newLeftConnections.push({ id: id, title: title, color: color });
            }, true);
            let newRightConnections = [];
            right.find('.' + classes.connection_wrapper).walk((element) => {
                let id = element.id();
                let title = element.find('.' + classes.connection).val();
                let color = element.find('.' + classes.color).val();
                newRightConnections.push({ id: id, title: title, color: color });
            }, true);
            let newConnections = [...newLeftConnections, ...newRightConnections];
            let existingConnections = [...leftConnections, ...rightConnections];
            newConnections.forEach(newConn => {
                let existingConn = existingConnections.find(conn => conn.id === newConn.id);
                if (existingConn) {
                    existingConn.title = (newConn.title && newConn.title !== _n) ? newConn.title : '';
                    existingConn.color = newConn.color;
                } else {
                    existingConnections.push(newConn);
                }
            });
        }
        updateBlock(selectedblock = _n, callback) {
            let preferences = Q('.' + classes.node_preferences);
            let block;
            if (selectedblock) {
                block = selectedblock;
            }
            else {
                block = this.blocks.find(b => b.id === preferences.id());
            }
            let name = preferences.find('#' + classes.name).text();
            let content = preferences.find('#' + classes.content).html();
            block.name = name;
            block.text = content;
            if (callback) callback(block);
        }
        _event_pointer_down(event) {
            if (event.button === 2) return;
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            if (this.isMenuPreferences) {
                this.isMenuPreferences = false;
                if (!Q.isExists('.' + classes.node_preferences + ' #' + classes.name)) {
                    this._menu_remove();
                    return;
                }
                let block = this.blocks.find(b => b.id === Q('.' + classes.node_preferences).id());
                this.updateBlock(block);
                this.updateConnections(block);
                this._menu_remove();
                this.render();
            }
            for (let i = this.blocks.length - 1; i >= 0; i--) {
                let block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this.isDraggingBlock = true;
                    this.draggingBlock = block;
                    this.offsetX = mouseX - block.x;
                    this.offsetY = mouseY - block.y;
                    block.isDragging = true;
                    break;
                }
            }
        }
        _event_pointer_move(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            if (this.draggingBlock) {
                this.draggingBlock.x = mouseX - this.offsetX;
                this.draggingBlock.y = mouseY - this.offsetY;
                this._connection_update();
                this.render();
                return;
            }
            if (this.connection_start && this.connection_end === _n) {
                this.mouseX = mouseX;
                this.mouseY = mouseY;
                this.render();
                return;
            }
            if (this.isOverConnection) {
                this.isOverConnection = false;
                this.render();
            }
            this.connections.forEach(conn => {
                if (this._point_line_segment(mouseX, mouseY, conn.start.x, conn.start.y, conn.end.x, conn.end.y)) {
                    if (!this.isOverConnection) {
                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.start.x, conn.start.y, this.appearance.connectionPointSize + 2, 0, 2 * _ma.PI);
                        let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                        this.canvas_context.strokeStyle = startColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();
                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.end.x, conn.end.y, this.appearance.connectionPointSize + 2, 0, 2 * _ma.PI);
                        let endColor = this._getConnectionColor(conn.end.block, conn.end.point);
                        this.canvas_context.strokeStyle = endColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();
                        this.isOverConnection = true;
                    }
                }
            });
        }
        _event_pointer_up(event) {
            if (this.draggingBlock) {
                this.isDraggingBlock = false;
                this.draggingBlock.isDragging = false;
                this.draggingBlock = _n;
                this._connection_update();
                this.render();
            }
            if (this.connection_start && this.connection_end === _n) {
                _st(() => {
                    this.connection_start = _n;
                    this.mouseX = 0;
                    this.mouseY = 0;
                    this.render();
                }, 100);
            }
        }
        _event_click(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            for (let block of this.blocks) {
                if (this._connection_over_point(block, mouseX, mouseY)) {
                    if (this.connection_start === _n) {
                        this.connection_start = this._point_details(block, mouseX, mouseY);
                    }
                    else if (this.connection_end === _n) {
                        this.connection_end = this._point_details(block, mouseX, mouseY);
                        if (this.connection_start.block !== this.connection_end.block &&
                            !this._connection_exists(this.connection_start, this.connection_end)) {
                            this._connection_create(this.connection_start, this.connection_end);
                            block.addConnection({ id: this.connection_start.block.id, point: this.connection_start.point });
                        } else {
                            this.connection_start = _n;
                            this.connection_end = _n;
                            this.render();
                        }
                        this.connection_start = _n;
                        this.connection_end = _n;
                    }
                    return;
                }
            }
        }
        _menu_context(x, y) {
            let div = Q('<div>', { class: [classes.node_preferences], style: { position: 'absolute', left: x + 'px', top: y + 'px' } });
            this.isMenuPreferences = true;
            let add = Q('<div>', { class: ['button_nodes_big'], text: 'Create Block' });
            add.on('click', () => {
                let id = this._id();
                let nodes = this.blocks.length + 1;
                let block = new UMLBlock({}, this.appearance, id, 'Node ' + nodes, 'Content', x, y, this.appearance.blockWidth, [{ id: this._id(), title: '', color: this.appearance.connectionColor }], [{ id: this._id(), title: '', color: this.appearance.connectionColor }]);
                this.addBlock(block);
                this._menu_remove();
            });
            div.append(add);
            this.element_parent.append(div);
        }
        _event_click_right(event) {
            event.preventDefault();
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            if (this.isMenuPreferences) {
                this.isMenuPreferences = false;
                if (!Q.isExists('.' + classes.node_preferences + ' #' + classes.name)) {
                    this._menu_remove();
                    return;
                }
                let block = this.blocks.find(b => b.id === Q('.' + classes.node_preferences).id());
                this.updateBlock(block);
                this.updateConnections(block);
                this._menu_remove();
                this.render();
            }
            for (let i = this.blocks.length - 1; i >= 0; i--) {
                let block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this._menu_remove();
                    this._menu_preferences(block, mouseX, mouseY);
                    return;
                }
            }
            for (let i = 0; i < this.connections.length; i++) {
                let conn = this.connections[i];
                if (this._point_line_segment(mouseX, mouseY, conn.start.x, conn.start.y, conn.end.x, conn.end.y)) {
                    const startBlock = this.blocks.find(b => b.id === conn.start.block.id);
                    const endBlock = this.blocks.find(b => b.id === conn.end.block.id);
                    if (startBlock && endBlock) {
                        startBlock.removeConnection({ id: endBlock.id, point: conn.start.point });
                    }
                    this.connections.splice(i, 1);
                    this.render();
                    return;
                }
            }
            this._menu_context(mouseX, mouseY);
            this.render();
        }
        _id() {
            return '_' + _ma.random().toString(36).substr(2, 9);
        }
        _menu_remove() {
            _c.log(classes.node_preferences);
            Q('.' + classes.node_preferences).remove();
            this.isMenuPreferences = false;
        }
        _menu_item_section(title, content) {
            let div = Q('<div>', { class: [classes.pref_section] });
            let titleDiv = Q('<div>', { class: [classes.pref_title], text: title });
            div.append(titleDiv, content);
            return div;
        }
        _menu_item_input(id, content, placeholder) {
            let input = Q('<div>', { class: [classes.pref_content], id: id, contentEditable: true, html: content, placeholder: placeholder });
            return input;
        }
        _menu_item_connections(block) {
            let div = Q('<div>', { class: [classes.connection_content] });
            let left = Q('<div>', { class: [classes.left] });
            let right = Q('<div>', { class: [classes.right] });
            const connItem = (pos, conn) => {
                let connection_wrapper = Q('<div>', { class: [classes.connection_wrapper], id: conn.id });
                let connection = Q('<input>', { class: [classes.connection], type: 'text', value: conn.title, placeholder: 'Point...', maxLength: 10 });
                let color_wrapper = Q('<div>', { class: [classes.color_wrapper] });
                let color = Q('<input>', { class: [classes.color], type: 'color', value: conn.color });
                color_wrapper.append(color);
                color.on('change', () => {
                    conn.color = color.val();
                    this.render();
                });
                connection.on('input', () => {
                    let contitle = connection.val();
                    conn.title = (conn.title && contitle !== _n) ? contitle : '';
                    this.updateConnections(block);
                    this.render();
                });
                connection_wrapper.append(color_wrapper, connection);
                let remove = Q('<div>', { class: [classes.button_nodes], text: 'X' });
                remove.on('click', () => {
                    connection_wrapper.remove();
                    this.connections = this.connections.filter(c => {
                        if (c.start.block.id === block.id && c.start.point === conn.id) {
                            let targetBlock = this.blocks.find(b => b.id === c.end.block.id);
                            targetBlock.removeConnection({ id: block.id, point: c.end.point });
                            return false;
                        }
                        if (c.end.block.id === block.id && c.end.point === conn.id) {
                            let targetBlock = this.blocks.find(b => b.id === c.start.block.id);
                            targetBlock.removeConnection({ id: block.id, point: c.start.point });
                            return false;
                        }
                        return true;
                    });
                    if (pos === 'left') { block.connLeft = block.connLeft.filter(c => c.id !== conn.id); }
                    if (pos === 'right') { block.connRight = block.connRight.filter(c => c.id !== conn.id); }
                    this.render();
                });
                connection_wrapper.append(remove);
                return connection_wrapper;
            };
            block.connLeft.forEach(conn => {
                let connection_wrapper = connItem('left', conn);
                left.append(connection_wrapper);
            });
            block.connRight.forEach(conn => {
                let connection_wrapper = connItem('right', conn);
                right.append(connection_wrapper);
            });
            let add = Q('<button>', { class: [classes.button_nodes, classes.button_add], text: '+' });
            add.on('click', () => {
                let id = this._id();
                let connection = { id: id, title: '', color: '#333333' };
                block.connLeft.push(connection);
                left.append(connItem('left', connection));
                left.append(add);
                this.render();
            });
            left.append(add);
            let addRight = Q('<button>', { class: [classes.button_nodes, classes.button_add], text: '+' });
            addRight.on('click', () => {
                let id = this._id();
                let connection = { id: id, title: '', color: '#333333' };
                block.connRight.push(connection);
                right.append(connItem('right', connection));
                right.append(addRight);
                this.render();
            });
            right.append(addRight);
            div.append(left, right);
            return div;
        }
        _menu_manipulation(block) {
            let div = Q('<div>', { class: [classes.manipulation] });
            let color_wrapper = Q('<div>', { class: [classes.color_wrapper] });
            let color = Q('<input>', { class: [classes.color], type: 'color', value: block.appearance.background });
            color_wrapper.append(color);
            color.on('change', () => {
                block._restyle({ background: color.val() });
                this.render();
            });
            div.append(color_wrapper);
            let delete_button = Q('<div>', { class: [classes.button_nodes_big], text: 'Delete Block' });
            delete_button.on('click', () => {
                this.removeBlock(block);
                this._menu_remove();
            });
            let duplicate_button = Q('<div>', { class: [classes.button_nodes_big], text: 'Duplicate Block' });
            duplicate_button.on('click', () => {
                this.duplicateBlock(block);
                this._menu_remove();
            });
            div.append(color_wrapper, delete_button, duplicate_button);
            return div;
        }
        _menu_preferences(block, x, y) {
            let div = Q('<div>', { class: [classes.node_preferences], id: block.id });
            div.css({ position: 'absolute', left: x + 'px', top: y + 'px' });
            let title = this._menu_item_section('Class', this._menu_item_input(classes.name, block.name, 'Class name...'));
            let content = this._menu_item_section('Content', this._menu_item_input(classes.content, block.text, 'Content...'));
            let connections = this._menu_item_section('Connections', this._menu_item_connections(block));
            let manipulation = this._menu_item_section('Manipulation', this._menu_manipulation(block));
            div.append(title, content, connections, manipulation);
            this.element_parent.append(div);
            this.isMenuPreferences = true;
        }
        _connections_init(block) {
            block.connections.forEach(conn => {
                const targetBlock = this.blocks.find(b => b.id === conn.id);
                if (targetBlock) {
                    const startCoords = this._point_coords(block, 'right');
                    const endCoords = this._point_coords(targetBlock, 'left');
                    this._connection_create(
                        { block: block, point: 'right', x: startCoords.x, y: startCoords.y },
                        { block: targetBlock, point: conn.point, x: endCoords.x, y: endCoords.y }
                    );
                }
            });
        }
        _blocks_connected(block1, block2) {
            return this.connections.some(connection =>
                (connection.start.block === block1 && connection.end.block === block2) ||
                (connection.start.block === block2 && connection.end.block === block1)
            );
        }
        _connection_exists(startConn, endConn) {
            return this.connections.some(conn =>
                (conn.start.block === startConn.block && conn.start.point === startConn.point &&
                    conn.end.block === endConn.block && conn.end.point === endConn.point) ||
                (conn.start.block === endConn.block && conn.start.point === endConn.point &&
                    conn.end.block === startConn.block && conn.end.point === startConn.point)
            );
        }
        _connection_create(startConn, endConn) {
            this.connections.push({
                start: { block: startConn.block, point: startConn.point, x: startConn.x, y: startConn.y },
                end: { block: endConn.block, point: endConn.point, x: endConn.x, y: endConn.y }
            });
            startConn.block.addConnection({ id: endConn.block.id, point: startConn.point });
            endConn.block.addConnection({ id: startConn.block.id, point: endConn.point });
            this.render();
        }
        _connection_update() {
            this.connections.forEach(conn => {
                const startCoords = this._point_coords(conn.start.block, conn.start.point);
                const endCoords = this._point_coords(conn.end.block, conn.end.point);
                conn.start.x = startCoords.x;
                conn.start.y = startCoords.y;
                conn.end.x = endCoords.x;
                conn.end.y = endCoords.y;
            });
        }
        _point_coords(block, pointId) {
            const leftCoords = block.leftConnCoords;
            const rightCoords = block.rightConnCoords;
            for (let i = 0; i < block.connLeft.length; i++) {
                if (block.connLeft[i].id === pointId) {
                    return { x: leftCoords[i].x, y: leftCoords[i].y };
                }
            }
            for (let i = 0; i < block.connRight.length; i++) {
                if (block.connRight[i].id === pointId) {
                    return { x: rightCoords[i].x, y: rightCoords[i].y };
                }
            }
            return { x: block.x, y: block.y };
        }
        _connection_over_point(block, x, y) {
            const radius = 5;
            return block.getAllConnectionCoords().some(coord => _ma.abs(x - coord.x) < radius && _ma.abs(y - coord.y) < radius);
        }
        _point_details(block, x, y) {
            const radius = 5;
            let matchedPoint = _n;
            block.leftConnCoords.forEach((coord, index) => {
                if (_ma.abs(x - coord.x) < radius && _ma.abs(y - coord.y) < radius) {
                    matchedPoint = { block: block, point: block.connLeft[index].id, x: coord.x, y: coord.y, index: index };
                }
            });
            if (!matchedPoint) {
                block.rightConnCoords.forEach((coord, index) => {
                    if (_ma.abs(x - coord.x) < radius && _ma.abs(y - coord.y) < radius) {
                        matchedPoint = { block: block, point: block.connRight[index].id, x: coord.x, y: coord.y, index: index };
                    }
                });
            }
            return matchedPoint;
        }
        _point_line_segment(px, py, x1, y1, x2, y2) {
            const distance = this._point_line_distance(px, py, x1, y1, x2, y2);
            const buffer = 5;
            return distance <= buffer;
        }
        _point_line_distance(px, py, x1, y1, x2, y2) {
            const A = px - x1;
            const B = py - y1;
            const C = x2 - x1;
            const D = y2 - y1;
            const dot = (A * C) + (B * D);
            const len_sq = (C * C) + (D * D);
            let param = -1;
            if (len_sq !== 0) {
                param = dot / len_sq;
            }
            let xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }
            const dx = px - xx;
            const dy = py - yy;
            return _ma.sqrt((dx * dx) + (dy * dy));
        }
    }
    let appearance = {
        darkTextColor: '#888',
        lightTextColor: '#222',
        background: '#181818',
        grid: true,
        gridColor: '#161616',
        gridSize: 20,
        factorTitleBackground: -20,
        factorDarkColors: -30,
        factorLightColors: 80,
        factorDarkColorMargin: 20,
        factorDarkColorThreshold: 127,
        blockWidth: 200,
        connectionColor: '#333333',
        connectionPointSize: 5,
        connectionPointPadding: 5,
        connectionTextPaddingX: 5,
        connectionTextPaddingY: 5,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        font: 'Arial',
        fontSize: 12,
        fontSizeTitle: 12,
        fontSizeConnection: 10,
        padding: 5,
        radius: 10
    };
    appearance = _ob.assign(appearance, options);
    let uml = new UMLCanvas(selector, width, height, appearance, classes);
    return {
        import: function (data) {
            uml.import(data);
        },
        export: function () {
            return uml.export();
        },
        addBlock: function (block) {
            uml.addBlock(block);
        },
        removeBlock: function (block) {
            uml.removeBlock(block);
        }
    };
}
Q.Socket = function (url, onMessage, onStatus, options = {}) {
    const { retries = 5, delay = 1000, protocols = [] } = options;
    let socket, attempts = 0;
    const connect = () => {
        socket = new WebSocket(url, protocols);
        socket.onopen = () => { onStatus?.('connected'); attempts = 0; };
        socket.onmessage = event => onMessage?.(event.data);
        socket.onerror = error => onStatus?.('error', error);
        socket.onclose = () => {
            if (++attempts <= retries) {
                onStatus?.('closed');
                _st(connect, delay);
            } else {
                onStatus?.('Max retries exceeded');
            }
        };
    };
    connect();
    return {
        send: msg => socket.readyState === WebSocket.OPEN && socket.send(msg),
        reconnect: () => connect(),
        close: () => socket.close()
    };
};
Q.Storage = function (key, value) {
    if (arguments.length === 2) { 
        if (value === _n || value === '') { 
            localStorage.removeItem(key); 
        } else {
            localStorage.setItem(key, JSON.stringify(value)); 
        }
    } else if (arguments.length === 1) { 
        let storedValue = localStorage.getItem(key); 
        try {
            return JSON.parse(storedValue); 
        } catch (e) {
            return storedValue; 
        }
    }
};
Q.String = function (string) {
    if (!(this instanceof Q.String)) {
        return new Q.String(string);
    }
    this.string = string;
};
Q.String.prototype.capitalize = function () {
    return this.string.charAt(0).toUpperCase() + this.string.slice(1);
};
Q.String.prototype.levenshtein = function (string) {
    const a = this.string, b = string;
    const matrix = _ar.from({ length: a.length + 1 }, (_, i) => _ar.from({ length: b.length + 1 }, (_, j) => i || j));
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = _ma.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return matrix[a.length][b.length];
};
Q.String.prototype.find = function (stringOrRegex) {
    return this.string.match(stringOrRegex);
};
Q.String.prototype.replaceAll = function (stringOrRegex, replacement) {
    return this.string.replace(new _re(stringOrRegex, 'g'), replacement);
};
Q.style = (function () {
    let styleData = {
        gen: "",
        root: '',
        element: _n,
        checked: false,
    };
    function applyStyles() {
        if (!styleData.init) {
            styleData.element = document.getElementById('qlib-root-styles') || createStyleElement();
            styleData.init = true;
        }
        let finalStyles = '';
        if (styleData.root) {
            finalStyles = `:root {${styleData.root}}\n`;
        }
        finalStyles += styleData.gen;
        styleData.element.textContent = finalStyles;
    }
    function createStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.id = 'qlib-root-styles';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
    }
    window.addEventListener('load', () => {
        _c.log('Styles plugin loaded.');
        delete Q.style;
    }, { once: true });
    return function (styles, mapping = _n, obfuscate = false) {
        if (typeof styles === 'string') {
            const rootContentMatch = styles.match(/:root\s*{([^}]*)}/);
            if (rootContentMatch) {
                styles = styles.replace(rootContentMatch[0], '');
                const rootContent = rootContentMatch[1].split(';').map(item => item.trim()).filter(item => item);
                styleData.root += rootContent.join(';') + ';';
            }
            if (obfuscate && mapping) {
                const keys = _ob.keys(mapping);
                keys.forEach((key) => {
                    let newKey = Q.ID(5, '_');
                    styles = styles.replace(new _re(`\\b${key}\\b`, 'gm'), newKey);
                    mapping[key] = mapping[key].replace(key, newKey);
                });
            }
            styleData.gen += styles;
            applyStyles();
                return mapping;
        } else {
            _c.error('Invalid styles parameter. Expected a string.');
        }
    };
})();
Q.Task = (function () {
    const tasks = {};
    const runningTasks = {};
    function createTask(id) {
        if (!tasks[id]) {
            tasks[id] = [];
        }
    }
    function addTask(id, ...functions) {
        if (!tasks[id]) {
            createTask(id);
        }
        tasks[id].push(...functions);
    }
    async function runTask(id) {
        if (!tasks[id] || tasks[id].length === 0) {
            _c.error(`No tasks found with ID: ${id}`);
            return;
        }
        runningTasks[id] = {
            doneCallback: _n,
            failCallback: _n,
            timeout: 20000, 
            timeoutCallback: _n,
        };
        const { timeout, timeoutCallback } = runningTasks[id];
        const timeoutPromise = new _pr((_, reject) => {
            const timer = _st(() => {
                abortTask(id);
                reject(new _er(`Task with ID: ${id} timed out after ${timeout / 1000} seconds`));
            }, timeout);
            runningTasks[id].timeoutClear = () => _ct(timer);
        });
        try {
            await _pr.race([
                (async () => {
                    for (const task of tasks[id]) {
                        await new _pr((resolve, reject) => {
                            try {
                                const result = task();
                                if (result instanceof _pr) {
                                    result.then(resolve).catch(reject);
                                } else {
                                    resolve();
                                }
                            } catch (error) {
                                reject(error);
                            }
                        });
                    }
                })(),
                timeoutPromise
            ]);
            if (runningTasks[id]?.doneCallback) {
                runningTasks[id].doneCallback();
            }
        } catch (error) {
            _c.error(`Task with ID: ${id} failed with error:`, error);
            if (runningTasks[id]?.failCallback) {
                runningTasks[id].failCallback(error);
            }
        } finally {
            if (runningTasks[id]?.timeoutClear) {
                runningTasks[id].timeoutClear();
            }
            delete runningTasks[id];
        }
    }
    function abortTask(id) {
        if (runningTasks[id]) {
            delete runningTasks[id];
            _c.log(`Task with ID: ${id} has been aborted.`);
        }
    }
    function taskDone(id, callback) {
        if (runningTasks[id]) {
            runningTasks[id].doneCallback = callback;
        }
    }
    function taskFail(id, callback) {
        if (runningTasks[id]) {
            runningTasks[id].failCallback = callback;
        }
    }
    function setTimeoutForTask(id, seconds) {
        if (runningTasks[id]) {
            runningTasks[id].timeout = seconds * 1000;
        }
    }
    function setTimeoutCallback(id, callback) {
        if (runningTasks[id]) {
            runningTasks[id].timeoutCallback = callback;
        }
    }
    return function (id, ...functions) {
        if (functions.length > 0) {
            addTask(id, ...functions);
        }
        return {
            Run: () => runTask(id),
            Abort: () => abortTask(id),
            Done: callback => taskDone(id, callback),
            Fail: callback => taskFail(id, callback),
            Timeout: (seconds) => setTimeoutForTask(id, seconds),
            TimeoutCallback: (callback) => setTimeoutCallback(id, callback),
        };
    };
})();
Q.Timer = function (callback, id, options = {}) {
    const defaultOptions = {
        tick: 1,
        delay: 1000,
        interrupt: false
    };
    options = { ...defaultOptions, ...options };
    let tickCount = 0;
    let intervalId = _n;
    if (!Q.Timer.activeTimers) {
        Q.Timer.activeTimers = new Map();
    }
    if (options.interrupt && Q.Timer.activeTimers.has(id)) {
        clearInterval(Q.Timer.activeTimers.get(id));
    }
    intervalId = _si(() => {
        callback();
        tickCount++;
        if (options.tick > 0 && tickCount >= options.tick) {
            clearInterval(intervalId);
            Q.Timer.activeTimers.delete(id);
        }
    }, options.delay);
    Q.Timer.activeTimers.set(id, intervalId);
    return intervalId;
};
Q.Timer.stop = function (id) {
    if (Q.Timer.activeTimers && Q.Timer.activeTimers.has(id)) {
        clearInterval(Q.Timer.activeTimers.get(id));
        Q.Timer.activeTimers.delete(id);
    }
};
Q.Timer.stopAll = function () {
    if (Q.Timer.activeTimers) {
        for (let intervalId of Q.Timer.activeTimers.values()) {
            clearInterval(intervalId);
        }
        Q.Timer.activeTimers.clear();
    }
};
return Q;
})();