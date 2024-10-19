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
    Q.Ext('addClass', a => {
    const b = a.split(' ');
    return this.each(c => this.nodes[c].classList.add(...b));
});
Q.Ext('animate', (a, b, e) => {
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
Q.Ext('append', (...a) => {
    return this.each(e => {
        const b = this.nodes[e];
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
Q.Ext('attr', (a, b) => {
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
Q.Ext('bind', (a, b) => {
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
Q.Ext('blur', () => {
    return this.each(a => this.nodes[a].blur());
});
Q.Ext('children', () => {
    return new Q(this.nodes[0].children);
});
Q.Ext('click', () => {
    return this.each(a => this.nodes[a].click());
});
Q.Ext('clone', () => {
    return new Q(this.nodes[0].cloneNode(true));
});
Q.Ext('closest', a => {
    let b = this.nodes[0];
    while (b) {
        if (b.matches && b.matches(a)) {
            return new Q(b);
        }
        b = b.parentElement;
    }
    return _n;
});
Q.Ext('css', (a, b) => {
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
Q.Ext('data', (a, b) => {
    if (b === _un) {
        return this.nodes[0]?.dataset[a] || _n;
    }
    return this.each(c => this.nodes[c].dataset[a] = b);
});
Q.Ext('each', a => {
    this.nodes.forEach((b, c) => a.call(b, c, b));
    return this;
});
Q.Ext('empty', () => {
    return this.each(a => this.nodes[a].innerHTML = '');
});
Q.Ext('eq', a => {
    return new Q(this.nodes[a]);
});
Q.Ext('fadeIn', (a = 400, b) => {
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
Q.Ext('fadeOut', (a, b) => {
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
Q.Ext('fadeTo', (a, b, c) => {
    return this.each(d => {
        this.nodes[d].style.transition = `a ${b}ms`;
        this.nodes[d].offsetHeight;
        this.nodes[d].style.a = a;
        _st(() => {
            this.nodes[d].style.transition = '';
            if (c) c();
        }, b);
    });
});
Q.Ext('fadeToggle', (a, b) => {
    return this.each(c => {
        if (window.getComputedStyle(this.nodes[c]).opacity === '0') {
            this.fadeIn(a, b);
        } else {
            this.fadeOut(a, b);
        }
    });
});
Q.Ext('find', b => {
    const a = this.nodes[0].querySelectorAll(b);
    return a.length ? Q(a) : _n;
});
Q.Ext('first', () => {
    return new Q(this.nodes[0]);
});
Q.Ext('focus', () => {
    return this.each(a => this.nodes[a].focus());
});
Q.Ext('hasClass', a => {
    return this.nodes[0]?.classList.contains(a) || false;
});
Q.Ext('height', a => {
    if (a === _un) {
        return this.nodes[0].offsetHeight;
    }
    return this.each(b => this.nodes[b].style.height = a);
});
Q.Ext('hide', (a = 0, b) => {
    return this.each(e => {
        const c = this.nodes[e];
        if (a === 0) {
            c.style.display = 'none';
            if (b) b();
        } else {
            c.style.transition = `opacity ${a}ms`;
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
Q.Ext('html', a => {
    if (a.length === 0) {
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
Q.Ext('id', a => {
    if (a === _un) {
        return this.nodes[0].id;
    }
    return this.nodes[0].id = a;
});
Q.Ext('a', a => {
    if (a === _un) {
        return _ar.from(this.nodes[0].parentNode.children).indexOf(this.nodes[0]);
    }
    return this.each(f => {
        const b = this.nodes[f].parentNode;
        const c = _ar.from(b.children);
        const d = c.indexOf(f);
        const e = c.splice(a, 1)[0];
        if (d < a) {
            b.insertBefore(e, f);
        } else {
            b.insertBefore(e, this.nodes[f].nextSibling);
        }
    });
});
Q.Ext('inside', a => {
    return this.nodes[0]?.closest(a) !== _n;
});
Q.Ext('is', a => {
    const b = this.nodes[0];
    if (!b) return false;
    if (typeof a === 'function') {
        return a.call(b, 0, b);
    }
    if (typeof a === 'string') {
        switch (a) {
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
                return b.matches(a);
        }
    }
    if (a?.nodeType === 1 || a?.nodeType != _n) {
        return b === a;
    }
    if (a instanceof Q) {
        return b === a.nodes[0];
    }
    return false;
});
Q.Ext('isExists', () => {
    return document.body.contains(this.nodes[0]);
});
Q.isExists = (a) => document.querySelector(a) !== _n;
Q.Ext('last', () => {
    return new Q(this.nodes[this.nodes.length - 1]);
});
Q.Ext('off', (a, b, c) => {
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
Q.Ext('offset', () => {
    const a = this.nodes[0].getBoundingClientRect();
    return {
        top: a.top + window.scrollY,
        left: a.left + window.scrollX
    };
});
Q.Ext('on', (a, b, c) => {
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
Q.Ext('parent', () => {
    return new Q(this.nodes[0].parentNode);
});
Q.Ext('position', () => {
    return {
        top: this.nodes[0].offsetTop,
        left: this.nodes[0].offsetLeft
    };
});
Q.Ext('prepend', (...a) => {
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
Q.Ext('prop', (a, b) => {
    if (b === _un) {
        return this.nodes[0]?.[a] || _n;
    }
    return this.each((d, c) => {
        c[a] = b;
    });
});
Q.Ext('remove', () => {
    return this.each(a => this.nodes[a].remove());
});
Q.Ext('removeAttr', a => {
    return this.each(b => this.nodes[b].removeAttribute(a));
});
Q.Ext('removeClass', a => {
    const b = a.split(' ');
    return this.each(c => this.nodes[c].classList.remove(...b));
});
Q.Ext('removeData', a => {
    return this.each(b => delete this.nodes[b].dataset[a]);
});
Q.Ext('removeProp', a => {
    return this.each(b => delete this.nodes[b][a]);
});
Q.Ext('removeTransition', () => {
    return this.each(a => this.nodes[a].style.transition = '');
});
Q.Ext('scrollHeight', () => {
    return this.nodes[0].scrollHeight;
});
Q.Ext('scrollLeft', (a, b) => {
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
Q.Ext('scrollTop', (a, b) => {
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
Q.Ext('scrollWidth', () => {
    return this.nodes[0].scrollWidth;
});
Q.Ext('show', (a = 0, b) => {
    return this.each(e => {
        const c = this.nodes[e];
        if (a === 0) {
            c.style.display = '';
            if (b) b();
        } else {
            c.style.transition = `opacity ${a}ms`;
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
Q.Ext('size', () => {
    return {
        width: this.nodes[0].offsetWidth,
        height: this.nodes[0].offsetHeight
    };
});
Q.Ext('text', a => {
    if (a === _un) {
        return this.nodes[0]?.textContent || _n;
    }
    return this.each(b => this.nodes[b].textContent = a);
});
Q.Ext('toggle', () => {
    return this.each(a => this.nodes[a].style.display = this.nodes[a].style.display === 'none' ? '' : 'none');
});
Q.Ext('toggleClass', a => {
    return this.each(b => this.nodes[b].classList.toggle(a));
});
Q.Ext('trigger', a => {
    return this.each((c, b) => {
        b.dispatchEvent(new _ev(a));
    });
});
Q.Ext('unwrap', () => {
    return this.each(b => {
        const a = this.nodes[b].parentNode;
        if (a !== document.body) {
            a.replaceWith(...this.nodes);
        }
    });
});
Q.Ext('a', a => {
    if (a === _un) {
        return this.nodes[0]?.value || _n;
    }
    return this.each(b => this.nodes[b].value = a);
});
Q.Ext('wait', a => {
    const b = this;
    return new _pr((resolve) => {
        _st(() => {
            resolve(b);
        }, a);
    });
});
Q.Ext('walk', (a, b = false) => {
    this.nodes.forEach((e, d) => {
        const c = b ? Q(e) : e;
        a.call(e, c, d);
    });
    return this;
});
Q.Ext('width', a => {
    if (a === _un) {
        return this.nodes[0].offsetWidth;
    }
    return this.each(b => this.nodes[b].style.width = a);
});
Q.Ext('wrap', c => {
    return this.each(d => {
        const a = this.nodes[d].parentNode;
        const b = typeof c === 'string' ? document.createElement(c) : c;
        a.insertBefore(b, this.nodes[d]);
        b.appendChild(this.nodes[d]);
    });
});
Q.Ext('wrapAll', a => {
    return this.each(e => {
        const b = this.nodes[e].parentNode;
        const c = typeof a === 'string' ? document.createElement(a) : a;
        b.insertBefore(c, this.nodes[0]);
        this.nodes.forEach(d => c.appendChild(d));
    });
});
Q.Ext('zIndex', a => {
    if (a === _un) {
        let b = this.nodes[0].style.zIndex;
        if (!b) {
            b = window.getComputedStyle(this.nodes[0]).zIndex;
        }
        return b;
    }
    return this.each(c => this.nodes[c].style.zIndex = a);
});
return Q;
})();