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
return Q;
})();