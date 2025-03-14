const Q = (() => {
    'use strict';
const _ob = Object, _ar = Array, _ma = Math, _ac = AbortController, _as = AbortSignal, _bo = Boolean, _da = Date, _er = Error, _ev = Event, _pr = Promise, _nu = Number, _re = RegExp, _st = setTimeout, _un = undefined, _n = null, _nl = NodeList, _el = Element, _si = setInterval, _c = console, _f = fetch, _ct = clearTimeout;
    let GLOBAL = {};
    let styleData = {
        gen: "",
        root: '',
        element: _n,
        init: false
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
        applyStyles();
    }, { once: true });
    function Q(a, attributes, c) {
        if (!(this instanceof Q)) return new Q(a, attributes, c);
        if (a?.nodeType === 1 || a?.nodeType != _n) {
            this.nodes = [a];
            return;
        }
        if (a instanceof Q) {
            this.nodes = a.nodes;
            return;
        }
        if (a?.constructor === _nl) {
            this.nodes = _ar.from(a);
            return;
        }
        if (typeof a === 'string') { 
            const l = attributes || a.indexOf('<') > -1;
            if (l) {
                const template = document.createElement('template');
                template.innerHTML = a.trim();
                this.nodes = _ar.from(template.content.childNodes);
                if (attributes) {
                    for (const element of this.nodes) {
                        _ob.entries(attributes).forEach(([g, j]) => {
                            if (g === 'class') {
                                element.classList.add(...(_ar.isArray(j) ? j : j.split(/\s+/)));
                            } else if (g === 'style') {
                                if (typeof j === 'object') {
                                    _ob.entries(j).forEach(([property, propertyValue]) => {
                                        element.style[property] = propertyValue;
                                    });
                                } else {
                                    element.style.cssText = j;
                                }
                            } else if (g === 'text') {
                                element.textContent = j;
                            } else if (g === 'html') {
                                element.innerHTML = j;
                            } else {
                                element.setAttribute(g, j);
                            }
                        });
                    }
                }
                if (c) {
                    this.nodes.forEach(element => {
                        c.forEach(d => element[d] = true);
                    });
                }
            } else {
                this.nodes = _ar.from(document.querySelectorAll(a));
            }
        }
    }
    Q.Ext = (methodName, functionImplementation) =>
        (Q.prototype[methodName] = functionImplementation, Q);
    Q.getGLOBAL = i => GLOBAL[i];
    Q.setGLOBAL = h => (GLOBAL = { ...GLOBAL, ...h });
    Q.style = (root = '', style = '', mapping = _n) => {
        if (root && typeof root === 'string') {
            styleData.root += root.trim() + ';';
        }
        if (style && typeof style === 'string') {
            if (mapping) {
                const keys = _ob.keys(mapping);
                keys.forEach((i) => {
                    let newKey = Q.ID ? Q.ID(5, '_') : `_${_ma.random().toString(36).substring(2, 7)}`;
                    style = style.replace(new _re(`\\b${i}\\b`, 'gm'), newKey);
                    mapping[i] = mapping[i].replace(i, newKey);
                });
            }
            styleData.gen += style;
        }
        applyStyles();
        return mapping;
    };
    Q.Ext('addClass', function (classes) {
    const b = classes.split(' '),
          nodes = this.nodes;
    for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].classList.add(...b);
    }
    return this;
});
Q.Ext('animate', function (duration, b, e) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const f = nodes[i],
          c = _ob.keys(b)
            .map(d => `${d} ${duration}ms`)
            .join(', ');
    f.style.transition = c;
    for (const d in b) {
      f.style[d] = b[d];
    }
    if (typeof e === 'function') {
      _st(() => e.call(f), duration);
    }
  }
  return this;
});
Q.Ext('append', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const b = nodes[i];
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const c = contents[j];
      if (typeof c === "string") {
        b.insertAdjacentHTML('beforeend', c);
      } else if (c?.nodeType === 1 || c instanceof Q) {
        b.appendChild(c.nodes ? c.nodes[0] : c);
      } else if (_ar.isArray(c) || c?.constructor === _nl) {
        const subNodes = _ar.from(c);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          b.appendChild(subNodes[k]);
        }
      }
    }
  }
  return this;
});
Q.Ext('attr', function (attribute, b) {
    const nodes = this.nodes;
    if (typeof attribute === 'object') {
        for (const node of nodes) {
            for (const [c, val] of _ob.entries(attribute)) {
                node.setAttribute(c, val);
            }
        }
        return this;
    } else {
        if (b === _un) {
            return nodes[0] && nodes[0].getAttribute(attribute) || _n;
        }
        for (const node of nodes) {
            node.setAttribute(attribute, b);
        }
        return this;
    }
});
Q.Ext('bind', function (a, b) {
    if (!this.d) {
        this.d = {};
    }
    if (!this.d[a]) {
        document.addEventListener(a, (e) => {
            const nodes = this.nodes;
            for (const node of nodes) {
                if (node.contains(e.target)) {
                    b.call(e.target, e);
                }
            }
        });
        this.d[a] = true;
    }
    return this;
});
Q.Ext('blur', function () {
    const nodes = this.nodes; // ...existing code...
    for (const node of nodes) {
        node.blur();
    }
    return this;
});
Q.Ext('children', function () {
    return new Q(this.nodes[0].children);
});
Q.Ext('click', function () {
    const nodes = this.nodes; // ...existing code...
    for (const node of nodes) {
        node.click();
    }
    return this;
});
Q.Ext('clone', function () {
    const node = this.nodes[0]; // ...existing code...
    return new Q(node.cloneNode(true));
});
Q.Ext('closest', function (selector) {
    let node = this.nodes[0]; // ...existing code...
    while (node) {
        if (node.matches && node.matches(selector)) {
            return new Q(node);
        }
        node = node.parentElement;
    }
    return _n;
});
Q.Ext('css', function(property, b) {
  const nodes = this.nodes;
  if (typeof property === 'object') {
      for (let i = 0, len = nodes.length; i < len; i++) {
          const style = nodes[i].style;
          for (const c in property) {
              style[c] = property[c];
          }
      }
      return this;
  }
  if (b === _un) return getComputedStyle(nodes[0])[property];
  for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].style[property] = b;
  }
  return this;
});
Q.Ext('data', function (key, b) {
    const nodes = this.nodes;
    if (b === _un) {
        return nodes[0] && nodes[0].dataset[key] || _n;
    }
    for (const node of nodes) {
        node.dataset[key] = b;
    }
    return this;
});
Q.Ext('each', function (callback) {
    if (!this.nodes) return this;
    this.nodes.forEach((b, c) => callback.call(b, c, b));
    return this;
});
Q.Ext('empty', function () {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    nodes[i].innerHTML = '';
  }
  return this;
});
Q.Ext('eq', function (index) {
  const node = this.nodes[index];
  return node ? new Q(node) : _n;
});
Q.Ext('fadeIn', function(a = 400, b) {
    const d = this.nodes;
    this.each(index => {
      const element = d[index];
      const c = element.style;
      c.display = '';
      c.transition = `opacity ${a}ms`;
      void element.offsetHeight;
      c.opacity = 1;
      _st(() => {
        c.transition = '';
        if (b) {
          b();
        }
      }, a);
    });
});
Q.Ext('fadeOut', function(a, b) {
    const d = this.nodes;
    this.each(index => {
      const c = d[index].style;
      c.transition = `opacity ${a}ms`;
      c.opacity = 0;
      _st(() => {
        c.transition = '';
        c.display = 'none';
        if (b) b();
      }, a);
    });
});
Q.Ext('fadeTo', function(opacity, b, c) {
    const e = this.nodes;
    this.each(function(f) {
      const element = e[f];
      const d = element.style;
      d.transition = `opacity ${b}ms`;
      void element.offsetHeight;
      d.opacity = opacity;
      _st(function() {
        d.transition = '';
        if (c) {
          c();
        }
      }, b);
    });
  });
Q.Ext('fadeToggle', function(a, b) {
    const c = this.nodes;
    this.each(function(e) {
      const d = window.getComputedStyle(c[e]);
      if (d.opacity === '0') {
        this.fadeIn(a, b);
      } else {
        this.fadeOut(a, b);
      }
    });
  });
Q.Ext('find', function(selector) {
    const b = this.nodes[0];
    if (!b) {
      return _n;
    }
    const c = b.querySelectorAll(selector);
    return c.length ? Q(c) : _n;
  });
Q.Ext('first', function () {
    return new Q(this.nodes[0]);
});
Q.Ext('focus', function () {
    return this.each(a => this.nodes[a].focus());
});
Q.Ext('hasClass', function(className) {
    return this.nodes[0]?.classList.contains(className) || false;
  });
Q.Ext('height', function (a) {
    const nodes = this.nodes; // ...existing code...
    if (a === _un) {
        return nodes[0].offsetHeight;
    }
    for (const node of nodes) {
        node.style.height = a;
    }
    return this;
});
Q.Ext('hide', function (duration = 0, b) {
    for (const node of this.nodes) {
        if (duration === 0) {
            node.style.display = 'none';
            if (b) b();
        } else {
            node.style.transition = `opacity ${duration}ms`;
            node.style.opacity = 1;
            _st(() => {
                node.style.opacity = 0;
                node.addEventListener('transitionend', function d() {
                    node.style.display = 'none';
                    node.style.transition = '';
                    node.removeEventListener('transitionend', d);
                    if (b) b();
                });
            }, 0);
        }
    }
    return this;
});
Q.Ext('html', function (content) {
    if (content === _un) {
        return this.nodes[0] ? this.nodes[0].innerHTML : _n;
    }
    for (const d of this.nodes) {
        d.innerHTML = '';
        const appendContent = (b) => {
            if (typeof b === 'string') {
                d.insertAdjacentHTML('beforeend', b);
            } else if (b instanceof Q) {
                for (const subnode of b.nodes) {
                    d.appendChild(subnode);
                }
            } else if (b?.nodeType === 1 || b?.nodeType != _n) {
                d.appendChild(b);
            } else if (_ar.isArray(b) || b?.constructor === _nl) {
                for (const e of _ar.from(b)) {
                    d.appendChild(e);
                }
            }
        };
        if (_ar.isArray(content) || content?.constructor === _nl) {
            for (const b of _ar.from(content)) {
                appendContent(b);
            }
        } else {
            appendContent(content);
        }
    }
    return this;
});
Q.Ext('id', function (ident) {
    const node = this.nodes[0];
    if (ident === _un) return node.id;
    node.id = ident;
    return this;
});
Q.Ext('index', function (index) {
    const first = this.nodes[0];
    if (index === _un) {
        return _ar.from(first.parentNode.children).indexOf(first);
    }
    for (const node of this.nodes) {
        const b = node.parentNode;
        if (!b) continue;
        const children = _ar.from(b.children);
        b.removeChild(node);
        if (index >= children.length) {
            b.appendChild(node);
        } else {
            b.insertBefore(node, children[index]);
        }
    }
    return this;
});
Q.Ext('inside', function (selector) {
    const node = this.nodes[0];
    return node ? node.closest(selector) !== _n : false;
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
    const node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});
Q.isExists = function (a) {
    return document.querySelector(a) !== _n;
};
Q.Ext('last', function () {
    const nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});
Q.Ext('map', function (callback) {
    const b = [];
    for (const node of this.nodes) {
        b.push(callback(new Q(node)));
    }
    return b;
});
Q.Ext('off', function (a, b, c) {
    const d = {
        capture: false,
        once: false,
        passive: false
    };
    c = { ...d, ...c };
    const eventList = a.split(' ');
    for (const node of this.nodes) {
        for (const e of eventList) {
            node.removeEventListener(e, b, c);
        }
    }
    return this;
});
Q.Ext('offset', function () {
    const node = this.nodes[0];
    const a = node.getBoundingClientRect();
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
  const eventList = a.split(' ');
  return this.each(index => {
      const node = this.nodes[index];
      eventList.forEach(f => {
          node.addEventListener(f, b, c);
      });
  });
});
Q.Ext('parent', function () {
    const node = this.nodes[0];
    return new Q(node ? node.parentNode : _n);
});
Q.Ext('position', function () {
    const node = this.nodes[0];
    return {
        top: node.offsetTop,
        left: node.offsetLeft
    };
});
Q.Ext('prepend', function (...a) {
    for (const b of this.a) {
        for (const c of a) {
            if (typeof c === 'string') {
                b.insertAdjacentHTML('afterbegin', c);
            } else if (c instanceof Q) {
                b.insertBefore(c.a[0], b.firstChild);
            } else if (c?.nodeType === 1 || c?.nodeType != _n) {
                b.insertBefore(c, b.firstChild);
            } else if (_ar.isArray(c) || c?.constructor === _nl) {
                for (const d of _ar.from(c)) {
                    b.insertBefore(d, b.firstChild);
                }
            }
        }
    }
    return this;
});
Q.Ext('prop', function (property, b) {
    if (b === _un) {
        return this.nodes[0] ? this.nodes[0][property] : _n;
    }
    for (const node of this.nodes) {
        node[property] = b;
    }
    return this;
});
Q.Ext('remove', function() {
    for (const node of this.nodes) {
        node.remove();
    }
    return this;
});
Q.Ext('removeAttr', function (a) {
    for (const node of this.nodes) {
        node.removeAttribute(a);
    }
    return this;
});
Q.Ext('removeClass', function (a) {
    const b = a.split(' ');
    for (const node of this.nodes) {
        node.classList.remove(...b);
    }
    return this;
});
Q.Ext('removeData', function (key) {
    return this.each(index => {
        const node = this.nodes[index];
        delete node.dataset[key];
    });
});
Q.Ext('removeProp', function (property) {
    return this.each(index => {
        const node = this.nodes[index];
        delete node[property];
    });
});
Q.Ext('removeTransition', function () {
    return this.each(index => {
        const node = this.nodes[index];
        node.style.transition = '';
    });
});
Q.Ext('scrollHeight', function () {
    return this.nodes[0].scrollHeight;
});
Q.Ext('scrollLeft', function (a, b) {
    if (a === _un) {
        return this.nodes[0].scrollLeft;
    }
    return this.each(index => {
        const node = this.nodes[index];
        const c = node.scrollWidth - node.clientWidth;
        if (b) {
            node.scrollLeft = _ma.min(node.scrollLeft + a, c);
        } else {
            node.scrollLeft = _ma.min(a, c);
        }
    });
});
Q.Ext('scrollTop', function (a, b) {
    if (a === _un) {
        return this.nodes[0].scrollTop;
    }
    return this.each(index => {
        const node = this.nodes[index];
        const c = node.scrollHeight - node.clientHeight;
        if (b) {
            node.scrollTop = _ma.min(node.scrollTop + a, c);
        } else {
            node.scrollTop = _ma.min(a, c);
        }
    });
});
Q.Ext('scrollWidth', function () {
    return this.nodes[0].scrollWidth;
});
Q.Ext('show', function (duration = 0, b) {
    return this.each(index => {
        const c = this.nodes[index];
        if (duration === 0) {
            c.style.display = '';
            if (b) b();
        } else {
            c.style.transition = `opacity ${duration}ms`;
            c.style.opacity = 0;
            c.style.display = '';
            _st(() => {
                c.style.opacity = 1;
                c.addEventListener('transitionend', () => {
                    c.style.transition = '';
                    if (b) b();
                }, { once: true });
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
    return this.each(function(index, b) {
        b.textContent = a;
    });
});
Q.Ext('toggle', function () {
    return this.each(function(index, a) {
        a.style.display = (a.style.display === 'none' ? '' : 'none');
    });
});
Q.Ext('toggleClass', function (className) {
    return this.each(function(index, b) {
        b.classList.toggle(className);
    });
});
Q.Ext('trigger', function (event) {
	return this.each(function(c, b) {
		b.dispatchEvent(new _ev(event));
	});
});
Q.Ext('unwrap', function () {
    return this.each(function(index, b) {
        const a = b.parentNode;
        if (a && a !== document.body) {
            a.replaceWith(...a.childNodes);
        }
    });
});
Q.Ext('val', function(a) {
    if (a === _un) return this.nodes[0]?.value || _n;
    for (const node of this.nodes) {
        node.value = a;
    }
    return this;
  });
Q.Ext('wait', function(ms) {
	return new _pr(resolve => _st(() => resolve(this), ms));
});
Q.Ext('walk', function (callback, b = false) {
	return this.each(function(d, el) {
		const c = b ? Q(el) : el;
		callback.call(el, c, d);
	});
});
Q.Ext('width', function (value) {
    if (typeof value === '_un') {
        return this.nodes[0] ? this.nodes[0].offsetWidth : _un;
    }
    this.nodes.forEach(node => {
        node.style.width = value;
    });
    return this;
});
Q.Ext('wrap', function (a) {
    return this.each(f => {
        const b = f.b;
        let c = typeof a === 'string'
            ? // Create and clone the a so each f gets its own instance.
              ((d => (d.innerHTML = a.trim(), d.firstElementChild.cloneNode(true)))
              (document.createElement('e')))
            : a;
        b.insertBefore(c, f);
        c.appendChild(f);
    });
});
Q.Ext('wrapAll', function (wrapper) {
    if (!this.nodes.length) return this;
    const b = this.nodes[0].parentNode;
    let c = typeof wrapper === 'string'
        ? ((tempDiv => (tempDiv.innerHTML = wrapper.trim(), tempDiv.firstElementChild))
           (document.createElement('div')))
        : wrapper;
    b.insertBefore(c, this.nodes[0]);
    this.nodes.forEach(d => c.appendChild(d));
    return this;
});
Q.Ext('zIndex', function (value) {
    const node = this.nodes[0];
    if (!node) return;
    if (value === _un) {
        let b = node.style.zIndex || window.getComputedStyle(node).zIndex;
        return b;
    }
    this.nodes.forEach(node => node.style.zIndex = value);
    return this;
});

Q.AvgColor = (source, sampleSize, callback) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    if (typeof source === 'string') image.src = source;
    else if (source instanceof HTMLCanvasElement) image.src = source.toDataURL();
    else return _c.error("Invalid image source provided.");
    image.onload = () => {
      const canvas = _ob.assign(document.createElement('canvas'), { width: image.width, height: image.height });
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, image.width, image.height).data;
      const samplingRate = sampleSize === 'auto'
        ? _ma.max(1, _ma.ceil(_ma.sqrt(image.width * image.height) / 32))
        : (typeof sampleSize === 'number' && sampleSize > 0 ? sampleSize : 1);
      let totalRed = 0, totalGreen = 0, totalBlue = 0, count = 0;
      for (let index = 0, len = data.length; index < len; index += samplingRate * 4) {
        totalRed   += data[index];
        totalGreen += data[index + 1];
        totalBlue  += data[index + 2];
        count++;
      }
      const avgColor = { r: (totalRed / count) | 0, g: (totalGreen / count) | 0, b: (totalBlue / count) | 0 };
      typeof callback === 'function' && callback(avgColor);
    };
    image.onerror = () => _c.error("Failed to load image.");
  };
Q.ColorBrightness = (inputColor, percent) => {
    if (!/^#|^rgb/.test(inputColor)) throw new _er('Unsupported c format');
    let red, green, blue, alpha = 1, isHex = false, factor = 1 + percent / 100;
    if (inputColor[0] === '#') {
      isHex = true;
      const hexString = inputColor.slice(1);
      if (hexString.length === 3) {
        red = parseInt(hexString[0] + hexString[0], 16);
        green = parseInt(hexString[1] + hexString[1], 16);
        blue = parseInt(hexString[2] + hexString[2], 16);
      } else if (hexString.length === 6) {
        red = parseInt(hexString.slice(0, 2), 16);
        green = parseInt(hexString.slice(2, 4), 16);
        blue = parseInt(hexString.slice(4, 6), 16);
      }
    } else {
      const match = inputColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        red = +match[1];
        green = +match[2];
        blue = +match[3];
        if (match[4] != _n) alpha = parseFloat(match[4]);
      }
    }
    const clamp = value => _ma.min(255, _ma.max(0, _ma.round(value * factor)));
    red = clamp(red);
    green = clamp(green);
    blue = clamp(blue);
    return isHex
      ? '#' + [red, green, blue].map(component => (`0${component.toString(16)}`).slice(-2)).join('')
      : (alpha === 1 ? `rgb(${red}, ${green}, ${blue})` : `rgba(${red}, ${green}, ${blue}, ${alpha})`);
  };
Q.Debounce = (id, b, c) => {
    const debounceStorage = Q.getGLOBAL('Debounce') || {};
    debounceStorage[id] && _ct(debounceStorage[id]);
    debounceStorage[id] = _st(c, b);
    Q.setGLOBAL({ Debounce: debounceStorage });
  };
Q.HSL2RGB = (h, s, l) => {
    if (s === 0) {
      const gray = l * 255;
      return [gray, gray, gray];
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q,
          hueToRgb = (t) => {
            t < 0 && (t += 1);
            t > 1 && (t -= 1);
            return t < 1 / 6 ? p + (q - p) * 6 * t
                 : t < 1 / 2 ? q
                 : t < 2 / 3 ? p + (q - p) * 6 * (2 / 3 - t)
                 : p;
          };
    return [hueToRgb(h + 1 / 3) * 255, hueToRgb(h) * 255, hueToRgb(h - 1 / 3) * 255];
  };
Q.ID = (length = 8, b = '') =>
    b + _ar.from({ length }, () => (_ma.random() * 16 | 0).toString(16)).join('');
Q.RGB2HSL = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    const max = _ma.max(r, g, b), min = _ma.min(r, g, b);
    let h, s, l = (max + min) / 2, d = max - min;
    if (!d) h = s = 0;
    else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0)
        : max === g ? (b - r) / d + 2
        : (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  };
Q.isDarkColor = (color, b = 20, c = 100) => {
    let red, green, blue;
    if (color[0] === '#') {
      const f = color.slice(1);
      const parts = f.length === 3
        ? [f[0] + f[0], f[1] + f[1], f[2] + f[2]]
        : f.length === 6
        ? [f.slice(0, 2), f.slice(2, 4), f.slice(4, 6)]
        : _n;
      if (!parts) throw _er('Invalid f color format');
      [red, green, blue] = parts.map(v => parseInt(v, 16));
    } else if (color.startsWith('rgb')) {
      const arr = color.match(/\d+/g);
      if (arr && arr.length >= 3) [red, green, blue] = arr.map(_nu);
      else throw _er('Invalid color format');
    } else throw _er('Unsupported color format');
    return _ma.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2) + b < c;
  };
return Q;
})();