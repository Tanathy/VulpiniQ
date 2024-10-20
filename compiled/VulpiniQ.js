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
Q.Ext('find', function (b) {
    const foundNodes = this.nodes[0].querySelectorAll(b);
    return foundNodes.length ? Q(foundNodes) : _n;
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
return Q;
})();