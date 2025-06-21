const Q = (() => {
    'use strict';
    const _ob = Object, _ar = Array, _ma = Math, _da = Date, _re = RegExp,
        _st = setTimeout, _un = undefined, _n = null, _nl = NodeList,
        _el = Element, _si = setInterval, _c = console, _ct = clearTimeout,
        _ci = clearInterval, _pr = Promise, _str = String, _nu = Number,
        _bo = Boolean, _json = JSON, _map = Map, _set = Set, _sym = Symbol,
        _win = window, _doc = document, _loc = location, _hist = history,
        _ls = localStorage, _ss = sessionStorage, _f = fetch, _ev = Event,
        _ac = AbortController, _as = AbortSignal, _err = Error;
    let GLOBAL = {};
    let styleData = {
        elements: [],
        root: '',
        generic: "",
        responsive: {},
        element: _n,
        init: false
    };
    function applyStyles() {
        if (!styleData.init) {
            styleData.element = document.getElementById('qlib_set') || createStyleElement();
            styleData.init = true;
        }
        let finalStyles = styleData.root ? `:root {${styleData.root}}\n` : '';
        finalStyles += styleData.generic;
        const breakpoints = _ob.keys(styleData.responsive);
        for (let i = 0; i < breakpoints.length; i++) {
            const size = breakpoints[i];
            const css = styleData.responsive[size];
            if (css) {
                finalStyles += `\n@media (max-width: ${size}) {\n${css}\n}`;
            }
        }
        styleData.element.textContent = finalStyles;
    }
    function createStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.id = 'qlib_set';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        applyStyles();
    } else {
        window.addEventListener('load', applyStyles, { once: true });
    }
    function Q(identifier, attributes, props) {
        if (!(this instanceof Q)) return new Q(identifier, attributes, props);
        if (identifier && identifier.nodeType) {
            this.nodes = [identifier];
            return;
        }
        if (identifier instanceof Q) {
            this.nodes = identifier.nodes;
            return;
        }
        if (identifier?.constructor === _nl) {
            this.nodes = _ar.from(identifier);
            return;
        }
        if (typeof identifier === 'string') {
            const isCreating = attributes || identifier.indexOf('<') > -1;
            if (isCreating) {
                const svgTags = ['svg','g','line','polyline','rect','circle','ellipse','text','path','polygon'];
                const tagMatch = identifier.match(/^<([a-zA-Z0-9\-]+)(\s|>|\/)*/);
                const tag = tagMatch ? tagMatch[1].toLowerCase() : null;
                if (tag && svgTags.includes(tag)) {
                    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                    if (attributes) {
                        for (const [k, v] of Object.entries(attributes)) {
                            if (k === 'children' && Array.isArray(v)) {
                                v.forEach(child => {
                                    if (child instanceof Node) {
                                        el.appendChild(child);
                                    } else if (child instanceof Q) {
                                        child.nodes.forEach(n => el.appendChild(n));
                                    } else if (typeof child === 'string') {
                                        const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                                        temp.innerHTML = child;
                                        Array.from(temp.childNodes).forEach(n => el.appendChild(n));
                                    }
                                });
                            } else if (k !== 'children') {
                                el.setAttribute(k, v);
                            }
                        }
                    }
                    const inner = identifier.replace(/^<[^>]+>/, '').replace(/<\/[a-zA-Z0-9\-]+>$/, '');
                    if (inner.trim()) {
                        const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        temp.innerHTML = inner;
                        Array.from(temp.childNodes).forEach(n => el.appendChild(n));
                    }
                    this.nodes = [el];
                    return;
                }
                const template = document.createElement('template');
                template.innerHTML = identifier.trim();
                this.nodes = _ar.from(template.content.childNodes);
                if (attributes) {
                    const attrEntries = _ob.entries(attributes);
                    for (let i = 0, n = this.nodes.length; i < n; i++) {
                        const element = this.nodes[i];
                        for (let j = 0, m = attrEntries.length; j < m; j++) {
                            const [attr, val] = attrEntries[j];
                            if (attr === 'class') {
                                element.classList.add(...(Array.isArray(val) ? val : val.split(/\s+/)));
                            } else if (attr === 'style') {
                                if (typeof val === 'object') {
                                    const styleEntries = _ob.entries(val);
                                    for (let k = 0, p = styleEntries.length; k < p; k++) {
                                        const [prop, propVal] = styleEntries[k];
                                        element.style[prop] = propVal;
                                    }
                                } else {
                                    element.style.cssText = val;
                                }
                            } else if (attr === 'text') {
                                element.textContent = val;
                            } else if (attr === 'html') {
                                element.innerHTML = val;
                            } else {
                                element.setAttribute(attr, val);
                            }
                        }
                    }
                }
                if (props) {
                    for (let i = 0, n = this.nodes.length; i < n; i++) {
                        const element = this.nodes[i];
                        for (let j = 0, m = props.length; j < m; j++) {
                            element[props[j]] = true;
                        }
                    }
                }
            } else {
                this.nodes = _ar.from(document.querySelectorAll(identifier));
            }
        }
    }
    Q.Ext = (methodName, functionImplementation) =>
        (Q.prototype[methodName] = functionImplementation, Q);
    Q.getGLOBAL = key => GLOBAL[key];
    Q.setGLOBAL = value => (GLOBAL = { ...GLOBAL, ...value });
    Q.style = (root = _n, style = '', responsive = _n, mapping = _n, enable_mapping = true) => {
        const cleanUp = (str) => {
            str= str.replace(/^\s*[\r\n]/gm, '');
            str = str.replace(/\s+/g, ' ');
            str = str.replace(/;;/g, ';');
            return str.trim();
        }
        if (mapping && enable_mapping) {
            const keys = _ob.keys(mapping);
            const generateSecureCSSClassName = () => {
                const letters = 'abcdefghijklmnopqrstuvwxyz';
                const allChars = letters + '0123456789';
                const length = _ma.floor(_ma.random() * 3) + 6;  
                const firstChar = letters.charAt(_ma.floor(_ma.random() * letters.length));
                const remainingChars = Array.from({ length: length - 1 }, () => 
                    allChars.charAt(_ma.floor(_ma.random() * allChars.length))
                ).join('');
                return firstChar + remainingChars;
            };
            const getUniqueClassName = () => {
                let newKey;
                do {
                    newKey = generateSecureCSSClassName();
                } while (styleData.elements.includes(newKey));
                styleData.elements.push(newKey);
                return newKey;
            };
            keys.forEach((key) => {
                let newKey = getUniqueClassName();
                if (style && typeof style === 'string') {
                    style = style.replace(new _re(`\\.${key}\\b`, 'gm'), `.${newKey}`);
                    style = style.replace(new _re(`^\\s*\\.${key}\\s*{`, 'gm'), `.${newKey} {`);
                    style = style.replace(new _re(`(,\\s*)\\.${key}\\b`, 'gm'), `$1.${newKey}`);
                    style = style.replace(new _re(`(\\s+)\\.${key}\\b`, 'gm'), `$1.${newKey}`);
                }
                mapping[key] = mapping[key].replace(key, newKey);
            });
        }
        if (root && typeof root === 'string') {
            styleData.root += root.trim();
            styleData.root = cleanUp(styleData.root);
        }
        if (style && typeof style === 'string') {
            styleData.generic += style;
            styleData.generic = cleanUp(styleData.generic);
        }
        if (responsive && typeof responsive === 'object') {
            const breakpoints = _ob.entries(responsive);
            for (let i = 0; i < breakpoints.length; i++) {
                const [size, css] = breakpoints[i];
                if (css && typeof css === 'string') {
                    if (!styleData.responsive[size]) {
                        styleData.responsive[size] = '';
                    }
                    styleData.responsive[size] += css + '\n';
                }
            }
        }
        if (document.readyState === 'complete') {
            applyStyles();
        }
        return mapping;
    };
    Q._ = {
        ob: _ob, ar: _ar, ma: _ma, da: _da, re: _re, st: _st, un: _un,
        n: _n, nl: _nl, el: _el, si: _si, c: _c, ct: _ct, ci: _ci,
        pr: _pr, str: _str, nu: _nu, bo: _bo, json: _json, map: _map,
        set: _set, sym: _sym, win: _win, doc: _doc, loc: _loc, hist: _hist,
        ls: _ls, ss: _ss, f: _f, ev: _ev, ac: _ac, as: _as, err: _err
    };
    Q.Ext('addClass', function (classes) {
    var list = classes.split(' '),
        nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].classList.add.apply(nodes[i].classList, list);
    }
    return this;
});
Q.Ext('after', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const target = nodes[i];
    const parent = target.parentNode;
    if (!parent) continue;
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const content = contents[j];
      if (typeof content === "string") {
        target.insertAdjacentHTML('afterend', content);
      } else if (content instanceof HTMLElement) {
        if (target.nextSibling) {
          parent.insertBefore(content, target.nextSibling);
        } else {
          parent.appendChild(content);
        }
      } else if (content instanceof Q) {
        if (target.nextSibling) {
          parent.insertBefore(content.nodes[0], target.nextSibling);
        } else {
          parent.appendChild(content.nodes[0]);
        }
      } else if (Array.isArray(content) || content instanceof NodeList) {
        const subNodes = Array.from(content);
        let nextSibling = target.nextSibling;
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          if (nextSibling) {
            parent.insertBefore(subNodes[k], nextSibling);
            nextSibling = subNodes[k].nextSibling;
          } else {
            parent.appendChild(subNodes[k]);
          }
        }
      }
    }
  }
  return this;
});
Q.Ext('animate', function (duration, properties, callback) {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    var element = nodes[i],
        keys = Object.keys(properties),
        transitionProperties = '';
    for (var j = 0, klen = keys.length; j < klen; j++) {
      transitionProperties += keys[j] + ' ' + duration + 'ms' + (j < klen - 1 ? ', ' : '');
    }
    element.style.transition = transitionProperties;
    for (var j = 0; j < klen; j++) {
      var prop = keys[j];
      element.style[prop] = properties[prop];
    }
    if (typeof callback === 'function') {
      setTimeout((function(el){
          return function(){ callback.call(el); };
      })(element), duration);
    }
  }
  return this;
});
Q.Ext('append', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const child = contents[j];
      if (typeof child === "string") {
        if (parent instanceof SVGElement) {
          const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          temp.innerHTML = child;
          Array.from(temp.childNodes).forEach(n => parent.appendChild(n));
        } else {
          parent.insertAdjacentHTML('beforeend', child);
        }
      } else if (child instanceof HTMLElement || child instanceof Q || child instanceof SVGElement) {
        parent.appendChild(child.nodes ? child.nodes[0] : child);
      } else if (Array.isArray(child) || child instanceof NodeList) {
        const subNodes = Array.from(child);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          parent.appendChild(subNodes[k]);
        }
      }
    }
  }
  return this;
});
Q.Ext('attr', function (attribute, value) {
    var nodes = this.nodes;
    if (typeof attribute === 'object') {
        var keys = Object.keys(attribute);
        for (var i = 0, len = nodes.length; i < len; i++) {
            var node = nodes[i];
            for (var j = 0, klen = keys.length; j < klen; j++) {
                node.setAttribute(keys[j], attribute[keys[j]]);
            }
        }
        return this;
    } else {
        if (value === undefined) {
            return nodes[0] && nodes[0].getAttribute(attribute) || null;
        }
        for (var i = 0, len = nodes.length; i < len; i++) {
            nodes[i].setAttribute(attribute, value);
        }
        return this;
    }
});
Q.Ext('before', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const target = nodes[i];
    const parent = target.parentNode;
    if (!parent) continue;
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const content = contents[j];
      if (typeof content === "string") {
        target.insertAdjacentHTML('beforebegin', content);
      } else if (content instanceof HTMLElement) {
        parent.insertBefore(content, target);
      } else if (content instanceof Q) {
        parent.insertBefore(content.nodes[0], target);
      } else if (Array.isArray(content) || content instanceof NodeList) {
        const subNodes = Array.from(content);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          parent.insertBefore(subNodes[k], target);
        }
      }
    }
  }
  return this;
});
Q.Ext('bind', function (event, handler) {
    if (!this._eventDelegation) {
        this._eventDelegation = {};
    }
    if (!this._eventDelegation[event]) {
        document.addEventListener(event, (e) => {
            var nodes = this.nodes;
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i].contains(e.target)) {
                    handler.call(e.target, e);
                }
            }
        });
        this._eventDelegation[event] = true;
    }
    return this;
});
Q.Ext('blur', function () {
    var nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].blur();
    }
    return this;
});
Q.Ext('children', function (selector) {
  const result = [];
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    if (!parent || !parent.children) continue;
    const childElements = parent.children;
    if (selector) {
      for (let j = 0; j < childElements.length; j++) {
        if (childElements[j].matches && childElements[j].matches(selector)) {
          result.push(childElements[j]);
        }
      }
    } else {
      for (let j = 0; j < childElements.length; j++) {
        result.push(childElements[j]);
      }
    }
  }
  return new Q(result);
});
Q.Ext('click', function () {
    var nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].click();
    }
    return this;
});
Q.Ext('clone', function () {
    return new Q(this.nodes[0].cloneNode(true));
});
Q.Ext('closest', function (selector) {
    let node = this.nodes[0];
    while (node) {
        if (node.matches && node.matches(selector)) {
            return new Q(node);
        }
        node = node.parentElement;
    }
    return null;
});
Q.Ext('css', function(property, value) {
  const nodes = this.nodes;
  if (typeof property === 'object') {
      for (let i = 0, len = nodes.length; i < len; i++) {
          const elemStyle = nodes[i].style;
          for (const key in property) {
              elemStyle[key] = property[key];
          }
      }
      return this;
  }
  if (value === Q._.un) return getComputedStyle(nodes[0])[property];
  for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].style[property] = value;
  }
  return this;
});
Q.Ext('data', function (key, value) {
    const nodes = this.nodes;
    if (value === Q._.un) {
        return nodes[0] && nodes[0].dataset[key] || Q._.n;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].dataset[key] = value;
    }
    return this;
});
Q.Ext('detach', function() {
    const nodes = this.nodes;
    const detachedNodes = [];
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const parent = node.parentNode;
        if (parent) {
            detachedNodes.push(node);
            parent.removeChild(node);
        }
    }
    this.nodes = detachedNodes;
    return this;
});
Q.Ext('each', function (callback) {
    if (!this.nodes) return this;
    const nodes = this.nodes;
    for (let i = 0, len = nodes.length; i < len; i++) {
        callback.call(nodes[i], i, nodes[i]);
    }
    return this;
});
Q.Ext('empty', function () {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    nodes[i].innerHTML = '';
  }
  return this;
});
Q.Ext('eq', function (index) {
  var node = this.nodes[index];
  return node ? new Q(node) : null;
});
Q.Ext('fadeIn', function(duration, callback) {
    duration = duration || 400;
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var elemStyle = el.style;
            elemStyle.display = '';
            elemStyle.transition = 'opacity ' + duration + 'ms';
            void el.offsetHeight;
            elemStyle.opacity = 1;
            setTimeout(function() {
                elemStyle.transition = '';
                if (callback) callback();
            }, duration);
        })(nodes[i]);
    }
    return this;
});
Q.Ext('fadeOut', function(duration, callback) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var elemStyle = el.style;
            elemStyle.transition = 'opacity ' + duration + 'ms';
            elemStyle.opacity = 0;
            setTimeout(function() {
                elemStyle.transition = '';
                elemStyle.display = 'none';
                if (callback) callback();
            }, duration);
        })(nodes[i]);
    }
    return this;
});
Q.Ext('fadeTo', function(opacity, duration, callback) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var style = el.style;
            style.transition = 'opacity ' + duration + 'ms';
            void el.offsetHeight;
            style.opacity = opacity;
            setTimeout(function() {
                style.transition = '';
                if (callback) callback();
            }, duration);
        })(nodes[i]);
    }
    return this;
});
Q.Ext('fadeToggle', function(duration, callback) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var computed = window.getComputedStyle(nodes[i]);
        if (computed.opacity === '0') {
            this.fadeIn(duration, callback);
        } else {
            this.fadeOut(duration, callback);
        }
    }
    return this;
});
Q.Ext('find', function(selector) {
    var parent = this.nodes[0];
    if (!parent) return null;
    var found = parent.querySelectorAll(selector);
    return found.length ? Q(found) : null;
});
Q.Ext('first', function () {
    return new Q(this.nodes[0]);
});
Q.Ext('focus', function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].focus();
    }
    return this;
});
Q.Ext('hasClass', function(className) {
    var node = this.nodes[0];
    return (node && node.classList.contains(className)) || false;
});
Q.Ext('height', function (value) {
    var nodes = this.nodes;
    if (value === undefined) {
        return nodes[0].offsetHeight;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.height = value;
    }
    return this;
});
Q.Ext('hide', function (duration, callback) {
    duration = duration || 0;
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (duration === 0) {
            node.style.display = 'none';
            if (callback) callback();
        } else {
            node.style.transition = 'opacity ' + duration + 'ms';
            node.style.opacity = 1;
            setTimeout((function(n) {
                return function() {
                    n.style.opacity = 0;
                    n.addEventListener('transitionend', function handler() {
                        n.style.display = 'none';
                        n.style.transition = '';
                        n.removeEventListener('transitionend', handler);
                        if (callback) callback();
                    });
                };
            })(node), 0);
        }
    }
    return this;
});
Q.Ext('html', function (content) {
    var nodes = this.nodes;
    if (content === undefined) {
        return nodes[0] ? nodes[0].innerHTML : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        node.innerHTML = '';
        var appendContent = function(child) {
            if (typeof child === 'string') {
                node.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof Q) {
                for (var j = 0, clen = child.nodes.length; j < clen; j++) {
                    node.appendChild(child.nodes[j]);
                }
            } else if (child instanceof HTMLElement || child instanceof Node) {
                node.appendChild(child);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                var subs = Array.from(child);
                for (var k = 0, slen = subs.length; k < slen; k++) {
                    node.appendChild(subs[k]);
                }
            }
        };
        if (Array.isArray(content) || content instanceof NodeList) {
            var contArr = Array.from(content);
            for (var m = 0, mlen = contArr.length; m < mlen; m++) {
                appendContent(contArr[m]);
            }
        } else {
            appendContent(content);
        }
    }
    return this;
});
Q.Ext('id', function (ident) {
    var node = this.nodes[0];
    if (ident === undefined) return node.id;
    node.id = ident;
    return this;
});
Q.Ext('index', function (index) {
    var first = this.nodes[0];
    if (index === undefined) {
        return Array.prototype.indexOf.call(first.parentNode.children, first);
    }
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i],
            parent = node.parentNode;
        if (!parent) continue;
        var children = Array.from(parent.children);
        parent.removeChild(node);
        if (index >= children.length) {
            parent.appendChild(node);
        } else {
            parent.insertBefore(node, children[index]);
        }
    }
    return this;
});
Q.Ext('inside', function (selector) {
    var node = this.nodes[0];
    return node ? node.closest(selector) !== null : false;
});
Q.Ext('is', function (selector) {
    var node = this.nodes[0];
    if (!node) return false;
    if (typeof selector === 'function') {
        return selector.call(node, 0, node);
    }
    if (typeof selector === 'string') {
        switch (selector) {
            case ':visible':
                return node.offsetWidth > 0 && node.offsetHeight > 0;
            case ':hidden':
                return node.offsetWidth === 0 || node.offsetHeight === 0;
            case ':hover':
                return node === document.querySelector(':hover');
            case ':focus':
                return node === document.activeElement;
            case ':blur':
                return node !== document.activeElement;
            case ':checked':
                return node.checked;
            case ':selected':
                return node.selected;
            case ':disabled':
                return node.disabled;
            case ':enabled':
                return !node.disabled;
            default:
                return node.matches(selector);
        }
    }
    if (selector instanceof HTMLElement || selector instanceof Node) {
        return node === selector;
    }
    if (selector instanceof Q) {
        return node === selector.nodes[0];
    }
    return false;
});
Q.Ext('isExists', function () {
    var node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});
Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};
Q.Ext('last', function () {
    var nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});
Q.Ext('map', function (callback) {
    var result = [],
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        result.push(callback(new Q(nodes[i])));
    }
    return result;
});
Q.Ext('next', function(selector) {
    const result = [];
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        let next = node.nextElementSibling;
        if (next && (!selector || next.matches(selector))) {
            result.push(next);
        }
    }
    const instance = new Q();
    instance.nodes = result;
    return instance;
});
Q.Ext('off', function (events, handler, options) {
    var defaultOptions = { capture: false, once: false, passive: false },
        opts = Object.assign({}, defaultOptions, options),
        eventList = events.split(' '),
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        for (var j = 0, elen = eventList.length; j < elen; j++) {
            nodes[i].removeEventListener(eventList[j], handler, opts);
        }
    }
    return this;
});
Q.Ext('offset', function () {
    var node = this.nodes[0],
        rect = node.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
});
Q.Ext('on', function (events, handler, options) {
    var defaultOptions = { capture: false, once: false, passive: false },
        opts = Object.assign({}, defaultOptions, options),
        eventList = events.split(' '),
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        for (var j = 0, elen = eventList.length; j < elen; j++) {
            nodes[i].addEventListener(eventList[j], handler, opts);
        }
    }
    return this;
});
Q.Ext('parent', function () {
    var node = this.nodes[0];
    return new Q(node ? node.parentNode : null);
});
Q.Ext('position', function () {
    var node = this.nodes[0];
    return {
        top: node.offsetTop,
        left: node.offsetLeft
    };
});
Q.Ext('prepend', function () {
    var nodes = this.nodes,
        contents = Array.prototype.slice.call(arguments),
        i, j, k, parent, child, subNodes;
    for (i = 0; i < nodes.length; i++) {
        parent = nodes[i];
        for (j = 0; j < contents.length; j++) {
            child = contents[j];
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('afterbegin', child);
            } else if (child instanceof Q) {
                parent.insertBefore(child.nodes[0], parent.firstChild);
            } else if (child instanceof HTMLElement || child instanceof Node) {
                parent.insertBefore(child, parent.firstChild);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                subNodes = Array.from(child);
                for (k = 0; k < subNodes.length; k++) {
                    parent.insertBefore(subNodes[k], parent.firstChild);
                }
            }
        }
    }
    return this;
});
Q.Ext('prev', function(selector) {
    const result = [];
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        let previous = node.previousElementSibling;
        if (previous && (!selector || previous.matches(selector))) {
            result.push(previous);
        }
    }
    const instance = new Q();
    instance.nodes = result;
    return instance;
});
Q.Ext('prop', function (property, value) {
    var nodes = this.nodes;
    if (value === undefined) {
        return nodes[0] ? nodes[0][property] : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i][property] = value;
    }
    return this;
});
Q.Ext('remove', function() {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].remove();
    }
    return this;
});
Q.Ext('removeAttr', function (attribute) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].removeAttribute(attribute);
    }
    return this;
});
Q.Ext('removeClass', function (classes) {
    var list = classes.split(' ');
    for (var i = 0, len = this.nodes.length; i < len; i++) {
        this.nodes[i].classList.remove.apply(this.nodes[i].classList, list);
    }
    return this;
});
Q.Ext('removeData', function (key) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i].dataset[key];
    }
    return this;
});
Q.Ext('removeProp', function (property) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i][property];
    }
    return this;
});
Q.Ext('removeTransition', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.transition = '';
    }
    return this;
});
Q.Ext('replaceWith', function(newContent) {
    const nodes = this.nodes;
    let newNodes = (newContent instanceof Q) ? newContent.nodes : [newContent];
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        if (node && node.parentNode) {
            for (let j = 0; j < newNodes.length; j++) {
                node.parentNode.insertBefore(newNodes[j].cloneNode(true), node);
            }
            node.parentNode.removeChild(node);
        }
    }
    return this;
});
Q.Ext('scrollHeight', function () {
    var node = this.nodes[0];
    return node.scrollHeight;
});
Q.Ext('scrollLeft', function (value, increment) {
    const node = this.nodes[0];
    if (value === undefined) {
        return node.scrollLeft;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const current = this.nodes[i];
        const maxScrollLeft = current.scrollWidth - current.clientWidth;
        current.scrollLeft = increment 
            ? Math.min(current.scrollLeft + value, maxScrollLeft) 
            : Math.min(value, maxScrollLeft);
    }
    return this;
});
Q.Ext('scrollTop', function (value, increment) {
    const node = this.nodes[0];
    if (value === undefined) {
        return node.scrollTop;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const current = this.nodes[i];
        const maxScrollTop = current.scrollHeight - current.clientHeight;
        current.scrollTop = increment 
            ? Math.min(current.scrollTop + value, maxScrollTop) 
            : Math.min(value, maxScrollTop);
    }
    return this;
});
Q.Ext('scrollWidth', function () {
    var node = this.nodes[0];
    return node.scrollWidth;
});
Q.Ext('show', function (duration = 0, callback) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const element = this.nodes[i];
        if (duration === 0) {
            element.style.display = '';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
            element.style.display = '';
            setTimeout(() => {
                element.style.opacity = 1;
                element.addEventListener('transitionend', () => {
                    element.style.transition = '';
                    if (callback) callback();
                }, { once: true });
            }, 0);
        }
    }
    return this;
});
Q.Ext('siblings', function(selector) {
    const result = [];
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        const parent = node.parentNode;
        if (parent) {
            const children = parent.children;
            for (let j = 0; j < children.length; j++) {
                if (children[j] !== node) {
                    if (!selector || children[j].matches(selector)) {
                        result.push(children[j]);
                    }
                }
            }
        }
    }
    const instance = new Q();
    instance.nodes = result;
    return instance;
});
Q.Ext('size', function () {
    const node = this.nodes[0];
	return {
		width: node.offsetWidth,
		height: node.offsetHeight
	};
});
Q.Ext('text', function (content) {
    if (content === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].textContent = content;
    }
    return this;
});
Q.Ext('toggle', function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.display = (nodes[i].style.display === 'none' ? '' : 'none');
    }
    return this;
});
Q.Ext('toggleClass', function (className) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].classList.toggle(className);
    }
    return this;
});
Q.Ext('trigger', function (event) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].dispatchEvent(new Event(event));
    }
    return this;
});
Q.Ext('unwrap', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const el = this.nodes[i];
        const parent = el.parentNode;
        if (parent && parent !== document.body) {
            parent.replaceWith(...parent.childNodes);
        }
    }
    return this;
});
Q.Ext('val', function(input) {
    if (input === undefined) return this.nodes[0]?.value || null;
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].value = input;
    }
    return this;
});
Q.Ext('wait', function(ms) {
	return new Promise(resolve => setTimeout(() => resolve(this), ms));
});
Q.Ext('walk', function (callback, useQObject = false) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = useQObject ? Q(this.nodes[i]) : this.nodes[i];
        callback.call(this.nodes[i], node, i);
    }
    return this;
});
Q.Ext('width', function (value) {
    if (typeof value === 'undefined') {
        return this.nodes[0] ? this.nodes[0].offsetWidth : undefined;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.width = value;
    }
    return this;
});
Q.Ext('wrap', function (wrapper) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = this.nodes[i];
        const parent_Node = node.parentNode;
        let newParentElement;
        if (typeof wrapper === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = wrapper.trim();
            newParentElement = tempDiv.firstElementChild.cloneNode(true);
        } else {
            newParentElement = wrapper;
        }
        parent_Node.insertBefore(newParentElement, node);
        newParentElement.appendChild(node);
    }
    return this;
});
Q.Ext('wrapAll', function (wrapper) {
    if (!this.nodes.length) return this;
    const parent = this.nodes[0].parentNode;
    let newParent = typeof wrapper === 'string'
        ? ((tempDiv => (tempDiv.innerHTML = wrapper.trim(), tempDiv.firstElementChild))
           (document.createElement('div')))
        : wrapper;
    parent.insertBefore(newParent, this.nodes[0]);
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        newParent.appendChild(this.nodes[i]);
    }
    return this;
});
Q.Ext('zIndex', function (value) {
    const node = this.nodes[0];
    if (!node) return;
    if (value === undefined) {
        let Index = node.style.zIndex || window.getComputedStyle(node).zIndex;
        return Index;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.zIndex = value;
    }
    return this;
});
Q.Done=((c)=>{
    window.addEventListener("load",()=>{while(c.length)c.shift()();c=0});
    return f=>c?c.push(f):f()
})([]);
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
    });
    return f=>c?c.push(f):f(ev)
  })([]);
Q.Ready=((c)=>{
    document.readyState==='loading'?document.addEventListener("DOMContentLoaded",()=>{while(c.length)c.shift()();c=0},{once:1}):c=0;
    return f=>c?c.push(f):f();
  })([]);
Q.Resize=((c)=>{
    addEventListener("resize",()=>{
      for(let i=0,l=c.length;i<l;) c[i++](innerWidth,innerHeight)
    });
    return f=>c.push(f)
  })([]);
Q.AvgColor = (source, sampleSize, callback) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    if (typeof source === 'string') image.src = source;
    else if (source instanceof HTMLCanvasElement) image.src = source.toDataURL();
    else return console.error("Invalid image source provided.");
    image.onload = () => {
      const canvas = Object.assign(document.createElement('canvas'), { width: image.width, height: image.height });
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, image.width, image.height).data;
      const samplingRate = sampleSize === 'auto'
        ? Math.max(1, Math.ceil(Math.sqrt(image.width * image.height) / 32))
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
    image.onerror = () => console.error("Failed to load image.");
  };
Q.CMYK2RGB = (c, m, y, k) => {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return [Math.round(r), Math.round(g), Math.round(b)];
};
Q.ColorBrightness = (inputColor, percent) => {
    if (!/^#|^rgb/.test(inputColor)) throw new Error('Unsupported format');
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
        if (match[4] != null) alpha = parseFloat(match[4]);
      }
    }
    const clamp = value => Math.min(255, Math.max(0, Math.round(value * factor)));
    red = clamp(red);
    green = clamp(green);
    blue = clamp(blue);
    return isHex
      ? '#' + [red, green, blue].map(component => (`0${component.toString(16)}`).slice(-2)).join('')
      : (alpha === 1 ? `rgb(${red}, ${green}, ${blue})` : `rgba(${red}, ${green}, ${blue}, ${alpha})`);
  };
Q.Debounce = (id, time, callback) => {
    const debounceStorage = Q.getGLOBAL('Debounce') || {};
    debounceStorage[id] && clearTimeout(debounceStorage[id]);
    debounceStorage[id] = setTimeout(callback, time);
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
Q.ID = (length = 8, prefix = '') =>
    prefix + Array.from({ length }, () => (Math.random() * 16 | 0).toString(16)).join('');
Q.isDarkColor = (color, margin = 20, threshold = 100) => {
    let red, green, blue;
    if (color[0] === '#') {
      const hex = color.slice(1);
      const parts = hex.length === 3
        ? [hex[0] + hex[0], hex[1] + hex[1], hex[2] + hex[2]]
        : hex.length === 6
        ? [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
        : null;
      if (!parts) throw Error('Invalid hex format');
      [red, green, blue] = parts.map(v => parseInt(v, 16));
    } else if (color.startsWith('rgb')) {
      const arr = color.match(/\d+/g);
      if (arr && arr.length >= 3) [red, green, blue] = arr.map(Number);
      else throw Error('Invalid format');
    } else throw Error('Unsupported format');
    return Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2) + margin < threshold;
  };
Q.LAB2RGB = (L, a, b) => {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const xRef = 95.047;
  const yRef = 100.0;
  const zRef = 108.883;
  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);
  const x = xRef * (fx3 > 0.008856 ? fx3 : (fx - 16/116) / 7.787);
  const y = yRef * (fy3 > 0.008856 ? fy3 : (fy - 16/116) / 7.787);
  const z = zRef * (fz3 > 0.008856 ? fz3 : (fz - 16/116) / 7.787);
  let r = (x * 0.032406 + y * -0.015372 + z * -0.004986) / 100;
  let g = (x * -0.009689 + y * 0.018758 + z * 0.000415) / 100;
  let b_val = (x * 0.000557 + y * -0.002040 + z * 0.010570) / 100;
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  b_val = b_val > 0.0031308 ? 1.055 * Math.pow(b_val, 1/2.4) - 0.055 : 12.92 * b_val;
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b_val = Math.max(0, Math.min(1, b_val));
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b_val * 255)];
};
Q.RGB2CMYK = (r, g, b) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 1];
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return [c, m, y, k];
};
Q.RGB2HSL = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
Q.RGB2LAB = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;
  const xRef = 95.047;
  const yRef = 100.0;
  const zRef = 108.883;
  const xNorm = x / xRef;
  const yNorm = y / yRef;
  const zNorm = z / zRef;
  const fx = xNorm > 0.008856 ? Math.pow(xNorm, 1/3) : (7.787 * xNorm) + (16/116);
  const fy = yNorm > 0.008856 ? Math.pow(yNorm, 1/3) : (7.787 * yNorm) + (16/116);
  const fz = zNorm > 0.008856 ? Math.pow(zNorm, 1/3) : (7.787 * zNorm) + (16/116);
  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const b_val = 200 * (fy - fz);
  return [L, a, b_val];
};
function Container(options = {}) {
    if (!(this instanceof Container)) {
        return new Container(options);
    }
    this.elements = [];
    this.options = options;
    if (!Container.initialized) {
        Container.classes = Q.style('', `
            .container_icon {
                width: 100%;
                height: 100%;
                color: #777; /* Default color */
                pointer-events: none;
                z-index: 1;
            }
        `, null, {
            'container_icon': 'container_icon'
        });
        Q.Icons();
        Container.initialized = true;
        console.log('Container core initialized');
    }
}
Container.prototype.Icon = function(icon) {
    const iconInstance = Q.Icons();
    return iconInstance.get(icon, 'container_icon');
};
Q.Container = Container;
Container.prototype.Frame = function(options = {}) {
    const self = this;
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
    options = Object.assign({}, defaultOptions, options);
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
    const frameId = options.id || null;
    const savePosition = !!options.savePosition;
    const storageKey = options.storageKey;
    const minSize = options.minSize;
    const responsive = !!options.responsive;
    const responsivesMaxCount = options.responsivesMaxCount || 5;
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
    function getScreenSizeBucket() {
        const px = direction === 'horizontal'
            ? window.innerWidth
            : window.innerHeight;
        return Math.floor(px / 100); // pl. 1842 -> 18
    }
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
    root.direction = function(dir) {
        direction = dir === 'vertical' ? 'vertical' : 'horizontal';
        root.removeClass(Container.frameClasses.frame_horizontal + ' ' + Container.frameClasses.frame_vertical);
        root.addClass(direction === 'horizontal' ? Container.frameClasses.frame_horizontal : Container.frameClasses.frame_vertical);
        return this;
    };
    root.clearPos = function() {
        if (frameId) clearFramePos(frameId);
        return this;
    };
    root.frames = function(frameDefs) {
        root.empty();
        const frameMap = {};
        let totalFlex = 0;
        root._frameDefs = frameDefs;
        frameDefs.forEach(def => {
            if (def.size && typeof def.size === 'string' && def.size.endsWith('%')) {
                totalFlex += parseFloat(def.size);
            }
        });
        const defaultSize = frameDefs.length > 0 ? (100 - totalFlex) / frameDefs.filter(f => !f.size).length : 100;
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
        const sections = [];
        const resizers = [];
        frameDefs.forEach((def, idx) => {
            const section = Q('<div>', { class: Container.frameClasses.frame_section });
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
            frameMap[def.name] = section;
            sections.push(section);
            root.append(section);
            if (def.resize && idx < frameDefs.length - 1) {
                const resizer = Q('<div>', { class: Container.frameClasses.frame_resizer });
                resizer.addClass(direction === 'horizontal' ? Container.frameClasses.frame_resizer_horizontal : Container.frameClasses.frame_resizer_vertical);
                resizer.on('mousedown', function(e) {
                    e.preventDefault();
                    const prev = section;
                    const next = sections[idx + 1];
                    if (!prev || !next) return;
                    const parent = root.nodes[0];
                    const isHorizontal = direction === 'horizontal';
                    const prevRect = prev.nodes[0].getBoundingClientRect();
                    const nextRect = next.nodes[0].getBoundingClientRect();
                    const parentPx = isHorizontal ? parent.clientWidth : parent.clientHeight;
                    const prevPercent = (isHorizontal ? prevRect.width : prevRect.height) / parentPx * 100;
                    const nextPercent = (isHorizontal ? nextRect.width : nextRect.height) / parentPx * 100;
                    const startX = e.clientX, startY = e.clientY;
                    function onMove(ev) {
                        let deltaPx = isHorizontal ? ev.clientX - startX : ev.clientY - startY;
                        let newPrevPercent = prevPercent + (deltaPx / parentPx) * 100;
                        let newNextPercent = nextPercent - (deltaPx / parentPx) * 100;
                        const minPercent = minSize / parentPx * 100;
                        if (newPrevPercent < minPercent) {
                            newNextPercent -= (minPercent - newPrevPercent);
                            newPrevPercent = minPercent;
                        }
                        if (newNextPercent < minPercent) {
                            newPrevPercent -= (minPercent - newNextPercent);
                            newNextPercent = minPercent;
                        }
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
                        saveCurrentSizes();
                    }
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                });
                root.append(resizer);
                resizers.push(resizer); // Store reference
            }
        });
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
                                setTimeout(() => {
                                    if (direction === 'horizontal') {
                                        sec.css('transition', '');
                                    } else {
                                        sec.css('transition', '');
                                    }
                                }, options.responsiveAnimation + 10);
                            }
                        } else {
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
                    responsiveArr = responsiveArr.filter(entry => entry.screenSizeBucket !== screenSizeBucket);
                    if (responsiveArr.length >= responsivesMaxCount) {
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
        root._frameSections = sections;
        root._frameMap = frameMap;
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
        return frameMap;
    };
    this.elements.push(root);
    return root;
};
Container.prototype.Tab = function(data, horizontal = true) {
    if (!Container.tabClassesInitialized) {
        Container.tabClasses = Q.style('', `
            .tab_navigation_buttons {
                box-sizing: border-box;
                width: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
            }
            .tab_navigation_buttons_vertical {
                width: auto;
                height: 20px;
            }
            .tab_navigation_buttons:hover {
                background-color: var(--form-default-background-hover);
            }
            .tab_container {
                width: 100%;
                min-height: 300px;
            }
            .tab_container_vertical {
                display: flex;
            }
            .tab_navigation_header {
                background-color: var(--form-default-background);
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
                background-color: var(--form-default-accent-color);
                color: var(--form-default-accent-text-color);
                color: #fff;
            }
            .tab {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: default;
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                white-space: nowrap;     /* prevent text wrap */
            }
            .tab_disabled {
                background-color: var(--form-default-background-disabled);
                color: var(--form-default-text-color-disabled);
            }
            .tab_content {
                display: none;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
            .tab_content_active {
                display: block;
            }
            .tab_content_container {
                width: 100%;
                height: 100%;
                overflow: auto;
                position: relative;
            }
        `, null, {
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
            'tab_disabled': 'tab_disabled',
            'tab_content_container': 'tab_content_container'
        });
        Container.tabClassesInitialized = true;
    }
    const wrapper = Q('<div>', { class: Container.tabClasses.tab_container });
    const header = Q('<div>', { class: Container.tabClasses.tab_navigation_header });
    const prevBtn = Q('<div>', { class: Container.tabClasses.tab_navigation_buttons });
    const nextBtn = Q('<div>', { class: Container.tabClasses.tab_navigation_buttons });
    const tabs = Q('<div>', { class: Container.tabClasses.tab_navigation_tabs });
    const contentContainer = Q('<div>', { class: Container.tabClasses.tab_content_container });
    if (!horizontal) {
        wrapper.addClass(Container.tabClasses.tab_container_vertical);
        header.addClass(Container.tabClasses.tab_navigation_header_vertical);
        tabs.addClass(Container.tabClasses.tab_navigation_tabs_vertical);
        prevBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        nextBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        prevBtn.html('▲');
        nextBtn.html('▼');
    } else {
        prevBtn.html('◀');
        nextBtn.html('▶');
    }
    header.append(prevBtn, tabs, nextBtn);
    wrapper.append(header, contentContainer);
    function updateNavButtons() {
        const el = tabs.nodes[0];
        const hasOverflow = horizontal
            ? el.scrollWidth > el.clientWidth
            : el.scrollHeight > el.clientHeight;
        const disp = hasOverflow ? 'flex' : 'none';
        prevBtn.css('display', disp);
        nextBtn.css('display', disp);
    }
    const data_tabs = {};
    const data_contents = {};
    let activeTab = null;
    prevBtn.off('click').on('click', () => {
        const scrollAmount = horizontal ? tabs.width() : tabs.height();
        const el = tabs.nodes[0];
        if (el && el.scrollBy) {
            el.scrollBy({
                left: horizontal ? -scrollAmount : 0,
                top:  horizontal ? 0 : -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            horizontal ? tabs.scrollLeft(-scrollAmount, true)
                       : tabs.scrollTop(-scrollAmount, true);
        }
    });
    nextBtn.off('click').on('click', () => {
        const scrollAmount = horizontal ? tabs.width() : tabs.height();
        const el = tabs.nodes[0];
        if (el && el.scrollBy) {
            el.scrollBy({
                left: horizontal ?  scrollAmount : 0,
                top:  horizontal ?  0 :  scrollAmount,
                behavior: 'smooth'
            });
        } else {
            horizontal ? tabs.scrollLeft( scrollAmount, true)
                       : tabs.scrollTop( scrollAmount, true);
        }
    });
    data.forEach(item => {
        const tab = Q('<div>', { class: Container.tabClasses.tab })
            .attr('data-value', item.value)
            .text(item.title);
        if (item.disabled) {
            tab.addClass(Container.tabClasses.tab_disabled);
        }
        let content;
        if (typeof item.content === 'string') {
            content = Q('<div>').html(item.content);
        } else if (item.content instanceof Element) {
            content = Q(item.content);
        } else if (item.content instanceof Q) {
            content = item.content;
        } else {
            content = Q('<div>');
        }
        data_tabs[item.value] = tab;
        data_contents[item.value] = content;
        tab.on('click', function() {
            if (tab.hasClass(Container.tabClasses.tab_disabled)) return;
            const activeTabs = tabs.find('.' + Container.tabClasses.tab_active);
            if (activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(item.value);
        });
        tabs.append(tab);
    });
    updateNavButtons();
    function showContent(value) {
        if (!data_contents[value]) return;
        if (activeTab && data_contents[activeTab]) {
            data_contents[activeTab].detach();
        }
        activeTab = value;
        contentContainer.append(data_contents[value]);
    }
    wrapper.select = function(value) {
        const tab = data_tabs[value];
        if (tab) tab.click();
        return this;
    };
    wrapper.disabled = function(value, state) {
        const tab = data_tabs[value];
        if (tab) {
            state ? tab.addClass(Container.tabClasses.tab_disabled) : 
                  tab.removeClass(Container.tabClasses.tab_disabled);
        }
        return this;
    };
    wrapper.addTab = function(tabData) {
        if (!tabData) return null;
        const tab = Q('<div>', { class: Container.tabClasses.tab })
            .attr('data-value', tabData.value)
            .text(tabData.title);
        if (tabData.disabled) {
            tab.addClass(Container.tabClasses.tab_disabled);
        }
        let content;
        if (typeof tabData.content === 'string') {
            content = Q('<div>').html(tabData.content);
        } else if (tabData.content instanceof Element) {
            content = Q(tabData.content);
        } else if (tabData.content instanceof Q) {
            content = tabData.content;
        } else {
            content = Q('<div>');
        }
        data_tabs[tabData.value] = tab;
        data_contents[tabData.value] = content;
        tab.on('click', function() {
            if (tab.hasClass(Container.tabClasses.tab_disabled)) return;
            const activeTabs = tabs.find('.' + Container.tabClasses.tab_active);
            if (activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(tabData.value);
        });
        tabs.append(tab);
        updateNavButtons();
        return tab;
    };
    wrapper.removeTab = function(value) {
        if (data_tabs[value]) {
            data_tabs[value].remove();
            if (activeTab === value) {
                const availableTab = Object.keys(data_tabs).find(key => key !== value);
                if (availableTab) {
                    this.select(availableTab);
                } else {
                    contentContainer.empty();
                    activeTab = null;
                }
            }
            if (data_contents[value]) {
                data_contents[value].remove();
            }
            delete data_tabs[value];
            delete data_contents[value];
        }
        updateNavButtons();
        return this;
    };
    wrapper.getContent = function(value) {
        return data_contents[value] || null;
    };
    wrapper.updateContent = function(value, newContent) {
        if (!data_contents[value]) return this;
        if (typeof newContent === 'string') {
            data_contents[value].html(newContent);
        } else if (newContent instanceof Element || newContent instanceof Q) {
            data_contents[value].empty().append(newContent);
        }
        return this;
    };
    this.elements.push(wrapper);
    return wrapper;
};
Container.prototype.Table = function (data = [], options = {}) {
  if (!Array.isArray(data)) throw new Error('Container.Table: data must be an array of objects');
  const defaultOptions = {
    pageSize: 10,
    sizes: [],
    pageButtonLimit: 5,
    debounce: 250,
    search: true,
    sort: true,
    filter: true,
    page: true,
    info: true,
    language: ['Search...', 'No results found.', 'Showing [PAGE] to [ALL_PAGES] of [TOTAL] entries','First', 'Prev', 'Next', 'Last'],
  };
  options = Object.assign({}, defaultOptions, options);
  const {
    debounce: debounceTime,
    search: enableSearch,
    sort: enableSort,
    filter: enableFilter,
    page: enablePage,
    info: enableInfo
  } = options;
  if (!Container.tableClassesInitialized) {
    Container.tableClasses = Q.style('', `
      .tbl_wrapper { display: flex; flex-direction: column; }
      .tbl_top { display: flex; justify-content: space-between; margin-bottom: 5px; }
      .tbl_table { width:100%; border-collapse: collapse; 
      border-radius: var(--form-default-border-radius);
      overflow: hidden;
      }
      .tbl_table th, .tbl_table td {
      border: var(--form-default-dataset-border);
      padding:6px;
      text-align:left;
      cursor: default;
      }
      .tbl_row.selected { background: var(--form-default-accent-color); color: var(--form-default-accent-text-color); }
            .tbl_table th
      {
        background: var(--form-default-dataset-header-background);
        color: var(--form-default-dataset-header-text-color);
        font-weight: var(--form-default-dataset-header-font-weight);
        font-size: var(--form-default-dataset-header-font-size);
        padding-right: 25px;
}
        .tbl_table td
      {
        font-size: var(--form-default-dataset-header-data-font-size);
        color: var(--form-default-dataset-data-text-color);
    }
      .tbl_bottom {
      display: flex;
      justify-content: space-between;
      margin-top:5px; 
      font-size: var(--form-default-dataset-header-data-font-size);
      color: var(--form-default-dataset-data-text-color);
      }
      .tbl_pagination {
      display:flex;
      gap:2px;
      }
      .tbl_page_btn {
      padding: 5px 15px;
      cursor: default;
      user-select: none;
      }
      .tbl_page_btn.active { 
      background: var(--form-default-accent-color);
        color: var(--form-default-text-color-active);
    }
      .tbl_table th { position: relative; }
      .tbl_table th .sort-icons {
        position: absolute; right: 8px; top: 50%;
        transform: translateY(-50%);
        display: flex; flex-direction: column;
        font-size: 8px; line-height: 1.3;
      }
      .sort_active {
      color: var(--form-default-accent-color);
    }
    `, null, {
      'tbl_wrapper': 'tbl_wrapper',
      'tbl_top': 'tbl_top',
      'tbl_search': 'tbl_search',
      'tbl_page_size': 'tbl_page_size',
      'tbl_table': 'tbl_table',
      'tbl_row': 'tbl_row',
      'tbl_bottom': 'tbl_bottom',
      'tbl_pagination': 'tbl_pagination',
      'tbl_page_btn': 'tbl_page_btn',
      'sort-icons': 'sort-icons',
      'asc': 'asc', 'desc': 'desc',
      'sort_active': 'sort_active',
      'active': 'active',
      'selected': 'selected',
    }, true);
    Container.tableClassesInitialized = true;
  }
  const wrapper = Q('<div>', { class: Container.tableClasses.tbl_wrapper });
  const top = Q('<div>', { class: Container.tableClasses.tbl_top });
  let allData = [...data],
    currentPage = 1,
    sortKey = null,
    sortOrder = 'off',
    selectedIdx = null,
    onChange = null,
    filteredIndices = [];
  const columnSizes = options.sizes;
  const form = new Q.Form();
  const searchInput = form.TextBox('text', '', options.language[0]);
  const search = Q('<div>', { class: Container.tableClasses.tbl_search })
    .append(searchInput.nodes[0]);
  if (enableSearch) top.append(search);
  const searchDebounceId = Q.ID('tbl_search_');
  const table = Q('<table>', { class: Container.tableClasses.tbl_table });
  const bottom = Q('<div>', { class: Container.tableClasses.tbl_bottom });
  const status = Q('<div>');
  const pagination = Q('<div>', { class: Container.tableClasses.tbl_pagination });
  bottom.append(status, pagination);
  wrapper.append(top, table, bottom);
  let pageSizeVal = options.pageSize;
  const pageSizeDropdown = form.Dropdown({
    values: [10, 25, 50, 100].map(n => ({ value: n, text: '' + n, default: n === pageSizeVal }))
  });
  const pageSize = Q('<div>', { class: Container.tableClasses.tbl_page_size })
    .append(pageSizeDropdown.nodes[0]);
  if (enablePage) top.append(pageSize);
  pageSizeDropdown.change(v => {
    pageSizeVal = +v;
    currentPage = 1;
    render();
  });
  pageSizeVal = +pageSizeDropdown.val().value;
  function render() {
    const rawVal = searchInput.val() || '';
    const term = rawVal.trim();
    if (enableFilter) {
      filteredIndices = allData.map((row, i) => i);
      if (term.includes(':')) {
        const clauses = term.split(',').map(c => {
          const [field, ...rest] = c.split(':');
          return [field.trim(), rest.join(':').trim()];
        });
        filteredIndices = filteredIndices.filter(i => {
          const row = allData[i];
          return clauses.every(([field, val]) => {
            const fv = row[field];
            if (fv == null) return false;
            const str = typeof fv === 'object' ? JSON.stringify(fv) : String(fv);
            return str.toLowerCase().includes(val.toLowerCase());
          });
        });
      } else {
        const lower = term.toLowerCase();
        filteredIndices = filteredIndices.filter(i =>
          JSON.stringify(allData[i]).toLowerCase().includes(lower)
        );
      }
    } else {
      filteredIndices = allData.map((_, i) => i);
    }
    if (enableSort && sortKey && sortOrder !== 'off') {
      filteredIndices.sort((a, b) => {
        const aVal = allData[a][sortKey];
        const bVal = allData[b][sortKey];
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const total = filteredIndices.length;
    const totalPages = Math.ceil(total / pageSizeVal) || 1;
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSizeVal,
      end = start + pageSizeVal;
    const pageIndices = enablePage
      ? filteredIndices.slice(start, end)
      : filteredIndices;
    const keys = Object.keys(allData[0] || {});
    const thead = `<thead><tr>${keys.map((k, i) => {
      const icons = enableSort
        ? `<span class="${Container.tableClasses['sort-icons']}">
               <span class="${Container.tableClasses.asc}">▲</span>
               <span class="${Container.tableClasses.desc}">▼</span>
             </span>`
        : '';
      return `<th data-key="${k}"${columnSizes[i] ? ` style="width:${columnSizes[i]}"` : ''}>${k}${icons}</th>`;
    }).join('')
      }</tr></thead>`;
    const tbody = pageIndices.map(idx => {
      const row = allData[idx];
      return `<tr data-idx="${idx}" class="${Container.tableClasses.tbl_row}${idx === selectedIdx ? ' '+ Container.tableClasses.selected : ''}">${Object.values(row).map(v => {
        if (Array.isArray(v)) return `<td>${v.join(', ')}</td>`;
        if (typeof v === 'object') return `<td>${JSON.stringify(v)}</td>`;
        return `<td>${v}</td>`;
      }).join('')
        }</tr>`;
    }).join('');
    table.html('');
    table.append(thead + `<tbody>${tbody}</tbody>`);
    if (enableInfo) {
      if (total === 0) {
        status.html(options.language[1]);
      } else{
      const pageInfo = options.language[2]
        .replace('[PAGE]', currentPage)
        .replace('[ALL_PAGES]', totalPages)
        .replace('[TOTAL]', total);
      status.html(pageInfo);
      }
    }
    if (enablePage) {
      pagination.html('');
      [options.language[3], options.language[4]].forEach(t => {
        const btn = `<span class="${Container.tableClasses.tbl_page_btn}" data-action="${t.toLowerCase()}">${t}</span>`;
        pagination.append(btn);
      });
      const limit = options.pageButtonLimit;
      const half = Math.floor(limit / 2);
      let startPage = Math.max(1, currentPage - half);
      let endPage = Math.min(totalPages, startPage + limit - 1);
      if (endPage - startPage + 1 < limit) {
        startPage = Math.max(1, endPage - limit + 1);
      }
      for (let p = startPage; p <= endPage; p++) {
        const cls = p === currentPage ? ' '+ Container.tableClasses.active : '';
        pagination.append(`<span class="${Container.tableClasses.tbl_page_btn + cls}" data-page="${p}">${p}</span>`);
      }
      [options.language[5], options.language[6]].forEach(t => {
        const btn = `<span class="${Container.tableClasses.tbl_page_btn}" data-action="${t.toLowerCase()}">${t}</span>`;
        pagination.append(btn);
      });
    }
  }
  if (enableSearch) {
    searchInput.change(() => {
      Q.Debounce(searchDebounceId, debounceTime, () => {
        currentPage = 1;
        render();
      });
    });
  }
  table.on('click', evt => {
    const th = evt.target.closest('th');
    const tr = evt.target.closest('tr[data-idx]');
    if (enableSort && th) {
      const key = th.dataset.key;
      if (sortKey === key) {
        if (sortOrder === 'off') sortOrder = 'asc';
        else if (sortOrder === 'asc') sortOrder = 'desc';
        else { sortOrder = 'off'; sortKey = null; }
      } else {
        sortKey = key;
        sortOrder = 'asc';
      }
      render();
      Q('.' + Container.tableClasses.sort_active).removeClass(Container.tableClasses.sort_active);
      if (sortOrder != 'off') {
        const arrowKey = sortOrder === 'asc' ? Container.tableClasses.asc : Container.tableClasses.desc;
        const head = Q(`[data-key="${key}"] .${arrowKey}`);
        head.addClass(Container.tableClasses.sort_active);
      }
    } else if (tr) {
      const idx = +tr.dataset.idx;
      wrapper.select(idx);
    }
  });
  if (enablePage) {
    pagination.on('click', evt => {
      const tgt = evt.target;
      if (tgt.dataset.page) currentPage = +tgt.dataset.page;
      else if (tgt.dataset.action === 'first') currentPage = 1;
      else if (tgt.dataset.action === 'prev') currentPage = Math.max(1, currentPage - 1);
      else if (tgt.dataset.action === 'next') currentPage = Math.min(Math.ceil(filteredIndices.length / pageSizeVal), currentPage + 1);
      else if (tgt.dataset.action === 'last') currentPage = Math.ceil(filteredIndices.length / pageSizeVal);
      render();
    });
  }
  wrapper.load = function (newData, stayOn = false) {
    allData = [...newData];
    if (!stayOn) { sortKey = null; sortOrder = 'off'; currentPage = 1; }
    wrapper; render(); return this;
  };
  wrapper.select = function (idx, key, val) {
    if (key != null) {
      const found = allData.findIndex(o => o[key] === val);
      if (found >= 0) idx = found;
    }
    selectedIdx = idx;
    table.find('tr').removeClass(Container.tableClasses.selected);
    table.find(`tr[data-idx="${idx}"]`).addClass(Container.tableClasses.selected);
    if (onChange) onChange(idx, allData[idx]);
    return this;
  };
  wrapper.change = function (cb) { onChange = cb; return this; };
  wrapper.index = function (idx) { return wrapper.select(idx); };
  wrapper.clear = function () { allData = []; render(); return this; };
  this.elements.push(wrapper);
  render();
  return wrapper;
};
Container.prototype.Window = function (options = {}) {
    const defaultOptions = {
        title: 'Window',
        content: '',
        resizable: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        draggable: true,
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        minWidth: 200,
        minHeight: 150,
        zIndex: 1000,
        minimizePosition: 'bottom-left',
        minimizeContainer: null,
        minimizeOffset: 10,
        animate: 150,
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        shadowSpread: 0,
        blur: false,
        blurInactive: false,
        blurRadius: 10,
        blurGradientOpacity: 0.3,
    };
    if (!Container.windowClassesInitialized) {
        Container.windowClasses = Q.style(`
            --window-bg-color:rgb(37, 37, 37);
            --window-shadow-color: rgba(0, 0, 0, 0.1);
            --window-titlebar-bg:rgb(17, 17, 17);
            --window-titlebar-text: #ffffff;
            --window-button-bg:rgb(17, 17, 17);
            --window-button-hover-bg: #777777;
            --window-button-text: #ffffff;
            --window-close-color: #e74c3c;
            --window-titlebar-height: 28px; /* Add fixed titlebar height */
        `, `
            .window_container {
                position: fixed; /* Change from absolute to fixed */
                min-width: 200px;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transition-property: opacity, transform, width, height, top, left;
                transition-timing-function: ease-out;
            }
            .window_titlebar {
                color: var(--window-titlebar-text);
                background-color: var(--window-titlebar-bg);
                font-size: 12px;
                cursor: default;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                height: var(--window-titlebar-height); /* Fixed height for titlebar */
            }
            .window_title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                margin: 0 10px;
                text-shadow: 0px 1px 5px rgba(0, 0, 0, 1.0);
            }
            .window_controls {
                display: flex;
                height:100%;
            }
            .window_button {
                background-color: var(--window-button-bg);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: 100%;
                width: 30px;
            }
            .window_button:hover {
                background-color: var(--window-button-hover-bg);
            }
            .window_close:hover {
                background-color: var(--window-close-color);
            }
            .window_content {
                flex: 1;
                overflow: auto;
                padding: 10px;
                position: relative;
                background-color: var(--window-bg-color);
                box-sizing: border-box;
            }
            .window_content:empty {
            padding: 0;
            }
            .window_resize_handle {
                position: absolute;
                z-index: 1;
            }
            .window_resize_n {
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                cursor: n-resize;
            }
            .window_resize_e {
                top: 0;
                right: 0;
                bottom: 0;
                width: 5px;
                cursor: e-resize;
            }
            .window_resize_s {
                bottom: 0;
                left: 0;
                right: 0;
                height: 5px;
                cursor: s-resize;
            }
            .window_resize_w {
                top: 0;
                left: 0;
                bottom: 0;
                width: 5px;
                cursor: w-resize;
            }
            .window_resize_nw {
                top: 0;
                left: 0;
                width: 10px;
                height: 10px;
                cursor: nw-resize;
            }
            .window_resize_ne {
                top: 0;
                right: 0;
                width: 10px;
                height: 10px;
                cursor: ne-resize;
            }
            .window_resize_se {
                bottom: 0;
                right: 0;
                width: 10px;
                height: 10px;
                cursor: se-resize;
            }
            .window_resize_sw {
                bottom: 0;
                left: 0;
                width: 10px;
                height: 10px;
                cursor: sw-resize;
            }
            .window_minimized {
                height: var(--window-titlebar-height) !important; /* Fixed to titlebar height */
                width: auto !important;
                min-width: 200px;
                position: fixed !important;
                bottom: 10px;
                left: 10px;
                overflow: hidden;
            }
            .window_minimized .window_content {
                display: none !important; /* Ensure it really does not appear */
                height: 0 !important;
            }
            .window_minimized .window_resize_handle {
                display: none;
            }
            .window_maximized {
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 0;
                position: fixed !important;
            }
            .window_maximized .window_resize_handle {
                display: none;
            }
            .window_button_icon {
                width: 10px;
                height: 10px;
                color: var(--window-button-text);
                pointer-events: none;
            }
            .window_taskbar_btn {
                min-width: 100px;
                max-width: 220px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background: #222;
                color: #fff;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 0 12px;
                height: 28px;
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 13px;
                box-sizing: border-box;
            }
        `, null, {
            'window_container': 'window_container',
            'window_titlebar': 'window_titlebar',
            'window_title': 'window_title',
            'window_controls': 'window_controls',
            'window_button': 'window_button',
            'window_minimize': 'window_minimize',
            'window_maximize': 'window_maximize',
            'window_restore': 'window_restore',
            'window_close': 'window_close',
            'window_content': 'window_content',
            'window_resize_handle': 'window_resize_handle',
            'window_resize_n': 'window_resize_n',
            'window_resize_e': 'window_resize_e',
            'window_resize_s': 'window_resize_s',
            'window_resize_w': 'window_resize_w',
            'window_resize_nw': 'window_resize_nw',
            'window_resize_ne': 'window_resize_ne',
            'window_resize_se': 'window_resize_se',
            'window_resize_sw': 'window_resize_sw',
            'window_minimized': 'window_minimized',
            'window_maximized': 'window_maximized',
            'window_button_icon': 'window_button_icon',
            'window_taskbar_btn': 'window_taskbar_btn'
        }, false);
        Container.windowClassesInitialized = true;
    }
    if (!Container.taskbar) {
        let taskbarStyle = {
            position: 'fixed',
            height: '32px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            maxWidth: '100vw',
            minHeight: '0',
            minWidth: '0'
        };
        switch (defaultOptions.minimizePosition || 'bottom-left') {
            case 'bottom-right':
                taskbarStyle.right = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.bottom = defaultOptions.minimizeOffset + 'px';
                break;
            case 'top-left':
                taskbarStyle.left = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.top = defaultOptions.minimizeOffset + 'px';
                break;
            case 'top-right':
                taskbarStyle.right = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.top = defaultOptions.minimizeOffset + 'px';
                break;
            case 'bottom-left':
            default:
                taskbarStyle.left = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.bottom = defaultOptions.minimizeOffset + 'px';
                break;
        }
        Container.taskbar = Q('<div>', { class: Container.windowClasses.window_taskbar || 'window_taskbar' }).css(taskbarStyle);
        Q('body').append(Container.taskbar);
    }
    const settings = Object.assign({}, defaultOptions, options);
    const windowElement = Q('<div>', { class: Container.windowClasses.window_container });
    if (settings.shadow) {
        windowElement.css({
            boxShadow: `${settings.shadowOffsetX}px ${settings.shadowOffsetY}px ${settings.shadowBlur}px ${settings.shadowSpread}px ${settings.shadowColor}`
        });
    } else {
        windowElement.css({ boxShadow: 'none' });
    }
    const titlebar = Q('<div>', { class: Container.windowClasses.window_titlebar });
    function setTitlebarBlurElement(titlebarElem, active, blurRadius, gradientOpacity, animateMs) {
        if (!titlebarElem) return;
        if (typeof animateMs === 'number' && animateMs > 0) {
            titlebarElem.style.transition = `backdrop-filter ${animateMs}ms, -webkit-backdrop-filter ${animateMs}ms, background-image ${animateMs}ms`;
        } else {
            titlebarElem.style.transition = '';
        }
        if (active) {
            titlebarElem.style.backdropFilter = `blur(${blurRadius}px)`;
            titlebarElem.style.WebkitBackdropFilter = `blur(${blurRadius}px)`;
            titlebarElem.style.backgroundColor = 'transparent';
            const buttonBg = getComputedStyle(document.documentElement)
                .getPropertyValue('--window-button-bg') || '#111';
            const leftAlpha = Math.max(0, Math.min(1, gradientOpacity));
            titlebarElem.style.backgroundImage =
                `linear-gradient(to right, rgba(17,17,17,${leftAlpha}), ${buttonBg.trim()} 80%)`;
        } else {
            titlebarElem.style.backdropFilter = 'blur(0px)';
            titlebarElem.style.WebkitBackdropFilter = 'blur(0px)';
            titlebarElem.style.backgroundColor = '';
            titlebarElem.style.backgroundImage = '';
        }
    }
    function updateAllTitlebarBlur() {
        const allWindows = document.querySelectorAll('.' + Container.windowClasses.window_container);
        let maxZ = -Infinity, activeWindow = null;
        allWindows.forEach(win => {
            const z = parseInt(win.style.zIndex || window.getComputedStyle(win).zIndex, 10) || 0;
            if (z > maxZ) {
                maxZ = z;
                activeWindow = win;
            }
        });
        allWindows.forEach(win => {
            const tb = win.querySelector('.' + Container.windowClasses.window_titlebar);
            if (!tb) return;
            if (settings.blurInactive) {
                setTitlebarBlurElement(
                    tb,
                    win !== activeWindow,
                    settings.blurRadius,
                    settings.blurGradientOpacity,
                    settings.animate
                );
            } else if (settings.blur) {
                setTitlebarBlurElement(tb, true, settings.blurRadius, settings.blurGradientOpacity, 0);
            } else {
                setTitlebarBlurElement(tb, false, settings.blurRadius, settings.blurGradientOpacity, 0);
            }
        });
    }
    if (settings.blurInactive) {
        setTimeout(updateAllTitlebarBlur, 0);
        windowElement.on('mousedown', function () {
            setTimeout(updateAllTitlebarBlur, 0);
        });
    } else if (settings.blur) {
        setTitlebarBlurElement(titlebar.nodes[0], true, settings.blurRadius, settings.blurGradientOpacity, 0);
    } else {
        setTitlebarBlurElement(titlebar.nodes[0], false, settings.blurRadius, settings.blurGradientOpacity, 0);
    }
    const titleElement = Q('<div>', { class: Container.windowClasses.window_title }).text(settings.title);
    const controls = Q('<div>', { class: Container.windowClasses.window_controls });
    const contentContainer = Q('<div>', { class: Container.windowClasses.window_content });
    if (settings.minimizable) {
        const minimizeButton = Q('<div>', {
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_minimize
        });
        minimizeButton.append(this.Icon('window-minimize').addClass(Container.windowClasses.window_button_icon));
        controls.append(minimizeButton);
    }
    if (settings.maximizable) {
        const maximizeButton = Q('<div>', {
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_maximize
        });
        maximizeButton.append(this.Icon('window-full').addClass(Container.windowClasses.window_button_icon));
        controls.append(maximizeButton);
    }
    if (settings.closable) {
        const closeButton = Q('<div>', {
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_close
        });
        closeButton.append(this.Icon('window-close').addClass(Container.windowClasses.window_button_icon));
        controls.append(closeButton);
    }
    titlebar.append(titleElement, controls);
    windowElement.append(titlebar, contentContainer);
    if (settings.resizable) {
        const resizeHandles = [
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_n, 'data-resize': 'n' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_e, 'data-resize': 'e' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_s, 'data-resize': 's' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_w, 'data-resize': 'w' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_nw, 'data-resize': 'nw' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_ne, 'data-resize': 'ne' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_se, 'data-resize': 'se' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_sw, 'data-resize': 'sw' })
        ];
        for (let i = 0; i < resizeHandles.length; i++) {
            windowElement.append(resizeHandles[i]);
        }
    }
    if (settings.content) {
        if (typeof settings.content === 'string') {
            contentContainer.html(settings.content);
        } else if (settings.content instanceof Element || settings.content instanceof Q) {
            contentContainer.append(settings.content);
        }
    }
    let isMinimized = false;
    let isMaximized = false;
    let previousState = {
        width: settings.width,
        height: settings.height,
        x: 0,
        y: 0
    };
    let isOpen = false;
    let isAnimating = false;
    let taskbarButton = null;
    function setTransitionDuration(duration) {
        if (!settings.animate) return;
        windowElement.css('transition-duration', duration + 'ms');
    }
    function resetTransition() {
        setTimeout(() => {
            windowElement.css('transition-duration', '');
            isAnimating = false;
        }, settings.animate);
    }
    function calculateInitialPosition() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const windowWidth = settings.width;
        const windowHeight = settings.height;
        let left = (viewportWidth * settings.x / 100) - (windowWidth / 2);
        let top = (viewportHeight * settings.y / 100) - (windowHeight / 2);
        left = Math.max(0, Math.min(left, viewportWidth - windowWidth));
        top = Math.max(0, Math.min(top, viewportHeight - windowHeight));
        return { left, top };
    }
    function setInitialPositionAndSize() {
        const position = calculateInitialPosition();
        windowElement.css({
            position: 'fixed',
            width: settings.width + 'px',
            height: settings.height + 'px',
            left: position.left + 'px',
            top: position.top + 'px',
            zIndex: settings.zIndex
        });
        previousState.x = position.left;
        previousState.y = position.top;
    }
    function bringToFront() {
        const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
        if (windowIndex !== -1) {
            Container.openWindows.splice(windowIndex, 1);
        }
        Container.openWindows.push(windowElement.nodes[0]);
        updateZIndices();
        if (settings.blurInactive) setTimeout(updateAllTitlebarBlur, 0);
    }
    function updateZIndices() {
        const baseZIndex = settings.zIndex;
        for (let i = 0; i < Container.openWindows.length; i++) {
            const windowNode = Container.openWindows[i];
            windowNode.style.zIndex = baseZIndex + i;
        }
        Container.highestZIndex = baseZIndex + Container.openWindows.length - 1;
    }
    function setupDraggable() {
        if (!settings.draggable) return;
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            if (isMinimized) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const minWidth = windowElement.width();
                const minHeight = windowElement.height();
                const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - minWidth));
                const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - minHeight));
                windowElement.css({
                    left: constrainedLeft + 'px',
                    top: constrainedTop + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
                return;
            }
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = windowElement.width();
            const windowHeight = windowElement.height();
            const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - windowWidth));
            const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - windowHeight));
            windowElement.css({
                left: constrainedLeft + 'px',
                top: constrainedTop + 'px',
                right: 'auto',
                bottom: 'auto'
            });
            previousState.x = constrainedLeft;
            previousState.y = constrainedTop;
        }
        function onMouseUp() {
            isDragging = false;
            Q(document).off('mousemove', onMouseMove);
            Q(document).off('mouseup', onMouseUp);
        }
        Q(titlebar).on('mousedown', function (e) {
            if (isMaximized || isMinimized) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(windowElement.css('left'), 10);
            startTop = parseInt(windowElement.css('top'), 10);
            bringToFront();
            Q(document).on('mousemove', onMouseMove);
            Q(document).on('mouseup', onMouseUp);
            e.preventDefault();
        });
        Q(titlebar).on('dblclick', function (e) {
            if (settings.maximizable) {
                toggleMaximize();
            }
        });
    }
    function setupResizable() {
        if (!settings.resizable) return;
        let isResizing = false;
        let resizeDirection = '';
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        const resizeHandles = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_resize_handle);
        function onMouseMove(e) {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;
            if (resizeDirection.includes('e')) {
                newWidth = startWidth + dx;
            }
            if (resizeDirection.includes('s')) {
                newHeight = startHeight + dy;
            }
            if (resizeDirection.includes('w')) {
                newWidth = startWidth - dx;
                newLeft = startLeft + dx;
            }
            if (resizeDirection.includes('n')) {
                newHeight = startHeight - dy;
                newTop = startTop + dy;
            }
            if (newWidth < settings.minWidth) {
                if (resizeDirection.includes('w')) {
                    newLeft = startLeft + startWidth - settings.minWidth;
                }
                newWidth = settings.minWidth;
            }
            if (newHeight < settings.minHeight) {
                if (resizeDirection.includes('n')) {
                    newTop = startTop + startHeight - settings.minHeight;
                }
                newHeight = settings.minHeight;
            }
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            if (newLeft + newWidth > viewportWidth) {
                if (resizeDirection.includes('e')) {
                    newWidth = viewportWidth - newLeft;
                }
            }
            if (newTop + newHeight > viewportHeight) {
                if (resizeDirection.includes('s')) {
                    newHeight = viewportHeight - newTop;
                }
            }
            if (newLeft < 0) {
                if (resizeDirection.includes('w')) {
                    const adjustment = -newLeft;
                    newLeft = 0;
                    newWidth -= adjustment;
                }
            }
            if (newTop < 0) {
                if (resizeDirection.includes('n')) {
                    const adjustment = -newTop;
                    newTop = 0;
                    newHeight -= adjustment;
                }
            }
            windowElement.css({
                width: newWidth + 'px',
                height: newHeight + 'px',
                left: newLeft + 'px',
                top: newTop + 'px'
            });
            previousState.width = newWidth;
            previousState.height = newHeight;
            previousState.x = newLeft;
            previousState.y = newTop;
        }
        function onMouseUp() {
            isResizing = false;
            Q(document).off('mousemove', onMouseMove);
            Q(document).off('mouseup', onMouseUp);
        }
        for (let i = 0; i < resizeHandles.length; i++) {
            const handle = resizeHandles[i];
            Q(handle).on('mousedown', function (e) {
                if (isMaximized || isMinimized) return;
                isResizing = true;
                resizeDirection = this.getAttribute('data-resize');
                startX = e.clientX;
                startY = e.clientY;
                startWidth = windowElement.width();
                startHeight = windowElement.height();
                startLeft = parseInt(windowElement.css('left'), 10);
                startTop = parseInt(windowElement.css('top'), 10);
                windowElement.css('zIndex', settings.zIndex + 10);
                Q(document).on('mousemove', onMouseMove);
                Q(document).on('mouseup', onMouseUp);
                e.preventDefault();
                e.stopPropagation();
            });
        }
    }
    function setupControls() {
        const minimizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_minimize);
        if (minimizeButtons.length) {
            for (let i = 0; i < minimizeButtons.length; i++) {
                Q(minimizeButtons[i]).on('click', function () {
                    bringToFront();
                    toggleMinimize();
                });
            }
        }
        const maximizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_maximize);
        if (maximizeButtons.length) {
            for (let i = 0; i < maximizeButtons.length; i++) {
                Q(maximizeButtons[i]).on('click', function () {
                    bringToFront();
                    toggleMaximize();
                });
            }
        }
        const closeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_close);
        if (closeButtons.length) {
            for (let i = 0; i < closeButtons.length; i++) {
                Q(closeButtons[i]).on('click', function () {
                    closeWindow();
                });
            }
        }
        Q(contentContainer).on('mousedown', function () {
            bringToFront();
        });
    }
    if (!Container.highestZIndex) {
        Container.highestZIndex = settings.zIndex;
        Container.openWindows = [];
    }
    function toggleMinimize() {
        if (isAnimating) return;
        isAnimating = true;
        if (!isMinimized) {
            const rect = windowElement.nodes[0].getBoundingClientRect();
            const start = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
                opacity: 1
            };
            let taskbarRect = { left: 0, top: window.innerHeight, width: 160, height: 28 };
            if (Container.taskbar && taskbarButton) {
                const btnRect = taskbarButton.nodes[0].getBoundingClientRect();
                taskbarRect = {
                    left: btnRect.left,
                    top: btnRect.top,
                    width: btnRect.width,
                    height: btnRect.height
                };
            } else if (Container.taskbar) {
                const barRect = Container.taskbar.nodes[0].getBoundingClientRect();
                taskbarRect.left = barRect.left;
                taskbarRect.top = barRect.top;
            }
            windowElement.css({
                willChange: 'width,height,left,top,opacity',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`
            });
            windowElement.css({
                width: start.width + 'px',
                height: start.height + 'px',
                left: start.left + 'px',
                top: start.top + 'px',
                opacity: 1
            });
            setTimeout(() => {
                windowElement.css({
                    width: taskbarRect.width + 'px',
                    height: taskbarRect.height + 'px',
                    left: taskbarRect.left + 'px',
                    top: taskbarRect.top + 'px',
                    opacity: 0.2
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                if (!taskbarButton) {
                    let shortTitle = settings.title;
                    if (shortTitle.length > 18) {
                        shortTitle = shortTitle.slice(0, 15) + '...';
                    }
                    taskbarButton = Q('<div>', { class: Container.windowClasses.window_taskbar_btn, text: shortTitle });
                    taskbarButton.on('click', function () {
                        toggleMinimize();
                    });
                    if (settings.minimizePosition === 'bottom-left' || settings.minimizePosition === 'top-left') {
                        Q(Container.taskbar).prepend(taskbarButton);
                    } else {
                        Q(Container.taskbar).append(taskbarButton);
                    }
                }
                windowElement.detach();
                isMinimized = true;
                isAnimating = false;
            }, settings.animate + 10);
        } else {
            Q('body').append(windowElement);
            let btnRect = { left: 0, top: window.innerHeight, width: 160, height: 28 };
            if (taskbarButton) {
                const rect = taskbarButton.nodes[0].getBoundingClientRect();
                btnRect = {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            }
            const end = {
                width: previousState.width,
                height: previousState.height,
                left: previousState.x,
                top: previousState.y,
                opacity: 1
            };
            windowElement.css({
                willChange: 'width,height,left,top,opacity',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`,
                width: btnRect.width + 'px',
                height: btnRect.height + 'px',
                left: btnRect.left + 'px',
                top: btnRect.top + 'px',
                opacity: 0.2,
                display: ''
            });
            setTimeout(() => {
                windowElement.css({
                    width: end.width + 'px',
                    height: end.height + 'px',
                    left: end.left + 'px',
                    top: end.top + 'px',
                    opacity: 1
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                if (taskbarButton) {
                    taskbarButton.remove();
                    taskbarButton = null;
                }
                isMinimized = false;
                bringToFront();
                isAnimating = false;
            }, settings.animate + 10);
        }
    }
    function toggleMaximize() {
        if (isAnimating) return;
        isAnimating = true;
        if (!isMaximized) {
            const rect = windowElement.nodes[0].getBoundingClientRect();
            const start = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top
            };
            windowElement.css({
                willChange: 'width,height,left,top',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`,
                width: start.width + 'px',
                height: start.height + 'px',
                left: start.left + 'px',
                top: start.top + 'px'
            });
            setTimeout(() => {
                windowElement.addClass(Container.windowClasses.window_maximized);
                windowElement.css({
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    borderRadius: 0
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                isMaximized = true;
                previousState.width = start.width;
                previousState.height = start.height;
                previousState.x = start.left;
                previousState.y = start.top;
                isAnimating = false;
            }, settings.animate + 10);
        } else {
            const end = {
                width: previousState.width,
                height: previousState.height,
                left: previousState.x,
                top: previousState.y
            };
            windowElement.removeClass(Container.windowClasses.window_maximized);
            windowElement.css({
                willChange: 'width,height,left,top',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`,
                width: '100vw',
                height: '100vh',
                left: 0,
                top: 0,
                borderRadius: '0'
            });
            setTimeout(() => {
                windowElement.css({
                    width: end.width + 'px',
                    height: end.height + 'px',
                    left: end.left + 'px',
                    top: end.top + 'px',
                    borderRadius: '4px'
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                isMaximized = false;
                isAnimating = false;
            }, settings.animate + 10);
        }
    }
    function closeWindow() {
        if (isAnimating) return;
        if (taskbarButton) {
            taskbarButton.remove();
            taskbarButton = null;
        }
        const savedContent = windowElement.data('detached-content');
        if (savedContent) {
            windowElement.removeData('detached-content');
        }
        if (settings.animate) {
            isAnimating = true;
            setTransitionDuration(settings.animate);
            windowElement.css({
                opacity: '0',
                transform: 'scale(0.90)'
            });
            setTimeout(() => {
                if (windowElement.nodes[0]._resizeHandler) {
                    window.removeEventListener('resize', windowElement.nodes[0]._resizeHandler);
                    windowElement.nodes[0]._resizeHandler = null;
                }
                const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
                if (windowIndex !== -1) {
                    Container.openWindows.splice(windowIndex, 1);
                    updateZIndices();
                }
                windowElement.remove();
                isOpen = false;
            }, settings.animate);
        } else {
            if (windowElement.nodes[0]._resizeHandler) {
                window.removeEventListener('resize', windowElement.nodes[0]._resizeHandler);
                windowElement.nodes[0]._resizeHandler = null;
            }
            const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
            if (windowIndex !== -1) {
                Container.openWindows.splice(windowIndex, 1);
                updateZIndices();
            }
            windowElement.remove();
            isOpen = false;
        }
        setTimeout(function () {
            const selector = '.' + (Container.windowClasses.window_container || 'window_container');
            if (!Q(selector).nodes.length) {
                if (Container.taskbar) {
                    Q(Container.taskbar).remove();
                    Container.taskbar = null;
                }
            }
        }, 0);
        if (settings.blurInactive) {
            setTimeout(updateAllTitlebarBlur, 0);
        }
    }
    function handleWindowResize() {
        if (isMaximized) {
            return;
        }
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const currentWidth = windowElement.width();
        const currentHeight = windowElement.height();
        let currentLeft = parseInt(windowElement.css('left'), 10);
        let currentTop = parseInt(windowElement.css('top'), 10);
        let needsUpdate = false;
        if (currentWidth > viewportWidth) {
            windowElement.css('width', viewportWidth + 'px');
            previousState.width = viewportWidth;
            needsUpdate = true;
        }
        if (currentHeight > viewportHeight) {
            windowElement.css('height', viewportHeight + 'px');
            previousState.height = viewportHeight;
            needsUpdate = true;
        }
        if (currentLeft + currentWidth > viewportWidth) {
            currentLeft = Math.max(0, viewportWidth - currentWidth);
            needsUpdate = true;
        }
        if (currentTop + currentHeight > viewportHeight) {
            currentTop = Math.max(0, viewportHeight - currentHeight);
            needsUpdate = true;
        }
        if (needsUpdate) {
            windowElement.css({
                left: currentLeft + 'px',
                top: currentTop + 'px'
            });
            previousState.x = currentLeft;
            previousState.y = currentTop;
        }
    }
    function setupWindowResizeHandler() {
        function resizeHandler() {
            handleWindowResize();
        }
        windowElement.nodes[0]._resizeHandler = resizeHandler;
        window.addEventListener('resize', resizeHandler);
    }
    const windowAPI = {
        Open: function () {
            if (!isOpen) {
                Q('body').append(windowElement);
                setInitialPositionAndSize();
                if (settings.animate) {
                    windowElement.css({
                        opacity: '0',
                        transform: 'scale(0.90)'
                    });
                    void windowElement.nodes[0].offsetWidth;
                    isAnimating = true;
                    setTransitionDuration(settings.animate);
                    windowElement.css({
                        opacity: '1',
                        transform: 'scale(1)'
                    });
                    resetTransition();
                }
                setupDraggable();
                setupResizable();
                setupControls();
                setupWindowResizeHandler();
                isOpen = true;
                bringToFront();
                if (settings.blurInactive) setTimeout(updateAllTitlebarBlur, 0);
            } else {
                windowElement.show();
                bringToFront();
            }
            return this;
        },
        Close: function () {
            closeWindow();
            if (settings.blurInactive) setTimeout(updateAllTitlebarBlur, 0);
            return this;
        },
        Content: function (content) {
            if (content === undefined) {
                return contentContainer.html();
            }
            contentContainer.empty();
            if (typeof content === 'string') {
                contentContainer.html(content);
            } else if (content instanceof Element || content instanceof Q) {
                contentContainer.append(content);
            }
            return this;
        },
        Title: function (title) {
            if (title === undefined) {
                return titleElement.text();
            }
            titleElement.text(title);
            return this;
        },
        Position: function (x, y) {
            if (x === undefined || y === undefined) {
                return {
                    x: parseInt(windowElement.css('left'), 10),
                    y: parseInt(windowElement.css('top'), 10)
                };
            }
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = windowElement.width();
            const windowHeight = windowElement.height();
            let left = typeof x === 'string' && x.endsWith('%')
                ? (viewportWidth * parseInt(x, 10) / 100) - (windowWidth / 2)
                : x;
            let top = typeof y === 'string' && y.endsWith('%')
                ? (viewportHeight * parseInt(y, 10) / 100) - (windowHeight / 2)
                : y;
            left = Math.max(0, Math.min(left, viewportWidth - windowWidth));
            top = Math.max(0, Math.min(top, viewportHeight - windowHeight));
            windowElement.css({
                left: left + 'px',
                top: top + 'px'
            });
            previousState.x = left;
            previousState.y = top;
            return this;
        },
        Size: function (width, height) {
            if (width === undefined || height === undefined) {
                return {
                    width: windowElement.width(),
                    height: windowElement.height()
                };
            }
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let currentLeft = parseInt(windowElement.css('left'), 10);
            let currentTop = parseInt(windowElement.css('top'), 10);
            width = Math.max(settings.minWidth, width);
            height = Math.max(settings.minHeight, height);
            if (currentLeft + width > viewportWidth) {
                currentLeft = Math.max(0, viewportWidth - width);
                windowElement.css('left', currentLeft + 'px');
                previousState.x = currentLeft;
            }
            if (currentTop + height > viewportHeight) {
                currentTop = Math.max(0, viewportHeight - height);
                windowElement.css('top', currentTop + 'px');
                previousState.y = currentTop;
            }
            windowElement.css({
                width: width + 'px',
                height: height + 'px'
            });
            previousState.width = width;
            previousState.height = height;
            return this;
        },
        Minimize: function () {
            if (!isMinimized) {
                toggleMinimize();
            }
            return this;
        },
        Maximize: function () {
            if (!isMaximized) {
                toggleMaximize();
            }
            return this;
        },
        Restore: function () {
            if (isMinimized) {
                toggleMinimize();
            } else if (isMaximized) {
                toggleMaximize();
            }
            return this;
        },
        IsMinimized: function () {
            return isMinimized;
        },
        IsMaximized: function () {
            return isMaximized;
        },
        IsOpen: function () {
            return isOpen;
        },
        Element: function () {
            return windowElement;
        },
        BringToFront: function () {
            bringToFront();
            return this;
        },
        MinimizePosition: function (position, container, offset) {
            if (position === undefined) {
                return {
                    position: settings.minimizePosition,
                    container: settings.minimizeContainer,
                    offset: settings.minimizeOffset
                };
            }
            if (position) {
                settings.minimizePosition = position;
            }
            if (container !== undefined) {
                settings.minimizeContainer = container;
            }
            if (offset !== undefined) {
                settings.minimizeOffset = offset;
            }
            if (isMinimized) {
                toggleMinimize();
                toggleMinimize();
            }
            return this;
        },
        Animation: function (duration) {
            if (duration === undefined) {
                return settings.animate;
            }
            settings.animate = parseInt(duration) || 0;
            return this;
        }
    };
    this.elements.push(windowAPI);
    return windowAPI;
};
function Form(options = {}) {
    if (!(this instanceof Form)) {
        return new Form(options);
    }
    this.elements = [];
    this.options = options;
    if (!Form.initialized) {
        Form.classes = Q.style(`
            --form-default-accent-color: rgb(100, 60, 240);
            --form-default-accent-text-color: #fff;
            --form-default-font-size: 12px;
            --form-default-font-family: Arial, sans-serif;
            --form-default-dataset-header-font-weight: 600;
            --form-default-dataset-header-font-size: 12px;
            --form-default-dataset-header-data-font-size: 12px;
            --form-default-dataset-header-background: rgba(127, 127, 127, 0.10);
            --form-default-dataset-header-text-color: #fff;
            --form-default-dataset-border: 1px solid rgba(127, 127, 127, 0.24);
            --form-default-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
            --form-default-shadow-active: 0px 0px 5px rgba(100, 60, 240, 0.5);
            --form-default-shadow-focus: 0px 0px 5px rgba(100, 60, 240, 0.5);
            --form-default-shadow-hover: 0px 0px 5px rgba(100, 60, 240, 0.5);
            --form-default-background-active: rgb(46, 46, 46);
            --form-default-background-focus: rgb(46, 46, 46);
            --form-default-background-hover: rgb(46, 46, 46);
            --form-default-background-disabled: rgb(46, 46, 46);
            --form-default-background: rgb(46, 46, 46);
            --form-default-border-active: 1px solid var(--form-default-accent-color);
            --form-default-border-focus: 1px solid var(--form-default-accent-color);
            --form-default-border-hover: 1px solid var(--form-default-accent-color);
            --form-default-border: 1px solid rgba(255, 255, 255, 0.03);
            --form-default-outline-active: var(--form-default-border-active);
            --form-default-outline-focus: var(--form-default-border-focus);
            --form-default-outline-hover: var(--form-default-border-hover);
            --form-default-outline: var(--form-default-border);
            --form-default-border-radius: 5px;
            --form-default-margin: 0px 0px 0px 0px;
            --form-default-padding: 5px 10px 5px 10px;
            --form-default-text-color-active: #fff;
            --form-default-text-color-focus: #fff;
            --form-default-text-color-hover: #fff;
            --form-default-text-color-disabled: #999;
            --form-default-text-color: #999;
            --form-default-text-active: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-text-focus: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-text-hover: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-text: normal var(--form-default-font-size) var(--form-default-font-family);
            --form-default-width: 100%;
        `, `
            .form_icon {
                width: 100%;
                height: 100%;
                color: #fff;
                pointer-events: none;
            }
            .form_close_button {
                user-select: none;
                -webkit-user-select: none;
                position: absolute;
                top: 0px;
                right: 0px;
                width: 18px;
                height: 18px;
                background-color: rgba(0, 0, 0, 0.5);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
            }
            .form_close_button:hover {
                background-color: rgba(220, 53, 69, 0.8);
            }
            /* New scrollbar customization class */
            .scrollbar::-webkit-scrollbar {
                width: 12px;
            }
            .scrollbar::-webkit-scrollbar-track {
                background:transparent;
            }
            .scrollbar::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 10px;
                border: 3px solid rgb(37, 37, 37);
            }
            .scrollbar {
                scrollbar-color: #888 rgb(48, 48, 48);
            }
            /* ripple effect container */
            .form_ripple_container {
                position: relative;
                overflow: hidden;
            }
            .form_ripple_container::after {
                content: '';
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                width: var(--ripple-size);
                height: var(--ripple-size);
                top: var(--ripple-y);
                left: var(--ripple-x);
                transform: scale(0);
            }
            .form_ripple_container.rippleing::after {
                animation: form_ripple 0.4s linear;
            }
            @keyframes form_ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `, null, {
            'form_icon': 'form_icon',
            'form_close_button': 'form_close_button',
            'scrollbar': 'scrollbar',
            'form_ripple_container': 'form_ripple_container',
            'rippleing': 'rippleing'
        });
        Form.initialized = true;
        console.log('Form core initialized');
    }
}
Form.prototype.Icon = function (icon) {
    let iconElement = Q('<div>');
    iconElement.addClass('svg_' + icon + ' form_icon');
    return iconElement;
};
/* FX_Ripple: pseudo‑element approach */
Form.prototype.FX_Ripple = function(el) {
    const element = el instanceof Q ? el.nodes[0] : el;
    if (!element) return this;
    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    element.classList.add(Form.classes.form_ripple_container);
    element.addEventListener('click', function(e) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        element.style.setProperty('--ripple-size', size + 'px');
        element.style.setProperty(
            '--ripple-x',
            (e.clientX - rect.left - size/2) + 'px'
        );
        element.style.setProperty(
            '--ripple-y',
            (e.clientY - rect.top  - size/2) + 'px'
        );
        element.classList.add(Form.classes.rippleing);
        setTimeout(() => {
            element.classList.remove(Form.classes.rippleing);
        }, 400);
    });
    return this;
};
Q.Form = Form;
Form.prototype.Button = function(text = '') {
    if (!Form.buttonClassesInitialized) {
        Form.buttonClasses = Q.style(null, `
            .button {
                user-select: none;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
                border-radius: var(--form-default-border-radius);
                padding: var(--form-default-padding);
            }
            .button:hover {
                background-color: var(--form-default-background-hover);
                color: var(--form-default-text-color-hover);
            }
            .button:active {
                background-color: var(--form-default-background-active);
                color: var(--form-default-text-color-active);
            }
            .button_disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `, null, {
            'button_disabled': 'button_disabled',
            'button': 'button'
        });
        Form.buttonClassesInitialized = true;
    }
    const button = Q(`<div class="${Form.buttonClasses.button}">${text}</div>`);
    button.click = function(callback) {
        button.on('click', callback);
        return button;
    };
    button.disabled = function(state) {
        if (state) {
            button.addClass(Form.buttonClasses.button_disabled);
        } else {
            button.removeClass(Form.buttonClasses.button_disabled);
        }
        return button;
    };
    button.setText = function(newText) {
        button.text(newText);
        return button;
    };
    button.remove = function() {
        button.remove();
        return button;
    };
    this.elements.push(button);
    this.FX_Ripple(button);
    return button;
};
Form.prototype.CheckBox = function(checked = false, text = '') {
    if (!Form.checkBoxClassesInitialized) {
        Form.checkBoxClasses = Q.style('', `
            .form_checkbox {
                display: flex;
                width: fit-content;
                align-items: center;
            }
            .form_checkbox .form_label:empty {
                display: none;
            }
            .form_checkbox .form_label {
                padding-left: 5px;
                user-select: none;
            }
            .form_checkbox_element {
                position: relative;
                width: 20px;
                height: 20px;
                background-color: var(--form-default-background);
                border-radius: var(--form-default-border-radius);
                cursor: pointer;
            }
            .form_checkbox_element.checked:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--form-default-accent-color);
                border-radius: var(--form-default-border-radius);
            }
            .form_label {
                padding-left: 5px;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
            .form_checkbox_element.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        `, null, {
            'form_checkbox': 'form_checkbox',
            'form_checkbox_element': 'form_checkbox_element',
            'form_label': 'form_label',
            'disabled': 'disabled',
            'checked': 'checked'
        });
        Form.checkBoxClassesInitialized = true;
    }
    let ID = '_' + Q.ID();
    const container = Q('<div class="' + Form.checkBoxClasses.form_checkbox + '">');
    const checkbox_container = Q('<div class="' + Form.checkBoxClasses.form_checkbox_element + '">');
    const labeltext = Q('<div class="' + Form.checkBoxClasses.form_label + '">' + text + '</div>');
    if (checked) {
        checkbox_container.addClass(Form.checkBoxClasses['checked']);
    }
    checkbox_container.on('click', function(){
        if (!checkbox_container.hasClass(Form.checkBoxClasses['disabled'])) {
            const newState = !checkbox_container.hasClass(Form.checkBoxClasses['checked']);
            checkbox_container.toggleClass(Form.checkBoxClasses['checked'], newState);
            if (container._changeCallback) {
                container._changeCallback(newState);
            }
        }
    });
    container.append(checkbox_container, labeltext);
    container.checked = function(state) {
        checkbox_container.toggleClass(Form.checkBoxClasses['checked'], state);
        if (state && container._changeCallback) {
            container._changeCallback(state);
        }
    };
    container.change = function(callback) {
        container._changeCallback = callback;
    };
    container.disabled = function(state) {
        if (state) {
            checkbox_container.addClass(Form.checkBoxClasses['disabled']);
            container.addClass(Form.classes.form_disabled);
        } else {
            checkbox_container.removeClass(Form.checkBoxClasses['disabled']);
            container.removeClass(Form.classes.form_disabled);
        }
    };
    container.text = function(newText) {
        labeltext.text(newText);
    };
    this.elements.push(container);
    return container;
};
Form.prototype.ColorPicker = function (options = {}) {
    if (!Form.ColorPickerClassesInitialized) {
        Form.colorPickerClasses = Q.style('', `
            .q_form_color_picker_wrapper {
                display: flex;
                width: 100%;
                height: 100%;
                align-items: stretch;
                justify-content: space-between;
            }
            .left_wrapper {
                flex: 1;
                width: 100%;
                height: 100%;
                display: flex;
            }
            .right_wrapper {
                display: flex;
                flex-direction: column;
                flex: 1;
                padding: 5px;
            }
            .section_snatches, .section_second, .section_third, .section_fourth {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .sections {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2px;
                flex: 1;
            }
            .color_picker_input {
                background-color: var(--form-default-background);
                border-radius: var(--form-default-border-radius);
                padding: 2px;
                margin: 2px;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                outline: var(--form-default-outline);
                border: 0;
                width: 45px;
                text-align: center;
            }
            .input_rgb888, .input_rgb565, .input_hsl
            {
            width: 100%;
            }
            .color_picker_input:focus {
                outline: none;
                background-color: var(--form-default-background-focus);
                outline: var(--form-default-outline-focus);
            }
            /* Hide spinner buttons for number inputs */
            .color_picker_input[type="number"]::-webkit-inner-spin-button,
            .color_picker_input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            /* Firefox */
            .color_picker_input[type="number"] {
                -moz-appearance: textfield;
            }
            .input_wrapper {
                display: flex;
                align-items: center;
            }
            .half_snatch {
                height: 50%;
                width: 100%;
        }
        .picker_blocks {
        background: rgba(0, 0, 0, 0.1);
        border-radius: var(--form-default-border-radius);
        padding: 5px;
        margin: 2px;
        }
            .input_snatches {
            width:40px;
            height:40px;
            border-radius: 10px;
            background-color: var(--form-default-background);
            color: var(--form-default-text-color);
            font-family: var(--form-default-font-family);
            font-size: var(--form-default-font-size);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .snatches_wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
        }
        .input_snatch_wrapper {
            display: flex;
            flex-direction: column;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            overflow: hidden;
        }
            .input_prefix {
            user-select: none;
                width: 20px;
                font-size: var(--form-default-font-size);
                color: var(--form-default-text-color);
                display:block;
            }
            .input_suffix {
            user-select: none;
                margin-left: 5px;
                font-size: var(--form-default-font-size);
                color: var(--form-default-text-color);
                display:block;
            }
            .block_header {
            user-select: none;
                font-weight: bold;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                text-align: center;
                grid-column: 1 / -1;
            }
            .snatches_add {
            cursor: pointer;
            user-select: none;
            }
            `, null, {
            'sections': 'sections',
            'q_form_color_picker_wrapper': 'q_form_color_picker_wrapper',
            'left_wrapper': 'left_wrapper',
            'right_wrapper': 'right_wrapper',
            'color_picker_input': 'color_picker_input',
            'input_wrapper': 'input_wrapper',
            'input_prefix': 'input_prefix',
            'input_suffix': 'input_suffix',
            'section_snatches': 'section_snatches',
            'section_first': 'section_first',
            'section_second': 'section_second',
            'section_third': 'section_third',
            'section_fourth': 'section_fourth',
            'input_snatches': 'input_snatches',
            'input_snatch_wrapper': 'input_snatch_wrapper',
            'half_snatch': 'half_snatch',
            'block_hsb': 'block_hsb',
            'block_rgb': 'block_rgb',
            'block_lab': 'block_lab',
            'block_cmyk': 'block_cmyk',
            'block_rgb888': 'block_rgb888',
            'block_rgb565': 'block_rgb565',
            'block_rgb': 'block_rgb',
            'block_hex': 'block_hex',
            'block_hsl': 'block_hsl',
            'input_h': 'input_h',
            'input_s': 'input_s',
            'input_b': 'input_b',
            'input_r': 'input_r',
            'input_g': 'input_g',
            'input_b2': 'input_b2',
            'input_l': 'input_l',
            'input_a': 'input_a',
            'input_b3': 'input_b3',
            'input_c': 'input_c',
            'input_m': 'input_m',
            'input_y': 'input_y',
            'input_k': 'input_k',
            'input_rgb888': 'input_rgb888',
            'input_rgb565': 'input_rgb565',
            'input_rgb': 'input_rgb',
            'input_hex': 'input_hex',
            'input_hsl': 'input_hsl',
            'input_lab': 'input_lab',
            'input_cmyk': 'input_cmyk',
            'block_header': 'block_header',
            'snatches_wrapper': 'snatches_wrapper',
            'picker_blocks': 'picker_blocks',
            'snatches_add': 'snatches_add'
        }, false);
        Form.ColorPickerClassesInitialized = true;
    }
    const width = options.width || 300;
    const height = options.height || 300;
    const showDetails = options.showDetails !== undefined ? options.showDetails : true;
    const initialColor = options.color || '#FF0000';
    const wrapper = Q('<div>');
    const canvas = Q(`<canvas width="${width}" height="${height}"></canvas>`);
    let current_color, previous_color, input_h, input_s, input_b, input_r, input_g, input_b2, input_l, input_a, input_b3, input_c, input_m, input_y, input_k, input_rgb888, input_rgb565, input_rgb, input_hex, input_hsl, input_lab, input_cmyk;
    let snatches = [];
    if (showDetails) {
        canvas.css({
            'width': '100%',
            'height': '100%',
        });
        wrapper.addClass(Form.colorPickerClasses.q_form_color_picker_wrapper);
        const left_wrapper = Q('<div>', { class: Form.colorPickerClasses.left_wrapper });
        const right_wrapper = Q('<div>', { class: Form.colorPickerClasses.right_wrapper });
        const snatches_wrapper = Q('<div>', { class: Form.colorPickerClasses.snatches_wrapper + ' ' + Form.colorPickerClasses.picker_blocks });
        const section_snatches = Q('<div>', { class: Form.colorPickerClasses.section_snatches });
        const section_first = Q('<div>', { class: Form.colorPickerClasses.section_first });
        const section_second = Q('<div>', { class: Form.colorPickerClasses.section_second + ' ' + Form.colorPickerClasses.sections });
        const section_third = Q('<div>', { class: Form.colorPickerClasses.section_third + ' ' + Form.colorPickerClasses.sections });
        const section_fourth = Q('<div>', { class: Form.colorPickerClasses.section_fourth + ' ' + Form.colorPickerClasses.sections });
        const block_hsb = Q('<div>', { class: Form.colorPickerClasses.block_hsb + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_rgb = Q('<div>', { class: Form.colorPickerClasses.block_rgb + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_lab = Q('<div>', { class: Form.colorPickerClasses.block_lab + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_cmyk = Q('<div>', { class: Form.colorPickerClasses.block_cmyk + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_rgb888 = Q('<div>', { class: Form.colorPickerClasses.block_rgb888 + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_rgb565 = Q('<div>', { class: Form.colorPickerClasses.block_rgb565 + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_hsl = Q('<div>', { class: Form.colorPickerClasses.block_hsl + ' ' + Form.colorPickerClasses.picker_blocks });
        const header_hsb = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'HSB Color'
        });
        const header_rgb = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'RGB Color'
        });
        const header_lab = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'LAB Color'
        });
        const header_cmyk = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'CMYK Color'
        });
        const header_rgb888 = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'RGB888'
        });
        const header_rgb565 = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'RGB565'
        });
        const header_hsl = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'HSL Color'
        });
        const createInputWithLabel = (type, className, value, min, max, prefix, suffix) => {
            const wrapper = Q('<div>', { class: Form.colorPickerClasses.input_wrapper });
            const prefixElement = Q('<span>', { class: Form.colorPickerClasses.input_prefix, text: prefix });
            const input = Q('<input>', {
                type: type,
                class: Form.colorPickerClasses.color_picker_input + ' ' + className,
                value: value
            });
            if (type === 'number') {
                input.attr('min', min);
                input.attr('max', max);
            } else if (type === 'text') {
                input.attr('maxlength', max || 20);
            }
            wrapper.append(prefixElement, input);
            if (suffix) {
                const suffixElement = Q('<span>', { class: Form.colorPickerClasses.input_suffix, text: suffix });
                wrapper.append(suffixElement);
            }
            return { wrapper, input };
        };
        const snatch_add = Q('<div>', { class: Form.colorPickerClasses.input_snatches + ' ' + Form.colorPickerClasses.snatches_add, text: '+' });
        const snatch_1 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_2 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_3 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_4 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_prev_current_wrapper = Q('<div>', { class: Form.colorPickerClasses.input_snatch_wrapper });
        current_color = Q('<div>', { class: Form.colorPickerClasses.half_snatch });
        previous_color = Q('<div>', { class: Form.colorPickerClasses.half_snatch });
        snatch_prev_current_wrapper.append(current_color,previous_color);
        snatches = [snatch_1, snatch_2, snatch_3, snatch_4];
        snatches.forEach(slot => slot.on('click', () => {
            const col = slot.css('background-color');
            if (col) wrapper.val(col);
        }));
        snatch_add.on('click', () => {
            for (let i = snatches.length - 1; i > 0; i--) {
                snatches[i].css('background-color', snatches[i - 1].css('background-color'));
            }
            snatches[0].css('background-color', current_color.css('background-color'));
        });
        const input_h_obj = createInputWithLabel('number', Form.colorPickerClasses.input_h, 0, 0, 360, 'H:', '°');
        const input_s_obj = createInputWithLabel('number', Form.colorPickerClasses.input_s, 0, 0, 100, 'S:', '%');
        const input_b_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b, 0, 0, 100, 'B:', '%');
        const input_r_obj = createInputWithLabel('number', Form.colorPickerClasses.input_r, 0, 0, 255, 'R:');
        const input_g_obj = createInputWithLabel('number', Form.colorPickerClasses.input_g, 0, 0, 255, 'G:');
        const input_b2_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b2, 0, 0, 255, 'B:');
        const input_l_obj = createInputWithLabel('number', Form.colorPickerClasses.input_l, 0, 0, 100, 'L:');
        const input_a_obj = createInputWithLabel('number', Form.colorPickerClasses.input_a, 0, -128, 127, 'a:');
        const input_b3_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b3, 0, -128, 127, 'b:');
        const input_c_obj = createInputWithLabel('number', Form.colorPickerClasses.input_c, 0, 0, 100, 'C:', '%');
        const input_m_obj = createInputWithLabel('number', Form.colorPickerClasses.input_m, 0, 0, 100, 'M:', '%');
        const input_y_obj = createInputWithLabel('number', Form.colorPickerClasses.input_y, 0, 0, 100, 'Y:', '%');
        const input_k_obj = createInputWithLabel('number', Form.colorPickerClasses.input_k, 0, 0, 100, 'K:', '%');
        const input_rgb888_obj = createInputWithLabel('text', Form.colorPickerClasses.input_rgb888, '0x000000', null, 8, '888:');
        const input_rgb565_obj = createInputWithLabel('text', Form.colorPickerClasses.input_rgb565, '0x0000', null, 6, '565:');
        const input_rgb_obj = createInputWithLabel('text', Form.colorPickerClasses.input_rgb, 'rgb(0,0,0)', null, 20, 'RGB:');
        const input_hex_obj = createInputWithLabel('text', Form.colorPickerClasses.input_hex, '#000000', null, 7, 'Hex:');
        const input_hsl_obj = createInputWithLabel('text', Form.colorPickerClasses.input_hsl, 'hsl(0,0%,0%)', null, 20, 'HSL:');
        const input_lab_obj = createInputWithLabel('text', Form.colorPickerClasses.input_lab, 'lab(0,0,0)', null, 20, 'LAB:');
        const input_cmyk_obj = createInputWithLabel('text', Form.colorPickerClasses.input_cmyk, 'cmyk(0%,0%,0%,0%)', null, 20, 'CMYK:');
        input_h = input_h_obj.input;
        input_s = input_s_obj.input;
        input_b = input_b_obj.input;
        input_r = input_r_obj.input;
        input_g = input_g_obj.input;
        input_b2 = input_b2_obj.input;
        input_l = input_l_obj.input;
        input_a = input_a_obj.input;
        input_b3 = input_b3_obj.input;
        input_c = input_c_obj.input;
        input_m = input_m_obj.input;
        input_y = input_y_obj.input;
        input_k = input_k_obj.input;
        input_rgb888 = input_rgb888_obj.input;
        input_rgb565 = input_rgb565_obj.input;
        input_rgb = input_rgb_obj.input;
        input_hex = input_hex_obj.input;
        input_hsl = input_hsl_obj.input;
        input_lab = input_lab_obj.input;
        input_cmyk = input_cmyk_obj.input;
        function setupInputListeners() {
            input_h.on('input', updateFromHSB);
            input_s.on('input', updateFromHSB);
            input_b.on('input', updateFromHSB);
            input_r.on('input', updateFromRGB);
            input_g.on('input', updateFromRGB);
            input_b2.on('input', updateFromRGB);
            input_l.on('input', updateFromLAB);
            input_a.on('input', updateFromLAB);
            input_b3.on('input', updateFromLAB);
            input_c.on('input', updateFromCMYK);
            input_m.on('input', updateFromCMYK);
            input_y.on('input', updateFromCMYK);
            input_k.on('input', updateFromCMYK);
            input_hex.on('input', updateFromHex);
            input_rgb.on('input', updateFromRGBString);
            input_hsl.on('input', updateFromHSLString);
        }
        function updateFromHSB() {
            const h = parseInt(input_h.val()) / 360;
            const s = parseInt(input_s.val()) / 100;
            const b = parseInt(input_b.val()) / 100;
            const [r, g, b2] = Q.HSL2RGB(h, s, (2 * b - b * s) / 2); // Convert HSB to RGB
            updatePickerFromRGB(Math.round(r), Math.round(g), Math.round(b2));
        }
        function updateFromRGB() {
            const r = parseInt(input_r.val());
            const g = parseInt(input_g.val());
            const b = parseInt(input_b2.val());
            updatePickerFromRGB(r, g, b);
        }
        function updateFromLAB() {
            const l = parseFloat(input_l.val());
            const a = parseFloat(input_a.val());
            const b = parseFloat(input_b3.val());
            const [r, g, b2] = labToRGB(l, a, b);
            updatePickerFromRGB(r, g, b2);
        }
        function updateFromCMYK() {
            const c = parseInt(input_c.val()) / 100;
            const m = parseInt(input_m.val()) / 100;
            const y = parseInt(input_y.val()) / 100;
            const k = parseInt(input_k.val()) / 100;
            const r = Math.round(255 * (1 - c) * (1 - k));
            const g = Math.round(255 * (1 - m) * (1 - k));
            const b = Math.round(255 * (1 - y) * (1 - k));
            updatePickerFromRGB(r, g, b);
        }
        function updateFromHex() {
            const hex = input_hex.val();
            if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                updatePickerFromRGB(r, g, b);
            }
        }
        function updateFromRGBString() {
            const rgbStr = input_rgb.val();
            const match = rgbStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                updatePickerFromRGB(r, g, b);
            }
        }
        function updateFromHSLString() {
            const hslStr = input_hsl.val();
            const match = hslStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
            if (match) {
                const h = parseInt(match[1]) / 360;
                const s = parseInt(match[2]) / 100;
                const l = parseInt(match[3]) / 100;
                const [r, g, b] = Q.HSL2RGB(h, s, l);
                updatePickerFromRGB(Math.round(r), Math.round(g), Math.round(b));
            }
        }
        function updatePickerFromRGB(r, g, b) {
            const [h, s, l] = Q.RGB2HSL(r, g, b);
            selectedHue = h; // Store just the hue
            positionHueMarker(h);
            positionTriangleMarker(s, l);
            drawPicker();
            return `rgb(${r},${g},${b})`;
        }
        function positionHueMarker(hue) {
            const angle = hue * 2 * Math.PI;
            const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
            markers.outer = {
                x: centerX + innerRingMiddleRadius * Math.cos(angle),
                y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
            };
            if (outerSegments > 0) {
                const segmentIndex = Math.floor(hue * outerSegments) % outerSegments;
                selectedOuterSegment = (angle >= 0) ? segmentIndex : null;
            }
        }
        function positionTriangleMarker(s, l) {
            const totalHeight = bottomLeftVertex.y - topVertex.y;
            const relativeY = 1 - s;
            const y = topVertex.y + relativeY * totalHeight;
            const triangleWidthAtY = (bottomRightVertex.x - bottomLeftVertex.x) * relativeY;
            let relativeX;
            if (relativeY === 0) {
                relativeX = 0.5;
            } else {
                if (l <= 0.5) {
                    relativeX = 1 - (l / 0.5);
                } else {
                    relativeX = (1 - l) / 0.5;
                }
            }
            const leftX = centerX - triangleWidthAtY / 2;
            const x = leftX + relativeX * triangleWidthAtY;
            markers.triangle = { x, y };
        }
        function updateInputsFromColor(color) {
            if (!color) return;
            let r, g, b;
            if (color.startsWith('rgb')) {
                const match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                if (match) {
                    r = parseInt(match[1]);
                    g = parseInt(match[2]);
                    b = parseInt(match[3]);
                }
            } else if (color.startsWith('#')) {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            }
            if (r === undefined || g === undefined || b === undefined) return;
            input_r.val(r);
            input_g.val(g);
            input_b2.val(b);
            const hex = '#' +
                r.toString(16).padStart(2, '0') +
                g.toString(16).padStart(2, '0') +
                b.toString(16).padStart(2, '0');
            input_hex.val(hex);
            input_rgb.val(`rgb(${r},${g},${b})`);
            const [h, s, l] = Q.RGB2HSL(r, g, b);
            input_h.val(Math.round(h * 360));
            input_s.val(Math.round(s * 100));
            input_b.val(Math.round((l * 2 / (2 - s)) * 100)); // Convert L to B (brightness)
            input_hsl.val(`hsl(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`);
            const [l_val, a_val, b_val] = rgbToLab(r, g, b);
            input_l.val(Math.round(l_val));
            input_a.val(Math.round(a_val));
            input_b3.val(Math.round(b_val));
            input_lab.val(`lab(${Math.round(l_val)},${Math.round(a_val)},${Math.round(b_val)})`);
            const [c, m, y, k] = rgbToCmyk(r, g, b);
            input_c.val(Math.round(c * 100));
            input_m.val(Math.round(m * 100));
            input_y.val(Math.round(y * 100));
            input_k.val(Math.round(k * 100));
            input_cmyk.val(`cmyk(${Math.round(c * 100)}%,${Math.round(m * 100)}%,${Math.round(y * 100)}%,${Math.round(k * 100)}%)`);
            input_rgb888.val('0x' +
                r.toString(16).padStart(2, '0') +
                g.toString(16).padStart(2, '0') +
                b.toString(16).padStart(2, '0'));
            const r5 = Math.round(r * 31 / 255) & 0x1F;
            const g6 = Math.round(g * 63 / 255) & 0x3F;
            const b5 = Math.round(b * 31 / 255) & 0x1F;
            const rgb565 = (r5 << 11) | (g6 << 5) | b5;
            input_rgb565.val('0x' + rgb565.toString(16).padStart(4, '0'));
        }
        function rgbToCmyk(r, g, b) {
            return Q.RGB2CMYK(r, g, b);
        }
        function rgbToLab(r, g, b) {
            return Q.RGB2LAB(r, g, b);
        }
        function labToRGB(l, a, b) {
            return Q.LAB2RGB(l, a, b);
        }
        setupInputListeners();
        block_hsb.append(header_hsb, input_h_obj.wrapper, input_s_obj.wrapper, input_b_obj.wrapper);
        block_rgb.append(header_rgb, input_r_obj.wrapper, input_g_obj.wrapper, input_b2_obj.wrapper);
        block_lab.append(header_lab, input_l_obj.wrapper, input_a_obj.wrapper, input_b3_obj.wrapper);
        block_cmyk.append(header_cmyk, input_c_obj.wrapper, input_m_obj.wrapper, input_y_obj.wrapper, input_k_obj.wrapper);
        block_rgb888.append(header_rgb888, input_rgb888_obj.wrapper);
        block_rgb565.append(header_rgb565, input_rgb565_obj.wrapper);
        block_hsl.append(header_hsl, input_hsl_obj.wrapper);
        snatches_wrapper.append(snatch_prev_current_wrapper, snatch_1, snatch_2, snatch_3, snatch_4, snatch_add);
        section_first.append(snatches_wrapper);
        section_second.append(block_hsb, block_rgb, block_lab, block_cmyk);
        section_third.append(block_rgb888, block_rgb565, block_hsl);
        left_wrapper.append(canvas);
        right_wrapper.append(section_snatches, section_first, section_second, section_third, section_fourth);
        wrapper.append(left_wrapper, right_wrapper);
    }
    else {
        canvas.css({
            'width': width + 'px',
            'height': height + 'px',
        });
        wrapper.append(canvas);
    }
    const ctx = canvas.nodes[0].getContext('2d');
    const centerX = width / 2;
    const ringCenterY = height / 2;
    const minDimension = Math.min(width, height);
    const globalRadius = options.globalRadius || (minDimension * 0.46);
    const outerRingThickness = options.outerRingThickness || (globalRadius * 0.05);
    const innerRingThickness = options.innerRingThickness || (globalRadius * 0.15);
    const ringPadding = options.ringPadding || (globalRadius * 0.02);
    const outerRadius = globalRadius;
    const innerRadius = outerRadius - outerRingThickness - ringPadding;
    const innerMostRadius = innerRadius - innerRingThickness - ringPadding;
    const triangleVertexRadius = innerMostRadius - (globalRadius * 0.07);
    const topVertex = {
        x: centerX,
        y: ringCenterY - triangleVertexRadius
    };
    const bottomLeftVertex = {
        x: centerX - triangleVertexRadius * Math.sin(Math.PI / 3),
        y: ringCenterY + triangleVertexRadius * Math.cos(Math.PI / 3)
    };
    const bottomRightVertex = {
        x: centerX + triangleVertexRadius * Math.sin(Math.PI / 3),
        y: ringCenterY + triangleVertexRadius * Math.cos(Math.PI / 3)
    };
    let selectedHue = 0; // Store hue as a number (0-1) instead of a color string
    let selectedOuterSegment = null;
    let activeArea = 'inner';
    let markers = {
        outer: { x: centerX, y: ringCenterY },
        triangle: { x: centerX, y: ringCenterY }
    };
    const outerSegments = options.outerSegments || 18;
    const outerColors = Array.from({ length: outerSegments }, (_, i) => {
        const hue = i * (1 / outerSegments);
        const [r, g, b] = Q.HSL2RGB(hue, 1, 0.5);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    });
    const defaultHue = 0;
    const defaultSaturation = 1;
    const defaultLightness = 0.5;
    const middleRingAngle = (defaultHue / 360) * 2 * Math.PI;
    const middleRingRadius = innerRadius - innerRingThickness / 2;
    markers.outer = {
        x: centerX + middleRingRadius * Math.cos(middleRingAngle),
        y: ringCenterY + middleRingRadius * Math.sin(middleRingAngle)
    };
    markers.triangle = {
        x: topVertex.x,
        y: topVertex.y
    };
    function drawPicker() {
        current_color.css({
            'background-color': `rgb(${input_r.val()},${input_g.val()},${input_b2.val()})`
        });
        ctx.clearRect(0, 0, width, height);
        drawOuterRing();
        drawMiddleRing();
        drawTriangle();
        drawMarkers();
    }
    function drawOuterRing() {
        const segAngle = (2 * Math.PI) / outerSegments;
        for (let i = 0; i < outerSegments; i++) {
            const startAngle = i * segAngle;
            const endAngle = startAngle + segAngle;
            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = outerColors[i];
            ctx.fill();
        }
    }
    function drawMiddleRing() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerRadius, 0, 2 * Math.PI);
        ctx.closePath();
        if (ctx.createConicGradient) {
            const grad = ctx.createConicGradient(0, centerX, ringCenterY);
            grad.addColorStop(0, "hsl(0, 100%, 50%)");
            grad.addColorStop(0.17, "hsl(60, 100%, 50%)");
            grad.addColorStop(0.33, "hsl(120, 100%, 50%)");
            grad.addColorStop(0.5, "hsl(180, 100%, 50%)");
            grad.addColorStop(0.67, "hsl(240, 100%, 50%)");
            grad.addColorStop(0.83, "hsl(300, 100%, 50%)");
            grad.addColorStop(1, "hsl(360, 100%, 50%)");
            ctx.fillStyle = grad;
        } else {
            const grad = ctx.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, "#FF0000");
            grad.addColorStop(0.17, "#FFFF00");
            grad.addColorStop(0.33, "#00FF00");
            grad.addColorStop(0.5, "#00FFFF");
            grad.addColorStop(0.67, "#0000FF");
            grad.addColorStop(0.83, "#FF00FF");
            grad.addColorStop(1, "#FF0000");
            ctx.fillStyle = grad;
        }
        ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerRadius - innerRingThickness, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    function drawTriangle() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerMostRadius * 0.8, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(topVertex.x, topVertex.y);
        ctx.lineTo(bottomLeftVertex.x, bottomLeftVertex.y);
        ctx.lineTo(bottomRightVertex.x, bottomRightVertex.y);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.moveTo(topVertex.x, topVertex.y);
        ctx.lineTo(bottomLeftVertex.x, bottomLeftVertex.y);
        ctx.lineTo(bottomRightVertex.x, bottomRightVertex.y);
        ctx.closePath();
        ctx.clip();
        const gradHoriz = ctx.createLinearGradient(bottomLeftVertex.x, bottomLeftVertex.y, bottomRightVertex.x, bottomRightVertex.y);
        gradHoriz.addColorStop(0, "rgba(255,255,255,1)");
        gradHoriz.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradHoriz;
        ctx.globalCompositeOperation = 'normal';
        ctx.fillRect(bottomLeftVertex.x, topVertex.y, bottomRightVertex.x - bottomLeftVertex.x, bottomLeftVertex.y - topVertex.y);
        const [r, g, b] = Q.HSL2RGB(selectedHue, 1, 0.5);
        const pureHueColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        const gradVert = ctx.createLinearGradient(topVertex.x, topVertex.y, topVertex.x, bottomLeftVertex.y);
        gradVert.addColorStop(0, pureHueColor); // Use pure hue color instead of selectedHue
        gradVert.addColorStop(1, "#000");
        ctx.fillStyle = gradVert;
        ctx.globalCompositeOperation = 'color';
        ctx.fill();
        ctx.restore();
    }
    function drawMarkers() {
        ctx.save();
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 4;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        if (activeArea === 'inner') {
            const markerSize = innerRingThickness / 3; // Half the thickness for better visibility
            ctx.beginPath();
            ctx.arc(markers.outer.x, markers.outer.y, markerSize, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (activeArea === 'outer' && selectedOuterSegment !== null) {
            const segAngle = (2 * Math.PI) / outerSegments;
            const startAngle = selectedOuterSegment * segAngle;
            const endAngle = startAngle + segAngle;
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(markers.triangle.x, markers.triangle.y, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.restore();
    }
    function computeColor() {
        let hue = 0;
        if (typeof selectedHue === 'string') {
            if (selectedHue.startsWith('rgb')) {
                const rgbMatch = selectedHue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
                    const [h] = Q.RGB2HSL(r, g, b);
                    hue = h;
                }
            } else if (selectedHue.startsWith('#')) {
                hue = 0;
            }
        }
        const triangleMarker = markers.triangle;
        const totalHeight = bottomLeftVertex.y - topVertex.y;
        const totalWidth = bottomRightVertex.x - bottomLeftVertex.x;
        const relativeY = (triangleMarker.y - topVertex.y) / totalHeight;
        const triangleWidthAtY = totalWidth * relativeY;
        const leftBoundAtY = centerX - (triangleWidthAtY / 2);
        const relativeX = triangleWidthAtY === 0 ? 0.5 :
            (triangleMarker.x - leftBoundAtY) / triangleWidthAtY;
        let saturation = 1 - (1 - relativeX) * relativeY;
        let lightness = 1 - relativeY * relativeX;
        saturation = Math.max(0, Math.min(1, saturation));
        lightness = Math.max(0, Math.min(1, lightness));
        return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
    }
    let dragging = null;
    function handleEvent(e) {
        const rect = canvas.nodes[0].getBoundingClientRect();
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;
        if (dragging === 'triangle') {
            const constrained = constrainToTriangle(canvasX, canvasY, topVertex, bottomLeftVertex, bottomRightVertex);
            markers.triangle = constrained;
            const triangleColor = computeTriangleColor(constrained.x, constrained.y);
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }
            drawPicker();
            return; // Exit early as we've handled the drag event
        }
        if (dragging === 'inner_ring') {
            const constrained = constrainToHueRing(canvasX, canvasY);
            markers.outer = constrained;
            const angle = Math.atan2(constrained.y - ringCenterY, constrained.x - centerX);
            const hue = (angle >= 0 ? angle : angle + 2 * Math.PI) / (2 * Math.PI);
            selectedHue = hue;
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
            drawPicker();
            return; // Exit early as we've handled the drag event
        }
        const distFromCenter = Math.sqrt(Math.pow(canvasX - centerX, 2) + Math.pow(canvasY - ringCenterY, 2));
        if (distFromCenter <= outerRadius && distFromCenter >= outerRadius - outerRingThickness) {
            const angle = Math.atan2(canvasY - ringCenterY, canvasX - centerX);
            const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
            const segmentIndex = Math.floor(normalizedAngle / ((2 * Math.PI) / outerSegments));
            selectedOuterSegment = segmentIndex;
            selectedHue = segmentIndex / outerSegments;
            activeArea = 'outer';
            if (e.type === 'mousedown') {
                dragging = false;
            }
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
        }
        else if (distFromCenter <= innerRadius && distFromCenter >= innerRadius - innerRingThickness) {
            const angle = Math.atan2(canvasY - ringCenterY, canvasX - centerX);
            const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
            markers.outer = {
                x: centerX + innerRingMiddleRadius * Math.cos(angle),
                y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
            };
            const hue = (angle >= 0 ? angle : angle + 2 * Math.PI) / (2 * Math.PI);
            selectedHue = hue;
            selectedOuterSegment = null;
            activeArea = 'inner';
            if (e.type === 'mousedown') {
                dragging = 'inner_ring';
            }
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
        }
        else if (isPointInTriangle(canvasX, canvasY, topVertex, bottomLeftVertex, bottomRightVertex)) {
            markers.triangle = { x: canvasX, y: canvasY };
            const triangleColor = computeTriangleColor(canvasX, canvasY);
            if (e.type === 'mousedown') {
                dragging = 'triangle';
            }
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }
        }
        drawPicker();
    }
    function constrainToHueRing(x, y) {
        const angle = Math.atan2(y - ringCenterY, x - centerX);
        const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
        return {
            x: centerX + innerRingMiddleRadius * Math.cos(angle),
            y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
        };
    }
    function computeTriangleColor(x, y) {
        const totalHeight = bottomLeftVertex.y - topVertex.y;
        const relativeY = Math.max(0, Math.min(1, (y - topVertex.y) / totalHeight));
        const triangleWidthAtY = (bottomRightVertex.x - bottomLeftVertex.x) * relativeY;
        const leftX = centerX - triangleWidthAtY / 2;
        const rightX = centerX + triangleWidthAtY / 2;
        const relativeX = Math.max(0, Math.min(1, (x - leftX) / (rightX - leftX)));
        const saturation = 1 - relativeY;
        let lightness = 0.5;
        if (relativeY > 0) {
            lightness = 0.5 * (1 - relativeY) + relativeY * (1 - relativeX);
        }
        const clampedSaturation = Math.max(0, Math.min(1, saturation));
        const clampedLightness = Math.max(0, Math.min(1, lightness));
        const [r, g, b] = Q.HSL2RGB(selectedHue, clampedSaturation, clampedLightness);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    function isPointInTriangle(px, py, v1, v2, v3) {
        const d1 = sign(px, py, v1.x, v1.y, v2.x, v2.y);
        const d2 = sign(px, py, v2.x, v2.y, v3.x, v3.y);
        const d3 = sign(px, py, v3.x, v3.y, v1.x, v1.y);
        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(has_neg && has_pos);
    }
    function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
        return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
    }
    let onMouseMoveHandler, onMouseUpHandler;
    function attachGlobalListeners() {
        onMouseMoveHandler = handleMouseMove.bind(this);
        onMouseUpHandler = handleMouseUp.bind(this);
        Q(document).on('mousemove', onMouseMoveHandler);
        Q(document).on('mouseup', onMouseUpHandler);
    }
    function removeGlobalListeners() {
        Q(document).off('mousemove', onMouseMoveHandler);
        Q(document).off('mouseup', onMouseUpHandler);
    }
    function handleMouseDown(e) {
        handleEvent(e);
        if (dragging) {
            previous_color.css({
                'background-color': `rgb(${input_r.val()},${input_g.val()},${input_b2.val()})`
            });
            attachGlobalListeners();
        }
    }
    function handleMouseMove(e) {
        if (dragging === 'inner_ring' || dragging === 'hue_stripe' || dragging === 'triangle') {
            handleEvent(e);
        }
    }
    function handleMouseUp(e) {
        dragging = false;
        removeGlobalListeners();
    }
    canvas.on('mousedown', handleMouseDown);
    function constrainToTriangle(x, y, v1, v2, v3) {
        if (isPointInTriangle(x, y, v1, v2, v3)) {
            return { x, y };
        }
        const denominator = ((v2.y - v3.y) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.y - v3.y));
        let a = ((v2.y - v3.y) * (x - v3.x) + (v3.x - v2.x) * (y - v3.y)) / denominator;
        let b = ((v3.y - v1.y) * (x - v3.x) + (v1.x - v3.x) * (y - v3.y)) / denominator;
        let c = 1 - a - b;
        if (a < 0) a = 0;
        if (b < 0) b = 0;
        if (c < 0) c = 0;
        const sum = a + b + c;
        if (sum > 0) {
            a /= sum;
            b /= sum;
            c /= sum;
        } else {
            a = b = c = 1 / 3;
        }
        return {
            x: a * v1.x + b * v2.x + c * v3.x,
            y: a * v1.y + b * v2.y + c * v3.y
        };
    }
    wrapper.change = function (callback) {
        const originalCallback = callback;
        wrapper.changeCallback = function (color) {
            Q.Debounce('colorpicker_change', 10, function () {
                if (showDetails && input_h) {
                    updateInputsFromColor(color);
                }
                originalCallback(color);
            });
        };
        return this;
    };
    wrapper.val = function (color) {
        if (!color) {
            return computeColor();
        }
        if (color.startsWith('#') || color.startsWith('rgb')) {
            let r, g, b;
            if (color.startsWith('rgb')) {
                const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    r = parseInt(rgbMatch[1]);
                    g = parseInt(rgbMatch[2]);
                    b = parseInt(rgbMatch[3]);
                }
            } else if (color.startsWith('#')) {
                const hex = color.slice(1);
                if (hex.length === 3) {
                    r = parseInt(hex[0] + hex[0], 16);
                    g = parseInt(hex[1] + hex[1], 16);
                    b = parseInt(hex[2] + hex[2], 16);
                } else if (hex.length === 6) {
                    r = parseInt(hex.slice(0, 2), 16);
                    g = parseInt(hex.slice(2, 4), 16);
                    b = parseInt(hex.slice(4, 6), 16);
                }
            }
            const [h, s, l] = Q.RGB2HSL(r, g, b);
            selectedHue = h;
            positionHueMarker(h);
            positionTriangleMarker(s, l);
            drawPicker();
            current_color.css('background-color', color);
            previous_color.css('background-color', color);
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(color);
            }
        }
        return this;
    };
    wrapper.destroy = function () {
        canvas.off('mousedown', handleMouseDown);
        removeGlobalListeners();
        dragging = false;
        return this;
    };
    wrapper.Snatch = function (index) {
        return snatches[index]
            ? snatches[index].css('background-color')
            : null;
    };
    drawPicker();
    console.log('ColorPicker drawn on canvas');
    if (showDetails) {
        updateInputsFromColor(initialColor);
        current_color.css('background-color', initialColor);
        previous_color.css('background-color', initialColor);
    }
    this.elements.push(wrapper);
    return wrapper;
};
Form.prototype.Dropdown = function(options = {}) {
    if (!Form.dropdownStyles) {
        Form.dropdownStyles = Q.style('', `
            .form_dropdown {
                position: relative;
                width: 100%;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                cursor: pointer;
                user-select: none;
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
            }
            .selected_text {
            padding-right: 10px;
        }
            .form_dropdown.disabled {
                opacity: 0.6;
                cursor: not-allowed;
                pointer-events: none;
            }
            .form_dropdown_selected {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--form-default-padding);
                line-height: normal;
                cursor: pointer;
                user-select: none;
                width: 100%;
                box-sizing: border-box;
            }
            .form_dropdown_items {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 3px;
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                background-color: var(--form-default-background);
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                box-shadow: var(--form-default-shadow);
                display: none;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
            }
            .form_dropdown_item {
                padding: var(--form-default-padding);
                cursor: pointer;
            }
            .form_dropdown_item:hover {
                background-color: var(--form-default-accent-color);
                color: var(--form-default-accent-text-color);
            }
            .form_dropdown_item.selected {
                background-color: var(--form-default-selected-background-color);
                color: var(--form-default-selected-text-color);
                font-weight: 500;
            }
            .form_dropdown_items {
                display: none;
            }
            .form_dropdown_arrow {
                transition: transform 0.2s ease-in-out;
                transform: scale(2.0);
            }
            .form_dropdown.open .form_dropdown_arrow {
                transform: rotate(180deg) scale(2.0);
            }
            .form_dropdown.open .form_dropdown_items {
                display: block;
                position: absolute;
                width: 100%;
                z-index: 1000;
                overflow-y: auto;
                top: 100%;
            }
            .form_dropdown.up .form_dropdown_items {
                top: auto;
                bottom: 100%;
                margin-top: 0;
                margin-bottom: 3px;
            }
        `, null, {
            'selected_text': 'selected_text',
            'form_dropdown': 'form_dropdown',
            'open': 'open',
            'disabled': 'disabled',
            'selected': 'selected',
            'form_dropdown_selected': 'form_dropdown_selected', 
            'form_dropdown_items': 'form_dropdown_items',
            'form_dropdown_item': 'form_dropdown_item',
            'form_dropdown_arrow': 'form_dropdown_arrow',
            'up': 'up'
        },true);
    }
    const container = Q('<div>').addClass(Form.dropdownStyles['form_dropdown']);
    const header = Q('<div>').addClass(Form.dropdownStyles['form_dropdown_selected']);
    const label = Q('<div>').text('Select an option').addClass(Form.dropdownStyles['selected_text']);
    const arrow = Q('<div>').addClass(Form.dropdownStyles['form_dropdown_arrow']).html('&#9662;');
    header.append(label, arrow);
    const listContainer = Q('<div>')
        .addClass(Form.dropdownStyles['form_dropdown_items'])
        .addClass(Form.classes['scrollbar']);
    container.append(header, listContainer);
    if (!Form.dropdownCloseListenerInitialized) {
        Q(document).on('click', () => {
            Q('.' + Form.dropdownStyles['form_dropdown'])
              .removeClass(Form.dropdownStyles['open']);
        });
        Form.dropdownCloseListenerInitialized = true;
    }
    if (options['max-height']) {
        listContainer.css('maxHeight', options['max-height'] + 'px');
    }
    let selectedValue = null;
    let selectedText = '';
    let selectedIndex = -1;
    let isDisabled = options.disabled || false;
    let changeCallback = options.change || null;
    if (isDisabled) { container.addClass(Form.dropdownStyles['disabled']); }
    header.on('click', function(e) {
        e.stopPropagation();
        if (isDisabled) return;
        const openCl = Form.dropdownStyles['open'];
        const upCl = Form.dropdownStyles['up'];
        if (container.hasClass(openCl)) {
            container.removeClass(upCl);
        } else {
            const rect = container.nodes[0].getBoundingClientRect();
            const itemsH = listContainer.nodes[0].scrollHeight;
            if (rect.bottom + itemsH > window.innerHeight) {
                container.addClass(upCl);
            } else {
                container.removeClass(upCl);
            }
        }
        container.toggleClass(openCl);
    });
    function selectItem(index) {
        const items = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
        if (!items) return;
        items.removeClass(Form.dropdownStyles['selected']);
        const item = items.eq(index);
        if (item.hasClass(Form.dropdownStyles['disabled'])) return;
        item.addClass(Form.dropdownStyles['selected']);
        selectedValue = item.attr('data-value');
        selectedText  = item.text();
        selectedIndex = index;
        label.text(selectedText);
        container.removeClass(Form.dropdownStyles['open']);
        if (typeof changeCallback === 'function') {
            changeCallback(selectedValue, selectedText, selectedIndex);
        }
    }
    if (options.values && Array.isArray(options.values)) {
        setValues(options.values);
    }
    function setValues(values) {
        listContainer.html('');
        let defaultIndex = -1;
        if (!Array.isArray(values) || values.length === 0) { return; }
        values.forEach((item, index) => {
            if (!item || typeof item !== 'object' || item.value === undefined || item.text === undefined) { return; }
            const dropdownItem = Q('<div>')
                .addClass(Form.dropdownStyles['form_dropdown_item'])
                .attr('data-value', item.value)
                .text(item.text);
            if (item.disabled) { dropdownItem.addClass(Form.dropdownStyles['disabled']); }
            if (item.default) { defaultIndex = index; }
            dropdownItem.on('click', function(e) {
                e.stopPropagation();
                if (!dropdownItem.hasClass(Form.dropdownStyles['disabled'])) {
                    selectItem(index);
                }
            });
            listContainer.append(dropdownItem);
        });
        if (defaultIndex < 0) defaultIndex = 0;
        selectItem(defaultIndex);
    }
    const dropdownAPI = {
        val: function(values) {
            if (values === undefined) {
                return { value: selectedValue, text: selectedText, index: selectedIndex };
            }
            setValues(values);
            return this;
        },
        change: function(callback) {
            changeCallback = callback;
            return this;
        },
        disabled: function(state) {
            isDisabled = !!state;
            if (isDisabled) { container.addClass(Form.dropdownStyles['disabled']); }
            else { container.removeClass(Form.dropdownStyles['disabled']); }
            return this;
        },
        select: function(index) {
            selectItem(index);
            return this;
        },
        index: function(index) {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            if (index >= 0 && index < items.length) {
                const item = Q(items[index]);
                return { value: item.attr('data-value'), text: item.text() };
            }
            return null;
        },
        disable: function(indexes) {
            if (!Array.isArray(indexes)) return this;
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            indexes.forEach(idx => {
                if (idx >= 0 && idx < items.length) {
                    Q(items[idx]).addClass(Form.dropdownStyles['disabled']);
                }
            });
            return this;
        },
        enable: function(indexes) {
            if (!Array.isArray(indexes)) return this;
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            indexes.forEach(idx => {
                if (idx >= 0 && idx < items.length) {
                    Q(items[idx]).removeClass(Form.dropdownStyles['disabled']);
                }
            });
            return this;
        },
        text: function(index, newText) {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            if (index >= 0 && index < items.length) {
                const item = Q(items[index]);
                item.text(newText);
                if (index === selectedIndex) {
                    selectedText = newText;
                    label.text(newText);
                }
            }
            return this;
        },
        add: function(value, text) {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            const newIndex = items.length;
            const dropdownItem = Q('<div>')
                .addClass(Form.dropdownStyles['form_dropdown_item'])
                .attr('data-value', value)
                .text(text);
            dropdownItem.on('click', function(e) {
                e.stopPropagation();
                if (!dropdownItem.hasClass(Form.dropdownStyles['disabled'])) {
                    selectItem(newIndex);
                }
            });
            listContainer.append(dropdownItem);
            return newIndex;
        },
        remove: function(index) {
            if (index !== undefined) {
                const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
                const items = found ? found.nodes : [];
                if (index >= 0 && index < items.length) {
                    Q(items[index]).remove();
                    if (index === selectedIndex) {
                        selectedValue = null;
                        selectedText = '';
                        selectedIndex = -1;
                        label.text('Select an option');
                    }
                }
                return this;
            } else {
                container.remove();
                return null;
            }
        },
        getCount: function() {
            const found = listContainer.find('.' + Form.dropdownStyles['form_dropdown_item']);
            const items = found ? found.nodes : [];
            return items.length;
        }
    };
    for (const key in dropdownAPI) {
        if (dropdownAPI.hasOwnProperty(key)) {
            container[key] = dropdownAPI[key];
        }
    }
    this.elements.push(container);
    return container;
};
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
Form.prototype.Radio = function(options = []) {
    if (!Form.radioClassesInitialized) {
        Form.radioClasses = Q.style(null, `
            .form_radio { display: flex; flex-direction: column; gap: 5px; }
            .form_radio_item { display: flex; align-items: center; cursor: pointer;
            color: var(--form-default-text-color);
            font: var(--form-default-text); font-size: var(--form-default-font-size);
            }
            .form_radio_item::before {
                content: "";
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 8px;
                background-color: var(--form-default-background);
                border-radius: 50%;
            }
            .form_radio_item:hover::before {
                outline: 2px solid var(--form-default-accent-color);
            }
            .form_radio_item.selected::before {
                background-color: var(--form-default-accent-color);
            }
            .form_radio_item.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        `, null, {
            'form_radio': 'form_radio',
            'form_radio_item': 'form_radio_item',
            'selected': 'selected',
            'disabled': 'disabled'
        },false);
        Form.radioClassesInitialized = true;
    }
    const container = Q(`<div class="${Form.radioClasses.form_radio}"></div>`);
    let _options = options.map(o => ({
        value: o.value,
        text: o.text,
        enabled: o.enabled !== false,
        selected: !!o.selected,
        disabled: !!o.disabled
    }));
    let _changeCallback;
    function render() {
        container.empty();
        _options.forEach((opt, idx) => {
            const item = Q(`<div class="${Form.radioClasses.form_radio_item}">${opt.text}</div>`);
            if (opt.selected) item.addClass(Form.radioClasses.selected);
            if (opt.disabled) item.addClass(Form.radioClasses.disabled);
            item.on('click', () => {
                if (opt.disabled) return;
                select(idx);
            });
            opt._el = item;
            container.append(item);
        });
    }
    function select(idx) {
        _options.forEach((o, i) => {
            const sel = i === idx;
            o.selected = sel;
            if (sel) {
                o._el.addClass(Form.radioClasses.selected);
            } else {
                o._el.removeClass(Form.radioClasses.selected);
            }
        });
        if (_changeCallback) {
            const o = _options[idx];
            _changeCallback(idx, o.value, o.text);
        }
    }
    container.val = function(vals) {
        if (vals === undefined) {
            return _options.map(({_el,...o}) => o);
        }
        _options = vals.map(o => ({
            value: o.value,
            text: o.text,
            enabled: o.enabled !== false,
            selected: !!o.selected,
            disabled: !!o.disabled
        }));
        render();
        return container;
    };
    container.selected = function() {
        const idx = _options.findIndex(o => o.selected);
        const o = _options[idx] || {};
        return { index: idx, value: o.value, text: o.text };
    };
    container.disable = function(idx) {
        const o = _options[idx];
        if (o) { o.disabled = true; o._el.addClass(Form.radioClasses.disabled); }
        return container;
    };
    container.select = function(idx) {
        select(idx);
        return container;
    };
    container.change = function(cb) { _changeCallback = cb; return container; };
    render();
    this.elements.push(container);
    return container;
};
Form.prototype.Slider = function(initial = 0, options = {}) {
    if (!Form.sliderClassesInitialized) {
        Form.sliderClasses = Q.style(null, `
            .slider { position: relative; width: 100%; height: 8px; background: var(--form-default-background); border-radius: 4px; cursor: pointer; }
            .slider_track { position: absolute; height:100%; background: var(--form-default-accent-color); border-radius: 4px; }
            .slider_thumb { position: absolute; top:50%; transform:translate(-50%,-50%); width:5px; height:100%; background: var('--form-default-accent-color'); border-radius: 4px; cursor: pointer; }
        `, null, {
            'slider': 'slider',
            'slider_track': 'slider_track',
            'slider_thumb': 'slider_thumb'
        });
        Form.sliderClassesInitialized = true;
    }
    const min = options.min ?? 0, max = options.max ?? 100;
    let val = Math.min(max, Math.max(min, initial)), callbacks = [];
    const slider = Q(`<div class="${Form.sliderClasses.slider}">
        <div class="${Form.sliderClasses.slider_track}"></div>
        <div class="${Form.sliderClasses.slider_thumb}"></div>
    </div>`);
    const containerEl = slider.nodes[0],
          trackEl     = containerEl.children[0],
          thumbEl     = containerEl.children[1];
    function updateThumb() {
        const pct = (val-min)/(max-min)*100;
        trackEl.style.width = pct+'%';
        thumbEl.style.left = pct+'%';
    }
    updateThumb();
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
Form.prototype.Tags = function(value = '', placeholder = '', options = {}) {
    const defaultOptions = {
        separator: ',',
        maxTags: null,
        minChars: 1
    };
    options = Object.assign({}, defaultOptions, options);
    if (!Form.tagsClassesInitialized) {
        Form.tagsClasses = Q.style('', `
            .form_tags_container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                width: 100%;
                min-height: 36px;
                padding: 3px;
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                cursor: text;
            }
            .form_tags_container:focus-within {
                border-color: var(--form-default-outline-focus);
                outline: none;
            }
            .form_tag {
            position:relative;
            overflow: hidden;
                display: inline-flex;
                align-items: center;
                padding: 0 30px 0 5px;
                background: var(--form-default-background);
                color: var(--form-default-text-color);
                border-radius: var(--form-default-border-radius);
                font-size: var(--form-default-font-size);
                font-family: var(--form-default-font-family);
                user-select: none;
            }
            .form_tag_editable {
                background-color: var(--form-default-background-hover);
            }
            .form_tag_remove {
                display: flex;
                position: absolute;
                right: 0;
                cursor: pointer;
                width: 20px;
                height: 100%;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }
            .form_tag_input {
                flex-grow: 1;
                min-width: 60px;
                border: none;
                outline: none;
                padding: 5px;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                background: transparent;
                color: var(--form-default-text-color);
            }
            .form_tag.dragging {
                opacity: 0.2;
            }
            .form_tag[draggable=true] {
                cursor: move;
            }
        `, null, {
            'form_tags_container': 'form_tags_container',
            'form_tag': 'form_tag',
            'form_tag_editable': 'form_tag_editable',
            'form_tag_remove': 'form_tag_remove',
            'form_tag_input': 'form_tag_input'
        });
        Form.tagsClassesInitialized = true;
    }
    const container = Q(`<div class="${Form.tagsClasses.form_tags_container}"></div>`);
    const input = Q(`<input class="${Form.tagsClasses.form_tag_input}" placeholder="${placeholder}" type="text">`);
    const state = {
        tags: [],
        draggedTag: null,
        currentEditTag: null
    };
    container.append(input);
    if (value && typeof value === 'string' && value.trim() !== '') {
        const initialTags = value.split(options.separator)
                               .map(tag => tag.trim())
                               .filter(Boolean);
        initialTags.forEach(tag => addTag(tag));
    }
    function addTag(text) {
        if (!text || text.length < options.minChars) return;
        if (options.maxTags !== null && state.tags.length >= options.maxTags) return;
        if (state.tags.includes(text)) return;
        const tag = Q(`<div class="${Form.tagsClasses.form_tag}" draggable="true"></div>`);
        const tagText = Q(`<span>${text}</span>`);
        const removeBtn = Q(`<span class="${Form.tagsClasses.form_tag_remove}">×</span>`);
        tag.append(tagText, removeBtn);
        state.tags.push(text);
        input.before(tag);
        setupDragAndDrop(tag);
        tag.on('click', function(e) {
            if (e.target.classList.contains(Form.tagsClasses.form_tag_remove.split(' ')[0])) return;
            tag.html('');
            tag.addClass(Form.tagsClasses.form_tag_editable);
            const editInput = Q(`<input type="text" value="${text}" style="border:none; background:transparent; color:inherit; outline:none; width:auto;">`);
            tag.append(editInput);
            editInput.focus();
            state.currentEditTag = { tag, originalText: text };
            editInput.on('blur', function() {
                finishEditing(editInput.val());
            });
            editInput.on('keydown', function(e) {
                if (e.key === 'Enter') {
                    finishEditing(editInput.val());
                    e.preventDefault();
                } else if (e.key === 'Escape') {
                    finishEditing(text); 
                    e.preventDefault();
                }
            });
        });
        removeBtn.on('click', function() {
            removeTag(tag, text);
        });
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
    }
    function finishEditing(newText) {
        if (!state.currentEditTag) return;
        const { tag, originalText } = state.currentEditTag;
        const index = state.tags.indexOf(originalText);
        if (index !== -1) {
            state.tags.splice(index, 1);
        }
        if (newText && newText.trim() && newText.length >= options.minChars) {
            tag.removeClass(Form.tagsClasses.form_tag_editable);
            tag.html(`<span>${newText}</span><span class="${Form.tagsClasses.form_tag_remove}">×</span>`);
            tag.find(`.${Form.tagsClasses.form_tag_remove.split(' ')[0]}`).on('click', function() {
                removeTag(tag, newText);
            });
            state.tags.push(newText);
        } else {
            tag.remove();
        }
        state.currentEditTag = null;
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
    }
    function removeTag(tagElement, text) {
        tagElement.remove();
        const index = state.tags.indexOf(text);
        if (index !== -1) {
            state.tags.splice(index, 1);
        }
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
    }
    function setupDragAndDrop(tag) {
        tag.on('dragstart', function(e) {
            state.draggedTag = tag;
            tag.addClass('dragging');
            if (e.dataTransfer) {
                e.dataTransfer.setData('text/plain', '');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        tag.on('dragend', function() {
            state.draggedTag = null;
            tag.removeClass('dragging');
        });
        tag.on('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault(); 
            }
            return false;
        });
        tag.on('dragenter', function(e) {
            e.preventDefault();
        });
        tag.on('drop', function(e) {
            e.stopPropagation();
            if (!state.draggedTag || state.draggedTag === tag) {
                return;
            }
            const allTags = Array.from(container.children()).filter(
                el => el.classList.contains(Form.tagsClasses.form_tag.split(' ')[0])
            );
            const fromIndex = allTags.indexOf(state.draggedTag);
            const toIndex = allTags.indexOf(tag);
            if (fromIndex < toIndex) {
                tag.after(state.draggedTag);
            } else {
                tag.before(state.draggedTag);
            }
            const movedTag = state.tags.splice(fromIndex, 1)[0];
            state.tags.splice(toIndex, 0, movedTag);
            if (typeof container.changeCallback === 'function') {
                container.changeCallback(state.tags.join(options.separator));
            }
            return false;
        });
    }
    container.on('click', function(e) {
        if (e.target === container.element) {
            input.focus();
        }
    });
    input.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',' || e.key === ';' || (options.separator === ' ' && e.key === ' ')) {
            const value = input.val().trim();
            if (value) {
                addTag(value);
                input.val('');
                e.preventDefault();
            }
        }
        else if (e.key === 'Backspace' && input.val() === '' && state.tags.length > 0) {
            const tagElements = container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
            if (tagElements.length > 0) {
                const lastTag = Q(tagElements[tagElements.length - 1]);
                lastTag.click(); 
            }
        }
    });
    input.on('paste', function(e) {
        let pastedText;
        if (window.clipboardData && window.clipboardData.getData) {
            pastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData('text/plain');
        }
        if (pastedText) {
            e.preventDefault();
            const tags = pastedText.split(options.separator).map(tag => tag.trim()).filter(Boolean);
            tags.forEach(tag => addTag(tag));
            input.val('');
        }
    });
    input.on('blur', function() {
        const inputValue = input.val();
        const value = inputValue ? inputValue.trim() : '';
        if (value) {
            addTag(value);
            input.val('');
        }
    });
    container.val = function(value) {
        if (value === undefined) {
            return state.tags.join(options.separator);
        }
        if (value === '') {
            if (container.nodes && container.nodes.length > 0) {
                const tagElements = container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
                for (let i = 0; i < tagElements.length; i++) {
                    if (tagElements[i].parentNode) {
                        tagElements[i].parentNode.removeChild(tagElements[i]);
                    }
                }
            }
            state.tags = [];
        } else {
            if (container.nodes && container.nodes.length > 0) {
                const tagElements = container.nodes[0].querySelectorAll(`.${Form.tagsClasses.form_tag.split(' ')[0]}`);
                for (let i = 0; i < tagElements.length; i++) {
                    if (tagElements[i].parentNode) {
                        tagElements[i].parentNode.removeChild(tagElements[i]);
                    }
                }
            }
            state.tags = [];
            const newTags = value.split(options.separator).map(tag => tag.trim()).filter(Boolean);
            newTags.forEach(tag => addTag(tag));
        }
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.tags.join(options.separator));
        }
        return container;
    };
    container.placeholder = function(text) {
        input.attr('placeholder', text);
        return container;
    };
    container.disabled = function(state) {
        input.prop('disabled', state);
        container.css('pointer-events', state ? 'none' : 'auto');
        if (state) {
            container.addClass(Form.classes.q_form_disabled);
        } else {
            container.removeClass(Form.classes.q_form_disabled);
        }
        return container;
    };
    container.setSeparator = function(separator) {
        options.separator = separator;
        return container;
    };
    container.reset = function() {
        return container.val('');
    };
    container.change = function(callback) {
        container.changeCallback = callback;
        return container;
    };
    this.elements.push(container);
    return container;
};
Form.prototype.TextArea = function(value = '', placeholder = '') {
    if (!Form.textAreaClassesInitialized) {
        Form.textAreaClasses = Q.style('', `
            .form_textarea {
                width: 100%;
                padding: var(--form-default-padding);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
                outline: var(--form-default-outline);
                border: 0;
                resize: none;
                min-height: 100px;
            }
            .form_textarea:focus {
                outline: var(--form-default-outline-focus);
            }
        `, null, {
            'form_textarea': 'form_textarea'
        });
        Form.textAreaClassesInitialized = true;
    }
    const textarea = Q('<textarea>')
        .addClass(Form.textAreaClasses.form_textarea)
        .attr('placeholder', placeholder)
        .val(value);
    textarea.disabled = function(state) {
        textarea.prop('disabled', state);
        return textarea;
    };
    textarea.reset = function() {
        textarea.val('');
        return textarea;
    };
    textarea.resizeable = function(x = true, y = true) {
        textarea.css('resize', (x ? 'horizontal' : 'none') + ' ' + (y ? 'vertical' : 'none'));
        return textarea;
    }
    textarea.change = function(callback) {
        textarea.on('input', function() {
            callback(this.value);
        });
        return textarea;
    };
    this.elements.push(textarea);
    return textarea;
};
Form.prototype.TextBox = function(type = 'text', value = '', placeholder = '') {
    if (!Form.textBoxClassesInitialized) {
        Form.textBoxClasses = Q.style('', `
            .q_form_input {
                width: 100%;
                font-family: var(--form-default-font-family);
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                color: var(--form-default-text-color);
                border: 0;
                resize: none;
                transition: background-color 0s ease, color 0s ease, outline 0s ease;
            }
            /* Fix for autofill background color */
            .q_form_input:-webkit-autofill,
            .q_form_input:-webkit-autofill:hover,
            .q_form_input:-webkit-autofill:focus,
            .q_form_input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 30px var(--form-default-background) inset !important;
                -webkit-text-fill-color: var(--form-default-text-color) !important;
                transition: background-color 5000s ease-in-out 0s;
                background-color: var(--form-default-background) !important;
            }
            .q_form_input:hover {
                outline: var(--form-default-outline-hover);
                background-color: var(--form-default-background-hover);
            }
            .q_form_input:hover:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 30px var(--form-default-background-hover) inset !important;
                background-color: var(--form-default-background-hover) !important;
            }
            .q_form_input:focus {
                outline: var(--form-default-outline-focus);
                background-color: var(--form-default-background-focus);
            }
            .q_form_input:focus:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 30px var(--form-default-background-focus) inset !important;
                background-color: var(--form-default-background-focus) !important;
            }
            .q_form_input:active {
                outline: var(--form-default-outline-active);
                background-color: var(--form-default-background-active);
            }
            .q_form_input:disabled {
                background-color: var(--form-default-background-disabled);
                color: var(--form-default-text-color-disabled);
                cursor: not-allowed;
            }
        `, null, {
            'q_form_input': 'q_form_input'
        });
        Form.textBoxClassesInitialized = true;
    }
    const input = Q(`<input class="${Form.textBoxClasses.q_form_input}" type="${type}" placeholder="${placeholder}" value="${value}">`);
    input.placeholder = function(text) {
        input.attr('placeholder', text);
    };
    input.disabled = function(state) {
        input.prop('disabled', state);
        if (state) {
            input.addClass(Form.classes.q_form_disabled);
        } else {
            input.removeClass(Form.classes.q_form_disabled);
        }
    };
    input.reset = function() {
        input.val('');
    };
    input.change = function(callback) {
        input.on('change input', function() {
            callback(this.value);
        });
    };
    this.elements.push(input);
    return input;
};
Form.prototype.Uploader = function (options = {}) {
    const defaultOptions = {
        fileTypes: '*', // Accepted file types: 'image/jpeg,image/png' or '.jpg,.png'
        preview: true,  // Show previews for images/videos
        thumbSize: 100, // Thumbnail size (px)
        allowDrop: true, // Allow drag and drop
        multiple: false, // Allow multiple file selection
        placeholder: 'Drop files here or click to select'
    };
    options = Object.assign({}, defaultOptions, options);
    if (!Form.uploaderClassesInitialized) {
        Form.uploaderClasses = Q.style('', `
            .form_uploader_container {
            user-select: none;
                -webkit-user-select: none;
                display: flex;
                flex-direction: column;
                width: 100%;
                outline: var(--form-default-outline);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-background);
                padding: 10px;
                color: var(--form-default-text-color);
            }
            .form_uploader_container.drag_over {
                outline: var(--form-default-outline-active);
                background-color: var(--form-default-background-hover);
            }
            .form_uploader_drop_area {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                color: var(--form-default-text-color);
                min-height: 120px;
            }
            .form_uploader_icon {
                font-size: 32px;
                margin-bottom: 10px;
                opacity: 0.7;
            }
            .form_uploader_text {
                margin-bottom: 10px;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
            .form_uploader_button {
                padding: var(--form-default-padding);
                background-color: var(--form-default-button-background-color);
                color: var(--form-default-button-text-color);
                border: none;
                border-radius: var(--form-default-border-radius);
                cursor: pointer;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
            .form_uploader_button:hover {
                background-color: var(--form-default-background-hover);
                color: var(--form-default-text-color-hover);
            }
            .form_uploader_input {
                display: none;
            }
            .form_uploader_preview_container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 5px;
            }
            .form_uploader_preview_item {
                position: relative;
                border-radius: var(--form-default-border-radius);
                overflow: hidden;
                outline: var(--form-default-outline);
            }
            .form_uploader_preview_image {
                object-fit: cover;
                display: block;
            }
            .form_uploader_preview_video {
                object-fit: cover;
                display: block;
            }
            .form_uploader_preview_icon {
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--form-default-input-text-color);
                background-color: rgba(37, 37, 37, 0.8);
                font-size: 24px;
            }
            .form_uploader_preview_info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 4px 6px;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                font-size: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        `, null, {
            'form_uploader_container': 'form_uploader_container',
            'drag_over': 'drag_over',
            'form_uploader_drop_area': 'form_uploader_drop_area',
            'form_uploader_icon': 'form_uploader_icon',
            'form_uploader_text': 'form_uploader_text',
            'form_uploader_button': 'form_uploader_button',
            'form_uploader_input': 'form_uploader_input',
            'form_uploader_preview_container': 'form_uploader_preview_container',
            'form_uploader_preview_item': 'form_uploader_preview_item',
            'form_uploader_preview_image': 'form_uploader_preview_image',
            'form_uploader_preview_video': 'form_uploader_preview_video',
            'form_uploader_preview_icon': 'form_uploader_preview_icon',
            'form_uploader_preview_info': 'form_uploader_preview_info'
        });
        Form.uploaderClassesInitialized = true;
    }
    const container = Q(`<div class="${Form.classes.q_form} ${Form.uploaderClasses.form_uploader_container}"></div>`);
    const dropArea = Q(`<div class="${Form.uploaderClasses.form_uploader_drop_area}"></div>`);
    const uploadIcon = Q(`<div class="${Form.uploaderClasses.form_uploader_icon}">📂</div>`);
    const text = Q(`<div class="${Form.uploaderClasses.form_uploader_text}">${options.placeholder}</div>`);
    const browseButton = Q(`<button type="button" class="${Form.uploaderClasses.form_uploader_button}">Browse Files</button>`);
    const fileInput = Q(`<input type="file" class="${Form.uploaderClasses.form_uploader_input}">`);
    if (options.multiple) {
        fileInput.attr('multiple', true);
    }
    if (options.fileTypes && options.fileTypes !== '*') {
        fileInput.attr('accept', options.fileTypes);
    }
    dropArea.append(uploadIcon, text, browseButton);
    container.append(dropArea, fileInput);
    let previewContainer = null;
    if (options.preview) {
        previewContainer = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_container}"></div>`);
        container.append(previewContainer);
    }
    const state = {
        files: [],
        fileObjects: []
    };
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    function getFileExtension(filename) {
        return filename.split('.').pop().toUpperCase();
    }
    function handleFiles(files) {
        if (!files || files.length === 0) return;
        Array.from(files).forEach(file => {
            const fileInfo = {
                name: file.name,
                size: file.size,
                formattedSize: formatFileSize(file.size),
                type: file.type,
                extension: getFileExtension(file.name)
            };
            state.files.push(fileInfo);
            state.fileObjects.push(file);
            if (options.preview) {
                generatePreview(file, fileInfo);
            }
        });
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.files);
        }
    }
    function generatePreview(file, fileInfo) {
        const previewItem = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_item}"></div>`);
        const fileInfoElement = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_info}">${file.name} (${fileInfo.formattedSize})</div>`);
        const removeButton = Q(`<div class="${Form.classes.form_close_button}">×</div>`);
        previewItem.css({
            width: options.thumbSize + 'px',
            height: options.thumbSize + 'px'
        });
        const titleInfo = `Name: ${file.name}\nSize: ${fileInfo.formattedSize}\nType: ${file.type}`;
        previewItem.attr('title', titleInfo);
        if (file.type.startsWith('image/')) {
            const img = Q(`<img class="${Form.uploaderClasses.form_uploader_preview_image}" alt="${file.name}">`);
            img.css({
                width: '100%',
                height: '100%'
            });
            img.attr('title', titleInfo);
            const reader = new FileReader();
            reader.onload = function (e) {
                img.attr('src', e.target.result);
                fileInfo.preview = e.target.result;
            };
            reader.readAsDataURL(file);
            previewItem.append(img);
        }
        else if (file.type.startsWith('video/')) {
            const video = Q(`<video class="${Form.uploaderClasses.form_uploader_preview_video}" controls muted>`);
            video.css({
                width: '100%',
                height: '100%'
            });
            video.attr('title', titleInfo);
            const reader = new FileReader();
            reader.onload = function (e) {
                video.attr('src', e.target.result);
                fileInfo.preview = e.target.result;
            };
            reader.readAsDataURL(file);
            previewItem.append(video);
        }
        else {
            const fileIcon = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_icon}"></div>`);
            fileIcon.css({
                width: '100%',
                height: '100%'
            });
            fileIcon.attr('title', titleInfo);
            fileIcon.text(fileInfo.extension);
            previewItem.append(fileIcon);
        }
        previewItem.append(fileInfoElement, removeButton);
        fileInfo.element = previewItem;
        if (previewContainer) {
            previewContainer.append(previewItem);
        }
        removeButton.on('click', () => {
            removeFile(fileInfo);
        });
    }
    function removeFile(fileInfo) {
        const index = state.files.indexOf(fileInfo);
        if (index !== -1) {
            state.files.splice(index, 1);
            state.fileObjects.splice(index, 1);
            if (fileInfo.element) {
                fileInfo.element.remove();
            }
            if (typeof container.changeCallback === 'function') {
                container.changeCallback(state.files);
            }
        }
    }
    function resetUploader() {
        state.files = [];
        state.fileObjects = [];
        if (previewContainer) {
            previewContainer.html('');
        }
        fileInput.val('');
    }
    if (options.allowDrop) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.on(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.on(eventName, () => {
                container.addClass(Form.uploaderClasses.drag_over);
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.on(eventName, () => {
                container.removeClass(Form.uploaderClasses.drag_over);
            });
        });
        dropArea.on('drop', (e) => {
            const files = e.dataTransfer.files;
            if (!options.multiple && files.length > 1) {
                handleFiles([files[0]]);
            } else {
                handleFiles(files);
            }
        });
    }
    browseButton.on('click', function () {
        fileInput.nodes[0].click();
    });
    dropArea.on('click', function (e) {
        if (e.target !== browseButton.nodes[0]) {
            fileInput.nodes[0].click();
        }
    });
    fileInput.on('change', function () {
        if (!options.multiple) {
            resetUploader(); // Clear previous files if not multiple
        }
        handleFiles(this.files);
    });
    container.val = function (value) {
        if (value === undefined) {
            return {
                files: state.files,
                fileObjects: state.fileObjects
            };
        }
        if (value === '' || value === null) {
            resetUploader();
            return container;
        }
        return container;
    };
    container.reset = function () {
        resetUploader();
        return container;
    };
    container.disabled = function (state) {
        if (state) {
            container.css('opacity', '0.5');
            container.css('pointer-events', 'none');
            fileInput.prop('disabled', true);
        } else {
            container.css('opacity', '1');
            container.css('pointer-events', 'auto');
            fileInput.prop('disabled', false);
        }
        return container;
    };
    container.change = function (callback) {
        container.changeCallback = callback;
        return container;
    };
    this.elements.push(container);
    return container;
};
function Graph(options = {}) {
    if (!(this instanceof Graph)) {
        return new Graph(options);
    }
    if (!Graph.initialized) {
        Q.style(`
        `);
        Graph.initialized = true;
    }
    return this;
};
Graph.deepMerge = function(target, src) {
    for (const k in src) {
        if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
            if (!target[k]) target[k] = {};
            Graph.deepMerge(target[k], src[k]);
        } else {
            target[k] = src[k];
        }
    }
    return target;
};
Graph.getPadding = function(pad) {
    if (Array.isArray(pad)) {
        if (pad.length === 2) return [pad[0], pad[1], pad[0], pad[1]];
        if (pad.length === 3) return [pad[0], pad[1], pad[2], pad[1]];
        if (pad.length === 4) return pad;
    }
    return [pad, pad, pad, pad];
};
Graph.catmullRom2bezier = function(points) {
    let d = '';
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        if (i === 0) d += `M${p1[0]},${p1[1]}`;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
};
Q.Graph = Graph;
Graph.prototype.Line = function (options = {}) {
    const defaults = {
        size: {
            width: 600,
            height: 300,
            padding: 40
        },
        background: '#181818',
        range: {
            min: 0,
            max: 100,
            autoscaleX: true,
            autoscaleY: true
        },
        line: {
            type: 'line',
            color: 'rgb(100, 60, 240)',
            thickness: 2,
            fill: null,
            triangle: {
                size: 8,
                fill: null,
                stroke: null,
                strokeWidth: null,
                opacity: null
            }
        },
        dot: {
            radius: 2,
            stroke: '#222',
            strokeWidth: 0
        },
        zeroLine: {
            enabled: false,
            color: '#607d8b',
            thickness: 2,
            dasharray: '',
            point: undefined,
            points: undefined
        },
        grid: {
            resolutionX: 0,
            resolutionY: 0,
            color: '#333',
            thickness: 1,
            dasharray: '2,2',
            showValuesX: false,
            showValuesY: false
        },
        text: {
            value: {
                color: '#bbb',
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 'normal',
                shadow: '',
            },
            axis: {
                color: '#aaa',
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                shadow: '',
            },
            label: {
                color: '#fff',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                shadow: '',
            }
        },
        current: {
            show: false
        },
        average: {
            enabled: true,
            dasharray: '2,2',
            color: '#ff9800',
            thickness: 3,
            label: {
                color: '#ff9800',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                shadow: '',
            }
        },
        hover: {
            value: false,
            onlyPoints: false,
            digits: 5,
            distance: 20,
            wrap: false,
            show: 'both',
            xDigits: 5,
            yDigits: 5,
            dot: {
                radius: 10,
                fill: 'rgb(100, 60, 240)',
                stroke: '#fff',
                strokeWidth: 0
            },
            margin: [0, 20],
            cursor: false,
            padding: [8, 8, 8, 8],
            background: '#111',
            opacity: 1,
            shadow: '',
            text: {
                color: '#fff',
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 'normal',
                shadow: ''
            }
        },
        valueDigits: 2
    };
    const opts = Graph.deepMerge(JSON.parse(JSON.stringify(defaults)), options);
    let dataX = [], dataY = [];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', opts.size.width);
    svg.setAttribute('height', opts.size.height);
    svg.style.background = opts.background;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(g);
    function render() {
        g.innerHTML = '';
        if (!dataY.length) return;
        let xArr = dataX.length ? dataX : dataY.map((_, i) => i);
        let minY = opts.range.autoscaleY ? Math.min(...dataY) : opts.range.min;
        let maxY = opts.range.autoscaleY ? Math.max(...dataY) : opts.range.max;
        let minX = opts.range.autoscaleX ? Math.min(...xArr) : 0;
        let maxX = opts.range.autoscaleX ? Math.max(...xArr) : xArr.length - 1;
        const pad = Graph.getPadding(opts.size.padding);
        const [padT, padR, padB, padL] = pad;
        const w = opts.size.width - padL - padR;
        const h = opts.size.height - padT - padB;
        const scaleX = v => padL + (w) * (v - minX) / (maxX - minX);
        const scaleY = v => opts.size.height - padB - (h) * (v - minY) / (maxY - minY);
        if (opts.grid.resolutionX > 0) {
            let xVal = Math.ceil(minX / opts.grid.resolutionX) * opts.grid.resolutionX;
            for (; xVal <= maxX; xVal += opts.grid.resolutionX) {
                const x = scaleX(xVal);
                const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Q(grid).attr({
                    x1: x,
                    y1: padT,
                    x2: x,
                    y2: opts.size.height - padB,
                    stroke: opts.grid.color,
                    'stroke-width': opts.grid.thickness,
                    'stroke-dasharray': opts.grid.dasharray
                });
                g.appendChild(grid);
                if (opts.grid.showValuesX) {
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    Q(label).attr({
                        x: x,
                        y: opts.size.height - padB + 18,
                        fill: opts.text.value.color,
                        'font-size': opts.text.value.fontSize,
                        'font-family': opts.text.value.fontFamily,
                        'font-weight': opts.text.value.fontWeight
                    });
                    label.textContent = xVal.toFixed(opts.valueDigits);
                    g.appendChild(label);
                }
            }
        }
        if (opts.grid.resolutionY > 0) {
            let yVal = Math.ceil(minY / opts.grid.resolutionY) * opts.grid.resolutionY;
            for (; yVal <= maxY; yVal += opts.grid.resolutionY) {
                const y = scaleY(yVal);
                const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                Q(grid).attr({
                    x1: padL,
                    y1: y,
                    x2: opts.size.width - padR,
                    y2: y,
                    stroke: opts.grid.color,
                    'stroke-width': opts.grid.thickness,
                    'stroke-dasharray': opts.grid.dasharray
                });
                g.appendChild(grid);
                if (opts.grid.showValuesY) {
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    Q(label).attr({
                        x: padL - 8,
                        y: y + 4,
                        fill: opts.text.value.color,
                        'font-size': opts.text.value.fontSize,
                        'font-family': opts.text.value.fontFamily,
                        'font-weight': opts.text.value.fontWeight,
                        'text-anchor': 'end'
                    });
                    label.textContent = yVal.toFixed(opts.valueDigits);
                    g.appendChild(label);
                }
            }
        }
        let d = '';
        if (opts.line.type === 'curve' && dataY.length > 2) {
            const points = dataY.map((y, i) => [scaleX(xArr[i]), scaleY(y)]);
            d = Graph.catmullRom2bezier(points);
        } else if (opts.line.type === 'dots') {
            for (let i = 0; i < dataY.length; i++) {
                const x = scaleX(xArr[i]);
                const y = scaleY(dataY[i]);
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                Q(dot).attr({
                    cx: x,
                    cy: y,
                    r: opts.dot.radius,
                    fill: opts.line.color,
                    stroke: opts.dot.stroke,
                    'stroke-width': opts.dot.strokeWidth
                });
                g.appendChild(dot);
            }
            d = '';
        } else {
            for (let i = 0; i < dataY.length; i++) {
                const x = scaleX(xArr[i]);
                const y = scaleY(dataY[i]);
                d += (i === 0 ? 'M' : 'L') + x + ',' + y;
            }
        }
        if (opts.line.fill && d && dataY.length > 1) {
            let areaPath = '';
            let fillColor = typeof opts.line.fill === 'object' ? opts.line.fill.color : opts.line.fill;
            let lowerY = [];
            if (opts.zeroLine && opts.zeroLine.enabled) {
                if (Array.isArray(opts.zeroLine.points) && opts.zeroLine.points.length === dataY.length) {
                    lowerY = opts.zeroLine.points;
                } else if (Array.isArray(opts.zeroLine.point) && opts.zeroLine.point.length === 2) {
                    lowerY = Array(dataY.length).fill(opts.zeroLine.point[1]);
                } else {
                    lowerY = Array(dataY.length).fill(opts.range.min);
                }
            } else {
                lowerY = Array(dataY.length).fill(opts.range.min);
            }
            if (opts.line.type === 'curve' && dataY.length > 2) {
                const points = dataY.map((y, i) => [scaleX(xArr[i]), scaleY(y)]);
                areaPath = Graph.catmullRom2bezier(points);
                for (let i = dataY.length - 1; i >= 0; i--) {
                    areaPath += 'L' + scaleX(xArr[i]) + ',' + scaleY(lowerY[i]);
                }
                areaPath += 'Z';
            } else {
                areaPath = '';
                for (let i = 0; i < dataY.length; i++) {
                    const x = scaleX(xArr[i]);
                    const y = scaleY(dataY[i]);
                    areaPath += (i === 0 ? 'M' : 'L') + x + ',' + y;
                }
                for (let i = dataY.length - 1; i >= 0; i--) {
                    areaPath += 'L' + scaleX(xArr[i]) + ',' + scaleY(lowerY[i]);
                }
                areaPath += 'Z';
            }
            const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            Q(fillPath).attr({
                d: areaPath,
                fill: fillColor
            });
            g.appendChild(fillPath);
        }
        if (d) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            Q(path).attr({
                d: d,
                stroke: opts.line.color,
                'stroke-width': opts.line.thickness,
                fill: 'none'
            });
            g.appendChild(path);
        }
        if (opts.zeroLine && opts.zeroLine.enabled) {
            let nullD = '';
            let started = false;
            for (let i = 0; i < dataY.length; i++) {
                if (dataY[i] === 0) {
                    const x = scaleX(xArr[i]);
                    const y = scaleY(dataY[i]);
                    nullD += (started ? 'L' : 'M') + x + ',' + y;
                    started = true;
                }
            }
            if (nullD) {
                const nullPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                Q(nullPath).attr({
                    d: nullD,
                    stroke: opts.zeroLine.color,
                    'stroke-width': opts.zeroLine.thickness,
                    fill: 'none'
                });
                g.appendChild(nullPath);
            }
            if (Array.isArray(opts.zeroLine.point) && opts.zeroLine.point.length === 2) {
                const [nullX, nullY] = opts.zeroLine.point;
                if (typeof nullX === 'number' && typeof nullY === 'number') {
                    const x = scaleX(nullX);
                    const nullLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    Q(nullLine).attr({
                        x1: x,
                        y1: padT,
                        x2: x,
                        y2: opts.size.height - padB,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullLine);
                    const y = scaleY(nullY);
                    const nullLineH = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    Q(nullLineH).attr({
                        x1: padL,
                        y1: y,
                        x2: opts.size.width - padR,
                        y2: y,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullLineH);
                }
            }
            if (Array.isArray(opts.zeroLine.points) && opts.zeroLine.points.length > 0) {
                const n = opts.zeroLine.points.length;
                if (n === 1) {
                    const y = scaleY(opts.zeroLine.points[0]);
                    const nullLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    Q(nullLine).attr({
                        x1: padL,
                        y1: y,
                        x2: opts.size.width - padR,
                        y2: y,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullLine);
                } else {
                    let points = [];
                    for (let i = 0; i < n; i++) {
                        const x = padL + (w) * (n === 1 ? 0.5 : i / (n - 1));
                        const y = scaleY(opts.zeroLine.points[i]);
                        points.push([x, y]);
                    }
                    let d = '';
                    for (let i = 0; i < points.length; i++) {
                        d += (i === 0 ? 'M' : 'L') + points[i][0] + ',' + points[i][1];
                    }
                    const nullPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    Q(nullPath).attr({
                        d: d,
                        stroke: opts.zeroLine.color,
                        'stroke-width': opts.zeroLine.thickness,
                        fill: 'none',
                        'stroke-dasharray': opts.zeroLine.dasharray
                    });
                    g.appendChild(nullPath);
                }
            }
        }
        if (opts.current.show && dataX.length && dataY.length) {
            const lastX = dataX[dataX.length - 1];
            const lastY = dataY[dataX.length - 1];
            const x = scaleX(lastX);
            const y = scaleY(lastY);
            const triOpts = opts.line.triangle;
            const triXSize = triOpts.size;
            const triYSize = triOpts.size;
            const triX = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            Q(triX).attr({
                points: `${x - triXSize},${opts.size.height - padB} ${x + triXSize},${opts.size.height - padB} ${x},${opts.size.height - padB + triXSize}`,
                fill: triOpts.fill || opts.line.color,
                stroke: triOpts.stroke,
                'stroke-width': triOpts.strokeWidth,
                opacity: triOpts.opacity
            });
            g.appendChild(triX);
            const xValStr = lastX.toFixed(opts.valueDigits);
            const xFont = opts.text.value.fontFamily;
            const xFontSize = opts.text.value.fontSize;
            const xLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            Q(xLabelBg).attr({
                x: x - 22,
                y: opts.size.height - padB + triXSize + 2,
                width: 44,
                height: 22,
                fill: '#111',
                rx: 4
            });
            g.appendChild(xLabelBg);
            const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            Q(xLabel).attr({
                x: x,
                y: opts.size.height - padB + triXSize + 18,
                'text-anchor': 'middle',
                fill: opts.text.value.color,
                'font-size': xFontSize,
                'font-family': xFont
            });
            xLabel.textContent = xValStr;
            g.appendChild(xLabel);
            const triY = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            Q(triY).attr({
                points: `${padL},${y - triYSize} ${padL},${y + triYSize} ${padL - triYSize},${y}`,
                fill: triOpts.fill || opts.line.color,
                stroke: triOpts.stroke,
                'stroke-width': triOpts.strokeWidth,
                opacity: triOpts.opacity
            });
            g.appendChild(triY);
            const yValStr = lastY.toFixed(opts.valueDigits);
            const yFont = opts.text.value.fontFamily;
            const yFontSize = opts.text.value.fontSize;
            const yLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            Q(yLabelBg).attr({
                x: padL - triYSize - 46,
                y: y - 11,
                width: 44,
                height: 22,
                fill: '#111',
                rx: 4
            });
            g.appendChild(yLabelBg);
            const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            Q(yLabel).attr({
                x: padL - triYSize - 24,
                y: y + 6,
                'text-anchor': 'middle',
                fill: opts.text.value.color,
                'font-size': yFontSize,
                'font-family': yFont
            });
            yLabel.textContent = yValStr;
            g.appendChild(yLabel);
        }
        if (opts.average && opts.average.enabled && dataY.length > 0) {
            const avgY = dataY.reduce((a, b) => a + b, 0) / dataY.length;
            const pad = Graph.getPadding(opts.size.padding);
            const [padT, padR, padB, padL] = pad;
            const w = opts.size.width - padL - padR;
            const h = opts.size.height - padT - padB;
            let minY = opts.range.autoscaleY ? Math.min(...dataY) : opts.range.min;
            let maxY = opts.range.autoscaleY ? Math.max(...dataY) : opts.range.max;
            const scaleY = v => opts.size.height - padB - (h) * (v - minY) / (maxY - minY);
            const y = scaleY(avgY);
            const avgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            Q(avgLine).attr({
                x1: padL,
                y1: y,
                x2: opts.size.width - padR,
                y2: y,
                stroke: opts.average.color,
                'stroke-width': opts.average.thickness,
                'stroke-dasharray': opts.average.dasharray
            });
            g.appendChild(avgLine);
            const avgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            Q(avgLabel).attr({
                x: padL - 8,
                y: y + 4,
                fill: opts.average.label.color,
                'font-size': opts.average.label.fontSize,
                'font-family': opts.average.label.fontFamily,
                'font-weight': opts.average.label.fontWeight,
                'text-anchor': 'end',
                opacity: 1
            });
            avgLabel.textContent = avgY.toFixed(typeof opts.valueDigits === 'number' ? opts.valueDigits : 2);
            g.appendChild(avgLabel);
        }
        if (opts.hover.value) {
            svg.onmousemove = function (e) {
                const rect = svg.getBoundingClientRect();
                const pad = Graph.getPadding(opts.size.padding);
                const [padT, padR, padB, padL] = pad;
                const w = opts.size.width - padL - padR;
                const h = opts.size.height - padT - padB;
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                let minX = opts.range.autoscaleX ? Math.min(...dataX) : opts.range.min;
                let maxX = opts.range.autoscaleX ? Math.max(...dataX) : dataX.length - 1;
                let minY = opts.range.autoscaleY ? Math.min(...dataY) : opts.range.min;
                let maxY = opts.range.autoscaleY ? Math.max(...dataY) : opts.range.max;
                let xVal = minX + (mouseX - padL) * (maxX - minX) / (w);
                let yVal = maxY - (mouseY - padT) * (maxY - minY) / (h);
                let showX = xVal, showY = yVal, dist = 0;
                if (opts.hover.onlyPoints && dataX.length) {
                    let minDist = Infinity, idx = 0;
                    for (let i = 0; i < dataX.length; i++) {
                        const px = padL + (w) * (dataX[i] - minX) / (maxX - minX);
                        const py = opts.size.height - padB - (h) * (dataY[i] - minY) / (maxY - minY);
                        const d = Math.hypot(mouseX - px, mouseY - py);
                        if (d < minDist) { minDist = d; idx = i; }
                    }
                    showX = dataX[idx];
                    showY = dataY[idx];
                    dist = minDist;
                } else if (dataX.length > 1) {
                    let minDist = Infinity;
                    for (let i = 0; i < dataX.length - 1; i++) {
                        const x1 = padL + (w) * (dataX[i] - minX) / (maxX - minX);
                        const y1 = opts.size.height - padB - (h) * (dataY[i] - minY) / (maxY - minY);
                        const x2 = padL + (w) * (dataX[i + 1] - minX) / (maxX - minX);
                        const y2 = opts.size.height - padB - (h) * (dataY[i + 1] - minY) / (maxY - minY);
                        const t = Math.max(0, Math.min(1, ((mouseX - x1) * (x2 - x1) + (mouseY - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2)));
                        const projX = x1 + t * (x2 - x1);
                        const projY = y1 + t * (x2 - x1);
                        const d = Math.hypot(mouseX - projX, mouseY - projY);
                        if (d < minDist) {
                            minDist = d;
                            showX = dataX[i] + t * (dataX[i + 1] - dataX[i]);
                            showY = dataY[i] + t * (dataY[i + 1] - dataY[i]);
                            dist = d;
                        }
                    }
                }
                if (dist > (opts.hover.distance)) {
                    let old = svg.querySelector('.q-graph-hover-label');
                    if (old) old.remove();
                    svg.style.cursor = opts.hover.cursor === false ? '' : (opts.hover.cursor === true ? 'pointer' : 'auto');
                    return;
                }
                if (opts.hover.cursor === false) {
                    svg.style.cursor = 'none';
                } else if (opts.hover.cursor === true) {
                    svg.style.cursor = 'pointer';
                } else {
                    svg.style.cursor = '';
                }
                const hoverShow = opts.hover.show;
                const xDigits = typeof opts.hover.xDigits === 'number' ? opts.hover.xDigits : (typeof opts.hover.digits === 'number' ? opts.hover.digits : 5);
                const yDigits = typeof opts.hover.yDigits === 'number' ? opts.hover.yDigits : (typeof opts.hover.digits === 'number' ? opts.hover.digits : 5);
                const showXVal = +showX.toFixed(xDigits);
                const showYVal = +showY.toFixed(yDigits);
                let old = svg.querySelector('.q-graph-hover-label');
                if (old) old.remove();
                const gHover = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                gHover.classList.add('q-graph-hover-label');
                const cx = padL + (w) * (showX - minX) / (maxX - minX);
                const cy = opts.size.height - padB - (h) * (showY - minY) / (maxY - minY);
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                const hoverDot = opts.hover.dot;
                Q(dot).attr({
                    cx: cx,
                    cy: cy,
                    r: hoverDot.radius,
                    fill: hoverDot.fill,
                    stroke: hoverDot.stroke,
                    'stroke-width': hoverDot.strokeWidth
                });
                gHover.appendChild(dot);
                const hoverText = opts.hover.text;
                let labelText = '';
                if (hoverShow === 'both') {
                    labelText = opts.hover.wrap ? `x: ${showXVal}\ny: ${showYVal}` : `x: ${showXVal}, y: ${showYVal}`;
                } else if (hoverShow === 'x') {
                    labelText = `x: ${showXVal}`;
                } else if (hoverShow === 'y') {
                    labelText = `y: ${showYVal}`;
                }
                const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                Q(tempText).attr({
                    'font-size': hoverText.fontSize,
                    'font-family': hoverText.fontFamily,
                    'font-weight': hoverText.fontWeight
                });
                if (opts.hover.wrap && labelText.includes('\n')) {
                    const lines = labelText.split('\n');
                    lines.forEach((line, i) => {
                        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        Q(tspan).attr({
                            x: 0,
                            dy: i === 0 ? '0' : (hoverText.fontSize) * 1.2
                        });
                        tspan.textContent = line;
                        tempText.appendChild(tspan);
                    });
                } else {
                    tempText.textContent = labelText;
                }
                svg.appendChild(tempText);
                const bbox = tempText.getBBox();
                svg.removeChild(tempText);
                function getBox(box, def, count) {
                    if (Array.isArray(box)) {
                        if (box.length === 2 && count === 2) return box;
                        if (box.length === 2 && count === 4) return [box[0], box[1], box[0], box[1]];
                        if (box.length === 3) return [box[0], box[1], box[2], box[1]];
                        if (box.length === 4) return box;
                    }
                    return Array(count).fill(def);
                }
                const hoverPadArr = getBox(opts.hover.padding, 8, 4);
                const hoverMarginArr = getBox(opts.hover.margin, 8, 2);
                const labelW = bbox.width + hoverPadArr[1] + hoverPadArr[3];
                const labelH = bbox.height + hoverPadArr[0] + hoverPadArr[2];
                const labelX = cx + hoverMarginArr[1];
                const labelY = cy - labelH / 2 + hoverMarginArr[0];
                const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                Q(labelBg).attr({
                    x: labelX,
                    y: labelY,
                    width: labelW,
                    height: labelH,
                    fill: opts.hover.background,
                    rx: 5,
                    opacity: opts.hover.opacity
                });
                if (opts.hover.shadow) labelBg.setAttribute('filter', `drop-shadow(${opts.hover.shadow})`);
                gHover.appendChild(labelBg);
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                Q(label).attr({
                    fill: hoverText.color,
                    'font-size': hoverText.fontSize,
                    'font-family': hoverText.fontFamily,
                    'font-weight': hoverText.fontWeight,
                    'alignment-baseline': 'middle',
                    'text-anchor': 'middle'
                });
                if (hoverText.shadow) label.setAttribute('filter', `drop-shadow(${hoverText.shadow})`);
                if (opts.hover.wrap && labelText.includes('\n')) {
                    const lines = labelText.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        Q(tspan).attr({
                            x: labelX + labelW / 2,
                            dy: i === 0 ? '0' : (hoverText.fontSize) * 1.2
                        });
                        tspan.textContent = lines[i];
                        label.appendChild(tspan);
                    }
                    label.setAttribute('y', labelY + hoverPadArr[0] + (hoverText.fontSize));
                } else {
                    label.setAttribute('x', labelX + labelW / 2);
                    label.setAttribute('y', labelY + labelH / 2 + (hoverText.fontSize ? hoverText.fontSize / 3 - 2 : 6));
                    label.textContent = labelText;
                }
                gHover.appendChild(label);
                svg.appendChild(gHover);
                svg.style.cursor = 'none';
            };
            svg.onmouseleave = function () {
                let old = svg.querySelector('.q-graph-hover-label');
                if (old) old.remove();
                svg.style.cursor = opts.hover.cursor === false ? '' : (opts.hover.cursor === true ? 'pointer' : 'auto');
            };
        } else {
            svg.style.cursor = '';
            svg.onmousemove = null;
            svg.onmouseleave = null;
        }
    }
    const qsvg = Q(svg);
    qsvg.data = function (arr) {
        if (Array.isArray(arr)) {
            dataY = arr;
            dataX = arr.map((_, i) => i);
        } else if (arr && typeof arr === 'object' && arr.x && arr.y) {
            dataX = arr.x;
            dataY = arr.y;
        }
        render();
        return qsvg;
    };
    qsvg.add = function (val) {
        if (typeof val === 'object' && val.x !== undefined && val.y !== undefined) {
            dataX.push(val.x);
            dataY.push(val.y);
        } else if (typeof val === 'number') {
            dataX.push(dataX.length);
            dataY.push(val);
        }
        render();
        return qsvg;
    };
    render();
    return qsvg;
};
Q.Image = function (options) {
    const defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        quality: 1,
        historyLimit: 10,
        autoSaveHistory: true
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.canvas = Q('<canvas>');
    this.node = this.canvas.nodes[0];
    if (this.options.width && this.options.height) {
        this.node.width = this.options.width;
        this.node.height = this.options.height;
    }
    this.history = {
        states: [],
        position: -1,
        isUndoRedoing: false
    };
};
Q.Image.prototype.Load = function (src, callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        if (this.node.width === 0 || this.node.height === 0 ||
            this.options.width === 0 || this.options.height === 0) {
            this.node.width = img.width;
            this.node.height = img.height;
        }
        const ctx = this.node.getContext('2d');
        ctx.clearRect(0, 0, this.node.width, this.node.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
            0, 0, this.node.width, this.node.height);
        this.history.states = [];
        this.history.position = -1;
        this.saveToHistory();
        if (callback) callback.call(this, null);
    };
    img.onerror = (err) => {
        console.error('Hiba a kép betöltésekor:', src, err);
        if (callback) callback.call(this, new Error('Error loading image'));
    };
    img.src = typeof src === 'string' ? src : src.src;
    return this;
};
Q.Image.prototype.Clear = function (fill = this.options.fill) {
    let ctx = this.node.getContext('2d');
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, this.node.width, this.node.height);
    this.saveToHistory();
    return this;
};
Q.Image.prototype.Render = function (target) {
    const targetNode = (typeof target === 'string')
        ? document.querySelector(target)
        : (target instanceof HTMLElement)
            ? target
            : (target.nodes ? target.nodes[0] : null);
    if (!targetNode) {
        console.error('Invalid render target');
        return this;
    }
    let ctxTarget;
    if (targetNode.tagName.toLowerCase() === 'canvas') {
        targetNode.width = this.node.width;
        targetNode.height = this.node.height;
        ctxTarget = targetNode.getContext('2d');
        ctxTarget.drawImage(this.node, 0, 0);
    } else if (targetNode.tagName.toLowerCase() === 'img') {
        targetNode.src = this.node.toDataURL(`image/${this.options.format}`, this.options.quality);
    } else {
        console.error('Unsupported element for rendering');
    }
    return this;
};
Q.Image.prototype.Save = function (filename) {
    const dataUrl = this.node.toDataURL('image/' + this.options.format, this.options.quality);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    link.remove();
    return this;
};
Q.Image.prototype.saveToHistory = function () {
    if (this.history.isUndoRedoing || !this.options.autoSaveHistory) return;
    if (this.node.width === 0 || this.node.height === 0) return;
    const ctx = this.node.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, this.node.width, this.node.height);
    if (this.history.position < this.history.states.length - 1) {
        this.history.states.length = this.history.position + 1;
    }
    this.history.states.push(imageData);
    if (this.history.states.length > this.options.historyLimit) {
        this.history.states.shift();
        if (this.history.position > 0) {
            this.history.position--;
        }
    } else {
        this.history.position++;
    }
};
/* 
 * IMPORTANT: Every image manipulation method should call saveToHistory() 
 * after modifying the canvas to ensure proper history tracking.
 */
Q.Image.prototype.Undo = function () {
    return this.History(-1);
};
Q.Image.prototype.Redo = function () {
    return this.History(1);
};
Q.Image.prototype.History = function (offset) {
    if (this.history.states.length === 0) {
        console.warn('No history states available.');
        return this;
    }
    const target = this.history.position + offset;
    if (target < 0 || target >= this.history.states.length) {
        console.warn('Nem lehetséges további visszalépés vagy előreugrás.');
        return this;
    }
    this.history.isUndoRedoing = true;
    const ctx = this.node.getContext('2d', { willReadFrequently: true });
    const historyState = this.history.states[target];
    if (this.node.width !== historyState.width || this.node.height !== historyState.height) {
        this.node.width = historyState.width;
        this.node.height = historyState.height;
    }
    ctx.putImageData(historyState, 0, 0);
    this.history.position = target;
    this.history.isUndoRedoing = false;
    return this;
};
Q.Image.prototype.AutoAdjust = function(autoAdjustOptions = {}) {
    const defaultOptions = {
        mode: 'autoTone',
        clipPercentage: 0.5,
        targetBrightness: 128,
        neutralizeColors: true,
        enhanceShadows: true,
        enhanceHighlights: true,
        preserveContrast: true,
        strength: 1.0,
        preserveHue: true,
        clamp: true
    };
    const finalOptions = Object.assign({}, defaultOptions, autoAdjustOptions);
    const canvas_node = this.node;
    const ctx = canvas_node.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
    const pixels = imageData.data;
    const pixelCount = pixels.length / 4;
    const imageStats = analyzeImage(pixels, pixelCount);
    switch (finalOptions.mode) {
        case 'autoTone':
            applyAutoTone(pixels, imageStats, finalOptions);
            break;
        case 'autoContrast':
            applyAutoContrast(pixels, imageStats, finalOptions);
            break;
        case 'autoBrightness':
            applyAutoBrightness(pixels, imageStats, finalOptions);
            break;
        case 'autoColor':
            applyAutoColor(pixels, imageStats, finalOptions);
            break;
        default:
            applyAutoTone(pixels, imageStats, finalOptions);
    }
    ctx.putImageData(imageData, 0, 0);
    this.saveToHistory();
    return this;
};
function applyAutoTone(pixels, imageStats, options) {
    const { histogram, avgR, avgG, avgB } = imageStats;
    const clipAmount = Math.floor(imageStats.pixelCount * (options.clipPercentage / 100));
    const blackPoint = {
        r: findBlackPoint(histogram.r, clipAmount, options.enhanceShadows),
        g: findBlackPoint(histogram.g, clipAmount, options.enhanceShadows),
        b: findBlackPoint(histogram.b, clipAmount, options.enhanceShadows)
    };
    const whitePoint = {
        r: findWhitePoint(histogram.r, clipAmount, options.enhanceHighlights),
        g: findWhitePoint(histogram.g, clipAmount, options.enhanceHighlights),
        b: findWhitePoint(histogram.b, clipAmount, options.enhanceHighlights)
    };
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        const originalR = r;
        const originalG = g;
        const originalB = b;
        const originalLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
        r = mapTone(r, blackPoint.r, whitePoint.r);
        g = mapTone(g, blackPoint.g, whitePoint.g);
        b = mapTone(b, blackPoint.b, whitePoint.b);
        r = lerp(originalR, r, options.strength);
        g = lerp(originalG, g, options.strength);
        b = lerp(originalB, b, options.strength);
        if (options.preserveHue && originalLuminance > 0) {
            const newLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (newLuminance > 0) {
                const luminanceRatio = newLuminance / originalLuminance;
                r = originalR * luminanceRatio;
                g = originalG * luminanceRatio;
                b = originalB * luminanceRatio;
            }
        }
        if (options.clamp) {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}
function applyAutoContrast(pixels, imageStats, options) {
    const { histogram } = imageStats;
    const clipAmount = Math.floor(imageStats.pixelCount * (options.clipPercentage / 100));
    const blackPoint = findBlackPoint(histogram.luminance, clipAmount, true);
    const whitePoint = findWhitePoint(histogram.luminance, clipAmount, true);
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        const originalR = r;
        const originalG = g;
        const originalB = b;
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const newLuminance = mapTone(luminance, blackPoint, whitePoint);
        if (luminance > 0) {
            const luminanceRatio = newLuminance / luminance;
            r = r * luminanceRatio;
            g = g * luminanceRatio;
            b = b * luminanceRatio;
        }
        r = lerp(originalR, r, options.strength);
        g = lerp(originalG, g, options.strength);
        b = lerp(originalB, b, options.strength);
        if (options.clamp) {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}
function applyAutoBrightness(pixels, imageStats, options) {
    const { avgLuminance } = imageStats;
    const targetBrightness = options.targetBrightness;
    const brightnessAdjust = targetBrightness - avgLuminance;
    const maxAdjustment = 80;
    const actualAdjustment = Math.max(-maxAdjustment, Math.min(maxAdjustment, 
                             brightnessAdjust * options.strength));
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        pixels[i] = Math.min(255, Math.max(0, r + actualAdjustment));
        pixels[i + 1] = Math.min(255, Math.max(0, g + actualAdjustment));
        pixels[i + 2] = Math.min(255, Math.max(0, b + actualAdjustment));
    }
}
function applyAutoColor(pixels, imageStats, options) {
    const { avgR, avgG, avgB } = imageStats;
    const neutralGray = (avgR + avgG + avgB) / 3;
    const rFactor = neutralGray / avgR;
    const gFactor = neutralGray / avgG;
    const bFactor = neutralGray / avgB;
    const limitFactor = 2.0;
    const rAdjust = Math.max(1/limitFactor, Math.min(limitFactor, rFactor));
    const gAdjust = Math.max(1/limitFactor, Math.min(limitFactor, gFactor));
    const bAdjust = Math.max(1/limitFactor, Math.min(limitFactor, bFactor));
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        const originalR = r;
        const originalG = g;
        const originalB = b;
        const originalLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
        r = r * rAdjust;
        g = g * gAdjust;
        b = b * bAdjust;
        r = lerp(originalR, r, options.strength);
        g = lerp(originalG, g, options.strength);
        b = lerp(originalB, b, options.strength);
        if (options.preserveHue && originalLuminance > 0) {
            const newLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (newLuminance > 0) {
                const luminanceRatio = newLuminance / originalLuminance;
                r = originalR * luminanceRatio;
                g = originalG * luminanceRatio;
                b = originalB * luminanceRatio;
            }
        }
        if (options.clamp) {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
        }
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
    }
}
function analyzeImage(pixels, pixelCount) {
    const histogram = {
        r: new Array(256).fill(0),
        g: new Array(256).fill(0),
        b: new Array(256).fill(0),
        luminance: new Array(256).fill(0)
    };
    let totalR = 0, totalG = 0, totalB = 0, totalLuminance = 0;
    let minR = 255, minG = 255, minB = 255, minLuminance = 255;
    let maxR = 0, maxG = 0, maxB = 0, maxLuminance = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        histogram.r[r]++;
        histogram.g[g]++;
        histogram.b[b]++;
        const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        histogram.luminance[luminance]++;
        totalR += r;
        totalG += g;
        totalB += b;
        totalLuminance += luminance;
        minR = Math.min(minR, r);
        minG = Math.min(minG, g);
        minB = Math.min(minB, b);
        minLuminance = Math.min(minLuminance, luminance);
        maxR = Math.max(maxR, r);
        maxG = Math.max(maxG, g);
        maxB = Math.max(maxB, b);
        maxLuminance = Math.max(maxLuminance, luminance);
    }
    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;
    const avgLuminance = totalLuminance / pixelCount;
    return {
        histogram,
        pixelCount,
        avgR, avgG, avgB, avgLuminance,
        minR, minG, minB, minLuminance,
        maxR, maxG, maxB, maxLuminance
    };
}
function findBlackPoint(histogram, clipAmount, enhanceShadows) {
    let count = 0;
    let blackPoint = 0;
    for (let i = 0; i < 256; i++) {
        count += histogram[i];
        if (count > clipAmount) {
            blackPoint = i;
            break;
        }
    }
    if (enhanceShadows) {
        blackPoint = Math.max(0, blackPoint - 5);
    }
    return blackPoint;
}
function findWhitePoint(histogram, clipAmount, enhanceHighlights) {
    let count = 0;
    let whitePoint = 255;
    for (let i = 255; i >= 0; i--) {
        count += histogram[i];
        if (count > clipAmount) {
            whitePoint = i;
            break;
        }
    }
    if (enhanceHighlights) {
        whitePoint = Math.min(255, whitePoint + 5);
    }
    return whitePoint;
}
function mapTone(value, blackPoint, whitePoint) {
    if (whitePoint <= blackPoint) {
        whitePoint = blackPoint + 1;
    }
    return 255 * (value - blackPoint) / (whitePoint - blackPoint);
}
function lerp(a, b, t) {
    return a + (b - a) * Math.max(0, Math.min(1, t));
}
Q.Image.prototype.AutoTone = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoTone' }));
};
Q.Image.prototype.AutoContrast = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoContrast' }));
};
Q.Image.prototype.AutoBrightness = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoBrightness' }));
};
Q.Image.prototype.AutoColor = function(options = {}) {
    return this.AutoAdjust(Object.assign({}, options, { mode: 'autoColor' }));
};
Q.Image.prototype.Blur = function (options = {}) {
  const DEFAULTS = {
    type: 'gaussian',
    radius: 5,
    quality: 1,
    direction: 0,
    distance: 10,
    focalDistance: 0.5,
    shape: 'circle',
    blades: 6,
    bladeCurvature: 0,
    rotation: 0,
    specularHighlights: 0,
    noise: 0
  };
  const settings = Object.assign({}, DEFAULTS, options);
  settings.radius = Math.max(1, Math.floor(settings.radius));
  settings.quality = Math.max(1, Math.round(settings.quality));
  settings.distance = Math.max(1, Math.round(settings.distance));
  settings.blades = Math.min(8, Math.max(5, Math.floor(settings.blades)));
  settings.bladeCurvature = clamp01(settings.bladeCurvature);
  settings.focalDistance = clamp01(settings.focalDistance);
  settings.specularHighlights = clamp01(settings.specularHighlights);
  settings.noise = clamp01(settings.noise);
  const ctx = this.node.getContext('2d', { willReadFrequently: true });
  const { width, height } = this.node;
  const imageData = ctx.getImageData(0, 0, width, height);
  const srcPixels = imageData.data;
  const dstPixels = new Uint8ClampedArray(srcPixels);
  const { kernel, size } = buildKernel(settings);
  for (let i = 0; i < settings.quality; i++) {
    convolve(srcPixels, dstPixels, width, height, kernel, size);
    srcPixels.set(dstPixels);
  }
  imageData.data.set(dstPixels);
  ctx.putImageData(imageData, 0, 0);
  this.saveToHistory();
  return this;
};
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function buildKernel(s) {
  switch (s.type.toLowerCase()) {
    case 'box':
      return createBoxKernel(s.radius);
    case 'motion':
      return createMotionKernel(s.radius, s.distance, s.direction);
    case 'lens':
      return createLensKernel(s);
    case 'gaussian':
    default:
      return createGaussianKernel(s.radius);
  }
}
function createGaussianKernel(radius) {
  radius = Math.max(0, Math.floor(radius));
  const size = 2 * radius + 1;
  if (size < 1 || !Number.isInteger(size)) {
    console.warn("Gaussian kernel: Invalid size derived from radius, using fallback 1x1 kernel.");
    return { kernel: new Float32Array([1]), size: 1 };
  }
  if (radius === 0) {
    return { kernel: new Float32Array([1]), size: 1 };
  }
  const kernel = new Float32Array(size * size);
  const sigma = radius / 3; 
  const twoSigmaSquare = 2 * sigma * sigma;
  let sum = 0;
  const center = radius; 
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const weight = Math.exp(-(dx * dx + dy * dy) / twoSigmaSquare);
      kernel[y * size + x] = weight;
      sum += weight;
    }
  }
  if (sum <= 0 || !isFinite(sum)) {
    console.warn("Gaussian kernel: Sum is zero or non-finite (" + sum + "), using fallback 1x1 kernel.");
    kernel.fill(0);
    const centerIndex = center * size + center;
    if (centerIndex >= 0 && centerIndex < kernel.length) {
      kernel[centerIndex] = 1;
    } else {
      return { kernel: new Float32Array([1]), size: 1 };
    }
    sum = 1; 
  } else {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= sum;
      if (!isFinite(kernel[i])) {
        console.warn("Gaussian kernel: Non-finite value after normalization, resetting to fallback 1x1 kernel.");
        kernel.fill(0);
        kernel[center * size + center] = 1; 
        break; 
      }
    }
  }
  return { kernel, size };
}
function createBoxKernel(radius) {
  const size = 2 * radius + 1;
  const kernel = new Float32Array(size * size).fill(1 / (size * size));
  return { kernel, size };
}
function createMotionKernel(radius, distance, direction) {
  const size = 2 * distance + 1;
  const kernel = new Float32Array(size * size).fill(0);
  const half = Math.floor(size / 2);
  const angle = direction * Math.PI / 180; 
  let totalWeight = 0;
  for (let t = -half; t <= half; t++) {
    const x = Math.round(Math.cos(angle) * t) + half;
    const y = Math.round(Math.sin(angle) * t) + half;
    if (x >= 0 && x < size && y >= 0 && y < size) {
      let weight = 1;
      if (radius > 1) {
        const dist = Math.abs(t) / half;
        weight = Math.exp(-dist * dist / (2 * (radius / distance) * (radius / distance)));
      }
      kernel[y * size + x] = weight;
      totalWeight += weight;
    }
  }
  if (totalWeight > 0) {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= totalWeight;
    }
  }
  return { kernel, size };
}
function createLensKernel({ radius, shape, blades, bladeCurvature, rotation, focalDistance, specularHighlights, noise }) {
  const size = 2 * radius + 1;
  const kernel = new Float32Array(size * size).fill(0);
  const half = radius;
  const rotationRad = rotation * Math.PI / 180; 
  const focalFactor = 1 - focalDistance;
  let totalWeight = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - half;
      const dy = y - half;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= radius) {
        const angle = Math.atan2(dy, dx) + rotationRad;
        let weight = 0;
        switch (shape) {
          case 'hexagon':
          case 'pentagon':
          case 'octagon':
            const bladeAngle = 2 * Math.PI / blades;
            const normalizedAngle = (angle % bladeAngle) / bladeAngle - 0.5;
            const bladeDistance = radius * (1 - bladeCurvature * Math.abs(normalizedAngle));
            weight = distance <= bladeDistance ? 1 : 0;
            break;
          case 'circle':
          default:
            weight = 1;
            const normalizedDist = distance / radius;
            if (normalizedDist > focalFactor) {
              weight *= Math.max(0, 1 - (normalizedDist - focalFactor) / (1 - focalFactor));
            }
            break;
        }
        if (specularHighlights > 0) {
          const highlightFactor = Math.max(0, 1 - distance / radius);
          weight *= 1 + specularHighlights * highlightFactor * 2;
        }
        if (noise > 0) {
          weight *= 1 + (Math.random() - 0.5) * noise;
        }
        kernel[y * size + x] = Math.max(0, weight);
        totalWeight += kernel[y * size + x];
      }
    }
  }
  if (totalWeight > 0) {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= totalWeight;
    }
  }
  return { kernel, size };
}
function convolve(src, dst, width, height, kernel, size) {
  const half = Math.floor(size / 2);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      const dstOff = (y * width + x) * 4;
      let weightSum = 0;
      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          const ny = y + ky - half;
          const nx = x + kx - half;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const srcOff = (ny * width + nx) * 4;
            const weight = kernel[ky * size + kx];
            if (isFinite(weight)) {
              r += src[srcOff] * weight;
              g += src[srcOff + 1] * weight;
              b += src[srcOff + 2] * weight;
              a += src[srcOff + 3] * weight;
              weightSum += weight;
            }
          }
        }
      }
      if (weightSum > 0 && isFinite(weightSum)) {
        dst[dstOff] = r / weightSum;
        dst[dstOff + 1] = g / weightSum;
        dst[dstOff + 2] = b / weightSum;
        dst[dstOff + 3] = a / weightSum;
      } else {
        dst[dstOff] = src[dstOff];
        dst[dstOff + 1] = src[dstOff + 1];
        dst[dstOff + 2] = src[dstOff + 2];
        dst[dstOff + 3] = src[dstOff + 3];
      }
    }
  }
};
Q.Image.prototype.Brightness = function (value, brightOptions = {}) {
    const defaultOptions = {
        preserveAlpha: true,
        clamp: true
    };
    const finalOptions = Object.assign({}, defaultOptions, brightOptions);
    const canvas_node = this.node;
    let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
    let pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] += value;
        pixels[i + 1] += value;
        pixels[i + 2] += value;
        if (finalOptions.clamp) {
            pixels[i] = Math.min(255, Math.max(0, pixels[i]));
            pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1]));
            pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2]));
        }
    }
    canvas_node.getContext('2d').putImageData(data, 0, 0);
    this.saveToHistory();
    return this;
};
Q.Image.prototype.CRT = function (crtOptions = {}) {
    const defaultOptions = {
        noiseStrength: 10,
        strongNoiseStrength: 100,
        strongNoiseCount: 5,
        noiseMaxLength: 20000,
        redShift: 3,
        blueShift: 3,
        scanlineHeight: 1,
        scanlineMargin: 3,
        scanlineOpacity: 0.1,
        vignette: false,
        vignetteStrength: 0.5,
        scanlineBrightness: 0.5,
        rgbOffset: 0,
        curvature: true,
        curvatureAmount: 0.1,
        curvatureX: 50,
        curvatureY: 50,
        curvatureArc: 15,
        curvatureType: "convex",
        zoom: 0,
        autoFill: false,
        verticalWobble: 5,
        horizontalWobble: 2,
        wobbleSpeed: 10,
        colorBleed: 0,
        jitterChance: 0,
    };
    const finalOptions = Object.assign({}, defaultOptions, crtOptions);
    finalOptions.curvatureArc = Math.max(0, Math.min(45, finalOptions.curvatureArc));
    const curvatureAmountFromArc = finalOptions.curvatureArc / 45 * 0.3;
    let curveAmount = Math.min(finalOptions.curvatureAmount, curvatureAmountFromArc);
    if (finalOptions.curvatureType === "concave") {
        curveAmount = -curveAmount;
    }
    finalOptions._effectiveCurvatureAmount = curveAmount;
    let zoom = (typeof finalOptions.zoom === "number" ? finalOptions.zoom : 0) / 100;
    if (finalOptions.autoFill && finalOptions.curvature && finalOptions.curvatureType === "concave") {
        const maxDistSq = 1 * 1 + 1 * 1;
        const absCurve = Math.abs(curveAmount);
        const distortion = 1 + maxDistSq * absCurve;
        zoom = Math.max(zoom, distortion - 1);
    }
    const canvas_node = this.node;
    this.saveToHistory();
    let temp = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let ctx = temp.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(canvas_node, 0, 0);
    const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
    const data = imageData.data;
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function CRTRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const noiseStrength = finalOptions.noiseStrength;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * noiseStrength;
        data[i] = clamp(data[i] + noise, 0, 255);
        data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
        data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
    }
    const strongNoiseStrength = finalOptions.strongNoiseStrength;
    const strongNoiseCount = finalOptions.strongNoiseCount;
    const noiseMaxLength = finalOptions.noiseMaxLength;
    for (let i0 = 0; i0 < strongNoiseCount; i0++) {
        const startPos = CRTRandomBetween(
            CRTRandomBetween(0, data.length - noiseMaxLength),
            data.length - noiseMaxLength
        );
        const endPos = startPos + CRTRandomBetween(0, noiseMaxLength);
        for (let i = startPos; i < endPos; i += 4) {
            if (i + 2 < data.length) {
                const noise = (Math.random() - 0.4) * strongNoiseStrength;
                data[i] = clamp(data[i] + noise, 0, 255);
                data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
                data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
            }
        }
    }
    let wobbleCanvas = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let wobbleCtx = wobbleCanvas.getContext('2d', { willReadFrequently: true });
    const tempData = new Uint8ClampedArray(data);
    const redShift = finalOptions.redShift;
    const blueShift = finalOptions.blueShift;
    const rgbOffset = finalOptions.rgbOffset;
    if (finalOptions.colorBleed > 0) {
        const bleed = Math.floor(finalOptions.colorBleed);
        for (let y = 0; y < temp.height; y++) {
            for (let x = 0; x < temp.width; x++) {
                const currentIndex = (y * temp.width + x) * 4;
                if (x + bleed < temp.width) {
                    const bleedIndex = (y * temp.width + (x + bleed)) * 4;
                    data[bleedIndex] = Math.max(data[bleedIndex], data[currentIndex] * 0.7);
                }
                if (y > bleed) {
                    const bleedIndex = ((y - bleed) * temp.width + x) * 4 + 2;
                    data[bleedIndex] = Math.max(data[bleedIndex], data[currentIndex + 2] * 0.7);
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    wobbleCtx.drawImage(temp, 0, 0);
    const resultCtx = canvas_node.getContext('2d', { willReadFrequently: true });
    resultCtx.clearRect(0, 0, canvas_node.width, canvas_node.height);
    let applyScanlines = !finalOptions.subpixelEmulation || !finalOptions.applyScanlineAfterSubpixel;
    if (finalOptions.jitterChance > 0 && Math.random() * 100 < finalOptions.jitterChance) {
        const jumpOffset = CRTRandomBetween(5, 20);
        resultCtx.drawImage(wobbleCanvas, 0, jumpOffset, canvas_node.width, canvas_node.height - jumpOffset);
        resultCtx.drawImage(wobbleCanvas, 0, 0, canvas_node.width, jumpOffset, 0, canvas_node.height - jumpOffset, canvas_node.width, jumpOffset);
    } else {
        const vWobbleAmp = finalOptions.verticalWobble;
        const hWobbleAmp = finalOptions.horizontalWobble;
        const wobbleSpeed = finalOptions.wobbleSpeed / 10;
        const timePhase = Date.now() / 1000 * wobbleSpeed;
        if (finalOptions.curvature) {
            const curveAmount = finalOptions._effectiveCurvatureAmount;
            const centerX = Math.round((finalOptions.curvatureX / 100) * canvas_node.width);
            const centerY = Math.round((finalOptions.curvatureY / 100) * canvas_node.height);
            for (let y = 0; y < canvas_node.height; y++) {
                const ny = ((y - centerY) / canvas_node.height) * 2;
                const vWobble = vWobbleAmp * Math.sin(y / 30 + timePhase);
                for (let x = 0; x < canvas_node.width; x++) {
                    const nx = ((x - centerX) / canvas_node.width) * 2;
                    let zx = nx / (1 + zoom);
                    let zy = ny / (1 + zoom);
                    const hWobble = hWobbleAmp * Math.sin(x / 20 + timePhase * 0.7);
                    const distSq = zx * zx + zy * zy;
                    const distortion = 1 + distSq * curveAmount;
                    const srcX = Math.round(centerX + (zx / distortion) * (canvas_node.width / 2) + hWobble);
                    const srcY = Math.round(centerY + (zy / distortion) * (canvas_node.height / 2) + vWobble);
                    if (srcX >= 0 && srcX < canvas_node.width && srcY >= 0 && srcY < canvas_node.height) {
                        if (rgbOffset > 0) {
                            const rOffset = Math.min(canvas_node.width - 1, srcX + Math.floor(rgbOffset));
                            const gOffset = srcX;
                            const bOffset = Math.max(0, srcX - Math.floor(rgbOffset));
                            const rData = wobbleCtx.getImageData(rOffset, srcY, 1, 1).data;
                            const gData = wobbleCtx.getImageData(gOffset, srcY, 1, 1).data;
                            const bData = wobbleCtx.getImageData(bOffset, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgb(${rData[0]}, ${gData[1]}, ${bData[2]})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        } else {
                            const pixelData = wobbleCtx.getImageData(srcX, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
        } else {
            for (let y = 0; y < canvas_node.height; y++) {
                const vWobble = vWobbleAmp * Math.sin(y / 30 + timePhase);
                for (let x = 0; x < canvas_node.width; x++) {
                    const hWobble = hWobbleAmp * Math.sin(x / 20 + timePhase * 0.7);
                    const srcX = Math.round(x + hWobble);
                    const srcY = Math.round(y + vWobble);
                    if (srcX >= 0 && srcX < canvas_node.width && srcY >= 0 && srcY < canvas_node.height) {
                        if (rgbOffset > 0) {
                            const rOffset = Math.min(canvas_node.width - 1, srcX + Math.floor(rgbOffset));
                            const gOffset = srcX;
                            const bOffset = Math.max(0, srcX - Math.floor(rgbOffset));
                            const rData = wobbleCtx.getImageData(rOffset, srcY, 1, 1).data;
                            const gData = wobbleCtx.getImageData(gOffset, srcY, 1, 1).data;
                            const bData = wobbleCtx.getImageData(bOffset, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgb(${rData[0]}, ${gData[1]}, ${bData[2]})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        } else {
                            const pixelData = wobbleCtx.getImageData(srcX, srcY, 1, 1).data;
                            resultCtx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                            resultCtx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
        }
    }
    function drawHorizontalLines(ctx, width, height, totalHeight, margin, color, brightnessFactor) {
        ctx.fillStyle = color;
        for (let i = 0; i < totalHeight; i += (height + margin)) {
            ctx.fillRect(0, i, width, height);
            if (brightnessFactor > 0 && i + height < totalHeight) {
                const brightColor = `rgba(255, 255, 255, ${brightnessFactor * 0.1})`;
                ctx.fillStyle = brightColor;
                ctx.fillRect(0, i + height, width, margin);
                ctx.fillStyle = color;
            }
        }
    }
    if (applyScanlines) {
        drawHorizontalLines(
            resultCtx,
            canvas_node.width,
            finalOptions.scanlineHeight,
            canvas_node.height,
            finalOptions.scanlineMargin,
            `rgba(0, 0, 0, ${finalOptions.scanlineOpacity})`,
            finalOptions.scanlineBrightness
        );
    }
    if (finalOptions.subpixelEmulation && finalOptions.applyScanlineAfterSubpixel) {
        drawHorizontalLines(
            resultCtx,
            canvas_node.width,
            finalOptions.scanlineHeight,
            canvas_node.height,
            finalOptions.scanlineMargin,
            `rgba(0, 0, 0, ${finalOptions.scanlineOpacity})`,
            finalOptions.scanlineBrightness
        );
    }
    if (finalOptions.vignette) {
        const centerX = canvas_node.width / 2;
        const centerY = canvas_node.height / 2;
        const radius = Math.max(centerX, centerY);
        const gradient = resultCtx.createRadialGradient(
            centerX, centerY, radius * 0.5,
            centerX, centerY, radius * 1.5
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${finalOptions.vignetteStrength})`);
        resultCtx.fillStyle = gradient;
        resultCtx.globalCompositeOperation = 'multiply';
        resultCtx.fillRect(0, 0, canvas_node.width, canvas_node.height);
        resultCtx.globalCompositeOperation = 'source-over';
    }
    return this;
};
Q.Image.prototype.ComicEffect = function (colorSteps = 4, effectOptions = {}) {
    const defaultOptions = {
        redSteps: colorSteps,
        greenSteps: colorSteps,
        blueSteps: colorSteps,
        edgeDetection: false,
        edgeThickness: 1,
        edgeThreshold: 20,
        saturation: 1.2
    };
    const finalOptions = Object.assign({}, defaultOptions, effectOptions);
    const canvas_node = this.node;
    this.saveToHistory();
    let temp = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let ctx = temp.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(canvas_node, 0, 0);
    const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
    const pixels = imageData.data;
    const redIntervalSize = 256 / finalOptions.redSteps;
    const greenIntervalSize = 256 / finalOptions.greenSteps;
    const blueIntervalSize = 256 / finalOptions.blueSteps;
    for (let i = 0; i < pixels.length; i += 4) {
        if (finalOptions.saturation !== 1.0) {
            let r = pixels[i] / 255;
            let g = pixels[i + 1] / 255;
            let b = pixels[i + 2] / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            s = Math.min(1, s * finalOptions.saturation);
            if (s === 0) {
                r = g = b = l;
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            pixels[i] = Math.round(r * 255);
            pixels[i + 1] = Math.round(g * 255);
            pixels[i + 2] = Math.round(b * 255);
        }
        const redIndex = Math.floor(pixels[i] / redIntervalSize);
        const greenIndex = Math.floor(pixels[i + 1] / greenIntervalSize);
        const blueIndex = Math.floor(pixels[i + 2] / blueIntervalSize);
        pixels[i] = redIndex * redIntervalSize;
        pixels[i + 1] = greenIndex * greenIntervalSize;
        pixels[i + 2] = blueIndex * blueIntervalSize;
    }
    if (finalOptions.edgeDetection) {
        const edgeImageData = new ImageData(
            new Uint8ClampedArray(pixels),
            temp.width,
            temp.height
        );
        for (let y = finalOptions.edgeThickness; y < temp.height - finalOptions.edgeThickness; y++) {
            for (let x = finalOptions.edgeThickness; x < temp.width - finalOptions.edgeThickness; x++) {
                const pos = (y * temp.width + x) * 4;
                let edgeDetected = false;
                const leftPos = (y * temp.width + (x - finalOptions.edgeThickness)) * 4;
                const rightPos = (y * temp.width + (x + finalOptions.edgeThickness)) * 4;
                const topPos = ((y - finalOptions.edgeThickness) * temp.width + x) * 4;
                const bottomPos = ((y + finalOptions.edgeThickness) * temp.width + x) * 4;
                const diffH = Math.abs(pixels[leftPos] - pixels[rightPos]) +
                    Math.abs(pixels[leftPos + 1] - pixels[rightPos + 1]) +
                    Math.abs(pixels[leftPos + 2] - pixels[rightPos + 2]);
                const diffV = Math.abs(pixels[topPos] - pixels[bottomPos]) +
                    Math.abs(pixels[topPos + 1] - pixels[bottomPos + 1]) +
                    Math.abs(pixels[topPos + 2] - pixels[bottomPos + 2]);
                if (diffH > finalOptions.edgeThreshold || diffV > finalOptions.edgeThreshold) {
                    edgeImageData.data[pos] = 0;
                    edgeImageData.data[pos + 1] = 0;
                    edgeImageData.data[pos + 2] = 0;
                }
            }
        }
        ctx.putImageData(edgeImageData, 0, 0);
    } else {
        ctx.putImageData(imageData, 0, 0);
    }
    canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
    canvas_node.getContext('2d').drawImage(temp, 0, 0);
    return this;
};
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
Q.Image.prototype.Contrast = function (value, contrastOptions = {}) {
    const defaultOptions = {
        preserveHue: true,
        clamp: true
    };
    const finalOptions = Object.assign({}, defaultOptions, contrastOptions);
    const canvas_node = this.node;
    let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
    let pixels = data.data;
    let factor = (259 * (value + 255)) / (255 * (259 - value));
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = factor * (pixels[i] - 128) + 128;
        pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
        pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
        if (finalOptions.clamp) {
            pixels[i] = Math.min(255, Math.max(0, pixels[i]));
            pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1]));
            pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2]));
        }
    }
    canvas_node.getContext('2d').putImageData(data, 0, 0);
    this.saveToHistory();
    return this;
};
Q.Image.prototype.Crop = function (x, y, width, height, cropOptions = {}) {
    const defaultOptions = {
        preserveContext: true
    };
    this.saveToHistory();
    const finalOptions = Object.assign({}, defaultOptions, cropOptions);
    const canvas_node = this.node;
    let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
    let tempCtx = temp.getContext('2d');
    if (finalOptions.preserveContext) {
        const ctx = canvas_node.getContext('2d');
        tempCtx.globalAlpha = ctx.globalAlpha;
        tempCtx.globalCompositeOperation = ctx.globalCompositeOperation;
    }
    tempCtx.drawImage(canvas_node, x, y, width, height, 0, 0, width, height);
    canvas_node.width = width;
    canvas_node.height = height;
    canvas_node.getContext('2d').drawImage(temp, 0, 0);
    return this;
};
Q.Image.prototype.Flip = function(direction = 'horizontal', flipOptions = {}) {
        const defaultOptions = {
            smoothing: true,    // Whether to use smoothing
            quality: 'high'     // Smoothing quality: 'low', 'medium', 'high'
        };
        const finalOptions = Object.assign({}, defaultOptions, flipOptions);
        const canvas_node = this.node;
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        let ctx = temp.getContext('2d');
        this.saveToHistory(); // Save the current state to history
        ctx.imageSmoothingEnabled = finalOptions.smoothing;
        ctx.imageSmoothingQuality = finalOptions.quality;
        if (direction === 'horizontal') {
            ctx.translate(canvas_node.width, 0);
            ctx.scale(-1, 1);
        } else if (direction === 'vertical') {
            ctx.translate(0, canvas_node.height);
            ctx.scale(1, -1);
        } else if (direction === 'both') {
            ctx.translate(canvas_node.width, canvas_node.height);
            ctx.scale(-1, -1);
        }
        ctx.drawImage(canvas_node, 0, 0);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        return this;
    };
Q.Image.prototype.Glitch = function (options = {}) {
    const defaults = {
        minDistance: 10,
        maxDistance: 80,
        type: "datamosh",
        angle: 0,
        counts: 12,
        minWidth: 10,
        maxWidth: 80,
        minHeight: 2,
        maxHeight: 30,
        corruptedBlockSize: 16,
        corruptedIntensity: 0.3,
        corruptedChannelShift: 8,
        macroblockBlockSize: 32,
        macroblockIntensity: 0.5,
        macroblockBlend: 0.3,
        macroblockShift: 24,
        macroblockNoise: 0.1,
        pixelsortAxis: "vertical",
        pixelsortSortBy: "brightness",
        pixelsortStrength: 1,
        pixelsortRandom: 0,
        pixelsortEdge: false,
        pixelsortEdgeThreshold: 0.2,
        pixelsortMass: false,
        pixelsortEdgeInside: true,
        waveAmplitude: 24,
        waveFrequency: 2,
        wavePhase: 0,
        waveDirection: "horizontal"
    };
    const opts = Object.assign({}, defaults, options);
    const canvas = this.node;
    const w = canvas.width, h = canvas.height;
    if (w === 0 || h === 0) return this;
    this.saveToHistory();
    const angleRad = opts.angle * Math.PI / 180;
    const diag = Math.ceil(Math.sqrt(w * w + h * h));
    const temp1 = document.createElement('canvas');
    temp1.width = diag;
    temp1.height = diag;
    const ctx1 = temp1.getContext('2d', { willReadFrequently: true });
    ctx1.save();
    ctx1.translate(diag / 2, diag / 2);
    ctx1.rotate(angleRad);
    ctx1.drawImage(canvas, -w / 2, -h / 2);
    ctx1.restore();
    {
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        for (let y = 0; y < diag; y++) {
            for (let x = 0; x < diag; x++) {
                let cx = x - diag / 2;
                let cy = y - diag / 2;
                let rx = Math.cos(-angleRad) * cx - Math.sin(-angleRad) * cy + w / 2;
                let ry = Math.sin(-angleRad) * cx + Math.cos(-angleRad) * cy + h / 2;
                if (rx < 0 || rx >= w || ry < 0 || ry >= h) {
                    const idx = (y * diag + x) * 4;
                    data[idx + 3] = 0;
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    }
    if (opts.type === "datamosh") {
        for (let i = 0; i < opts.counts; i++) {
            const gw = Math.floor(Math.random() * (opts.maxWidth - opts.minWidth + 1)) + opts.minWidth;
            const gh = Math.floor(Math.random() * (opts.maxHeight - opts.minHeight + 1)) + opts.minHeight;
            const gx = Math.floor(Math.random() * (diag - gw));
            const gy = Math.floor(Math.random() * (diag - gh));
            let distance = Math.floor(Math.random() * (opts.maxDistance - opts.minDistance + 1)) + opts.minDistance;
            if (Math.random() < 0.5) distance *= -1;
            let nx = gx + distance;
            if (nx < 0) nx = 0;
            if (nx + gw > diag) nx = diag - gw;
            const imageData = ctx1.getImageData(gx, gy, gw, gh);
            ctx1.putImageData(imageData, nx, gy);
        }
    } else if (opts.type === "corrupted") {
        const blockSize = opts.corruptedBlockSize;
        const intensity = opts.corruptedIntensity;
        const channelShift = opts.corruptedChannelShift;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        for (let i = 0; i < opts.counts; i++) {
            const bx = Math.floor(Math.random() * (diag - blockSize));
            const by = Math.floor(Math.random() * (diag - blockSize));
            for (let y = 0; y < blockSize; y++) {
                for (let x = 0; x < blockSize; x++) {
                    const px = bx + x;
                    const py = by + y;
                    const idx = (py * diag + px) * 4;
                    if (Math.random() < intensity) {
                        const rx = bx + Math.floor(Math.random() * blockSize);
                        const ry = by + Math.floor(Math.random() * blockSize);
                        const ridx = (ry * diag + rx) * 4;
                        for (let c = 0; c < 4; c++) {
                            const tmp = data[idx + c];
                            data[idx + c] = data[ridx + c];
                            data[ridx + c] = tmp;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < opts.counts; i++) {
            const bx = Math.floor(Math.random() * (diag - blockSize));
            const by = Math.floor(Math.random() * (diag - blockSize));
            const shiftR = Math.floor((Math.random() - 0.5) * 2 * channelShift);
            const shiftG = Math.floor((Math.random() - 0.5) * 2 * channelShift);
            const shiftB = Math.floor((Math.random() - 0.5) * 2 * channelShift);
            for (let y = 0; y < blockSize; y++) {
                for (let x = 0; x < blockSize; x++) {
                    const px = bx + x;
                    const py = by + y;
                    const idx = (py * diag + px) * 4;
                    let rIdx = ((py) * diag + Math.min(diag - 1, Math.max(0, px + shiftR))) * 4;
                    let gIdx = ((py) * diag + Math.min(diag - 1, Math.max(0, px + shiftG))) * 4;
                    let bIdx = ((py) * diag + Math.min(diag - 1, Math.max(0, px + shiftB))) * 4;
                    data[idx] = data[rIdx];
                    data[idx + 1] = data[gIdx + 1];
                    data[idx + 2] = data[bIdx + 2];
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    } else if (opts.type === "macroblock") {
        const blockSize = opts.macroblockBlockSize;
        const intensity = opts.macroblockIntensity;
        const blend = opts.macroblockBlend;
        const shift = opts.macroblockShift;
        const noise = opts.macroblockNoise;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        for (let by = 0; by < diag; by += blockSize) {
            for (let bx = 0; bx < diag; bx += blockSize) {
                if (Math.random() < intensity) {
                    let sx = bx + Math.floor((Math.random() - 0.5) * 2 * shift);
                    let sy = by + Math.floor((Math.random() - 0.5) * 2 * shift);
                    sx = Math.max(0, Math.min(diag - blockSize, sx));
                    sy = Math.max(0, Math.min(diag - blockSize, sy));
                    for (let y = 0; y < blockSize; y++) {
                        for (let x = 0; x < blockSize; x++) {
                            const dstX = bx + x;
                            const dstY = by + y;
                            const srcX = sx + x;
                            const srcY = sy + y;
                            if (dstX < diag && dstY < diag && srcX < diag && srcY < diag) {
                                const dstIdx = (dstY * diag + dstX) * 4;
                                const srcIdx = (srcY * diag + srcX) * 4;
                                for (let c = 0; c < 3; c++) {
                                    data[dstIdx + c] = Math.round(
                                        data[srcIdx + c] * blend + data[dstIdx + c] * (1 - blend)
                                    );
                                }
                                if (noise > 0) {
                                    for (let c = 0; c < 3; c++) {
                                        data[dstIdx + c] = Math.min(255, Math.max(0, data[dstIdx + c] + (Math.random() - 0.5) * 255 * noise));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    } else if (opts.type === "pixelsort") {
        const axis = opts.pixelsortAxis;
        const sortBy = opts.pixelsortSortBy;
        const strength = Math.max(0, Math.min(1, opts.pixelsortStrength));
        const randomness = Math.max(0, Math.min(1, opts.pixelsortRandom));
        const edgeEnabled = !!opts.pixelsortEdge;
        const edgeThreshold = Math.max(0, Math.min(1, opts.pixelsortEdgeThreshold || 0.2));
        const massMode = !!opts.pixelsortMass;
        const edgeInside = opts.pixelsortEdgeInside !== undefined ? !!opts.pixelsortEdgeInside : true;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        function getSortValue(r, g, b) {
            if (sortBy === "brightness") {
                return 0.299 * r + 0.587 * g + 0.114 * b;
            } else if (sortBy === "intensity") {
                return (r + g + b) / 3;
            } else if (sortBy === "hue") {
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h = 0;
                if (max === min) h = 0;
                else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
                else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
                else if (max === b) h = (60 * ((r - g) / (max - min)) + 240) % 360;
                return h;
            }
            return 0;
        }
        let edgeMap = null;
        if (edgeEnabled) {
            edgeMap = new Float32Array(diag * diag);
            const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
            const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
            for (let y = 1; y < diag - 1; y++) {
                for (let x = 1; x < diag - 1; x++) {
                    let sx = 0, sy = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * diag + (x + kx)) * 4;
                            let v;
                            if (sortBy === "brightness") {
                                v = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                            } else if (sortBy === "intensity") {
                                v = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                            } else if (sortBy === "hue") {
                                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                                let h = 0;
                                if (max === min) h = 0;
                                else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
                                else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
                                else if (max === b) h = (60 * ((r - g) / (max - min)) + 240) % 360;
                                v = h;
                            } else {
                                v = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                            }
                            const kIdx = (ky + 1) * 3 + (kx + 1);
                            sx += gx[kIdx] * v;
                            sy += gy[kIdx] * v;
                        }
                    }
                    const mag = Math.sqrt(sx * sx + sy * sy) / 1448;
                    edgeMap[y * diag + x] = mag;
                }
            }
        }
        function getEdgeMask(lineIdx, axis) {
            const mask = [];
            if (!edgeMap) return null;
            for (let i = 0; i < diag; i++) {
                let idx = axis === "vertical" ? (i * diag + lineIdx) : (lineIdx * diag + i);
                mask.push(edgeMap[idx] > edgeThreshold);
            }
            return mask;
        }
        function countEdges(lineIdx, axis) {
            if (!edgeMap) return 0;
            let count = 0;
            for (let i = 0; i < diag; i++) {
                let idx = axis === "vertical" ? (i * diag + lineIdx) : (lineIdx * diag + i);
                if (edgeMap[idx] > edgeThreshold) count++;
            }
            return count;
        }
        let massLine = -1;
        if (edgeEnabled && massMode) {
            let maxCount = -1;
            for (let i = 0; i < diag; i++) {
                const cnt = countEdges(i, axis);
                if (cnt > maxCount) {
                    maxCount = cnt;
                    massLine = i;
                }
            }
        }
        if (axis === "vertical") {
            for (let x = 0; x < diag; x++) {
                if (Math.random() > strength) continue;
                if (massMode && x !== massLine) continue;
                let pixels = [];
                let mask = edgeEnabled ? getEdgeMask(x, "vertical") : null;
                for (let y = 0; y < diag; y++) {
                    const idx = (y * diag + x) * 4;
                    pixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        a: data[idx + 3],
                        sort: getSortValue(data[idx], data[idx + 1], data[idx + 2]) + (Math.random() - 0.5) * 255 * randomness,
                        edge: mask ? mask[y] : false
                    });
                }
                if (edgeEnabled) {
                    let first = pixels.findIndex(p => p.edge);
                    let last = -1;
                    for (let i = diag - 1; i >= 0; i--) {
                        if (pixels[i].edge) { last = i; break; }
                    }
                    if (first !== -1 && last !== -1 && last > first) {
                        if (edgeInside) {
                            let segment = pixels.slice(first, last + 1);
                            segment.sort((a, b) => a.sort - b.sort);
                            for (let i = first; i <= last; i++) {
                                pixels[i] = segment[i - first];
                            }
                        } else {
                            if (first > 0) {
                                let segment = pixels.slice(0, first);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = 0; i < first; i++) {
                                    pixels[i] = segment[i];
                                }
                            }
                            if (last < diag - 1) {
                                let segment = pixels.slice(last + 1);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = last + 1; i < diag; i++) {
                                    pixels[i] = segment[i - (last + 1)];
                                }
                            }
                        }
                    }
                } else {
                    pixels.sort((a, b) => a.sort - b.sort);
                }
                for (let y = 0; y < diag; y++) {
                    let cx = x - diag / 2;
                    let cy = y - diag / 2;
                    let rx = Math.cos(-angleRad) * cx - Math.sin(-angleRad) * cy + w / 2;
                    let ry = Math.sin(-angleRad) * cx + Math.cos(-angleRad) * cy + h / 2;
                    if (rx >= 0 && rx < w && ry >= 0 && ry < h) {
                        const idx = (y * diag + x) * 4;
                        data[idx] = pixels[y].r;
                        data[idx + 1] = pixels[y].g;
                        data[idx + 2] = pixels[y].b;
                        data[idx + 3] = pixels[y].a;
                    }
                }
            }
        } else {
            for (let y = 0; y < diag; y++) {
                if (Math.random() > strength) continue;
                if (massMode && y !== massLine) continue;
                let pixels = [];
                let mask = edgeEnabled ? getEdgeMask(y, "horizontal") : null;
                for (let x = 0; x < diag; x++) {
                    const idx = (y * diag + x) * 4;
                    pixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        a: data[idx + 3],
                        sort: getSortValue(data[idx], data[idx + 1], data[idx + 2]) + (Math.random() - 0.5) * 255 * randomness,
                        edge: mask ? mask[x] : false
                    });
                }
                if (edgeEnabled) {
                    let first = pixels.findIndex(p => p.edge);
                    let last = -1;
                    for (let i = diag - 1; i >= 0; i--) {
                        if (pixels[i].edge) { last = i; break; }
                    }
                    if (first !== -1 && last !== -1 && last > first) {
                        if (edgeInside) {
                            let segment = pixels.slice(first, last + 1);
                            segment.sort((a, b) => a.sort - b.sort);
                            for (let i = first; i <= last; i++) {
                                pixels[i] = segment[i - first];
                            }
                        } else {
                            if (first > 0) {
                                let segment = pixels.slice(0, first);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = 0; i < first; i++) {
                                    pixels[i] = segment[i];
                                }
                            }
                            if (last < diag - 1) {
                                let segment = pixels.slice(last + 1);
                                segment.sort((a, b) => a.sort - b.sort);
                                for (let i = last + 1; i < diag; i++) {
                                    pixels[i] = segment[i - (last + 1)];
                                }
                            }
                        }
                    }
                } else {
                    pixels.sort((a, b) => a.sort - b.sort);
                }
                for (let x = 0; x < diag; x++) {
                    let cx = x - diag / 2;
                    let cy = y - diag / 2;
                    let rx = Math.cos(-angleRad) * cx - Math.sin(-angleRad) * cy + w / 2;
                    let ry = Math.sin(-angleRad) * cx + Math.cos(-angleRad) * cy + h / 2;
                    if (rx >= 0 && rx < w && ry >= 0 && ry < h) {
                        const idx = (y * diag + x) * 4;
                        data[idx] = pixels[x].r;
                        data[idx + 1] = pixels[x].g;
                        data[idx + 2] = pixels[x].b;
                        data[idx + 3] = pixels[x].a;
                    }
                }
            }
        }
        ctx1.putImageData(imgData, 0, 0);
    } else if (opts.type === "wave") {
        const amplitude = opts.waveAmplitude;
        const frequency = opts.waveFrequency;
        const phase = opts.wavePhase;
        const direction = opts.waveDirection;
        const imgData = ctx1.getImageData(0, 0, diag, diag);
        const data = imgData.data;
        const out = ctx1.createImageData(diag, diag);
        const outData = out.data;
        if (direction === "horizontal") {
            for (let y = 0; y < diag; y++) {
                const shift = Math.round(
                    Math.sin(2 * Math.PI * frequency * y / diag + phase) * amplitude
                );
                for (let x = 0; x < diag; x++) {
                    let sx = x + shift;
                    if (sx < 0 || sx >= diag) continue;
                    const srcIdx = (y * diag + sx) * 4;
                    const dstIdx = (y * diag + x) * 4;
                    outData[dstIdx] = data[srcIdx];
                    outData[dstIdx + 1] = data[srcIdx + 1];
                    outData[dstIdx + 2] = data[srcIdx + 2];
                    outData[dstIdx + 3] = data[srcIdx + 3];
                }
            }
        } else {
            for (let x = 0; x < diag; x++) {
                const shift = Math.round(
                    Math.sin(2 * Math.PI * frequency * x / diag + phase) * amplitude
                );
                for (let y = 0; y < diag; y++) {
                    let sy = y + shift;
                    if (sy < 0 || sy >= diag) continue;
                    const srcIdx = (sy * diag + x) * 4;
                    const dstIdx = (y * diag + x) * 4;
                    outData[dstIdx] = data[srcIdx];
                    outData[dstIdx + 1] = data[srcIdx + 1];
                    outData[dstIdx + 2] = data[srcIdx + 2];
                    outData[dstIdx + 3] = data[srcIdx + 3];
                }
            }
        }
        ctx1.putImageData(out, 0, 0);
    }
    const temp2 = document.createElement('canvas');
    temp2.width = w;
    temp2.height = h;
    const ctx2 = temp2.getContext('2d', { willReadFrequently: true });
    ctx2.save();
    ctx2.clearRect(0, 0, w, h);
    ctx2.translate(w / 2, h / 2);
    ctx2.rotate(-angleRad);
    ctx2.drawImage(temp1, -diag / 2, -diag / 2);
    ctx2.restore();
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(temp2, 0, 0);
    return this;
};
Q.Image.prototype.Glow = function (glowOptions = {}) {
    const defaultOptions = {
        illuminanceThreshold: 200,
        blurRadius: 10,
        intensity: 1.0,
        color: null,
        blendMode: 'lighter'
    };
    const finalOptions = Object.assign({}, defaultOptions, glowOptions);
    const w = this.node.width, h = this.node.height;
    if (w === 0 || h === 0) return this;
    this.saveToHistory();
    const src = document.createElement('canvas');
    src.width = w; src.height = h;
    const srcCtx = src.getContext('2d');
    srcCtx.drawImage(this.node, 0, 0);
    const thr = document.createElement('canvas');
    thr.width = w; thr.height = h;
    const thrCtx = thr.getContext('2d');
    const img = srcCtx.getImageData(0, 0, w, h);
    const data = img.data;
    let tint = null;
    if (finalOptions.color) {
        const tmp = document.createElement('canvas');
        tmp.width = tmp.height = 1;
        const tctx = tmp.getContext('2d');
        tctx.fillStyle = finalOptions.color;
        tctx.fillRect(0, 0, 1, 1);
        const pd = tctx.getImageData(0, 0, 1, 1).data;
        tint = { r: pd[0], g: pd[1], b: pd[2] };
    }
    for (let i = 0; i < data.length; i += 4) {
        const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (lum <= finalOptions.illuminanceThreshold) {
            data[i + 3] = 0;
        } else if (tint) {
            data[i] = tint.r;
            data[i + 1] = tint.g;
            data[i + 2] = tint.b;
        }
    }
    thrCtx.putImageData(img, 0, 0);
    const glow = document.createElement('canvas');
    glow.width = w; glow.height = h;
    const gctx = glow.getContext('2d');
    gctx.filter = `blur(${finalOptions.blurRadius}px)`;
    gctx.globalAlpha = finalOptions.intensity;
    gctx.drawImage(thr, 0, 0);
    const dst = this.node.getContext('2d');
    dst.drawImage(src, 0, 0);
    dst.globalCompositeOperation = finalOptions.blendMode;
    dst.drawImage(glow, 0, 0);
    dst.globalCompositeOperation = 'source-over';
    return this;
};
Q.Image.prototype.GodRay = function (rayOptions = {}) {
    const defaultOptions = {
        centerX: 50,
        centerY: 50,
        threshold: 200,
        length: 50,
        samples: 20,
        strength: 1.0,
        decay: 0.95,
        exposure: 0.3,
        angle: null,
        tintColor: null,
        blendMode: 'screen',
        fadeOut: 0.1,
        fadeOutType: 'ease'
    };
    this.saveToHistory();
    const finalOptions = Object.assign({}, defaultOptions, rayOptions);
    const canvas_node = this.node;
    const centerX = (finalOptions.centerX / 100) * canvas_node.width;
    const centerY = (finalOptions.centerY / 100) * canvas_node.height;
    const samples = Math.max(5, Math.min(50, finalOptions.samples));
    const length = Math.max(1, Math.min(100, finalOptions.length)) / 100;
    const maxScale = 1 + length;
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = canvas_node.width;
    sourceCanvas.height = canvas_node.height;
    const sourceCtx = sourceCanvas.getContext('2d');
    sourceCtx.drawImage(canvas_node, 0, 0);
    const brightCanvas = document.createElement('canvas');
    brightCanvas.width = canvas_node.width;
    brightCanvas.height = canvas_node.height;
    const brightCtx = brightCanvas.getContext('2d');
    const imageData = sourceCtx.getImageData(0, 0, canvas_node.width, canvas_node.height);
    const brightData = brightCtx.createImageData(canvas_node.width, canvas_node.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = Math.max(r, g, b);
        if (brightness >= finalOptions.threshold) {
            const factor = finalOptions.exposure * (brightness - finalOptions.threshold) / (255 - finalOptions.threshold);
            if (finalOptions.tintColor) {
                const color = parseColor(finalOptions.tintColor);
                brightData.data[i] = Math.min(255, r * color.r / 255 * factor);
                brightData.data[i + 1] = Math.min(255, g * color.g / 255 * factor);
                brightData.data[i + 2] = Math.min(255, b * color.b / 255 * factor);
            } else {
                brightData.data[i] = Math.min(255, r * factor);
                brightData.data[i + 1] = Math.min(255, g * factor);
                brightData.data[i + 2] = Math.min(255, b * factor);
            }
            brightData.data[i + 3] = 255;
        } else {
            brightData.data[i] = 0;
            brightData.data[i + 1] = 0;
            brightData.data[i + 2] = 0;
            brightData.data[i + 3] = 0;
        }
    }
    brightCtx.putImageData(brightData, 0, 0);
    const rayCanvas = document.createElement('canvas');
    rayCanvas.width = canvas_node.width;
    rayCanvas.height = canvas_node.height;
    const rayCtx = rayCanvas.getContext('2d');
    switch (finalOptions.blendMode) {
        case 'screen':
            rayCtx.globalCompositeOperation = 'screen';
            break;
        case 'add':
            rayCtx.globalCompositeOperation = 'lighter';
            break;
        case 'lighten':
            rayCtx.globalCompositeOperation = 'lighten';
            break;
        default:
            rayCtx.globalCompositeOperation = 'screen';
    }
    function getFade(progress) {
        if (finalOptions.fadeOutType === 'linear') {
            return Math.max(0, 1 - finalOptions.fadeOut * progress * samples);
        } else if (finalOptions.fadeOutType === 'ease') {
            return Math.max(0, 1 - finalOptions.fadeOut * Math.pow(progress, 0.5) * samples);
        }
        return Math.max(0, 1 - finalOptions.fadeOut * progress * samples);
    }
    for (let i = 0; i < samples; i++) {
        const progress = i / (samples - 1);
        const scale = 1 + progress * length;
        const fade = getFade(progress);
        const opacity = Math.pow(finalOptions.decay, i) * finalOptions.strength * fade;
        let x, y, w, h;
        if (finalOptions.angle !== null) {
            const angleDeg = parseFloat(finalOptions.angle);
            const angleRad = (angleDeg * Math.PI) / 180;
            const distance = progress * length * 50;
            x = centerX - (Math.cos(angleRad) * distance);
            y = centerY - (Math.sin(angleRad) * distance);
            w = canvas_node.width;
            h = canvas_node.height;
        } else {
            w = canvas_node.width * scale;
            h = canvas_node.height * scale;
            x = centerX - (centerX * scale);
            y = centerY - (centerY * scale);
        }
        rayCtx.globalAlpha = opacity;
        rayCtx.drawImage(brightCanvas, 0, 0, brightCanvas.width, brightCanvas.height,
            x, y, w, h);
    }
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas_node.width;
    finalCanvas.height = canvas_node.height;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.drawImage(sourceCanvas, 0, 0);
    finalCtx.globalCompositeOperation = 'screen';
    finalCtx.drawImage(rayCanvas, 0, 0);
    const ctx = canvas_node.getContext('2d');
    ctx.clearRect(0, 0, canvas_node.width, canvas_node.height);
    ctx.drawImage(finalCanvas, 0, 0);
    return this;
    function parseColor(color) {
        let r = 255, g = 255, b = 255;
        if (typeof color === 'string') {
            if (color.startsWith('#')) {
                if (color.length === 4) {
                    r = parseInt(color[1] + color[1], 16);
                    g = parseInt(color[2] + color[2], 16);
                    b = parseInt(color[3] + color[3], 16);
                } else if (color.length === 7) {
                    r = parseInt(color.substring(1, 3), 16);
                    g = parseInt(color.substring(3, 5), 16);
                    b = parseInt(color.substring(5, 7), 16);
                }
            }
            else if (color.startsWith('rgb')) {
                const parts = color.match(/\d+/g);
                if (parts && parts.length >= 3) {
                    r = parseInt(parts[0]);
                    g = parseInt(parts[1]);
                    b = parseInt(parts[2]);
                }
            }
        }
        return { r, g, b };
    }
};
Q.Image.prototype.Grayscale = function(grayOptions = {}) {
    const defaultGrayOptions = {
        algorithm: 'average', // 'average', 'luminance', 'lightness', 'desaturation', 'red', 'green', 'blue'
        intensity: 1.0,       // 0.0 to 1.0 for partial grayscale effect
        threshold: null       // optional: 0-255, if set, output is black/white
    };
    const finalOptions = Object.assign({}, defaultGrayOptions, grayOptions);
    finalOptions.intensity = Math.max(0, Math.min(1, finalOptions.intensity));
    const ctx = this.node.getContext('2d');
    this.saveToHistory(); // Save the current state to history
    let data = ctx.getImageData(0, 0, this.node.width, this.node.height);
    let pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let gray;
        switch (finalOptions.algorithm) {
            case 'luminance':
                gray = 0.299 * r + 0.587 * g + 0.114 * b;
                break;
            case 'lightness':
                gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
                break;
            case 'desaturation':
                gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
                break;
            case 'red':
                gray = r;
                break;
            case 'green':
                gray = g;
                break;
            case 'blue':
                gray = b;
                break;
            case 'average':
            default:
                gray = (r + g + b) / 3;
                break;
        }
        if (finalOptions.threshold !== null && !isNaN(finalOptions.threshold)) {
            gray = gray >= finalOptions.threshold ? 255 : 0;
        }
        if (finalOptions.intensity < 1.0) {
            pixels[i]     = Math.round(r * (1 - finalOptions.intensity) + gray * finalOptions.intensity);
            pixels[i + 1] = Math.round(g * (1 - finalOptions.intensity) + gray * finalOptions.intensity);
            pixels[i + 2] = Math.round(b * (1 - finalOptions.intensity) + gray * finalOptions.intensity);
        } else {
            pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round(gray);
        }
    }
    ctx.putImageData(data, 0, 0);
    return this;
};
Q.Image.prototype.HDR = function(hdrOptions = {}) {
        const defaultOptions = {
            shadowAdjust: 15,        // Shadow level adjustment
            brightnessAdjust: 10,    // Brightness adjustment
            contrastAdjust: 1.2,     // Contrast adjustment
            vibrance: 0.2,           // Vibrance adjustment (saturation for less saturated colors)
            highlights: -10,         // Highlight level adjustment
            clarity: 10,             // Clarity/local contrast enhancement
            tonal: true              // Apply tonal balancing
        };
        const finalOptions = Object.assign({}, defaultOptions, hdrOptions);
        const canvas_node = this.node;
        this.saveToHistory(); // Save the current state to history
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        let ctx = temp.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(canvas_node, 0, 0);
        const imageData = ctx.getImageData(0, 0, temp.width, temp.height);
        const data = imageData.data;
        let minBrightness = 255;
        let maxBrightness = 0;
        let avgBrightness = 0;
        if (finalOptions.tonal) {
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                minBrightness = Math.min(minBrightness, brightness);
                maxBrightness = Math.max(maxBrightness, brightness);
                avgBrightness += brightness;
            }
            avgBrightness /= (data.length / 4);
        }
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const shadowFactor = Math.max(0, 1 - brightness / 128);
            r += finalOptions.shadowAdjust * shadowFactor;
            g += finalOptions.shadowAdjust * shadowFactor;
            b += finalOptions.shadowAdjust * shadowFactor;
            const highlightFactor = Math.max(0, brightness / 128 - 1);
            r += finalOptions.highlights * highlightFactor;
            g += finalOptions.highlights * highlightFactor;
            b += finalOptions.highlights * highlightFactor;
            r += finalOptions.brightnessAdjust;
            g += finalOptions.brightnessAdjust;
            b += finalOptions.brightnessAdjust;
            r = (r - 128) * finalOptions.contrastAdjust + 128;
            g = (g - 128) * finalOptions.contrastAdjust + 128;
            b = (b - 128) * finalOptions.contrastAdjust + 128;
            if (finalOptions.vibrance !== 0) {
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const lightness = (max + min) / 510; // Normalize to 0-1
                if (max - min < 100) {  // Lower values = less saturated
                    const satAdjust = finalOptions.vibrance * (1 - (max - min) / 100);
                    if (max === r) {
                        g = g - satAdjust * (g - min);
                        b = b - satAdjust * (b - min);
                    } else if (max === g) {
                        r = r - satAdjust * (r - min);
                        b = b - satAdjust * (b - min);
                    } else {
                        r = r - satAdjust * (r - min);
                        g = g - satAdjust * (g - min);
                    }
                }
            }
            if (finalOptions.tonal && maxBrightness > minBrightness) {
                const normalizedBrightness = (brightness - minBrightness) / (maxBrightness - minBrightness);
                const tonalFactor = (normalizedBrightness < 0.5) ? 
                    2 * normalizedBrightness : 2 - 2 * normalizedBrightness;
                const tonalAdjust = finalOptions.clarity * tonalFactor;
                r += tonalAdjust;
                g += tonalAdjust;
                b += tonalAdjust;
            }
            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
        }
        ctx.putImageData(imageData, 0, 0);
        canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        return this;
    };
Q.Image.prototype.Hue = function (angle = 0, options = {}) {
    const defaultOptions = {
        clamp: true // Clamp RGB values to [0,255]
    };
    const finalOptions = Object.assign({}, defaultOptions, options);
    const canvas_node = this.node;
    this.saveToHistory();
    const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
    const data = imageData.data;
    const hueShift = ((angle % 360) + 360) % 360 / 360;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        h = (h + hueShift) % 1;
        if (h < 0) h += 1;
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        let rr = hue2rgb(p, q, h + 1 / 3);
        let gg = hue2rgb(p, q, h);
        let bb = hue2rgb(p, q, h - 1 / 3);
        data[i] = finalOptions.clamp ? Math.min(255, Math.max(0, Math.round(rr * 255))) : Math.round(rr * 255);
        data[i + 1] = finalOptions.clamp ? Math.min(255, Math.max(0, Math.round(gg * 255))) : Math.round(gg * 255);
        data[i + 2] = finalOptions.clamp ? Math.min(255, Math.max(0, Math.round(bb * 255))) : Math.round(bb * 255);
    }
    ctx.putImageData(imageData, 0, 0);
    return this;
};
Q.Image.prototype.LensFlare = function (flareOptions = {}) {
    const presets = {
        cinematic: {
            type: "anamorphic",
            widthModifier: 2.5,
            heightThreshold: 8,
            opacity: 0.18,
            blur: 8,
            falloff: 1.2,
            intensity: 1.1,
            blendMode: "overlay"
        },
        sciFi: {
            type: "starburst",
            points: 12,
            radius: 60,
            opacity: 0.22,
            blur: 6,
            falloff: 1.6,
            intensity: 1.3,
            blendMode: "lighter"
        },
        vintage: {
            type: "polygon",
            points: 6,
            radius: 38,
            opacity: 0.16,
            blur: 4,
            falloff: 1.0,
            intensity: 0.9,
            blendMode: "lighter"
        },
        photo: {
            type: "circular",
            radius: 32,
            opacity: 0.12,
            blur: 10,
            falloff: 1.0,
            intensity: 1.0,
            blendMode: "screen"
        },
        blockbuster: {
            type: "anamorphic",
            widthModifier: 3.5,
            heightThreshold: 12,
            opacity: 0.22,
            blur: 10,
            falloff: 1.4,
            intensity: 1.5,
            blendMode: "lighter",
            starSize: 320,
            starIntensity: 1.2,
            starPoints: 12,
            starRotation: 15,
            starOpacity: 1,
            streakOpacity: 1,
            centerOpacity: 1,
            diagOpacity: 1
        },
        dreamy: {
            type: "circular",
            radius: 80,
            opacity: 0.09,
            blur: 18,
            falloff: 0.7,
            intensity: 0.7,
            blendMode: "screen"
        },
        hardcore: {
            type: "starburst",
            points: 24,
            radius: 120,
            opacity: 0.35,
            blur: 2,
            falloff: 2.0,
            intensity: 2.0,
            blendMode: "lighter",
            starSize: 400,
            starIntensity: 2,
            starPoints: 24,
            starRotation: 0
        },
        minimal: {
            type: "polygon",
            points: 4,
            radius: 20,
            opacity: 0.08,
            blur: 2,
            falloff: 1.0,
            intensity: 0.5,
            blendMode: "overlay"
        },
        blueStreak: {
            type: "anamorphic",
            widthModifier: 4.0,
            heightThreshold: 6,
            opacity: 0.19,
            blur: 12,
            falloff: 1.1,
            intensity: 1.0,
            blendMode: "lighter",
            starColor: "#7cf",
            starSize: 220,
            starIntensity: 1.1,
            starPoints: 8,
            starRotation: 0
        },
        rainbow: {
            type: "circular",
            radius: 60,
            opacity: 0.18,
            blur: 8,
            falloff: 1.0,
            intensity: 1.2,
            blendMode: "lighter"
        },
        classic: {
            type: "starburst",
            points: 8,
            radius: 48,
            opacity: 0.18,
            blur: 4,
            falloff: 1.0,
            intensity: 1.0,
            blendMode: "lighter",
            starSize: 180,
            starIntensity: 1.0,
            starPoints: 8,
            starRotation: 0
        },
        crossStar: {
            type: "anamorphic",
            widthModifier: 1.5,
            heightThreshold: 8,
            opacity: 0.15,
            blur: 6,
            falloff: 1.0,
            intensity: 1.0,
            blendMode: "lighter",
            starSize: 300,
            starIntensity: 1.5,
            starPoints: 4,
            starRotation: 45
        }
    };
    const defaultOptions = {
        preset: null,
        type: "anamorphic",
        brightnessThreshold: 200,
        widthModifier: 1.0,
        heightThreshold: 10,
        maxFlares: 20,
        opacity: 0.2,
        flareColor: null,
        radius: 40,
        points: 6,
        rotation: 0,
        blur: 0,
        falloff: 1.0,
        intensity: 1.0,
        blendMode: "lighter",
        directionX: 100,
        directionY: 100,
        starSize: 180,
        starIntensity: 1.0,
        starColor: null,
        starPoints: 8,
        starRotation: 0,
        starOpacity: 1,
        streakOpacity: 1,
        centerOpacity: 1,
        diagOpacity: 1
    };
    let finalOptions = Object.assign({}, defaultOptions);
    if (flareOptions.preset && presets[flareOptions.preset]) {
        Object.assign(finalOptions, presets[flareOptions.preset]);
    }
    Object.assign(finalOptions, flareOptions);
    const canvas_node = this.node;
    let temp = Q('<canvas>', {
        width: canvas_node.width,
        height: canvas_node.height
    }).nodes[0];
    let ctx = temp.getContext('2d', { willReadFrequently: true });
    this.saveToHistory();
    ctx.drawImage(canvas_node, 0, 0);
    const sourceData = ctx.getImageData(0, 0, temp.width, temp.height).data;
    let flareColor = finalOptions.flareColor;
    if (!flareColor) {
        const avgColor = { r: 0, g: 0, b: 0, count: 0 };
        for (let y = 0; y < temp.height; y++) {
            for (let x = 0; x < temp.width; x++) {
                const index = (y * temp.width + x) * 4;
                const brightness = (sourceData[index] + sourceData[index + 1] + sourceData[index + 2]) / 3;
                if (brightness >= finalOptions.brightnessThreshold) {
                    avgColor.r += sourceData[index];
                    avgColor.g += sourceData[index + 1];
                    avgColor.b += sourceData[index + 2];
                    avgColor.count++;
                }
            }
        }
        if (avgColor.count > 0) {
            flareColor = [
                Math.round(avgColor.r / avgColor.count),
                Math.round(avgColor.g / avgColor.count),
                Math.round(avgColor.b / avgColor.count)
            ];
        } else {
            flareColor = [255, 255, 255];
        }
    }
    const flareColorR = flareColor[0];
    const flareColorG = flareColor[1];
    const flareColorB = flareColor[2];
    const flares = [];
    for (let y = 0; y < temp.height; y++) {
        for (let x = 0; x < temp.width; x++) {
            const index = (y * temp.width + x) * 4;
            const brightness = (sourceData[index] + sourceData[index + 1] + sourceData[index + 2]) / 3;
            if (brightness >= finalOptions.brightnessThreshold) {
                flares.push({ x, y, brightness });
            }
        }
    }
    flares.sort((a, b) => b.brightness - a.brightness);
    const targetCtx = canvas_node.getContext('2d');
    function applyBlur(ctx, blur) {
        if (blur > 0) {
            ctx.filter = `blur(${blur}px)`;
        } else {
            ctx.filter = "none";
        }
    }
    function getFinalAlpha(baseAlpha, partOpacity = 1) {
        return Math.max(0, Math.min(1, baseAlpha * finalOptions.opacity * partOpacity));
    }
    function drawAnamorphic(flare) {
        const starPoints = finalOptions.starPoints || 8;
        const starSize = finalOptions.starSize || 180;
        const starIntensity = finalOptions.starIntensity || 1.0;
        const starRotation = (finalOptions.starRotation || 0) * Math.PI / 180;
        let starColorStops = [
            { stop: 0.0, color: 'rgba(255,255,255,1)' },
            { stop: 0.5, color: 'rgba(120,180,255,0.7)' },
            { stop: 1.0, color: 'rgba(120,80,255,0.0)' }
        ];
        if (finalOptions.starColor) {
            starColorStops = [
                { stop: 0.0, color: finalOptions.starColor },
                { stop: 1.0, color: 'rgba(0,0,0,0)' }
            ];
        }
        const baseAlpha = (flare.brightness / 255) * finalOptions.intensity * starIntensity;
        const starAlpha = getFinalAlpha(baseAlpha, finalOptions.starOpacity);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        targetCtx.translate(flare.x, flare.y);
        targetCtx.rotate(starRotation);
        for (let i = 0; i < starPoints; i++) {
            const angle = (i / starPoints) * Math.PI * 2;
            targetCtx.save();
            targetCtx.rotate(angle);
            const grad = targetCtx.createLinearGradient(0, 0, 0, -starSize);
            starColorStops.forEach(cs => grad.addColorStop(cs.stop, cs.color.replace(/[\d\.]+\)$/g, starAlpha + ')')));
            targetCtx.beginPath();
            targetCtx.moveTo(-2, 0);
            targetCtx.lineTo(-1, -starSize * 0.15);
            targetCtx.lineTo(0, -starSize);
            targetCtx.lineTo(1, -starSize * 0.15);
            targetCtx.lineTo(2, 0);
            targetCtx.closePath();
            targetCtx.fillStyle = grad;
            targetCtx.shadowColor = 'rgba(120,180,255,0.5)';
            targetCtx.shadowBlur = starSize * 0.12;
            targetCtx.globalAlpha = 1.0;
            targetCtx.fill();
            targetCtx.restore();
        }
        targetCtx.restore();
        const centerRadius = Math.max(30, flare.brightness / finalOptions.brightnessThreshold * 60);
        const centerAlpha = getFinalAlpha(baseAlpha, finalOptions.centerOpacity);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 6);
        let grad = targetCtx.createRadialGradient(flare.x, flare.y, 0, flare.x, flare.y, centerRadius);
        grad.addColorStop(0, `rgba(120,180,255,${centerAlpha})`);
        grad.addColorStop(0.5, `rgba(120,180,255,${centerAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(120,180,255,0)`);
        targetCtx.beginPath();
        targetCtx.arc(flare.x, flare.y, centerRadius, 0, 2 * Math.PI);
        targetCtx.fillStyle = grad;
        targetCtx.fill();
        targetCtx.restore();
        const size = flare.brightness / finalOptions.brightnessThreshold * (400 * (finalOptions.widthModifier || 2.5));
        const height = finalOptions.heightThreshold || 8;
        const streakBaseAlpha = (flare.brightness / 255) * finalOptions.intensity * 0.7;
        const streakAlpha = getFinalAlpha(streakBaseAlpha, finalOptions.streakOpacity);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 2);
        let streakGrad = targetCtx.createLinearGradient(
            flare.x - size / 2, flare.y,
            flare.x + size / 2, flare.y
        );
        streakGrad.addColorStop(0, `rgba(120,180,255,0)`);
        streakGrad.addColorStop(0.45, `rgba(120,180,255,${streakAlpha * 0.2})`);
        streakGrad.addColorStop(0.5, `rgba(120,180,255,${streakAlpha})`);
        streakGrad.addColorStop(0.55, `rgba(120,180,255,${streakAlpha * 0.2})`);
        streakGrad.addColorStop(1, `rgba(120,180,255,0)`);
        targetCtx.beginPath();
        targetCtx.fillStyle = streakGrad;
        targetCtx.fillRect(flare.x - size / 2, flare.y - height / 2, size, height);
        targetCtx.restore();
        const vStreakAlpha = streakAlpha * 0.25 * (finalOptions.streakOpacity || 1);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 1);
        let vStreakGrad = targetCtx.createLinearGradient(
            flare.x, flare.y - size / 2,
            flare.x, flare.y + size / 2
        );
        vStreakGrad.addColorStop(0, `rgba(120,180,255,0)`);
        vStreakGrad.addColorStop(0.45, `rgba(120,180,255,${vStreakAlpha})`);
        vStreakGrad.addColorStop(0.5, `rgba(120,180,255,${vStreakAlpha * 2})`);
        vStreakGrad.addColorStop(0.55, `rgba(120,180,255,${vStreakAlpha})`);
        vStreakGrad.addColorStop(1, `rgba(120,180,255,0)`);
        targetCtx.beginPath();
        targetCtx.fillStyle = vStreakGrad;
        targetCtx.fillRect(flare.x - height / 2, flare.y - size / 2, height, size);
        targetCtx.restore();
        const streakCount = 4;
        const diagAlpha = getFinalAlpha(streakBaseAlpha * 0.12, finalOptions.diagOpacity);
        for (let i = 0; i < streakCount; i++) {
            const angle = (Math.PI / 2) * i + Math.PI / 4;
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            targetCtx.translate(flare.x, flare.y);
            targetCtx.rotate(angle);
            applyBlur(targetCtx, finalOptions.blur);
            let diagGrad = targetCtx.createLinearGradient(
                -size / 2, 0,
                size / 2, 0
            );
            diagGrad.addColorStop(0, `rgba(120,180,255,0)`);
            diagGrad.addColorStop(0.5, `rgba(120,180,255,${diagAlpha})`);
            diagGrad.addColorStop(1, `rgba(120,180,255,0)`);
            targetCtx.beginPath();
            targetCtx.fillStyle = diagGrad;
            targetCtx.fillRect(-size / 2, -height / 2, size, height);
            targetCtx.restore();
        }
    }
    function drawCircular(flare) {
        const w = temp.width, h = temp.height;
        const cx = flare.x, cy = flare.y;
        const centerX = w / 2, centerY = h / 2;
        const dx = centerX - cx, dy = centerY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mainBaseAlpha = (flare.brightness / 255) * finalOptions.intensity;
        const mainAlpha = getFinalAlpha(mainBaseAlpha);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 8);
        let grad = targetCtx.createRadialGradient(cx, cy, 0, cx, cy, finalOptions.radius * 1.2);
        grad.addColorStop(0, `rgba(255,255,255,${mainAlpha})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${mainAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, finalOptions.radius * 1.2, 0, 2 * Math.PI);
        targetCtx.fillStyle = grad;
        targetCtx.fill();
        targetCtx.restore();
        const haloRadii = [finalOptions.radius * 2.2, finalOptions.radius * 1.7, finalOptions.radius * 1.3];
        const haloColors = [
            [180, 220, 255],
            [255, 220, 180],
            [200, 180, 255]
        ];
        for (let i = 0; i < haloRadii.length; i++) {
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            applyBlur(targetCtx, finalOptions.blur + 2 + i);
            let haloGrad = targetCtx.createRadialGradient(cx, cy, haloRadii[i] * 0.7, cx, cy, haloRadii[i]);
            haloGrad.addColorStop(0, `rgba(${haloColors[i][0]},${haloColors[i][1]},${haloColors[i][2]},${mainAlpha * 0.08})`);
            haloGrad.addColorStop(1, `rgba(${haloColors[i][0]},${haloColors[i][1]},${haloColors[i][2]},0)`);
            targetCtx.beginPath();
            targetCtx.arc(cx, cy, haloRadii[i], 0, 2 * Math.PI);
            targetCtx.fillStyle = haloGrad;
            targetCtx.fill();
            targetCtx.restore();
        }
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 1);
        let arcRadius = finalOptions.radius * 2.1;
        let arcCenter = { x: cx, y: cy };
        let arcStart = Math.PI * 0.15, arcEnd = Math.PI * 1.85;
        let arcGrad = targetCtx.createLinearGradient(
            arcCenter.x - arcRadius, arcCenter.y,
            arcCenter.x + arcRadius, arcCenter.y
        );
        arcGrad.addColorStop(0.0, "rgba(255,0,0,0.13)");
        arcGrad.addColorStop(0.2, "rgba(255,255,0,0.13)");
        arcGrad.addColorStop(0.4, "rgba(0,255,0,0.13)");
        arcGrad.addColorStop(0.6, "rgba(0,255,255,0.13)");
        arcGrad.addColorStop(0.8, "rgba(0,0,255,0.13)");
        arcGrad.addColorStop(1.0, "rgba(255,0,255,0.13)");
        targetCtx.beginPath();
        targetCtx.arc(arcCenter.x, arcCenter.y, arcRadius, arcStart, arcEnd, false);
        targetCtx.lineWidth = Math.max(2, finalOptions.radius * 0.08);
        targetCtx.strokeStyle = arcGrad;
        targetCtx.shadowColor = "rgba(255,255,255,0.08)";
        targetCtx.shadowBlur = arcRadius * 0.08;
        targetCtx.stroke();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
        const ghostCount = 4;
        for (let i = 1; i <= ghostCount; i++) {
            const t = i / (ghostCount + 1);
            const gx = cx + dx * t;
            const gy = cy + dy * t;
            const ghostRadius = finalOptions.radius * (0.5 + 0.3 * Math.sin(i));
            const ghostAlpha = mainAlpha * (0.18 + 0.12 * Math.cos(i));
            const ghostColors = [
                [180, 220, 255],
                [255, 180, 220],
                [220, 180, 255],
                [200, 255, 255]
            ];
            const gc = ghostColors[i % ghostColors.length];
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            applyBlur(targetCtx, finalOptions.blur + 1);
            let ghostGrad = targetCtx.createRadialGradient(gx, gy, 0, gx, gy, ghostRadius);
            ghostGrad.addColorStop(0, `rgba(${gc[0]},${gc[1]},${gc[2]},${ghostAlpha * 0.7})`);
            ghostGrad.addColorStop(1, `rgba(${gc[0]},${gc[1]},${gc[2]},0)`);
            targetCtx.beginPath();
            targetCtx.arc(gx, gy, ghostRadius, 0, 2 * Math.PI);
            targetCtx.fillStyle = ghostGrad;
            targetCtx.fill();
            targetCtx.restore();
        }
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, 0);
        let dotArcRadius = finalOptions.radius * 2.3;
        let dotCount = 32;
        for (let i = 0; i < dotCount; i++) {
            const theta = Math.PI * 0.2 + (Math.PI * 1.6) * (i / dotCount);
            const x = cx + Math.cos(theta) * dotArcRadius;
            const y = cy + Math.sin(theta) * dotArcRadius;
            targetCtx.beginPath();
            targetCtx.arc(x, y, 1.2 + Math.sin(i) * 0.7, 0, 2 * Math.PI);
            targetCtx.fillStyle = `rgba(255,255,255,0.13)`;
            targetCtx.fill();
        }
        targetCtx.restore();
    }
    function drawStarburst(flare) {
        const w = temp.width, h = temp.height;
        const dirX = (finalOptions.directionX !== undefined ? finalOptions.directionX : 100) / 100 * w;
        const dirY = (finalOptions.directionY !== undefined ? finalOptions.directionY : 100) / 100 * h;
        const cx = flare.x, cy = flare.y;
        const dx = dirX - cx, dy = dirY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        let color = flareColor;
        if (!finalOptions.flareColor) color = [255, 200, 120];
        const [r, g, b] = color;
        const points = Math.max(4, finalOptions.points || 12);
        const outerRadius = (flare.brightness / finalOptions.brightnessThreshold) * (finalOptions.radius * 1.2);
        const innerRadius = outerRadius * 0.3;
        const angleStep = Math.PI / points;
        const rotation = finalOptions.rotation || 0;
        const baseAlpha = (flare.brightness / 255) * finalOptions.intensity;
        const alpha = getFinalAlpha(baseAlpha);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur);
        targetCtx.translate(cx, cy);
        targetCtx.rotate(rotation * Math.PI / 180 + angle);
        targetCtx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r0 = (i % 2 === 0) ? outerRadius : innerRadius;
            const a = i * angleStep;
            targetCtx.lineTo(Math.cos(a) * r0, Math.sin(a) * r0);
        }
        targetCtx.closePath();
        targetCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        targetCtx.shadowColor = `rgba(${r},${g},${b},0.7)`;
        targetCtx.shadowBlur = outerRadius * 0.5 * finalOptions.falloff;
        targetCtx.fill();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 2);
        targetCtx.beginPath();
        const arcRadius = dist * 0.7;
        const arcStart = angle - Math.PI / 3;
        const arcEnd = angle + Math.PI / 1.5;
        targetCtx.arc(cx, cy, arcRadius, arcStart, arcEnd, false);
        targetCtx.lineWidth = Math.max(2, outerRadius * 0.08);
        targetCtx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.25})`;
        targetCtx.shadowColor = `rgba(${r},${g},${b},0.2)`;
        targetCtx.shadowBlur = arcRadius * 0.08;
        targetCtx.stroke();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
        const ghostCount = 5;
        for (let i = 1; i <= ghostCount; i++) {
            const t = i / (ghostCount + 1);
            const gx = cx + dx * t;
            const gy = cy + dy * t;
            const ghostRadius = outerRadius * (0.18 + 0.12 * Math.sin(i));
            const ghostAlpha = alpha * (0.18 + 0.12 * Math.cos(i));
            targetCtx.save();
            targetCtx.globalCompositeOperation = finalOptions.blendMode;
            applyBlur(targetCtx, finalOptions.blur + 1);
            targetCtx.translate(gx, gy);
            targetCtx.rotate(angle + Math.PI / 6 * i);
            targetCtx.beginPath();
            for (let j = 0; j < 6; j++) {
                const a = (j / 6) * 2 * Math.PI;
                const x = Math.cos(a) * ghostRadius;
                const y = Math.sin(a) * ghostRadius;
                if (j === 0) targetCtx.moveTo(x, y);
                else targetCtx.lineTo(x, y);
            }
            targetCtx.closePath();
            targetCtx.fillStyle = `rgba(${r},${g},${b},${ghostAlpha})`;
            targetCtx.shadowColor = `rgba(${r},${g},${b},0.18)`;
            targetCtx.shadowBlur = ghostRadius * 0.7;
            targetCtx.fill();
            targetCtx.shadowBlur = 0;
            targetCtx.restore();
        }
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur + 3);
        let grad = targetCtx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius * 0.7);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, outerRadius * 0.7, 0, 2 * Math.PI);
        targetCtx.fillStyle = grad;
        targetCtx.fill();
        targetCtx.restore();
    }
    function drawPolygon(flare) {
        const sides = Math.max(3, finalOptions.points || 6);
        const radius = (flare.brightness / finalOptions.brightnessThreshold) * finalOptions.radius;
        const rotation = finalOptions.rotation || 0;
        const baseAlpha = (flare.brightness / 255) * finalOptions.intensity;
        const alpha = getFinalAlpha(baseAlpha);
        targetCtx.save();
        targetCtx.globalCompositeOperation = finalOptions.blendMode;
        applyBlur(targetCtx, finalOptions.blur);
        targetCtx.translate(flare.x, flare.y);
        targetCtx.rotate(rotation * Math.PI / 180);
        targetCtx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) targetCtx.moveTo(x, y);
            else targetCtx.lineTo(x, y);
        }
        targetCtx.closePath();
        targetCtx.fillStyle = `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, ${alpha})`;
        targetCtx.shadowColor = `rgba(${flareColorR}, ${flareColorG}, ${flareColorB}, 0.5)`;
        targetCtx.shadowBlur = radius * 0.3 * finalOptions.falloff;
        targetCtx.fill();
        targetCtx.shadowBlur = 0;
        targetCtx.restore();
    }
    for (let i = 0; i < Math.min(finalOptions.maxFlares, flares.length); i++) {
        const flare = flares[i];
        switch (finalOptions.type) {
            case "anamorphic":
                drawAnamorphic(flare);
                break;
            case "circular":
                drawCircular(flare);
                break;
            case "starburst":
                drawStarburst(flare);
                break;
            case "polygon":
                drawPolygon(flare);
                break;
            default:
                drawAnamorphic(flare);
        }
    }
    targetCtx.globalCompositeOperation = "source-over";
    targetCtx.filter = "none";
    return this;
};
Q.Image.prototype.RGBSubpixel = function (subpixelOptions = {}) {
    const defaultOptions = {
        subpixelSizeX: 2,
        subpixelSizeY: 3,
        padding: 1,
        subpixelLayout: 'rgb',
        subpixelGlow: false,
        glowStrength: 0.4,
        glowRadius: 2,
        screenBleed: false,
        bleedOpacity: 0.15,
        bleedSize: 24
    };
    const opts = Object.assign({}, defaultOptions, subpixelOptions);
    const canvas_node = this.node;
    const w = canvas_node.width, h = canvas_node.height;
    if (w === 0 || h === 0) return this;
    this.saveToHistory();
    let subpixelCountX = 3, subpixelCountY = 1;
    if (opts.subpixelLayout === 'quad') { subpixelCountX = 2; subpixelCountY = 2; }
    else if (opts.subpixelLayout === 'vrgb' || opts.subpixelLayout === 'vbgr') { subpixelCountX = 1; subpixelCountY = 3; }
    const blockSizeX = opts.subpixelSizeX * subpixelCountX + opts.padding;
    const blockSizeY = opts.subpixelSizeY * subpixelCountY + opts.padding;
    const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
    const srcData = ctx.getImageData(0, 0, w, h).data;
    const blocksX = Math.ceil(w / blockSizeX);
    const blocksY = Math.ceil(h / blockSizeY);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = blocksX * blockSizeX;
    tempCanvas.height = blocksY * blockSizeY;
    const tempCtx = tempCanvas.getContext('2d');
    const tempImg = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);
    const tempData = tempImg.data;
    function getSubpixelColor(sx, sy, r, g, b, a, layout) {
        if (layout === 'rgb') {
            const idx = Math.floor(sx / opts.subpixelSizeX);
            if (idx === 0) return [r, 0, 0, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [0, 0, b, a];
        } else if (layout === 'bgr') {
            const idx = Math.floor(sx / opts.subpixelSizeX);
            if (idx === 0) return [0, 0, b, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [r, 0, 0, a];
        } else if (layout === 'vrgb') {
            const idx = Math.floor(sy / opts.subpixelSizeY);
            if (idx === 0) return [r, 0, 0, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [0, 0, b, a];
        } else if (layout === 'vbgr') {
            const idx = Math.floor(sy / opts.subpixelSizeY);
            if (idx === 0) return [0, 0, b, a];
            if (idx === 1) return [0, g, 0, a];
            if (idx === 2) return [r, 0, 0, a];
        } else if (layout === 'quad') {
            const qx = Math.floor(sx / opts.subpixelSizeX);
            const qy = Math.floor(sy / opts.subpixelSizeY);
            if (qx === 0 && qy === 0) return [r, 0, 0, a];
            if (qx === 1 && qy === 0) return [0, g, 0, a];
            if (qx === 0 && qy === 1) return [0, 0, b, a];
            return [0, 0, 0, a];
        }
        return [r, g, b, a];
    }
    for (let by = 0; by < blocksY; ++by) {
        for (let bx = 0; bx < blocksX; ++bx) {
            let r = 0, g = 0, b = 0, a = 0, count = 0;
            for (let dy = 0; dy < blockSizeY; ++dy) {
                for (let dx = 0; dx < blockSizeX; ++dx) {
                    const sx = bx * blockSizeX + dx;
                    const sy = by * blockSizeY + dy;
                    if (sx < w && sy < h) {
                        const idx = (sy * w + sx) * 4;
                        r += srcData[idx];
                        g += srcData[idx + 1];
                        b += srcData[idx + 2];
                        a += srcData[idx + 3];
                        count++;
                    }
                }
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            a = Math.round(a / count);
            for (let sy = 0; sy < blockSizeY; ++sy) {
                for (let sx = 0; sx < blockSizeX; ++sx) {
                    const tx = bx * blockSizeX + sx;
                    const ty = by * blockSizeY + sy;
                    const tidx = (ty * tempCanvas.width + tx) * 4;
                    if (sx >= blockSizeX - opts.padding || sy >= blockSizeY - opts.padding) {
                        tempData[tidx] = 0;
                        tempData[tidx + 1] = 0;
                        tempData[tidx + 2] = 0;
                        tempData[tidx + 3] = 255;
                    } else {
                        const [cr, cg, cb, ca] = getSubpixelColor(sx, sy, r, g, b, a, opts.subpixelLayout);
                        tempData[tidx] = cr;
                        tempData[tidx + 1] = cg;
                        tempData[tidx + 2] = cb;
                        tempData[tidx + 3] = ca;
                    }
                }
            }
        }
    }
    tempCtx.putImageData(tempImg, 0, 0);
    if (opts.subpixelGlow) {
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = tempCanvas.width;
        glowCanvas.height = tempCanvas.height;
        const glowCtx = glowCanvas.getContext('2d');
        const glowImg = glowCtx.createImageData(tempCanvas.width, tempCanvas.height);
        const glowData = glowImg.data;
        for (let by = 0; by < blocksY; ++by) {
            for (let bx = 0; bx < blocksX; ++bx) {
                for (let sy = 0; sy < blockSizeY - opts.padding; ++sy) {
                    for (let sx = 0; sx < blockSizeX - opts.padding; ++sx) {
                        const tx = bx * blockSizeX + sx;
                        const ty = by * blockSizeY + sy;
                        const tidx = (ty * tempCanvas.width + tx) * 4;
                        glowData[tidx] = tempData[tidx];
                        glowData[tidx + 1] = tempData[tidx + 1];
                        glowData[tidx + 2] = tempData[tidx + 2];
                        glowData[tidx + 3] = tempData[tidx + 3];
                    }
                }
            }
        }
        glowCtx.putImageData(glowImg, 0, 0);
        tempCtx.save();
        tempCtx.globalAlpha = opts.glowStrength;
        tempCtx.globalCompositeOperation = "lighten";
        tempCtx.filter = `blur(${opts.glowRadius}px)`;
        tempCtx.drawImage(glowCanvas, 0, 0);
        tempCtx.filter = "none";
        tempCtx.globalAlpha = 1.0;
        tempCtx.globalCompositeOperation = "source-over";
        tempCtx.restore();
    }
    if (opts.screenBleed) {
        tempCtx.save();
        tempCtx.globalAlpha = opts.bleedOpacity;
        let grad = tempCtx.createLinearGradient(0, 0, 0, opts.bleedSize);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(0, 0, tempCanvas.width, opts.bleedSize);
        grad = tempCtx.createLinearGradient(0, tempCanvas.height - opts.bleedSize, 0, tempCanvas.height);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "#fff");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(0, tempCanvas.height - opts.bleedSize, tempCanvas.width, opts.bleedSize);
        grad = tempCtx.createLinearGradient(0, 0, opts.bleedSize, 0);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(0, 0, opts.bleedSize, tempCanvas.height);
        grad = tempCtx.createLinearGradient(tempCanvas.width - opts.bleedSize, 0, tempCanvas.width, 0);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "#fff");
        tempCtx.fillStyle = grad;
        tempCtx.fillRect(tempCanvas.width - opts.bleedSize, 0, opts.bleedSize, tempCanvas.height);
        tempCtx.globalAlpha = 1.0;
        tempCtx.restore();
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);
    return this;
};
Q.Image.prototype.Sharpen = function (options = {}) {
    const DEFAULTS = {
        amount: 1.0,
        radius: 1.0,
        threshold: 0,
        details: 0.5
    };
    const s = Object.assign({}, DEFAULTS, options);
    s.amount = Math.min(4, Math.max(0, s.amount));
    s.radius = Math.max(0, s.radius);
    s.threshold = Math.max(0, s.threshold);
    s.details = Math.min(1, Math.max(0, s.details));
    const ctx = this.node.getContext('2d', { willReadFrequently: true });
    const { width, height } = this.node;
    const imgData = ctx.getImageData(0, 0, width, height);
    const src = imgData.data;
    const blurred = new Uint8ClampedArray(src);
    const { kernel, size } = createGaussianKernel(s.radius);
    convolve(src, blurred, width, height, kernel, size);
    const amountFactor = s.amount * 0.75;
    const detailFactor = s.details * 2;
    for (let i = 0; i < src.length; i += 4) {
        const r = src[i], g = src[i + 1], b = src[i + 2];
        const rB = blurred[i], gB = blurred[i + 1], bB = blurred[i + 2];
        const Y = 0.299 * r + 0.587 * g + 0.114 * b;
        const Yb = 0.299 * rB + 0.587 * gB + 0.114 * bB;
        const diff = Y - Yb;
        if (Math.abs(diff) > s.threshold) {
            const f = amountFactor + detailFactor * (Math.abs(diff) / 255);
            const Ynew = Y + diff * f;
            const ratio = Y > 0 ? Ynew / Y : 1;
            imgData.data[i] = clamp255(r * ratio);
            imgData.data[i + 1] = clamp255(g * ratio);
            imgData.data[i + 2] = clamp255(b * ratio);
        }
    }
    ctx.putImageData(imgData, 0, 0);
    this.saveToHistory();
    return this;
};
function clamp255(v) {
    return v < 0 ? 0 : v > 255 ? 255 : v;
}
function createGaussianKernel(radius) {
    radius = Math.floor(Math.max(0, radius));
    const size = 2 * radius + 1;
    if (size < 1) return { kernel: new Float32Array([1]), size: 1 };
    if (radius === 0) return { kernel: new Float32Array([1]), size: 1 };
    const kernel = new Float32Array(size * size);
    const sigma = radius / 3;
    const twoSigma2 = 2 * sigma * sigma;
    let sum = 0, idx = 0, center = radius;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++, idx++) {
            const dx = x - center, dy = y - center;
            const w = Math.exp(-(dx * dx + dy * dy) / twoSigma2);
            kernel[idx] = w;
            sum += w;
        }
    }
    if (sum <= 0 || !isFinite(sum)) {
        kernel.fill(0);
        kernel[center * size + center] = 1;
        return { kernel, size: 1 };
    }
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] = isFinite(kernel[i] / sum) ? kernel[i] / sum : 0;
    }
    return { kernel, size };
}
function convolve(src, dst, width, height, kernel, size) {
    const half = Math.floor(size / 2);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0, wsum = 0;
            const off = (y * width + x) * 4;
            for (let ky = 0; ky < size; ky++) {
                for (let kx = 0; kx < size; kx++) {
                    const ny = y + ky - half;
                    const nx = x + kx - half;
                    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                        const w = kernel[ky * size + kx];
                        const i = (ny * width + nx) * 4;
                        if (isFinite(w)) {
                            r += src[i] * w;
                            g += src[i + 1] * w;
                            b += src[i + 2] * w;
                            a += src[i + 3] * w;
                            wsum += w;
                        }
                    }
                }
            }
            if (wsum > 0) {
                dst[off] = r / wsum;
                dst[off + 1] = g / wsum;
                dst[off + 2] = b / wsum;
                dst[off + 3] = a / wsum;
            } else {
                dst[off] = src[off];
                dst[off + 1] = src[off + 1];
                dst[off + 2] = src[off + 2];
                dst[off + 3] = src[off + 3];
            }
        }
    }
};
Q.Image.prototype.Zoom = function(factor = 1.5, zoomOptions = {}) {
        const defaultOptions = {
            centerX: this.node.width / 2,   // Default center point X
            centerY: this.node.height / 2,  // Default center point Y
            smoothing: true,                // Whether to use smoothing
            quality: 'high',                // Smoothing quality: 'low', 'medium', 'high'
            background: 'transparent'       // Background for areas outside the image when zooming out
        };
        const finalOptions = Object.assign({}, defaultOptions, zoomOptions);
        const canvas_node = this.node;
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        let ctx = temp.getContext('2d');
        this.saveToHistory(); // Save the current state to history
        ctx.imageSmoothingEnabled = finalOptions.smoothing;
        ctx.imageSmoothingQuality = finalOptions.quality;
        ctx.fillStyle = finalOptions.background;
        ctx.fillRect(0, 0, temp.width, temp.height);
        if (factor >= 1) {
            const sWidth = canvas_node.width / factor;
            const sHeight = canvas_node.height / factor;
            const sx = finalOptions.centerX - (sWidth / 2);
            const sy = finalOptions.centerY - (sHeight / 2);
            const boundedSx = Math.max(0, Math.min(canvas_node.width - sWidth, sx));
            const boundedSy = Math.max(0, Math.min(canvas_node.height - sHeight, sy));
            ctx.drawImage(
                canvas_node,
                boundedSx, boundedSy, sWidth, sHeight,
                0, 0, canvas_node.width, canvas_node.height
            );
        } else {
            const scaledWidth = canvas_node.width * factor;
            const scaledHeight = canvas_node.height * factor;
            const dx = (canvas_node.width - scaledWidth) / 2;
            const dy = (canvas_node.height - scaledHeight) / 2;
            ctx.drawImage(
                canvas_node,
                0, 0, canvas_node.width, canvas_node.height,
                dx, dy, scaledWidth, scaledHeight
            );
        }
        canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        return this;
    };
Q.Image.prototype.ZoomBlur = function (zoomOptions = {}) {
    const defaultOptions = {
        centerX: 50,
        centerY: 50,
        strength: 20,
        steps: 15,
        easing: 'linear',
        opacityStart: 0.7,
        opacityEnd: 0.1,
        baseLayerOpacity: 1.0,
        progressive: true
    };
    this.saveToHistory();
    const finalOptions = Object.assign({}, defaultOptions, zoomOptions);
    const canvas_node = this.node;
    const centerX = (finalOptions.centerX / 100) * canvas_node.width;
    const centerY = (finalOptions.centerY / 100) * canvas_node.height;
    const strength = Math.max(1, Math.min(100, finalOptions.strength));
    const steps = Math.max(3, Math.min(30, finalOptions.steps));
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = canvas_node.width;
    sourceCanvas.height = canvas_node.height;
    const sourceCtx = sourceCanvas.getContext('2d');
    sourceCtx.drawImage(canvas_node, 0, 0);
    const destCanvas = document.createElement('canvas');
    destCanvas.width = canvas_node.width;
    destCanvas.height = canvas_node.height;
    const destCtx = destCanvas.getContext('2d');
    destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
    if (finalOptions.progressive) {
        destCtx.globalAlpha = finalOptions.baseLayerOpacity;
        destCtx.drawImage(sourceCanvas, 0, 0);
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            let scale;
            switch (finalOptions.easing) {
                case 'easeIn':
                    scale = 1 + (strength / 100) * (t * t);
                    break;
                case 'easeOut':
                    scale = 1 + (strength / 100) * (1 - (1 - t) * (1 - t));
                    break;
                default:
                    scale = 1 + (strength / 100) * t;
            }
            const w = canvas_node.width * scale;
            const h = canvas_node.height * scale;
            const x = centerX - (centerX * scale);
            const y = centerY - (centerY * scale);
            const layerOpacity = finalOptions.opacityStart +
                (finalOptions.opacityEnd - finalOptions.opacityStart) * t;
            destCtx.globalAlpha = layerOpacity;
            destCtx.drawImage(sourceCanvas, 0, 0, canvas_node.width, canvas_node.height,
                x, y, w, h);
        }
    } else {
        destCtx.globalAlpha = 1.0;
        destCtx.drawImage(sourceCanvas, 0, 0);
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            let scale;
            switch (finalOptions.easing) {
                case 'easeIn':
                    scale = 1 + (strength / 100) * (t * t);
                    break;
                case 'easeOut':
                    scale = 1 + (strength / 100) * (1 - (1 - t) * (1 - t));
                    break;
                default:
                    scale = 1 + (strength / 100) * t;
            }
            const w = canvas_node.width * scale;
            const h = canvas_node.height * scale;
            const x = centerX - (centerX * scale);
            const y = centerY - (centerY * scale);
            destCtx.globalAlpha = 1 / steps;
            destCtx.drawImage(sourceCanvas, 0, 0, canvas_node.width, canvas_node.height,
                x, y, w, h);
        }
    }
    const ctx = canvas_node.getContext('2d');
    ctx.clearRect(0, 0, canvas_node.width, canvas_node.height);
    ctx.drawImage(destCanvas, 0, 0);
    return this;
};
function Media(options = {}) {
    if (!(this instanceof Media)) {
        return new Media(options);
    }
    if (!Media.initialized) {
        Q.style(`
            --media-timeline-bg: #232323;
            --media-timeline-track-border: #3338;
            --media-timeline-segment-normal: #4caf50;
            --media-timeline-segment-alert: #ff9800;
            --media-timeline-segment-warning: #f44336;
            --media-timeline-handle-bg:rgba(255, 255, 255, 0.21);
        `);
        Media.initialized = true;
        console.log('Media core initialized');
    }
    return this;
};
Q.Media = Media;
Media.prototype.Selector = function(container, options = {}) {
    if (!Media.selectorClassesInitialized) {
        Media.selectorClasses = Q.style(`
            --media-selector-bg: rgba(0,0,0,0.15);
            --media-selector-rect: #4caf50;
            --media-selector-rect-active: #ff9800;
            --media-selector-dot: #fff;
            --media-selector-dot-border: #333;
        `, `
            .media-selector-canvas {
                position: absolute;
                left: 0; top: 0; width: 100%; height: 100%;
                pointer-events: auto;
                z-index: 20;
                background: var(--media-selector-bg, rgba(0,0,0,0.15));
                cursor: crosshair;
                user-select: none;
            }
            .media-selector-rect {
                position: absolute;
                border: 2px solid var(--media-selector-rect, #4caf50);
                background: rgba(76,175,80,0.08);
                box-sizing: border-box;
                pointer-events: auto;
            }
            .media-selector-rect.active {
                border-color: var(--media-selector-rect-active, #ff9800);
                background: rgba(255,152,0,0.08);
            }
            .media-selector-dot {
                position: absolute;
                width: 12px; height: 12px;
                border-radius: 50%;
                background: var(--media-selector-dot, #fff);
                border: 2px solid var(--media-selector-dot-border, #333);
                right: -8px; bottom: -8px;
                cursor: nwse-resize;
                z-index: 2;
            }
        `, null, {
            'media-selector-canvas': 'media-selector-canvas',
            'media-selector-rect': 'media-selector-rect',
            'media-selector-dot': 'media-selector-dot'
        }, false);
        Media.selectorClassesInitialized = true;
    }
    const classes = Media.selectorClasses;
    const wrapper = Q(container);
    if (window.getComputedStyle(wrapper.nodes[0]).position === 'static') {
        wrapper.css('position', 'relative');
    }
    const canvas = Q('<canvas class="' + classes['media-selector-canvas'] + '"></canvas>');
    wrapper.append(canvas);
    let selection = null;
    let defaultDims = { x: 10, y: 10, w: 30, h: 30 }; // percent
    function getMediaRect() {
        const media = wrapper.find('video') || wrapper.find('img');
        if (!media || !media.nodes[0]) {
            const rect = wrapper.nodes[0].getBoundingClientRect();
            return { left: 0, top: 0, width: rect.width, height: rect.height };
        }
        const mediaRect = media.nodes[0].getBoundingClientRect();
        const wrapperRect = wrapper.nodes[0].getBoundingClientRect();
        return {
            left: mediaRect.left - wrapperRect.left,
            top: mediaRect.top - wrapperRect.top,
            width: mediaRect.width,
            height: mediaRect.height
        };
    }
    function percentToPx({x, y, w, h}) {
        const mediaRect = getMediaRect();
        return {
            x: mediaRect.left + mediaRect.width * x / 100,
            y: mediaRect.top + mediaRect.height * y / 100,
            w: mediaRect.width * w / 100,
            h: mediaRect.height * h / 100
        };
    }
    function pxToPercent({x, y, w, h}) {
        const mediaRect = getMediaRect();
        return {
            x: mediaRect.width ? ((x - mediaRect.left) / mediaRect.width * 100) : 0,
            y: mediaRect.height ? ((y - mediaRect.top) / mediaRect.height * 100) : 0,
            w: mediaRect.width ? (w / mediaRect.width * 100) : 0,
            h: mediaRect.height ? (h / mediaRect.height * 100) : 0
        };
    }
    function renderSelections() {
        const el = canvas.nodes[0];
        const rect = wrapper.nodes[0].getBoundingClientRect();
        el.width = rect.width;
        el.height = rect.height;
        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
        const ctx = el.getContext('2d');
        ctx.clearRect(0, 0, el.width, el.height);
        if (!selection) {
            return;
        }
        const dimsPx = percentToPx(selection);
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, el.width, el.height);
        ctx.clearRect(dimsPx.x, dimsPx.y, dimsPx.w, dimsPx.h);
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(dimsPx.x, dimsPx.y, dimsPx.w, dimsPx.h);
        ctx.restore();
        ctx.save();
        ctx.clearRect(dimsPx.x + dimsPx.w - 3, dimsPx.y + dimsPx.h - 3, 6, 6);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.8;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.rect(dimsPx.x + dimsPx.w - 3, dimsPx.y + dimsPx.h - 3, 6, 6);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    let drawing = null;
    let drag = null;
    canvas.on('mousedown', function(e) {
        const rect = wrapper.nodes[0].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (selection) {
            const dimsPx = percentToPx(selection);
            const dx = x - (dimsPx.x + dimsPx.w);
            const dy = y - (dimsPx.y + dimsPx.h);
            if (dx*dx + dy*dy <= 64) {
                drag = {
                    type: 'resize',
                    startX: e.clientX,
                    startY: e.clientY,
                    orig: {...selection}
                };
                document.body.style.userSelect = 'none';
                e.stopPropagation();
                return;
            }
            if (
                x >= dimsPx.x && x <= dimsPx.x + dimsPx.w &&
                y >= dimsPx.y && y <= dimsPx.y + dimsPx.h
            ) {
                drag = {
                    type: 'move',
                    startX: e.clientX,
                    startY: e.clientY,
                    orig: {...selection}
                };
                document.body.style.userSelect = 'none';
                e.stopPropagation();
                return;
            }
        }
        drawing = { startX: x, startY: y, endX: x, endY: y };
    });
    document.addEventListener('mousemove', function(e) {
        if (drawing) {
            const rect = wrapper.nodes[0].getBoundingClientRect();
            drawing.endX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            drawing.endY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
            renderSelections();
            const x = Math.min(drawing.startX, drawing.endX);
            const y = Math.min(drawing.startY, drawing.endY);
            const w = Math.abs(drawing.endX - drawing.startX);
            const h = Math.abs(drawing.endY - drawing.startY);
            const el = canvas.nodes[0];
            const ctx = el.getContext('2d');
            ctx.save();
            ctx.strokeStyle = '#ff9800';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
            ctx.restore();
        }
        if (drag && selection) {
            const sel = selection;
            const mediaRect = getMediaRect();
            if (drag.type === 'resize') {
                let dx = (e.clientX - drag.startX) / mediaRect.width * 100;
                let dy = (e.clientY - drag.startY) / mediaRect.height * 100;
                let newW = Math.max(2, drag.orig.w + dx);
                let newH = Math.max(2, drag.orig.h + dy);
                newW = Math.min(newW, 100 - drag.orig.x);
                newH = Math.min(newH, 100 - drag.orig.y);
                selection = {
                    x: drag.orig.x,
                    y: drag.orig.y,
                    w: newW,
                    h: newH
                };
                renderSelections();
            } else if (drag.type === 'move') {
                let dx = (e.clientX - drag.startX) / mediaRect.width * 100;
                let dy = (e.clientY - drag.startY) / mediaRect.height * 100;
                selection = {
                    x: Math.max(0, Math.min(100 - sel.w, drag.orig.x + dx)),
                    y: Math.max(0, Math.min(100 - sel.h, drag.orig.y + dy)),
                    w: sel.w,
                    h: sel.h
                };
                renderSelections();
            }
        }
    });
    document.addEventListener('mouseup', function(e) {
        if (drawing) {
            const rect = wrapper.nodes[0].getBoundingClientRect();
            const x = Math.min(drawing.startX, drawing.endX);
            const y = Math.min(drawing.startY, drawing.endY);
            const w = Math.abs(drawing.endX - drawing.startX);
            const h = Math.abs(drawing.endY - drawing.startY);
            if (w > 10 && h > 10) {
                const perc = pxToPercent({x, y, w, h});
                add(perc.x, perc.y, perc.w, perc.h);
            }
            drawing = null;
            renderSelections();
        }
        if (drag) {
            drag = null;
        }
        document.body.style.userSelect = '';
    });
    function handleResize() {
        renderSelections();
    }
    window.addEventListener('resize', handleResize);
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(handleResize);
        ro.observe(wrapper.nodes[0]);
        const media = wrapper.find('video') || wrapper.find('img');
        if (media && media.nodes[0]) {
            ro.observe(media.nodes[0]);
        }
    }
    function add(x, y, w, h) {
        selection = {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            w: Math.max(2, Math.min(100, w)),
            h: Math.max(2, Math.min(100, h))
        };
        renderSelections();
        return true;
    }
    function remove() {
        if (selection) {
            selection = null;
            renderSelections();
        }
    }
    function get() {
        if (!selection) return null;
        return {...selection};
    }
    function dimensions(x, y, w, h) {
        if (x === undefined) return {...defaultDims};
        defaultDims = {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            w: Math.max(2, Math.min(100, w)),
            h: Math.max(2, Math.min(100, h))
        };
        renderSelections();
        return instance;
    }
    function set(x, y, w, h) {
        selection = {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
            w: Math.max(2, Math.min(100, w)),
            h: Math.max(2, Math.min(100, h))
        };
        renderSelections();
        return instance;
    }
    function aspectRatio(ratio) {
        if (!ratio) {
            if (!selection) return null;
            return (selection.w / selection.h).toFixed(4);
        }
        let [rw, rh] = ratio.split(':').map(Number);
        if (!rw || !rh) return instance;
        const mediaRect = getMediaRect();
        const mediaW = mediaRect.width;
        const mediaH = mediaRect.height;
        if (!mediaW || !mediaH) return instance;
        let targetW = mediaW, targetH = mediaW * rh / rw;
        if (targetH > mediaH) {
            targetH = mediaH;
            targetW = mediaH * rw / rh;
        }
        const wPerc = (targetW / mediaW) * 100;
        const hPerc = (targetH / mediaH) * 100;
        const xPerc = (100 - wPerc) / 2;
        const yPerc = (100 - hPerc) / 2;
        set(xPerc, yPerc, wPerc, hPerc);
        return instance;
    }
    const instance = canvas;
    instance.add = add;
    instance.remove = remove;
    instance.get = get;
    instance.dimensions = dimensions;
    instance.set = set; // <-- new method
    instance.aspectRatio = aspectRatio; // <-- new method
    if (options.default) {
        dimensions(options.default.x, options.default.y, options.default.w, options.default.h);
    }
    if (options.init) {
        add(options.init.x, options.init.y, options.init.w, options.init.h);
    }
    renderSelections();
    return instance;
};
Media.prototype.Timeline = function (container, options = {}) {
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
            /* Seek line style */
            .media-timeline-seek-line {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 2px;
                background: #fff;
                opacity: 0.3;
                z-index: 10;
                pointer-events: none;
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
            'right': 'right',
            'media-timeline-seek-line': 'media-timeline-seek-line'
        });
        Media.timelineClassesInitialized = true;
    }
    const classes = Media.timelineClasses;
    const timeline = Q(`<div class="${classes['media-timeline-wrapper']}"></div>`);
    const bar = Q(`<div class="${classes['media-timeline-bar']}"></div>`);
    const tracksBar = Q(`<div class="${classes['media-timeline-tracks']}"></div>`);
    const seekLine = Q(`<div class="${classes['media-timeline-seek-line']}" style="display:none;height:100%;"></div>`);
    bar.append(seekLine);
    timeline.append(bar, tracksBar);
    timeline._length = 10000;
    timeline._segments = [];
    timeline._selected = null;
    timeline._changeCb = null;
    timeline._idCounter = 1;
    timeline._maxTracks = null;
    timeline._seekPos = null; // ms value or null
    timeline.seek = function (ms) {
        if (typeof ms !== "number" || isNaN(ms)) {
            this._seekPos = null;
        } else {
            this._seekPos = Math.max(0, Math.min(ms, this._length));
        }
        this._render();
        return this;
    };
    timeline.length = function (ms) {
        if (typeof ms === 'undefined') return this._length;
        this._length = Math.max(1, ms);
        this._render();
        return this;
    };
    timeline.add = function (from, to, type = 'normal', trackIndex) {
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
    timeline.modify = function (id, from, to, direction) {
        const seg = this._segments.find(s => s.id === id);
        if (!seg) return false;
        seg.from = Math.max(0, Math.min(from, this._length));
        seg.to = Math.max(seg.from, Math.min(to, this._length));
        this._render();
        this._triggerChange(direction);
        return true;
    };
    timeline.remove = function (id) {
        this._segments = this._segments.filter(s => s.id !== id);
        if (this._selected === id) this._selected = null;
        this._render();
        this._triggerChange();
        return this;
    };
    timeline.clear = function () {
        this._segments = [];
        this._selected = null;
        this._render();
        this._triggerChange();
        return this;
    };
    timeline.clone = function (id, from) {
        const seg = this._segments.find(s => s.id === id);
        if (!seg) return null;
        const len = seg.to - seg.from;
        let newFrom = Math.max(0, Math.min(from, this._length - len));
        let newTo = newFrom + len;
        return this.add(newFrom, newTo, seg.type);
    };
    timeline.change = function (cb) {
        this._changeCb = cb;
        return this;
    };
    timeline._selectCb = null;
    timeline._deselectCb = null;
    timeline.select = function (arg) {
        if (typeof arg === "function") {
            this._selectCb = arg;
            const seg = this._segments.find(s => s.id === this._selected);
            if (seg) arg(seg.id, seg.from, seg.to, seg.type);
            return this;
        }
        this._selected = arg;
        this._render();
        this._triggerChange("select");
        if (typeof this._selectCb === "function") {
            const seg = this._segments.find(s => s.id === this._selected);
            if (seg) this._selectCb(seg.id, seg.from, seg.to, seg.type);
        }
        return this;
    };
    timeline.deselect = function (arg) {
        if (typeof arg === "function") {
            this._deselectCb = arg;
            return this;
        }
        const wasSelected = this._selected;
        this._selected = null;
        this._render();
        this._triggerChange("deselect");
        if (wasSelected && typeof this._deselectCb === "function") {
            this._deselectCb();
        }
        return this;
    };
    timeline.selected = function (cb) {
        const seg = this._segments.find(s => s.id === this._selected);
        if (seg && typeof cb === 'function') {
            cb(seg.id, seg.from, seg.to, seg.type);
        }
        return seg;
    };
    timeline.track = function (number) {
        if (typeof number === 'undefined') return this._maxTracks;
        this._maxTracks = Math.max(1, parseInt(number, 10));
        this._render();
        return this;
    };
    timeline._triggerChange = function (event) {
        if (typeof this._changeCb === 'function') {
            const seg = this._segments.find(s => s.id === this._selected);
            this._changeCb({
                event: event,
                segment: seg ? { id: seg.id, from: seg.from, to: seg.to, type: seg.type } : null
            });
        }
    };
    function assignTracks(segments, maxTracks, movingId = null, movingFrom = null, movingTo = null) {
        let tracks = [];
        segments.forEach(seg => { seg._track = undefined; });
        let movingSeg = null;
        if (movingId && movingFrom !== null && movingTo !== null) {
            movingSeg = segments.find(s => s.id === movingId);
            if (movingSeg) {
                movingSeg._pendingFrom = movingFrom;
                movingSeg._pendingTo = movingTo;
            }
        }
        segments.forEach(seg => {
            if (movingSeg && seg.id === movingSeg.id) return;
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
            delete movingSeg._pendingFrom;
            delete movingSeg._pendingTo;
        }
        return tracks.length;
    }
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
    timeline._render = function () {
        bar.children().each(function (i, el) {
            if (el !== seekLine.nodes[0] && el.classList && el.classList.contains(classes['media-timeline-seek-line'])) {
                el.parentNode && el.parentNode.removeChild(el);
            }
        });
        bar.html('');
        bar.append(seekLine); // always keep only one seekLine
        tracksBar.html('');
        this._segments.sort((a, b) => a.from - b.from);
        const tempDiv = document.createElement('div');
        tempDiv.className = classes['media-timeline-segment'];
        document.body.appendChild(tempDiv);
        const segHeight = parseFloat(getComputedStyle(tempDiv).height) || 8;
        const segMargin = parseFloat(getComputedStyle(tempDiv).marginTop) || 2;
        document.body.removeChild(tempDiv);
        let movingId = null, movingFrom = null, movingTo = null;
        if (timeline._movingSeg) {
            movingId = timeline._movingSeg.id;
            movingFrom = timeline._movingSeg.from;
            movingTo = timeline._movingSeg.to;
        }
        const trackCount = assignTracks(
            this._segments,
            this._maxTracks,
            movingId,
            movingFrom,
            movingTo
        );
        const maxTracks = this._maxTracks || trackCount || 1;
        const trackHeight = segHeight + 2 * segMargin + (parseFloat(getComputedStyle(document.body).getPropertyValue('--media-timeline-track-gap')) || 0);
        const wrapperHeight = maxTracks * trackHeight;
        timeline.css('height', wrapperHeight + 'px');
        for (let t = 0; t < maxTracks; t++) {
            const top = (t * trackHeight) + 'px';
            const height = trackHeight + 'px';
            const row = Q(`<div class="${classes['media-timeline-track-row']}" style="top:${top};height:${height};"></div>`);
            const label = Q(`<div class="${classes['media-timeline-track-label']}" style="top:${top};">${t + 1}</div>`);
            tracksBar.append(row);
            tracksBar.append(label);
        }
        bar.off('mousedown', bar._timelineDeselectHandler);
        bar._timelineDeselectHandler = function (e) {
            if (
                !e.target.classList.contains(classes['media-timeline-segment']) &&
                !e.target.classList.contains(classes['media-timeline-handle'])
            ) {
                timeline.deselect();
            }
        };
        bar.on('mousedown', bar._timelineDeselectHandler);
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
                handleL.on('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    cleanupListeners();
                    timeline.select(seg.id);
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
                handleR.on('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    cleanupListeners();
                    timeline.select(seg.id);
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
                segDiv.on('mousedown', e => {
                    if (e.target.classList.contains(classes['media-timeline-handle'])) return;
                    cleanupListeners();
                    timeline.select(seg.id);
                    let dragStartX = e.clientX;
                    let origFrom = seg.from, origTo = seg.to;
                    let newFrom = origFrom, newTo = origTo;
                    document.body.style.userSelect = 'none';
                    timeline._movingSeg = seg;
                    globalMouseMove = ev => {
                        let dx = ev.clientX - dragStartX;
                        let percent = dx / bar.nodes[0].offsetWidth;
                        let deltaMs = Math.round(percent * this._length);
                        newFrom = origFrom + deltaMs;
                        newTo = origTo + deltaMs;
                        if (newFrom < 0) {
                            newTo += -newFrom;
                            newFrom = 0;
                        }
                        if (newTo > this._length) {
                            newFrom -= (newTo - this._length);
                            newTo = this._length;
                        }
                        if (newTo - newFrom < 1) return;
                        if (seg.from !== newFrom || seg.to !== newTo) {
                            seg.from = newFrom;
                            seg.to = newTo;
                            timeline._render();
                            timeline._triggerChange("move");
                        }
                    };
                    globalMouseUp = () => {
                        cleanupListeners();
                        delete timeline._movingSeg;
                        if (seg.from !== newFrom || seg.to !== newTo) {
                            timeline.modify(seg.id, seg.from, seg.to, "move");
                        }
                    };
                    document.addEventListener('mousemove', globalMouseMove, true);
                    document.addEventListener('mouseup', globalMouseUp, true);
                });
                bar.append(segDiv);
                used[seg.id] = true;
                segDiv._segId = seg.id;
            }
        }
        for (const segId in segNodeMap) {
            if (!used[segId]) {
                Q(segNodeMap[segId]).remove();
            }
        }
        if (this._seekPos !== null && this._length > 0) {
            const left = (this._seekPos / this._length * 100).toFixed(2) + '%';
            seekLine.css({
                left: left,
                display: ''
            });
        } else {
            seekLine.css('display', 'none');
        }
    };
    return timeline;
};
Media.prototype.Video = function(options = {}) {
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
    const wrapper = Q(`<div class="${classes['media-video-wrapper']}"></div>`);
    const video = Q(`<video class="${classes['media-video-element']}" preload="auto"></video>`);
    wrapper.append(video);
    const loaderOverlay = Q(`<div class="${classes['media-video-loader-overlay']}" style="display:none"></div>`);
    const loaderAnim = Q(`<div class="${classes['media-video-loader']}"></div>`);
    loaderOverlay.append(loaderAnim);
    wrapper.append(loaderOverlay);
    let _customOverlay = null;
    let _status = "idle";
    let _timetick = null;
    let _statuscb = null;
    let _loop = false;
    let _tickRAF = null;
    let _autostart = false;
    let _playTo = null;
    let _networkTimeout = null;
    let _fpsSamples = [];
    function updateLoader(st) {
        if (st === "loading" || st === "buffering" || st === "seeking") {
            Q.Debounce('media-video-loader', 1000, () => {
                if (_status === st && (st === "loading" || st === "buffering" || st === "seeking")) {
                    if (loaderOverlay.css('display') === 'none') {
                        loaderOverlay.css('display', 'flex');
                        setTimeout(() => loaderOverlay.addClass('visible'), 10);
                    } else {
                        loaderOverlay.addClass('visible');
                    }
                }
            });
            if (_networkTimeout) clearTimeout(_networkTimeout);
            _networkTimeout = setTimeout(() => {
                if (_status === "loading" || _status === "buffering" || _status === "seeking") {
                    setStatus("networkfail");
                }
            }, 30000);
        } else {
            Q.Debounce('media-video-loader', 0, () => {});
            loaderOverlay.removeClass('visible');
            loaderOverlay.nodes[0].addEventListener('transitionend', function handler(e) {
                if (!loaderOverlay.hasClass('visible')) {
                    loaderOverlay.css('display', 'none');
                }
                loaderOverlay.nodes[0].removeEventListener('transitionend', handler);
            });
            if (_networkTimeout) {
                clearTimeout(_networkTimeout);
                _networkTimeout = null;
            }
        }
    }
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
        if (!(st === "ready" || st === "playing" || st === "paused" || st === "ended")) {
            updateLoader(st);
        }
    }
    const updateStatus = (evt) => {
        let st = statusMap[evt.type] || evt.type;
        if (evt.type === "error") {
            const err = video.nodes[0].error;
            if (err) {
                if (err.code === 2) st = "networkfail";
                else st = "failed";
            } else {
                st = "failed";
            }
        }
        if ((evt.type === "canplay" || evt.type === "canplaythrough")) {
            if (_loop && _status === "ended") {
                st = "playing";
            } else if (video.nodes[0].paused) {
                st = "ready";
            } else if (!video.nodes[0].paused) {
                st = "playing";
            }
        }
        if (evt.type === "ratechange" && !video.nodes[0].paused) {
            st = "playing";
        }
        setStatus(st);
    };
    ["playing", "pause", "ended", "waiting", "seeking", "canplay", "canplaythrough", "loadstart", "error", "stalled", "suspend", "ratechange"].forEach(ev =>
        video.on(ev, updateStatus)
    );
    const tick = () => {
        if (_timetick && !video.nodes[0].paused && !video.nodes[0].ended) {
            _timetick(instance.pos());
        }
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
            while (_fpsSamples.length > 2 && (_fpsSamples[0].t < now - 1000)) {
                _fpsSamples.shift();
            }
        }
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
    const instance = wrapper;
    let seekEventCb = null;
    instance.onSeek = function(cb) {
        seekEventCb = typeof cb === "function" ? cb : null;
        return instance;
    };
    instance.load = function(url) {
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
        let videoLen = instance.length();
        if (typeof from === "number") {
            instance.seek(from);
            instance._playFrom = from;
        }
        if (typeof to === "number" && to > (typeof from === "number" ? from : 0)) {
            instance._playTo = Math.min(to, videoLen);
        }
        if (typeof from !== "number" && typeof to !== "number") {
            if (typeof instance._playFrom === "number" && typeof instance._playTo === "number") {
                instance.seek(instance._playFrom);
            } else {
                instance._playFrom = 0;
                instance._playTo = null;
                instance.seek(0);
            }
        }
        video.nodes[0].play().catch(error => {
            console.error("Video playback error:", error);
            setStatus("failed");
        });
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
    instance.seek = function(ms, _fromSeekBar) {
        video.nodes[0].currentTime = ms / 1000;
        if (!_fromSeekBar && seekEventCb) seekEventCb(ms);
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
    instance.boundaries = function() {
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
    const frag = Q(`<div class="${classes['media-video-controls']}"></div>`);
    const btnPlay = Q('<button>').text("Play").on('click', () => instance.play());
    const btnPause = Q('<button>').text("Pause").on('click', () => instance.pause());
    const btnStop = Q('<button>').text("Stop").on('click', () => instance.stop());
    const form = Q.Form ? new Q.Form() : null;
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
    const loop = Q('<input type="checkbox">')
        .prop('checked', instance.loop())
        .attr('title', 'Loop')
        .on('change', function() { instance.loop(this.checked); });
    const loopLbl = Q('<label>').append(loop, document.createTextNode(" Loop"));
    const auto = Q('<input type="checkbox">')
        .prop('checked', instance.autostart())
        .attr('title', 'Autostart')
        .on('change', function() { instance.autostart(this.checked); });
    const autoLbl = Q('<label>').append(auto, document.createTextNode(" Autostart"));
    function fmt(ms) {
        ms = Math.max(0, Math.round(ms));
        let s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
        let ms3 = (ms % 1000).toString().padStart(3, '0');
        s = s % 60; m = m % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms3}`;
    }
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
    const seekBar = Q(`<div class="${classes['media-video-seekbar']}"></div>`);
    const seekTrack = Q(`<div class="${classes['media-video-seekbar-track']}"></div>`);
    const seekThumb = Q(`<div class="${classes['media-video-seekbar-thumb']}"></div>`);
    seekBar.append(seekTrack, seekThumb);
    const seekInfo = Q(`<div class="${classes['media-video-seek-info']}"></div>`);
    const seekLeft = Q('<div>').css({flex:'1',textAlign:'left'});
    const seekCenter = Q('<div>').css({flex:'1',textAlign:'center'});
    const seekRight = Q('<div>').css({flex:'1',textAlign:'right'});
    seekInfo.append(seekLeft, seekCenter, seekRight);
    const seekGroup = Q(`<div class="${classes['media-video-seek-group']}"></div>`);
    seekGroup.append(seekScale, seekBar, seekInfo);
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
    let dragging = false;
    let lastSeekMs = null; // last seeked ms during seekbar drag
    function seekToClientX(clientX, status) {
        const rect = seekBar.nodes[0].getBoundingClientRect();
        let rel = (clientX - rect.left) / rect.width;
        rel = Math.max(0, Math.min(1, rel));
        const len = instance.length();
        const ms = Math.round(len * rel);
        lastSeekMs = ms;
        instance.seek(ms, true); // only UI update
        updateSeekUI();
        if (seekEventCb) seekEventCb(ms);
    }
    let mouseMoveHandler = null;
    let mouseUpHandler = null;
    seekBar.on('mousedown', function(e) {
        dragging = true;
        seekToClientX(e.clientX, 'start');
        document.body.style.userSelect = 'none';
        mouseMoveHandler = function(ev) {
            if (dragging) {
                seekToClientX(ev.clientX, 'move');
            }
        };
        mouseUpHandler = function(ev) {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
                seekToClientX(ev.clientX, 'end');
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                mouseMoveHandler = null;
                mouseUpHandler = null;
            }
        };
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
    video.on('timeupdate', updateSeekUI);
    video.on('loadedmetadata', function() {
        renderScale();
        updateSeekUI();
    });
    video.on('durationchange', function() {
        renderScale();
        updateSeekUI();
    });
    setTimeout(() => {
        renderScale();
        updateSeekUI();
    }, 0);
    frag.append(seekGroup);
    if (btnPlay) frag.append(btnPlay);
    if (btnPause) frag.append(btnPause);
    if (btnStop) frag.append(btnStop);
    if (volSlider) frag.append(volSlider);
    if (speedDropdown) frag.append(speedDropdown);
    frag.append(loopLbl);
    frag.append(autoLbl);
    instance.control = function() {
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
        if (_customOverlay) {
            Q(_customOverlay).remove();
            _customOverlay = null;
        }
        if (qobj && typeof qobj === "object" && qobj.nodes && qobj.nodes[0]) {
            wrapper.append(qobj);
            _customOverlay = qobj.nodes[0];
        }
        return instance;
    };
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
    return wrapper;
};
Media.Video = Media.prototype.Video;
return Q;
})();