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
        parent.insertAdjacentHTML('beforeend', child);
      } else if (child instanceof HTMLElement || child instanceof Q) {
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
  const defaults = {
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
  options = Object.assign({}, defaults, options);
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
    const defaults = {
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
                display: none !important; /* Biztosítjuk, hogy valóban ne jelenjen meg */
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
        switch (defaults.minimizePosition || 'bottom-left') {
            case 'bottom-right':
                taskbarStyle.right = defaults.minimizeOffset + 'px';
                taskbarStyle.bottom = defaults.minimizeOffset + 'px';
                break;
            case 'top-left':
                taskbarStyle.left = defaults.minimizeOffset + 'px';
                taskbarStyle.top = defaults.minimizeOffset + 'px';
                break;
            case 'top-right':
                taskbarStyle.right = defaults.minimizeOffset + 'px';
                taskbarStyle.top = defaults.minimizeOffset + 'px';
                break;
            case 'bottom-left':
            default:
                taskbarStyle.left = defaults.minimizeOffset + 'px';
                taskbarStyle.bottom = defaults.minimizeOffset + 'px';
                break;
        }
        Container.taskbar = Q('<div>', { class: Container.windowClasses.window_taskbar || 'window_taskbar' }).css(taskbarStyle);
        Q('body').append(Container.taskbar);
    }
    const settings = Object.assign({}, defaults, options);
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
Q.Cookie = function (cookieKey, cookieValue, cookieOptions = {}) {
    const buildOptions = (options) => {
      let optionsStr = '';
      if (options.days) optionsStr += `expires=${new Date(Date.now() + options.days * 86400000).toUTCString()}; `;
      if (options.path) optionsStr += `path=${options.path}; `;
      if (options.domain) optionsStr += `domain=${options.domain}; `;
      if (options.secure) optionsStr += 'secure; ';
      return optionsStr;
    };
    if (arguments.length > 1) {
      if (cookieValue === null || cookieValue === '') {
        cookieValue = '';
        cookieOptions = { ...cookieOptions, days: -1 };
      }
      return document.cookie = `${cookieKey}=${cookieValue}; ${buildOptions(cookieOptions)}`;
    }
    const allCookies = document.cookie.split('; ');
    for (let i = 0, len = allCookies.length; i < len; i++) {
      const currentCookie = allCookies[i];
      const indexEqual = currentCookie.indexOf('=');
      if (indexEqual > -1 && currentCookie.slice(0, indexEqual).trim() === cookieKey) {
        return currentCookie.slice(indexEqual + 1);
      }
    }
    return undefined;
  };
Q.Fetch = function (url, callback, options = {}) {
    const {
        method = 'GET',
        headers = {},
        body,
        contentType = 'application/json',
        responseType = 'json',
        credentials = 'same-origin',
        retries = 3,
        retryDelay = 1000,
        exponentialBackoff = false,
        timeout = 0,
        validateResponse = (data) => data,
        query = null,
        signal: externalSignal = null
    } = options;
    if (query && typeof query === 'object') {
        const urlObject = new URL(url, location.origin);
        Object.entries(query).forEach(([key, value]) => urlObject.searchParams.append(key, value));
        url = urlObject.toString();
    }
    let requestBody = body;
    if (body && typeof body === 'object' && contentType === 'application/json' && !(body instanceof FormData)) {
        try { requestBody = JSON.stringify(body); } catch (error) { callback(new Error('Failed to serialize request body'), null); return; }
    }
    headers['Content-Type'] = headers['Content-Type'] || contentType;
    const controller = new AbortController();
    const { signal } = controller;
    if (externalSignal) {
        externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    const doFetch = (attempt) => {
        let timeoutId = null;
        if (timeout) { timeoutId = setTimeout(() => controller.abort(), timeout); }
        fetch(url, { method, headers, body: requestBody, credentials, signal })
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                switch (responseType) {
                    case 'json': return response.json();
                    case 'text': return response.text();
                    case 'blob': return response.blob();
                    case 'arrayBuffer': return response.arrayBuffer();
                    default: throw new Error('Unsupported response type');
                }
            })
            .then(result => {
                if (timeoutId) clearTimeout(timeoutId);
                return validateResponse(result);
            })
            .then(validatedData => callback(null, validatedData))
            .catch(error => {
                if (timeoutId) clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    callback(new Error('Fetch request was aborted'), null);
                } else if (attempt < retries) {
                    const delay = exponentialBackoff ? retryDelay * (2 ** attempt) : retryDelay;
                    setTimeout(() => doFetch(attempt + 1), delay);
                } else {
                    callback(error, null);
                }
            });
    };
    doFetch(0);
    return { abort: () => controller.abort() };
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
Q.Icons = function () {
  let glob = Q.getGLOBAL('icons');
  let classes = {};
  if (glob && glob.icons) {
    classes = glob.icons;
  }
  else {
    classes = Q.style(`
	--icon_arrow-down: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 100.93685,31.353867 C 82.480099,48.598492 67.319803,62.707709 67.247301,62.707709 c -0.0725,0 -15.232809,-14.109215 -33.689561,-31.353842 L 3.5365448e-8,6.6845858e-7 H 67.247301 134.4946 Z"/></svg>');
	--icon_arrow-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="M 31.353844,100.93685 C 14.109219,82.480099 1.6018623e-6,67.319803 1.6018623e-6,67.247301 1.6018623e-6,67.174801 14.109217,52.014492 31.353844,33.55774 L 62.70771,0 V 67.247301 134.4946 Z"/></svg>');
	--icon_arrow-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="m 31.353868,33.55775 c 17.244625,18.456749 31.353842,33.617045 31.353842,33.689547 0,0.0725 -14.109215,15.232809 -31.353842,33.689563 L 1.6018623e-6,134.4946 V 67.247297 0 Z"/></svg>');
	--icon_arrow-up: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 33.55775,31.353843 C 52.014499,14.109218 67.174795,6.6845858e-7 67.247297,6.6845858e-7 67.319797,6.6845858e-7 82.480106,14.109216 100.93686,31.353843 L 134.4946,62.707709 H 67.247297 3.5365448e-8 Z"/></svg>');
	--icon_navigation-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2666.6667 2666.6667"><path d="M 1276.6667,2434.5485 C 950.24325,2418.4963 647.60291,2257.2797 449.65648,1994.0001 360.09366,1874.8766 294.54616,1735.7649 260.06678,1591.6333 c -40.82486,-170.6571 -40.82486,-347.2761 0,-517.9332 71.52438,-298.98806 268.8554,-557.46223 540.12266,-707.48002 258.68606,-143.06006 568.06486,-175.54075 852.57376,-89.50899 276.927,83.73908 511.1437,274.85672 650.2832,530.62227 168.8614,310.40014 177.2264,688.09064 22.2995,1006.84964 -77.0037,158.4335 -189.7203,295.013 -331.3458,401.4939 -205.303,154.3568 -458.4668,231.6017 -717.3334,218.8716 z m 130.2294,-151.2014 c 229.6976,-18.6692 437.2639,-114.273 599.1754,-275.9766 47.6541,-47.593 83.7471,-91.4686 120.133,-146.0371 91.2885,-136.9067 142.8941,-286.0616 157.3086,-454.6667 3.0513,-35.6912 3.0513,-112.3088 0,-148 -9.7543,-114.0948 -35.6813,-216.2096 -79.956,-314.91095 C 2140.8657,803.99837 2044.7703,680.42081 1924.6667,585.10582 1705.8186,411.42656 1421.4281,342.88551 1146,397.43913 961.28159,434.02604 793.07082,524.16769 658.61926,658.61926 508.15954,809.07897 413.50356,1001.5246 386.76219,1211.3334 c -5.50464,43.1886 -7.16468,71.3013 -7.16468,121.3333 0,50.0321 1.66004,78.1448 7.16468,121.3333 31.40785,246.4213 158.34097,471.0271 353.9045,626.2276 118.14734,93.7625 258.15376,158.5796 405.33331,187.6524 50.7995,10.0346 91.5353,14.8142 153.3334,17.9909 18.4799,0.95 83.6306,-0.5787 107.5627,-2.5238 z m 134.7679,-630.3487 -208.3296,-208.3296 -207.9982,207.9951 -207.99834,207.9951 -54.66892,-54.6567 c -30.0679,-30.0612 -54.66892,-55.2602 -54.66892,-55.9978 0,-0.7375 93.30001,-94.6396 207.33338,-208.6711 l 207.3333,-207.3301 -206.6689,-206.6721 -206.66886,-206.67213 55.00599,-54.99402 55.006,-54.99402 206.66127,206.66447 206.6613,206.6646 207.6661,-207.6629 207.666,-207.66288 55.3378,55.32571 55.3378,55.32571 -207.6673,207.67046 -207.6673,207.6705 208.3339,208.3372 208.334,208.3371 -55.0055,54.9935 -55.0054,54.9935 z"/></svg>');
	--icon_navigation-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.66669 682.66669"><path d="M 312.95615,622.51118 C 282.12556,619.5403 247.03663,609.52248 218.00001,595.4014 129.37889,552.30321 70.013661,466.90205 60.059145,368.19207 51.577814,284.09034 83.346262,198.0417 144.85111,138.52292 212.10881,73.437059 306.81846,45.865772 398.4674,64.691724 519.45153,89.543525 610.11296,190.57708 622.60754,314.47462 c 8.48133,84.10173 -23.28712,170.15036 -84.79196,229.66914 -59.89864,57.96444 -141.4913,86.4009 -224.85943,78.36742 z m 71.04386,-40.49085 c 101.01231,-18.37977 179.6848,-97.26565 198.14953,-198.68699 3.46591,-19.0372 3.48193,-65.25956 0.0291,-84 -18.78642,-101.96514 -96.94357,-180.11939 -198.8453,-198.83796 -18.89894,-3.471598 -65.10105,-3.471598 -84,0 C 197.45585,119.2095 119.27,197.39245 100.48802,299.33334 c -3.452807,18.74044 -3.436783,64.9628 0.0291,84 16.64224,91.4109 82.13775,165.12641 170.46427,191.85833 8.26023,2.49995 21.0186,5.49414 28.35193,6.65376 7.33334,1.15962 14.83334,2.3709 16.66667,2.69173 8.26494,1.44635 55.91079,-0.31712 68,-2.51683 z M 320.66668,412.53122 c -36.66667,-38.4534 -66.66667,-70.49248 -66.66667,-71.19795 0,-0.70547 30.15,-32.79758 67,-71.31579 l 67,-70.03311 v 141.34115 c 0,77.73764 -0.15,141.29162 -0.33333,141.23108 -0.18334,-0.0605 -30.33334,-31.57197 -67,-70.02538 z"/></svg>');
	--icon_navigation-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.66669 682.66669"><path d="M 312.95615,622.51118 C 103.83077,602.35954 -10.876679,362.01744 104.94177,186.66667 225.81958,3.6559506 499.6699,21.151057 595.4014,218.00001 691.73222,416.0813 532.80292,643.69595 312.95615,622.51118 Z m 71.04386,-40.49085 C 527.6749,555.87785 617.23885,410.16562 575.1842,270.98141 536.24285,142.10102 399.55264,68.634561 270.98141,107.48249 119.67709,153.19925 50.784795,329.22352 130.9177,465.35432 c 35.94209,61.05887 100.57273,105.76313 168.41564,116.49111 7.33334,1.15962 14.83334,2.3709 16.66667,2.69173 8.26494,1.44635 55.91079,-0.31712 68,-2.51683 z M 294.66668,341.34179 V 199.98437 l 67,70.03311 c 36.85,38.51821 67,70.60056 67,71.2941 0,0.69354 -30.15,32.78948 -67,71.32431 l -67,70.06332 z"/></svg>');
	--icon_window-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 2.8176856,98.903421 -4.0360052e-7,96.085741 22.611458,73.473146 45.222917,50.860554 22.611458,28.247962 -4.0360052e-7,5.6353711 2.8176856,2.8176851 5.6353716,-9.1835591e-7 28.247963,22.611458 50.860555,45.222916 73.473147,22.611458 96.085743,-9.1835591e-7 98.903423,2.8176851 101.72111,5.6353711 79.109651,28.247962 56.498193,50.860554 79.109651,73.473146 101.72111,96.085741 98.903423,98.903421 96.085743,101.72111 73.473147,79.109651 50.860555,56.498192 28.247963,79.109651 5.6353716,101.72111 Z"/></svg>');
	--icon_window-full: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 H 50.860555 84.417403 V 50.860554 84.417401 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z"/></svg>');
	--icon_window-minimize: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 0.5252846,83.893071 V 79.698469 H 50.860555 101.19582 v 4.194602 4.19461 H 50.860555 0.5252846 Z"/></svg>');
	--icon_window-windowed: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 h 8.389212 8.389212 V 8.9144961 0.52528408 H 67.638978 101.19582 V 34.082131 67.638977 h -8.389207 -8.38921 v 8.389212 8.389212 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z M 92.806613,34.082131 V 8.9144961 H 67.638978 42.471343 v 4.1946059 4.194606 h 20.973029 20.973031 v 20.973029 20.973029 h 4.1946 4.19461 z"/></svg>');
	--icon_zoom-in: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z"/></svg>');
	--icon_zoom-out: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z"/></svg>');
`,`
.svg_icon {-webkit-mask-size: cover;mask-size: cover;-webkit-mask-repeat: no-repeat;mask-repeat: no-repeat;-webkit-mask-position: center;mask-position: center;background-color: currentColor;}
.svg_iconsize { width:100%;height:100%; }
.arrow-down { mask-image: var(--icon_arrow-down);}
.arrow-left { mask-image: var(--icon_arrow-left);}
.arrow-right { mask-image: var(--icon_arrow-right);}
.arrow-up { mask-image: var(--icon_arrow-up);}
.navigation-close { mask-image: var(--icon_navigation-close);}
.navigation-left { mask-image: var(--icon_navigation-left);}
.navigation-right { mask-image: var(--icon_navigation-right);}
.window-close { mask-image: var(--icon_window-close);}
.window-full { mask-image: var(--icon_window-full);}
.window-minimize { mask-image: var(--icon_window-minimize);}
.window-windowed { mask-image: var(--icon_window-windowed);}
.zoom-in { mask-image: var(--icon_zoom-in);}
.zoom-out { mask-image: var(--icon_zoom-out);}
`,null
,{
  "arrow-down": "arrow-down",
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "arrow-up": "arrow-up",
  "navigation-close": "navigation-close",
  "navigation-left": "navigation-left",
  "navigation-right": "navigation-right",
  "window-close": "window-close",
  "window-full": "window-full",
  "window-minimize": "window-minimize",
  "window-windowed": "window-windowed",
  "zoom-in": "zoom-in",
  "zoom-out": "zoom-out",
  "svg_icon": "svg_icon",
  "svg_iconsize": "svg_iconsize"
}, false);
  }
  return {
    get: function (name, additional = '') {
      if (additional === '') {
        additional = classes['svg_iconsize'];
      }
      return Q('<div>', {class: classes['svg_icon'] + ' ' + classes[name] + ' ' + additional});
    }
  }
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
Q.Image.prototype.Load = function(src, callback) {
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
    return this; // Láncolhatóság!
};
Q.Image.prototype.Clear = function(fill = this.options.fill) {
    let ctx = this.node.getContext('2d');
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, this.node.width, this.node.height);
    this.saveToHistory();
    return this; 
};
Q.Image.prototype.Render = function(target) {
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
Q.Image.prototype.Save = function(filename) {
    const dataUrl = this.node.toDataURL('image/' + this.options.format, this.options.quality);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    link.remove();
    return this;
};
Q.Image.prototype.saveToHistory = function() {
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
Q.Image.prototype.Undo = function() {
    return this.History(-1);
};
Q.Image.prototype.Redo = function() {
    return this.History(1);
};
Q.Image.prototype.History = function(offset) {
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
Q.Image.prototype.Blur = function(blurOptions = {}) {
        const defaults = {
            type: 'gaussian', // gaussian, box, motion, lens
            radius: 5,         // Basic blur radius
            quality: 1,        // Number of iterations for higher quality
            direction: 0,      // Angle in degrees
            distance: 10,      // Distance of motion
            focalDistance: 0.5,  // 0-1, center of focus
            shape: 'circle',     // circle, hexagon, pentagon, octagon
            blades: 6,           // Number of aperture blades (5-8)
            bladeCurvature: 0,   // 0-1, curvature of blades
            rotation: 0,         // Rotation angle of the aperture in degrees
            specularHighlights: 0, // 0-1, brightness of highlights
            noise: 0              // 0-1, amount of noise
        };
        const settings = Object.assign({}, defaults, blurOptions);
        const canvas_node = this.node;
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        const pixels = data.data;
        const width = canvas_node.width;
        const height = canvas_node.height;
        let blurredPixels;
        switch(settings.type.toLowerCase()) {
            case 'box':
                blurredPixels = applyBoxBlur(pixels, width, height, settings);
                break;
            case 'motion':
                blurredPixels = applyMotionBlur(pixels, width, height, settings);
                break;
            case 'lens':
                blurredPixels = applyLensBlur(pixels, width, height, settings);
                break;
            case 'gaussian':
            default:
                blurredPixels = applyGaussianBlur(pixels, width, height, settings);
                break;
        }
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = blurredPixels[i];
        }
        ctx.putImageData(data, 0, 0);
        this.saveToHistory();
        return this;
    };
    function applyGaussianBlur(pixels, width, height, settings) {
        const { kernel, size } = gaussianKernel(settings.radius);
        const half = Math.floor(size / 2);
        const iterations = Math.round(settings.quality);
        let currentPixels = new Uint8ClampedArray(pixels);
        for (let i = 0; i < iterations; i++) {
            currentPixels = applyBlur(currentPixels, width, height, kernel, size, half);
        }
        return currentPixels;
    }
    function applyBoxBlur(pixels, width, height, settings) {
        const radius = Math.round(settings.radius);
        const iterations = Math.round(settings.quality);
        const size = 2 * radius + 1;
        const half = radius;
        const kernel = new Float32Array(size * size);
        const weight = 1 / (size * size);
        for (let i = 0; i < size * size; i++) {
            kernel[i] = weight;
        }
        let currentPixels = new Uint8ClampedArray(pixels);
        for (let i = 0; i < iterations; i++) {
            currentPixels = applyBlur(currentPixels, width, height, kernel, size, half);
        }
        return currentPixels;
    }
    function applyMotionBlur(pixels, width, height, settings) {
        const radius = Math.max(1, Math.round(settings.radius));
        const distance = Math.max(1, Math.round(settings.distance));
        const angle = settings.direction * Math.PI / 180; // Convert to radians
        const size = 2 * distance + 1;
        const kernel = new Float32Array(size * size).fill(0);
        const half = Math.floor(size / 2);
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
        return applyBlur(pixels, width, height, kernel, size, half);
    }
    function applyLensBlur(pixels, width, height, settings) {
        const radius = Math.max(1, Math.round(settings.radius));
        const size = 2 * radius + 1;
        const half = radius;
        const kernel = new Float32Array(size * size).fill(0);
        const rotation = settings.rotation * Math.PI / 180; // Convert to radians
        const blades = Math.max(5, Math.min(8, settings.blades));
        const curvature = Math.max(0, Math.min(1, settings.bladeCurvature));
        let totalWeight = 0;
        const focalFactor = 1 - settings.focalDistance;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - half;
                const dy = y - half;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    const angle = Math.atan2(dy, dx) + rotation;
                    let weight = 0;
                    switch (settings.shape) {
                        case 'hexagon':
                        case 'pentagon':
                        case 'octagon':
                            const bladeAngle = 2 * Math.PI / blades;
                            const normalizedAngle = (angle % bladeAngle) / bladeAngle - 0.5;
                            const bladeDistance = radius * (1 - curvature * Math.abs(normalizedAngle));
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
                    if (settings.specularHighlights > 0) {
                        const highlightFactor = Math.max(0, 1 - distance / radius);
                        weight *= 1 + settings.specularHighlights * highlightFactor * 2;
                    }
                    if (settings.noise > 0) {
                        weight *= 1 + (Math.random() - 0.5) * settings.noise;
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
        return applyBlur(pixels, width, height, kernel, size, half);
    }
    function gaussianKernel(radius) {
        const size = 2 * radius + 1;
        const kernel = new Float32Array(size * size);
        const sigma = radius / 3;
        let sum = 0;
        const center = radius;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - center;
                const dy = y - center;
                const weight = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
                kernel[y * size + x] = weight;
                sum += weight;
            }
        }
        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }
        return { kernel, size };
    }
    function applyBlur(pixels, width, height, kernel, size, half) {
        const output = new Uint8ClampedArray(pixels.length);
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
                            r += pixels[srcOff] * weight;
                            g += pixels[srcOff + 1] * weight;
                            b += pixels[srcOff + 2] * weight;
                            a += pixels[srcOff + 3] * weight;
                            weightSum += weight;
                        }
                    }
                }
                if (weightSum > 0) {
                    r /= weightSum;
                    g /= weightSum;
                    b /= weightSum;
                    a /= weightSum;
                }
                output[dstOff] = r;
                output[dstOff + 1] = g;
                output[dstOff + 2] = b;
                output[dstOff + 3] = a;
            }
        }
        return output;
    }
Q.Image.prototype.Brightness = function(value, brightOptions = {}) {
        const defaultOptions = {
            preserveAlpha: true,
            clamp: true   // Whether to clamp values to 0-255 range
        };
        const finalOptions = Object.assign({}, defaultOptions, brightOptions);
        const canvas_node = this.node;
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] += value;     // Red
            pixels[i + 1] += value; // Green
            pixels[i + 2] += value; // Blue
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
(function() {
    const originalImage = Q.Image;
    Q.Image = function(options = {}) {
        const Image = originalImage(options);
        return Image;
    };
    Q.Image.prototype.Contrast = function(value, contrastOptions = {}) {
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
})();
Q.JSON = function (jsonData) {
    if (!(this instanceof Q.JSON)) return new Q.JSON(jsonData);
    this.json = jsonData;
};
Q.JSON.prototype.Parse = function (options = { modify: false, recursive: false }, callback) {
    const { modify, recursive } = options;
    const process = (data) => {
        if (typeof data === 'object' && data && !Array.isArray(data)) {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const newValue = callback(key, data[key]);
                    if (modify) data[key] = newValue;
                    if (recursive && typeof data[key] === 'object' && data[key]) process(data[key]);
                }
            }
        }
    };
    process(this.json);
    return this.json;
};
Q.JSON.prototype.deflate = function (level) {
    const map = {}, deflateCounter = { count: 1 };
    const replaceRecursive = (obj) => {
        if (typeof obj === 'object' && obj) {
            for (let key in obj) {
                if (typeof obj[key] === 'object' && obj[key]) replaceRecursive(obj[key]);
                if (key.length >= level) {
                    if (!map[key]) { map[key] = `[${deflateCounter.count++}]`; }
                    const newKey = map[key];
                    obj[newKey] = obj[key]; delete obj[key];
                }
                if (typeof obj[key] === 'string' && obj[key].length >= level) {
                    if (!map[obj[key]]) { map[obj[key]] = `[${deflateCounter.count++}]`; }
                    obj[key] = map[obj[key]];
                }
            }
        }
    };
    const deflatedData = JSON.parse(JSON.stringify(this.json));
    replaceRecursive(deflatedData);
    return { data: deflatedData, map: map };
};
Q.JSON.prototype.inflate = function (deflatedJson) {
    const { data, map } = deflatedJson;
    const reverseMap = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
    const restoreRecursive = (obj) => {
        if (typeof obj === 'object' && obj) {
            for (let key in obj) {
                const originalKey = reverseMap[key] || key;
                const value = obj[key]; delete obj[key];
                obj[originalKey] = value;
                if (typeof obj[originalKey] === 'object' && obj[originalKey]) {
                    restoreRecursive(obj[originalKey]);
                } else if (reverseMap[obj[originalKey]]) {
                    obj[originalKey] = reverseMap[obj[originalKey]];
                }
            }
        }
    };
    const inflatedData = JSON.parse(JSON.stringify(data));
    restoreRecursive(inflatedData);
    return inflatedData;
};
Q.JSON.prototype.merge = function (otherJson) {
    const deepMerge = (target, source) => {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (typeof source[key] === 'object' && source[key] && !Array.isArray(source[key])) {
                    target[key] = deepMerge(target[key] && typeof target[key] === 'object' ? target[key] : {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return deepMerge(this.json, otherJson);
};
Q.JSON.prototype.sortKeys = function (recursive = false, reverse = false) {
    const sortObject = (obj) => {
        const keys = Object.keys(obj).sort();
        if (reverse) keys.reverse();
        const sorted = {};
        keys.forEach(key => {
            sorted[key] = (recursive && typeof obj[key] === 'object' && obj[key] && !Array.isArray(obj[key])) ? sortObject(obj[key]) : obj[key];
        });
        return sorted;
    };
    this.json = sortObject(this.json);
    return this.json;
};
Q.JSON.prototype.sortValues = function (reverse = false) {
    if (typeof this.json !== 'object' || !this.json) return this.json;
    const entries = Object.entries(this.json).sort((a, b) => {
        const aValue = String(a[1]), bValue = String(b[1]);
        return aValue.localeCompare(bValue);
    });
    if (reverse) entries.reverse();
    const sorted = {};
    for (const [key, value] of entries) sorted[key] = value;
    this.json = sorted;
    return this.json;
};
Q.JSON.prototype.sortByValues = function (keyProp, valueProp, reverse = false) {
    if (!Array.isArray(this.json)) return this.json;
    this.json.sort((a, b) => {
        const cmpKey = String(a[keyProp]).localeCompare(String(b[keyProp]));
        const cmpValue = String(a[valueProp]).localeCompare(String(b[valueProp]));
        const cmp = cmpKey || cmpValue;
        return reverse ? -cmp : cmp;
    });
    return this.json;
};
Q.JSON.prototype.flatten = function (prefix = '') {
    const result = {};
    const flattenRec = (obj, path) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const newKey = path ? `${path}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] && !Array.isArray(obj[key])) {
                    flattenRec(obj[key], newKey);
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
    };
    flattenRec(this.json, prefix);
    return result;
};
Q.JSON.prototype.unflatten = function (flatObject) {
    const result = {};
    Object.keys(flatObject).forEach(compoundKey => {
        compoundKey.split('.').reduce((accumulator, currentKey, index, keysArray) => {
            if (index === keysArray.length - 1) {
                accumulator[currentKey] = flatObject[compoundKey];
            } else {
                if (!accumulator[currentKey] || typeof accumulator[currentKey] !== 'object') {
                    accumulator[currentKey] = {};
                }
            }
            return accumulator[currentKey];
        }, result);
    });
    this.json = result;
    return result;
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
Q.Socket = function (url, onMessage, onStatus, options = {}) {
    const {
        retries = 5,                   
        delay = 1000,                  
        protocols = [],                
        backoff = false,               
        pingInterval = 0,              
        pingMessage = 'ping',          
        queueMessages = false,         
        autoReconnect = true,          
        onOpen = null,                 
        onClose = null,                
        onError = null                 
    } = options;
    let socket, attempts = 0, currentDelay = delay, pingId = null;
    const messageQueue = [];
    const connect = () => {
        socket = new WebSocket(url, protocols);
        socket.onopen = () => {
            attempts = 0;
            currentDelay = delay;
            onStatus?.('connected');
            onOpen?.();
            if (queueMessages && messageQueue.length) {
                while (messageQueue.length) {
                    socket.send(messageQueue.shift());
                }
            }
            if (pingInterval) {
                pingId && clearInterval(pingId);
                pingId = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(pingMessage);
                    }
                }, pingInterval);
            }
        };
        socket.onmessage = event => onMessage?.(event.data);
        socket.onerror = error => {
            onStatus?.('error', error);
            onError?.(error);
        };
        socket.onclose = event => {
            onClose?.(event);
            pingId && clearInterval(pingId);
            if (autoReconnect && (retries === 0 || attempts < retries)) {
                onStatus?.('closed');
                attempts++;
                setTimeout(() => {
                    connect();
                    if (backoff) {
                        currentDelay *= 2;
                    }
                }, currentDelay);
            } else {
                onStatus?.('Max retries exceeded');
            }
        };
    };
    connect();
    return {
        send: message => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            } else if (queueMessages) {
                messageQueue.push(message);
            }
        },
        reconnect: () => connect(),
        close: () => {
            autoReconnect = false;
            pingId && clearInterval(pingId);
            socket.close();
        },
        getState: () => socket?.readyState
    };
};
Q.Storage = (function () {
    const lzw_compress = (input) => {
        let dictionary = {}, current = "", result = "", code = 256;
        for (let index = 0; index < input.length; index++) {
            const character = input.charAt(index);
            const combined = current + character;
            if (Object.prototype.hasOwnProperty.call(dictionary, combined)) {
                current = combined;
            } else {
                result += current.length > 1
                    ? String.fromCharCode(dictionary[current])
                    : String.fromCharCode(current.charCodeAt(0));
                dictionary[combined] = code++;
                current = character;
            }
        }
        if (current !== "") {
            result += current.length > 1
                ? String.fromCharCode(dictionary[current])
                : String.fromCharCode(current.charCodeAt(0));
        }
        return result;
    };
    const lzw_decompress = (input) => {
        let dictionary = {}, current = String.fromCharCode(input.charCodeAt(0)),
            previous = current, result = current, code = 256, entry;
        for (let index = 1; index < input.length; index++) {
            const currentCode = input.charCodeAt(index);
            if (currentCode < 256) {
                entry = String.fromCharCode(currentCode);
            } else {
                entry = Object.prototype.hasOwnProperty.call(dictionary, currentCode)
                    ? dictionary[currentCode]
                    : previous + current;
            }
            result += entry;
            current = entry.charAt(0);
            dictionary[code++] = previous + current;
            previous = entry;
        }
        return result;
    };
    return function (storageKey, storageValue, compressionEnabled = false) {
        const PREFIX_COMPRESSED = 'C|';
        const PREFIX_STRING = 'S|';
        const PREFIX_JSON = 'J|';
        if (arguments.length > 1) { 
            if (storageValue === null || storageValue === '') {
                localStorage.removeItem(storageKey);
                return;
            }
            let dataString = typeof storageValue === 'string'
                ? PREFIX_STRING + storageValue
                : PREFIX_JSON + JSON.stringify(storageValue);
            if (compressionEnabled) {
                dataString = PREFIX_COMPRESSED + lzw_compress(dataString);
            }
            localStorage.setItem(storageKey, dataString);
        } else {
            let dataString = localStorage.getItem(storageKey);
            if (dataString === null) return null;
            if (dataString.startsWith(PREFIX_COMPRESSED)) {
                dataString = lzw_decompress(dataString.slice(PREFIX_COMPRESSED.length));
            }
            if (dataString.startsWith(PREFIX_STRING)) {
                return dataString.slice(PREFIX_STRING.length);
            }
            if (dataString.startsWith(PREFIX_JSON)) {
                try { return JSON.parse(dataString.slice(PREFIX_JSON.length)); } 
                catch (error) { return dataString.slice(PREFIX_JSON.length); }
            }
            try { return JSON.parse(dataString); } 
            catch (error) { return dataString; }
        }
    };
})();
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
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i || j));
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = Math.min(
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
    return this.string.replace(new RegExp(stringOrRegex, 'g'), replacement);
};
(() => {
    class ThreadPool {
      constructor(maxWorkers = 1) {
        this.maxWorkers = maxWorkers;
        this.workers = [];
        this.taskQueue = [];
        this.activeTasks = new Map();
        this.taskIdCounter = 0;
        this.resultCallbacks = [];
        this.doneCallbacks = [];
        this.aborted = false;
        this.blobURL = ThreadPool._createWorkerBlob();
        for (let index = 0; index < maxWorkers; index++) {
          this._addWorker();
        }
      }
      static _createWorkerBlob() {
        const code = `
          self.onmessage = event => {
            const { taskId, functionCode, parameters } = event.data;
            let executionFunction;
            try {
              executionFunction = eval('(' + functionCode + ')');
            } catch (error) {
              self.postMessage({ taskId, error: error.toString() });
              return;
            }
            Promise.resolve().then(() => executionFunction(...parameters)).then(
              result => self.postMessage({ taskId, result }),
              error => self.postMessage({ taskId, error: error.toString() })
            );
          };
        `;
        return URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
      }
      _addWorker() {
        const workerInstance = new Worker(this.blobURL);
        workerInstance.busy = false;
        workerInstance.onmessage = event => {
          const { taskId, result, error } = event.data;
          workerInstance.busy = false;
          const task = this.activeTasks.get(taskId);
          if (task) {
            error !== undefined ? task.reject(new Error(error)) : task.resolve(result);
            this.resultCallbacks.forEach(callbackFunction => callbackFunction({ id: taskId, result, error }));
            this.activeTasks.delete(taskId);
          }
          this._processQueue();
        };
        workerInstance.onerror = () => { workerInstance.busy = false; };
        this.workers.push(workerInstance);
      }
      _processQueue() {
        if (this.aborted) return;
        while (true) {
          const idleIndex = this.workers.findIndex(workerInstance => !workerInstance.busy);
          if (idleIndex === -1 || this.workers.length <= this.maxWorkers) break;
          this.workers[idleIndex].terminate();
          this.workers.splice(idleIndex, 1);
        }
        for (const workerInstance of this.workers) {
          if (!workerInstance.busy && this.taskQueue.length) {
            const task = this.taskQueue.shift();
            workerInstance.busy = true;
            this.activeTasks.set(task.id, task);
            workerInstance.postMessage({ taskId: task.id, functionCode: task.functionCode, parameters: task.parameters });
          }
        }
        if (!this.taskQueue.length && !this.activeTasks.size) {
          const callbacks = this.doneCallbacks.slice();
          this.doneCallbacks.length = 0;
          callbacks.forEach(callbackFunction => callbackFunction());
        }
      }
      Workers(newWorkerCount) {
        if (this.aborted) return this;
        this.maxWorkers = newWorkerCount;
        if (newWorkerCount > this.workers.length) {
          for (let index = 0, difference = newWorkerCount - this.workers.length; index < difference; index++) {
            this._addWorker();
          }
        } else {
          this._processQueue();
        }
        return this;
      }
      Push(taskInput, ...parameters) {
        if (this.aborted) return Promise.reject(new Error('Thread aborted'));
        const taskFunction = typeof taskInput === 'function' ? taskInput : (() => taskInput);
        const taskId = ++this.taskIdCounter;
        const task = { id: taskId, functionCode: taskFunction.toString(), parameters, resolve: null, reject: null };
        const promiseResult = new Promise((resolve, reject) => { task.resolve = resolve; task.reject = reject; });
        this.taskQueue.push(task);
        this._processQueue();
        return promiseResult;
      }
      Result(callbackFunction) {
        if (typeof callbackFunction === 'function') this.resultCallbacks.push(callbackFunction);
        return this;
      }
      Done(callbackFunction) {
        if (typeof callbackFunction !== 'function') return this;
        if (!this.taskQueue.length && !this.activeTasks.size) callbackFunction();
        else this.doneCallbacks.push(callbackFunction);
        return this;
      }
      Abort() {
        this.aborted = true;
        while (this.taskQueue.length) this.taskQueue.shift().reject(new Error('Task aborted'));
        this.activeTasks.forEach(task => task.reject(new Error('Task aborted')));
        this.activeTasks.clear();
        this.workers.forEach(workerInstance => workerInstance.terminate());
        this.workers = [];
        this.doneCallbacks.length = 0;
        this.resultCallbacks.length = 0;
        URL.revokeObjectURL(this.blobURL);
        return this;
      }
    }
    Q.Thread = (maxWorkers = 1) => new ThreadPool(maxWorkers);
  })();
Q.Timer = (callback, identifier, options = {}) => {
    const defaults = { tick: 1, delay: 1000, interrupt: false, autoStart: true, done: null };
    const config = { ...defaults, ...options };
    if (!Q.Timer.activeTimers) Q.Timer.activeTimers = new Map();
    if (config.interrupt && Q.Timer.activeTimers.has(identifier)) Q.Timer.stop(identifier);
    const timerControl = {
      id: identifier,
      tickCount: 0,
      isPaused: false,
      remainingDelay: config.delay,
      startTime: 0,
      timerHandle: null,
      pause() {
        if (!this.isPaused) {
          this.isPaused = true;
          clearTimeout(this.timerHandle);
          const elapsed = Date.now() - this.startTime;
          this.remainingDelay = config.delay - elapsed;
        }
        return this;
      },
      resume() {
        if (this.isPaused) {
          this.isPaused = false;
          startTick(this.remainingDelay);
        }
        return this;
      },
      stop() { Q.Timer.stop(this.id); }
    };
    const startTick = (delayTime) => {
      timerControl.startTime = Date.now();
      timerControl.timerHandle = setTimeout(function tickHandler() {
        callback();
        timerControl.tickCount++;
        if (config.tick > 0 && timerControl.tickCount >= config.tick) {
          Q.Timer.stop(identifier);
          if (typeof config.done === 'function') config.done();
        } else {
          timerControl.startTime = Date.now();
          timerControl.timerHandle = setTimeout(tickHandler, config.delay);
        }
      }, delayTime);
    };
    if (config.autoStart) startTick(config.delay);
    Q.Timer.activeTimers.set(identifier, timerControl);
    return timerControl;
  };
  Q.Timer.stop = (identifier) => {
    if (Q.Timer.activeTimers?.has(identifier)) {
      const timerControl = Q.Timer.activeTimers.get(identifier);
      clearTimeout(timerControl.timerHandle);
      Q.Timer.activeTimers.delete(identifier);
    }
  };
  Q.Timer.stopAll = () => {
    if (Q.Timer.activeTimers) {
      Q.Timer.activeTimers.forEach(timerControl => clearTimeout(timerControl.timerHandle));
      Q.Timer.activeTimers.clear();
    }
  };
return Q;
})();