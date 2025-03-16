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
        let finalStyles = styleData.root ? `:root {${styleData.root}}\n` : '';
        finalStyles += styleData.gen;
        styleData.element.textContent = finalStyles;
    }
    function createStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.id = 'qlib-root-styles';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
    }
    window.addEventListener('load', applyStyles, { once: true });
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
    Q.style = (root = '', style = '', mapping = _n) => {
        if (root && typeof root === 'string') {
            styleData.root += root.trim() + ';';
        }
        if (style && typeof style === 'string') {
            if (mapping) {
                const keys = _ob.keys(mapping);
                keys.forEach((key) => {
                    let newKey = Q.ID ? Q.ID(5, '_') : `_${_ma.random().toString(36).substring(2, 7)}`;
                    style = style.replace(new _re(`\\b${key}\\b`, 'gm'), newKey);
                    mapping[key] = mapping[key].replace(key, newKey);
                });
            }
            styleData.gen += style;
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
    var b = classes.split(' '),
        nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].classList.add.apply(nodes[i].classList, b);
    }
    return this;
});
Q.Ext('animate', function (duration, b, e) {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    var f = nodes[i],
        keys = Object.keys(b),
        c = '';
    for (var j = 0, klen = keys.length; j < klen; j++) {
      c += keys[j] + ' ' + duration + 'ms' + (j < klen - 1 ? ', ' : '');
    }
    f.style.transition = c;
    for (var j = 0; j < klen; j++) {
      var d = keys[j];
      f.style[d] = b[d];
    }
    if (typeof e === 'function') {
      setTimeout((function(g){
          return function(){ e.call(g); };
      })(f), duration);
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
      } else if (child?.nodeType === 1 || child instanceof Q) {
        parent.appendChild(child.nodes ? child.nodes[0] : child);
      } else if (Array.isArray(child) || child?.constructor === NodeList) {
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
    var nodes = this.nodes; // ...existing code...
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].blur();
    }
    return this;
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
          const style = nodes[i].style;
          for (const key in property) {
              style[key] = property[key];
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
            var style = el.style;
            style.display = '';
            style.transition = 'opacity ' + duration + 'ms';
            void el.offsetHeight;
            style.opacity = 1;
            setTimeout(function() {
                style.transition = '';
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
            var style = el.style;
            style.transition = 'opacity ' + duration + 'ms';
            style.opacity = 0;
            setTimeout(function() {
                style.transition = '';
                style.display = 'none';
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
            } else if (child?.nodeType === 1 || child?.nodeType != null) {
                node.appendChild(child);
            } else if (Array.isArray(child) || child?.constructor === NodeList) {
                var subs = Array.from(child);
                for (var k = 0, slen = subs.length; k < slen; k++) {
                    node.appendChild(subs[k]);
                }
            }
        };
        if (Array.isArray(content) || content?.constructor === NodeList) {
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
    if (selector?.nodeType === 1 || selector?.nodeType != null) {
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
            } else if (child?.nodeType === 1 || child?.nodeType != null) {
                parent.insertBefore(child, parent.firstChild);
            } else if (Array.isArray(child) || child?.constructor === NodeList) {
                subNodes = Array.from(child);
                for (k = 0; k < subNodes.length; k++) {
                    parent.insertBefore(subNodes[k], parent.firstChild);
                }
            }
        }
    }
    return this;
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
        const parentNode = node.parentNode;
        let newParentElement;
        if (typeof wrapper === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = wrapper.trim();
            newParentElement = tempDiv.firstElementChild.cloneNode(true);
        } else {
            newParentElement = wrapper;
        }
        parentNode.insertBefore(newParentElement, node);
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
})([])
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
    });
    return f=>c?c.push(f):f(ev)
  })([])
Q.Ready=((c)=>{
    document.readyState==='loading'?document.addEventListener("DOMContentLoaded",()=>{while(c.length)c.shift()();c=0},{once:1}):c=0;
    return f=>c?c.push(f):f();
  })([])
Q.Resize=((c)=>{
    addEventListener("resize",()=>{
      for(let i=0,l=c.length;i<l;) c[i++](innerWidth,innerHeight)
    });
    return f=>c.push(f)
  })([])
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
Q.ColorBrightness = (inputColor, percent) => {
    if (!/^#|^rgb/.test(inputColor)) throw new Error('Unsupported c format');
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
Q.Debounce = (id, b, c) => {
    const debounceStorage = Q.getGLOBAL('Debounce') || {};
    debounceStorage[id] && clearTimeout(debounceStorage[id]);
    debounceStorage[id] = setTimeout(c, b);
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
    b + Array.from({ length }, () => (Math.random() * 16 | 0).toString(16)).join('');
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
Q.isDarkColor = (color, b = 20, c = 100) => {
    let red, green, blue;
    if (color[0] === '#') {
      const f = color.slice(1);
      const parts = f.length === 3
        ? [f[0] + f[0], f[1] + f[1], f[2] + f[2]]
        : f.length === 6
        ? [f.slice(0, 2), f.slice(2, 4), f.slice(4, 6)]
        : null;
      if (!parts) throw Error('Invalid f color format');
      [red, green, blue] = parts.map(v => parseInt(v, 16));
    } else if (color.startsWith('rgb')) {
      const arr = color.match(/\d+/g);
      if (arr && arr.length >= 3) [red, green, blue] = arr.map(Number);
      else throw Error('Invalid color format');
    } else throw Error('Unsupported color format');
    return Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2) + b < c;
  };
Q.Container = function (options = {}) {
    const Container = {};
    Container.Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' container_icon');
        return iconElement;
    };
    Q.Icons();
    Container.classes = Q.style(`
        .container_icon {
            width: 100%;
            height: 100%;
            color: #777; /* Default color */
            pointer-events: none;
            z-index: 1;
        }
    `, {
        'container_icon': 'container_icon'
    });
    return Container;
};
Q.Container.Tab = function (options = {}) {
    const Container = Q.Container();
    const Icon = Container.Icon;
    const sharedClasses = Container.classes;
    const classes = Object.assign({}, sharedClasses, Q.style(`
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
    `, {
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
    }));
    return function (data, horizontal = true) {
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
            Object.keys(data_tabs).forEach(key => {
                if (data_tabs[key].data('value') === value) {
                    data_tabs[key].click();
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
    };
};
Q.Cookie = function (a, b, c = {}) {
    const buildOptions = (options) => {
      let optionsStr = '';
      if (options.days) optionsStr += `expires=${new Date(Date.now() + options.days * 86400000).toUTCString()}; `;
      if (options.path) optionsStr += `path=${options.path}; `;
      if (options.domain) optionsStr += `domain=${options.domain}; `;
      if (options.secure) optionsStr += 'secure; ';
      return optionsStr;
    };
    if (arguments.length > 1) {
      if (b === null || b === '') {
        b = '';
        c = { ...c, days: -1 };
      }
      return document.cookie = `${a}=${b}; ${buildOptions(c)}`;
    }
    const allCookies = document.cookie.split('; ');
    for (let i = 0, len = allCookies.length; i < len; i++) {
      const currentCookie = allCookies[i];
      const indexEqual = currentCookie.indexOf('=');
      if (indexEqual > -1 && currentCookie.slice(0, indexEqual).trim() === a) {
        return currentCookie.slice(indexEqual + 1);
      }
    }
    return undefined;
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
        exponentialBackoff = false,
        timeout = 0,
        validateResponse = (j) => j,
        query = null,
        e: externalSignal = null
    } = c;
    if (query && typeof query === 'object') {
        const urlObject = new URL(url, location.origin);
        Object.entries(query).forEach(([key, value]) => urlObject.searchParams.append(key, value));
        url = urlObject.toString();
    }
    let requestBody = body;
    if (body && typeof body === 'object' && contentType === 'application/json' && !(body instanceof FormData)) {
        try { requestBody = JSON.stringify(body); } catch (k) { b(new Error('Failed to serialize request body'), null); return; }
    }
    headers['Content-Type'] = headers['Content-Type'] || contentType;
    const d = new AbortController();
    const { e } = d;
    if (externalSignal) {
        externalSignal.addEventListener('abort', () => d.abort(), { once: true });
    }
    const doFetch = (f) => {
        let h = null;
        if (timeout) { h = setTimeout(() => d.abort(), timeout); }
        fetch(url, { method, headers, body: requestBody, credentials, e })
            .then(i => {
                if (!i.ok) throw new Error(`Network i was not ok: ${i.statusText}`);
                switch (responseType) {
                    case 'json': return i.json();
                    case 'text': return i.text();
                    case 'blob': return i.blob();
                    case 'arrayBuffer': return i.arrayBuffer();
                    default: throw new Error('Unsupported i type');
                }
            })
            .then(result => {
                if (h) clearTimeout(h);
                return validateResponse(result);
            })
            .then(validatedData => b(null, validatedData))
            .catch(k => {
                if (h) clearTimeout(h);
                if (k.name === 'AbortError') {
                    b(new Error('Fetch request was aborted'), null);
                } else if (f < retries) {
                    const delay = exponentialBackoff ? retryDelay * (2 ** f) : retryDelay;
                    setTimeout(() => doFetch(f + 1), delay);
                } else {
                    b(k, null);
                }
            });
    };
    doFetch(0);
    return { abort: () => d.abort() };
};
Q.Form = function (options = {}) {
    const Form = {};
    Form.Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' form_icon');
        return iconElement;
    };
    Form.classes = Q.style(`
           .form_icon {
               width: 100%;
               height: 100%;
               color: #fff;
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
    `, {
        'form_icon': 'form_icon',
        'q_form': 'q_form',
        'q_form_disabled': 'q_form_disabled'
    });
    return Form;
};
Q.Form.Button = function (text = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    const classes = Object.assign({}, sharedClasses, Q.style(`
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
    `, {
        'q_form_button': 'q_form_button'
    }));
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
};
Q.Form.CheckBox = function (checked = false, text = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    const classes = Object.assign({}, sharedClasses, Q.style(`
        .q_form_checkbox {
            display: flex;
            width: fit-content;
            align-items: center;
        }
        .q_form_checkbox .label:empty {
            display: none;
        }
        .q_form_checkbox .label {
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
    `, {
        'q_form_checkbox': 'q_form_checkbox',
        'q_form_cb': 'q_form_cb'
    }));
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
};
Q.Form.Tag = function (options = {}) {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    const Icon = Form.Icon;
    const classes = Object.assign({}, sharedClasses, Q.style(`
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
            margin: 0;
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
        'tag_container': 'tag_container',
        'tag_tag': 'tag_tag',
        'tag_rating': 'tag_rating',
        'tag_icon': 'tag_icon',
        'tag_icon_small': 'tag_icon_small',
        'tag_name': 'tag_name',
        'tag_value': 'tag_value',
        'tag_close': 'tag_close',
        'tag_input': 'tag_input',
        'tag_up': 'tag_up',
        'tag_down': 'tag_down'
    }));
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
    let changeCallback = null;
    const tagContainer = Q('<div>', { class: classes.tag_container });
    const input = Q('<input>', { class: classes.tag_input });
    const malformFix = Q('<input>', { class: classes.tag_input });
    let ID = Q.ID(5, '_');
    const changeTagValue = (tag, delta, currentValue) => {
        let newValue = tag.value + delta;
        newValue = Math.min(Math.max(newValue, min), max);
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
        if (!Array.isArray(taglist)) {
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
};
Q.Form.TextArea = function (value = '', placeholder = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    const classes = Object.assign({}, sharedClasses, Q.style(`
        .q_form_textarea {
            width: calc(100% - 2px);
            padding: 5px;
            outline: none;
            border: 0;
        }
        .q_form_textarea:focus {
            outline: 1px solid #1DA1F2;
        }
    `, {
        'q_form_textarea': 'q_form_textarea'
    }));
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
};
Q.Form.TextBox = function (type = 'text', value = '', placeholder = '') {
    const Form = Q.Form();
    const sharedClasses = Form.classes;
    const classes = Object.assign({}, sharedClasses, Q.style(`
        .q_form_input { 
            width: calc(100% - 2px);
            padding: 5px;
            outline: none;
            border: 0;
        }
        .q_form_input:focus {
            outline: 1px solid #1DA1F2;
        }
    `, {
        'q_form_input': 'q_form_input'
    }));
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
};
Q.Icons = function () {
  let glob = Q.getGLOBAL('icons');
  let classes = {};
  if (glob && glob.icons) {
    classes = glob.icons;
  }
  else {
    classes = Q.style(`:root {
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
}
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
`
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
}, true);
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
    const Image = {};
    const defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        size: 'auto',
        quality: 1,
        historyLimit: 3,         // Maximum number of history states to keep
        autoSaveHistory: true    // Automatically save history on operations
    };
    options = Object.assign({}, defaultOptions, options);
    const Canvas = Q('<canvas>');
    const canvas_node = Canvas.nodes[0];
    const history = {
        states: [],        // Array of ImageData objects
        position: -1,      // Current position in history (-1 means no history yet)
        isUndoRedoing: false // Flag to prevent recording during undo/redo
    };
    Image.canvas = Canvas;
    Image.node = canvas_node;
    Image.options = options;
    const saveToHistory = function() {
        if (history.isUndoRedoing || !options.autoSaveHistory) return;
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        if (history.position < history.states.length - 1) {
            history.states = history.states.slice(0, history.position + 1);
        }
        history.states.push(imageData);
        history.position++;
        if (history.states.length > options.historyLimit) {
            history.states.shift();
            history.position--;
        }
    };
    Image.Load = function (src, callback) {
        if (src instanceof HTMLCanvasElement) {
            canvas_node.width = src.width;
            canvas_node.height = src.height;
            canvas_node.getContext('2d', { willReadFrequently: true })
                .drawImage(src, 0, 0);
            saveToHistory();
            if (callback) callback();
            return Image;
        } 
        else if (src instanceof HTMLImageElement) {
            if (src.complete && src.naturalWidth !== 0) {
                canvas_node.width = src.naturalWidth;
                canvas_node.height = src.naturalHeight;
                canvas_node.getContext('2d', { willReadFrequently: true })
                    .drawImage(src, 0, 0);
                saveToHistory();
                if (callback) callback();
            } else {
                src.onload = function() {
                    canvas_node.width = src.naturalWidth;
                    canvas_node.height = src.naturalHeight;
                    canvas_node.getContext('2d', { willReadFrequently: true })
                        .drawImage(src, 0, 0);
                    saveToHistory();
                    if (callback) callback();
                };
            }
            return Image;
        } 
        else {
            let img = new window.Image();
            img.crossOrigin = 'Anonymous'; // Add this to handle CORS if needed
            img.src = src;
            img.onload = function () {
                canvas_node.width = img.width;
                canvas_node.height = img.height;
                canvas_node.getContext('2d', { willReadFrequently: true })
                    .drawImage(img, 0, 0);
                saveToHistory();
                if (callback) callback();
            };
            return Image;
        }
    };
    Image.Get = function (format = options.format, quality = options.quality) {
        if (format === 'jpeg' || format === 'webp') {
            return canvas_node.toDataURL('image/' + format, quality);
        } else {
            return canvas_node.toDataURL('image/' + format);
        }
    };
    Image.Save = function (filename, saveOptions = {}) {
        const defaultSaveOptions = {
            format: options.format,
            quality: options.quality,
            backgroundColor: options.fill, // Default background color for alpha handling
            preserveTransparency: true     // Whether to preserve transparency in non-alpha formats
        };
        const finalOptions = Object.assign({}, defaultSaveOptions, saveOptions);
        let format = finalOptions.format;
        let quality = finalOptions.quality;
        let dataUrl;
        if ((format === 'jpeg' || format === 'jpg') && finalOptions.preserveTransparency) {
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas_node.width;
            tempCanvas.height = canvas_node.height;
            let tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            tempCtx.fillStyle = finalOptions.backgroundColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas_node, 0, 0);
            dataUrl = tempCanvas.toDataURL('image/' + format, quality);
        } else {
            dataUrl = canvas_node.toDataURL('image/' + format, format === 'jpeg' || format === 'webp' ? quality : undefined);
        }
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeType });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);
        }
        return Image;
    };
    Image.Clear = function (fill = options.fill) {
        let ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
        saveToHistory();
        return Image;
    };
    Image.Render = function(target) {
        if (!target) {
            console.error('No target provided for rendering');
            return Image;
        }
        let targetElement;
        if (typeof target === 'string') {
            targetElement = document.getElementById(target) || document.querySelector(target);
            if (!targetElement) {
                const qElement = Q(target);
                if (qElement && qElement.nodes && qElement.nodes.length) {
                    targetElement = qElement.nodes[0];
                }
            }
        } else if (target.nodes && target.nodes.length) {
            targetElement = target.nodes[0];
        } else if (target.appendChild) {
            targetElement = target;
        }
        if (!targetElement) {
            console.error('Invalid render target');
            return Image;
        }
        let renderCanvas;
        const targetTag = targetElement.tagName.toLowerCase();
        if (targetTag === 'canvas') {
            renderCanvas = targetElement;
        } else if (targetTag === 'img') {
            canvas_node.toBlob(function(blob) {
                const objectUrl = URL.createObjectURL(blob);
                targetElement.src = objectUrl;
                targetElement.onload = function() {
                    URL.revokeObjectURL(objectUrl);
                };
            }, 'image/' + options.format, options.quality);
            return Image;
        } else {
            renderCanvas = targetElement.querySelector('canvas.q-image-render');
            if (!renderCanvas) {
                renderCanvas = document.createElement('canvas');
                renderCanvas.className = 'q-image-render';
                targetElement.appendChild(renderCanvas);
            }
        }
        renderCanvas.width = canvas_node.width;
        renderCanvas.height = canvas_node.height;
        const renderCtx = renderCanvas.getContext('2d', { willReadFrequently: true });
        renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
        renderCtx.drawImage(canvas_node, 0, 0);
        return Image;
    };
    Image.History = function(offset = -1) {
        if (history.states.length === 0) return Image;
        if (offset === 0) return Image;
        let targetPosition = history.position + offset;
        if (targetPosition < 0) targetPosition = 0;
        if (targetPosition >= history.states.length) targetPosition = history.states.length - 1;
        if (targetPosition === history.position) return Image;
        history.isUndoRedoing = true;
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const state = history.states[targetPosition];
        if (canvas_node.width !== state.width || canvas_node.height !== state.height) {
            canvas_node.width = state.width;
            canvas_node.height = state.height;
        }
        ctx.putImageData(state, 0, 0);
        history.position = targetPosition;
        history.isUndoRedoing = false;
        return Image;
    };
    Image.Undo = function() {
        return Image.History(-1);
    };
    Image.Redo = function() {
        return Image.History(1);
    };
    Image.AutoHistory = function(enable = true) {
        options.autoSaveHistory = enable;
        return Image;
    };
    Image.SaveHistory = function() {
        saveToHistory();
        return Image;
    };
    Image.ClearHistory = function() {
        history.states = [];
        history.position = -1;
        return Image;
    };
    return Image;
};
Q.ImageViewer = function () {
    let classes = Q.style(`
.image_viewer_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.77);
    transition: background 10s;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: #fff;
}
.image_panel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.image_wrapper {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.15s;
    margin: 0 1px;
    display: flex;
    flex-direction: column;
    animation: fadeInScale 0.3s forwards;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.image_canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: auto;
    transition: width 0.3s, height 0.3s;
}
.image_ambient {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: auto;
    filter: blur(25px);
    opacity: 0.75;
    z-index: 0;
}
@keyframes fadeInScale {
    to {
        opacity: 1;
    }
}
.image_viewer_wrapper .image_panel {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image_top, .image_bottom {
    width: 100%;
    z-index: 1;
    position: absolute;
}
.image_top {
    top: 0;
    text-align: left;
    background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
}
.image_bottom {
    bottom: 0;
}
.side_left, .side_right {
    height: 100%;
    width: 80px;
}
.image_info {
    max-width: 500px;
    padding: 10px;
    text-shadow: 0 1px 3px #000;
}
.image_title {
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 5px;
}
.image_desc {
    font-size: 14px;
}
.side_left:hover, .side_right:hover {
    background: rgba(255,255,255,0.05);
}
.viewer_left_button, .viewer_right_button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1;
    cursor: pointer;
    color: white;
    opacity: 0.5;
}
.viewer_navicon {
    width: 40px;
    height: 40px;
}
.viewer_left_button:hover, .viewer_right_button:hover, .viewer_close_button:hover {
    opacity: 1;
}
.viewer_button_container {
    z-index: 10000;
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
}
.viewer_close_button, .viewer_zoom_in_button, .viewer_zoom_out_button {
    width: 30px;
    height: 30px;
    cursor: pointer;
    color: white;
    opacity: 0.5;
}
    `, {
        'image_viewer_wrapper': 'image_viewer_wrapper',
        'image_panel': 'image_panel',
        'image_wrapper': 'image_wrapper',
        'image_canvas': 'image_canvas',
        'image_ambient': 'image_ambient',
        'image_top': 'image_top',
        'image_bottom': 'image_bottom',
        'image_info': 'image_info',
        'viewer_button_container': 'viewer_button_container',
        'side_left': 'side_left',
        'side_right': 'side_right',
        'viewer_left_button': 'viewer_left_button',
        'viewer_right_button': 'viewer_right_button',
        'viewer_close_button': 'viewer_close_button',
        'viewer_zoom_in_button': 'viewer_zoom_in_button',
        'viewer_zoom_out_button': 'viewer_zoom_out_button',
        'image_title': 'image_title',
        'image_desc': 'image_desc',
        'viewer_navicon': 'viewer_navicon'
    }, false);
    class Viewer {
        constructor() {
            this.selector = null;
            this.images = [];
            this.currentIndex = 0;
            this.eventHandler = this.handleClick.bind(this);
            this.addEventListener();
            this.icons = Q.Icons();
            this.eventListenerActive = false;
            this.loaded = false;
            this.resizing = false;
            this.thumbs = false;
            this.scale = 1;
            this.panX = 0;
            this.panY = 0;
            this.isPanning = false;
            this.startX = 0;
            this.startY = 0;
            this.imageCache = {};
            this.config = {
                panAndZoom: true,
                ambient: true,
                ambientSize: 1.2,
                dynamicBackground: true
            };
        }
        construct() {
            this.image_viewer = Q('<div>', { class: classes.image_viewer_wrapper });
            this.image_panel = Q('<div>', { class: classes.image_panel });
            this.image_wrapper = Q('<div>', { class: classes.image_wrapper });
            this.image_canvas = Q('<canvas>', { class: classes.image_canvas });
            this.image_ambient = Q('<canvas>', { class: classes.image_ambient });
            this.image_top = Q('<div>', { class: classes.image_top });
            this.image_bottom = Q('<div>', { class: classes.image_bottom });
            this.image_info = Q('<div>', { class: classes.image_info });
            this.button_container = Q('<div>', { class: classes.viewer_button_container });
            this.side_left = Q('<div>', { class: classes.side_left });
            this.side_right = Q('<div>', { class: classes.side_right });
            this.left_button = Q('<div>', { class: classes.viewer_left_button });
            this.right_button = Q('<div>', { class: classes.viewer_right_button });
            this.close_button = Q('<div>', { class: classes.viewer_close_button });
            this.zoom_in_button = Q('<div>', { class: classes.viewer_zoom_in_button });
            this.zoom_out_button = Q('<div>', { class: classes.viewer_zoom_out_button });
            this.left_button.append(this.icons.get('navigation-left', classes.viewer_navicon));
            this.right_button.append(this.icons.get('navigation-right', classes.viewer_navicon));
            this.close_button.append(this.icons.get('navigation-close'));
            this.zoom_in_button.append(this.icons.get('zoom-in'));
            this.zoom_out_button.append(this.icons.get('zoom-out'));
            this.side_left.append(this.left_button);
            this.side_right.append(this.right_button);
            this.image_top.append(this.image_info);
            this.button_container.append(this.zoom_in_button, this.zoom_out_button, this.close_button);
            this.image_wrapper.append(this.image_ambient, this.image_canvas, this.image_top, this.image_bottom);
            this.image_panel.append(this.side_left, this.image_wrapper, this.side_right);
            this.image_viewer.append(this.image_panel, this.button_container);
            this.left_button.on('click', () => this.prev());
            this.right_button.on('click', () => this.next());
            this.close_button.on('click', () => this.close());
            this.image_top.on('mouseenter', () => {
                this.image_top.css({ opacity: 1, transition: 'all 0.3s' });
            });
            this.image_top.on('mouseleave', () => {
                this.image_top.css({ opacity: 0, transition: 'all 0.3s', 'transition-delay': '3s' });
            });
            this.image_canvas.on('wheel', (e) => this.handleZoom(e));
            this.image_canvas.on('mousedown', (e) => this.startPan(e));
            this.image_canvas.on('mousemove', (e) => this.pan(e));
            this.image_canvas.on('mouseup', () => this.endPan());
            this.image_canvas.on('mouseleave', () => this.endPan());
            this.image_canvas.on('touchstart', (e) => this.startTouch(e));
            this.image_canvas.on('touchmove', (e) => this.touchPanZoom(e));
            this.image_canvas.on('touchend', () => this.endTouch());
        }
        handleClick(e) {
            if (e.target.closest(this.selector)) {
                const images = Q(this.selector).find('img');
                if (!images.nodes.length) {
                    return;
                }
                images.each((index, el) => {
                    let title, desc, src;
                    if (el.hasAttribute('data-title')) {
                        title = el.getAttribute('data-title');
                    }
                    if (el.hasAttribute('data-desc')) {
                        desc = el.getAttribute('data-desc');
                    }
                    if (el.hasAttribute('data-source')) {
                        src = el.getAttribute('data-source');
                    } else {
                        src = el.src;
                    }
                    this.images[index] = {
                        src: src,
                        title: title,
                        desc: desc
                    }
                });
                this.currentIndex = images.nodes.indexOf(e.target);
                this.open();
            }
        }
        handleResize() {
            if (!this.resizing) {
                this.resizing = true;
                this.image_canvas.css({ filter: 'blur(10px)', transition: 'all 0.1s ease-in-out' });
            }
            Q.Debounce('img_viewer', 500, () => {
                this.scale = 1;
                this.startX = 0;
                this.startY = 0;
                this.panX = 0;
                this.panY = 0;
                this.updateImage();
                this.resizing = false;
                this.image_canvas.css({ filter: 'none', transition: '' });
            });
        }
        handleZoom(e) {
            if (!this.config.panAndZoom) return;
            e.preventDefault();
            const rect = this.image_canvas.nodes[0].getBoundingClientRect();
            const offsetX = (e.clientX - rect.left - this.panX) / this.scale;
            const offsetY = (e.clientY - rect.top - this.panY) / this.scale;
            const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(Math.max(this.scale * scaleAmount, 0.5), 2.5);
            const deltaScale = newScale - this.scale;
            this.panX -= offsetX * deltaScale;
            this.panY -= offsetY * deltaScale;
            this.scale = newScale;
            this.updateImage();
        }
        startPan(e) {
            if (!this.config.panAndZoom) return;
            this.isPanning = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
        }
        pan(e) {
            if (!this.config.panAndZoom) return;
            if (!this.isPanning) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.updateImage();
        }
        endPan() {
            this.isPanning = false;
        }
        startTouch(e) {
            if (!this.config.panAndZoom) return;
            if (e.touches.length === 1) {
                this.isPanning = true;
                this.startX = e.touches[0].clientX - this.panX;
                this.startY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isPanning = false;
                this.initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                this.initialScale = this.scale;
            }
        }
        touchPanZoom(e) {
            if (!this.config.panAndZoom) return;
            e.preventDefault();
            if (e.touches.length === 1 && this.isPanning) {
                this.panX = e.touches[0].clientX - this.startX;
                this.panY = e.touches[0].clientY - this.startY;
                this.updateImage();
            } else if (e.touches.length === 2) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const scaleAmount = currentDistance / this.initialDistance;
                this.scale = Math.min(Math.max(this.initialScale * scaleAmount, 0.5), 2.5);
                this.updateImage();
            }
        }
        endTouch() {
            this.isPanning = false;
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
        fadeTitle() {
            this.image_top.css({ opacity: 1, transition: 'all 0.3s' });
            Q.Debounce('fade_title', 2000, () => {
                this.image_top.css({ opacity: 0, transition: 'all 0.3s' });
            });
        }
        open() {
            this.construct();
            this.updateImage();
            this.updateNavigation();
            Q('body').append(this.image_viewer);
            window.addEventListener('resize', this.handleResize.bind(this));
        }
        close() {
            this.thumbs = false;
            window.removeEventListener('resize', this.handleResize.bind(this));
            this.image_viewer.remove();
        }
        prev() {
            if (this.currentIndex > 0) {
                this.scale = 1;
                this.startX = 0;
                this.startY = 0;
                this.panX = 0;
                this.panY = 0;
                this.currentIndex--;
                this.fadeTitle();
                this.updateImage();
                this.updateNavigation();
            }
        }
        next() {
            if (this.currentIndex < this.images.length - 1) {
                this.scale = 1;
                this.startX = 0;
                this.startY = 0;
                this.panX = 0;
                this.panY = 0;
                this.currentIndex++;
                this.fadeTitle();
                this.updateImage();
                this.updateNavigation();
            }
        }
        updateImage() {
            this.window_width = window.innerWidth;
            this.window_height = window.innerHeight;
            this.image_info.empty();
            if (this.images[this.currentIndex].title) {
                this.image_info.append(Q('<div>', { class: classes.image_title, text: this.images[this.currentIndex].title }));
            }
            if (this.images[this.currentIndex].desc) {
                this.image_info.append(Q('<div>', { class: classes.image_desc, text: this.images[this.currentIndex].desc }));
            }
            const src = this.images[this.currentIndex];
            const img = this.imageCache[src.src] || new Image();
            if (!this.imageCache[src.src]) {
                img.src = src.src;
                this.imageCache[src.src] = img;
            }
            const isAnimated = /\.(webm|apng|gif)$/i.test(src.src);
            img.onload = () => {
                const canvas = this.image_canvas.nodes[0];
                const ambientCanvas = this.image_ambient.nodes[0];
                const ctx = canvas.getContext('2d');
                const ambientCtx = ambientCanvas.getContext('2d');
                canvas.width = this.image_wrapper.nodes[0].clientWidth;
                canvas.height = this.image_wrapper.nodes[0].clientHeight;
                ambientCanvas.width = canvas.width * 1.2;
                ambientCanvas.height = canvas.height * 1.2;
                if (isAnimated) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    if (this.config.ambient) {
                        ambientCtx.drawImage(img, (ambientCanvas.width - canvas.width) / 2, (ambientCanvas.height - canvas.height) / 2, canvas.width, canvas.height);
                    }
                    return;
                }
                const aspectRatio = img.width / img.height;
                let width = this.window_width * this.scale;
                let height = this.window_height * this.scale;
                if (width / height > aspectRatio) {
                    width = height * aspectRatio;
                } else {
                    height = width / aspectRatio;
                }
                const offsetX = (canvas.width - width) / 2;
                const offsetY = (canvas.height - height) / 2;
                ctx.setTransform(this.scale, 0, 0, this.scale, this.panX + offsetX, this.panY + offsetY);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                if (this.config.ambient) {
                    const ambientOffsetX = (ambientCanvas.width - width * this.config.ambientSize) / 2;
                    const ambientOffsetY = (ambientCanvas.height - height * this.config.ambientSize) / 2;
                    ambientCtx.setTransform(this.scale * this.config.ambientSize, 0, 0, this.scale * this.config.ambientSize, this.panX * this.config.ambientSize + ambientOffsetX, this.panY * this.config.ambientSize + ambientOffsetY);
                    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
                    ambientCtx.drawImage(img, 0, 0, width, height);
                }
                if (this.config.dynamicBackground) {
                    Q.Debounce('update_ambient', 1000, () => {
                        Q.AvgColor(canvas, 10, (color) => {
                            this.image_viewer.css('background', `rgba(${color.r}, ${color.g}, ${color.b}, 0.77)`);
                        });
                    });
                }
            };
            if (img.complete) {
                img.onload();
            }
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
            this.image_viewer.remove();
        }
        source(images) {
            this.images = images.map((img, index) => ({
                src: img.source,
                title: img.title,
                desc: img.desc
            }));
            this.currentIndex = 0;
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
        },
        config: function (options) {
            Object.assign(viewer.config, options);
            return this;
        },
        source: function (images) {
            viewer.source(images);
            return this;
        }
    };
}
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
Q.NodeBlock = function (selector, width, height, options) {
    let classes = Q.style(`
.node_preferences {
    position: absolute;
    background: #181818;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}
.node_preferences_big {
    width: 350px;
    max-height: 350px;
    overflow-y: scroll;
}
.node_preferences_small {
width: 200px;
overflow-y: auto;
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
        "node_preferences_small": "node_preferences_small",
        "node_preferences_big": "node_preferences_big",
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
            this.img = null;
            this.content = null;
            this.contentHeight = 0;
            this.unescapedBase64Data = null;
            this.appearance = appearance;
            this.custom_style = custom_style;
            this.appearance = Object.assign({}, this.appearance, custom_style);
            this.darkText = '#ffffff';
            this.lightText = '#000000';
            this.update = true;
            this.compiled_render = document.createElement('canvas');
            this.block_context = this.compiled_render.getContext('2d');
            this._processColors();
        }
        _restyle(object) {
            this.custom_style = object;
            this.appearance = Object.assign({}, this.appearance, object);
            this._processColors();
            this.t_text = '';
        }
        _processColors() {
            const {
                background,
                factorTitleBackground,
                factorDarkColorMargin,
                factorDarkColorThreshold,
                factorLightColors,
                factorDarkColors,
                darkTextColor,
                lightTextColor
            } = this.appearance;
            const titleBg = Q.ColorBrightness(background, factorTitleBackground);
            const isDark = Q.isDarkColor(background, factorDarkColorMargin, factorDarkColorThreshold);
            const textColor = isDark ? darkTextColor : lightTextColor;
            const borderColor = Q.ColorBrightness(background, isDark ? factorLightColors : factorDarkColors);
            Object.assign(this.appearance, {
                titleBackground: titleBg,
                titleColor: textColor,
                connectionTextColor: textColor,
                textColor: textColor,
                node_table_color: borderColor
            });
        }
        _drawContainer(ctx, x, y, width, height) {
            const { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, background, radius, connectionPointSize } = this.appearance;
            ctx.save();
            Object.assign(ctx, {
                fillStyle: background,
                shadowColor,
                shadowBlur,
                shadowOffsetX,
                shadowOffsetY
            });
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.fill();
            ctx.restore();
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
            const renderElements = () => {
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
            };
            html = html.replace(/style="[^"]*"/g, '');
            let images = [];
            html = html.replace(/<br>/g, '');
            if (html.includes('<img')) {
                let imgTags = html.match(/<img[^>]+>/g);
                imgTags.forEach((imgTag, index) => {
                    let src = imgTag.match(/src="([^"]*)"/)[1];
                    let img = new Image();
                    img.src = src;
                    img.onload = () => {
                        images[index] = img;
                        if (images.length === imgTags.length) {
                            renderElements();
                        }
                    };
                });
            }
            else {
                renderElements();
            }
        }
        draw(main_context) {
            const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
            const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
            const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
            const maxConnectionsHeight = Math.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;
            if (this.update) {
                const updateContainerHeight = (contentHeight) => {
                    this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
                    this.block_context.canvas.height = this.height;
                    this.block_context.canvas.width = this.width + (this.appearance.connectionPointSize * 2);
                };
                this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
                    updateContainerHeight(contentHeight);
                    this._drawContainer(this.block_context, this.appearance.connectionPointSize, 0, this.width - 5, this.height, this.appearance.radius);
                    this._drawTitle(this.block_context, this.appearance.connectionPointSize, 0, this.width - this.appearance.connectionPointSize, TITLE_HEIGHT, this.name);
                    this.block_context.drawImage(canvas, this.appearance.padding, TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
                    this.drawConnectionPoints(this.block_context, CONNECTION_HEIGHT, CONNECTION_PADDING);
                    main_context.drawImage(this.compiled_render, this.x, this.y);
                });
                this.update = false;
            }
            else {
                this.drawConnectionPoints(this.block_context, CONNECTION_HEIGHT, CONNECTION_PADDING);
                main_context.drawImage(this.compiled_render, this.x, this.y);
            }
            return;
        }
        drawConnectionPoints(ctx, paddingTop, height) {
            const connectionY = paddingTop;
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
                    ctx.arc(baseX, connY, pointSize, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.fillStyle = this.appearance.connectionTextColor;
                    ctx.fillText(conn.title, getTextX(conn.title, baseX), connY + middleYOffset);
                });
            };
            if (Array.isArray(this.connLeft)) {
                drawConnectionPoints(this.connLeft, this.leftConnCoords, this.appearance.connectionPointSize, (title, baseX) => baseX + connectionPaddingX * 2);
            }
            if (Array.isArray(this.connRight)) {
                drawConnectionPoints(this.connRight, this.rightConnCoords, this.width, (title, baseX) => baseX - ctx.measureText(title).width - connectionPaddingX * 2);
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
            return [
                ...this.leftConnCoords.map(coord => ({ x: coord.x + this.x, y: coord.y + this.y })),
                ...this.rightConnCoords.map(coord => ({ x: coord.x + this.x, y: coord.y + this.y }))
            ];
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
            this.draggingBlock = null;
            this.offsetX = 0;
            this.offsetY = 0;
            this.connection_start = null;
            this.connection_end = null;
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
            Promise.all(blockCreationPromises).then(() => {
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
                        console.error('Connection failed to initialize:', startBlock, endBlock);
                    }
                });
            }).catch(err => {
                console.error('Error during block initialization:', err);
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
            let nextBlock = null;
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
            let ctx = this.canvas_context;
            let w = this.width;
            let h = this.height;
            let grid_size = this.appearance.gridSize;
            let grid_color = this.appearance.gridColor;
            ctx.strokeStyle = grid_color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= w; x += grid_size) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
            }
            for (let y = 0; y <= h; y += grid_size) {
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
            }
            ctx.stroke();
        }
        render() {
            this.canvas_context.clearRect(0, 0, this.width, this.height);
            this.render_grid();
            this.connections.forEach(conn => {
                let startBlock = conn.start.block;
                let endBlock = conn.end.block;
                let startColor = this._getConnectionColor(startBlock, conn.start.point);
                let endColor = this._getConnectionColor(endBlock, conn.end.point);
                this.canvas_context.strokeStyle = 'rgb(150, 150, 150)';
                this.canvas_context.beginPath();
                this.canvas_context.lineWidth = 2;
                let gradient = this.canvas_context.createLinearGradient(
                    startBlock.x + conn.start.x, startBlock.y + conn.start.y,
                    endBlock.x + conn.end.x, endBlock.y + conn.end.y
                );
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                this.canvas_context.strokeStyle = gradient;
                this.canvas_context.moveTo(startBlock.x + conn.start.x, startBlock.y + conn.start.y);
                this.canvas_context.lineTo(endBlock.x + conn.end.x, endBlock.y + conn.end.y);
                this.canvas_context.stroke();
                let dx = (endBlock.x + conn.end.x) - (startBlock.x + conn.start.x);
                let dy = (endBlock.y + conn.end.y) - (startBlock.y + conn.start.y);
                let length = Math.sqrt(dx * dx + dy * dy);
                let unitDx = dx / length;
                let unitDy = dy / length;
                let arrowLength = 10;
                let arrowWidth = 5;
                for (let i = 100; i < length; i += 200) {
                    let x = (startBlock.x + conn.start.x) + unitDx * i;
                    let y = (startBlock.y + conn.start.y) + unitDy * i;
                    this.canvas_context.beginPath();
                    this.canvas_context.moveTo(x, y);
                    this.canvas_context.lineTo(x - arrowLength * unitDx + arrowWidth * unitDy, y - arrowLength * unitDy - arrowWidth * unitDx);
                    this.canvas_context.lineTo(x - arrowLength * unitDx - arrowWidth * unitDy, y - arrowLength * unitDy + arrowWidth * unitDx);
                    this.canvas_context.closePath();
                    this.canvas_context.fillStyle = gradient;
                    this.canvas_context.fill();
                }
            });
            if (this.connection_start && this.connection_end === null) {
                let startBlock = this.connection_start.block;
                let startColor = this._getConnectionColor(startBlock, this.connection_start.point);
                let gradient = this.canvas_context.createLinearGradient(
                    startBlock.x + this.connection_start.x, startBlock.y + this.connection_start.y,
                    this.mouseX, this.mouseY
                );
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, "rgb(150, 150, 150)");
                this.canvas_context.strokeStyle = gradient;
                this.canvas_context.beginPath();
                this.canvas_context.moveTo(startBlock.x + this.connection_start.x, startBlock.y + this.connection_start.y);
                this.canvas_context.lineTo(this.mouseX, this.mouseY);
                this.canvas_context.stroke();
            }
            this.blocks.forEach(block => {
                block.draw(this.canvas_context);
            });
            this._connection_update();
        }
        _getConnectionColor(block, pointId) {
            const connection = [...block.connLeft, ...block.connRight]
                .find(conn => conn.id === pointId);
            return connection ? connection.color : null;
        }
        updateConnections(block) {
            const preferences = Q('.' + classes.node_preferences);
            const collectConnections = (sideClass) => {
                const side = preferences.find('.' + sideClass);
                const connections = [];
                side.find('.' + classes.connection_wrapper).walk((element) => {
                    const id = element.id();
                    const title = element.find('.' + classes.connection).val() || '';
                    const color = element.find('.' + classes.color).val();
                    connections.push({ id, title, color });
                }, true);
                return connections;
            };
            const newLeftConnections = collectConnections(classes.left);
            const newRightConnections = collectConnections(classes.right);
            const newConnections = [...newLeftConnections, ...newRightConnections];
            const existingConnections = [...block.connLeft, ...block.connRight];
            newConnections.forEach(newConn => {
                const existingConn = existingConnections.find(conn => conn.id === newConn.id);
                if (existingConn) {
                    existingConn.title = newConn.title;
                    existingConn.color = newConn.color;
                } else {
                    existingConnections.push(newConn);
                }
            });
        }
        updateBlock(selectedblock = null, callback) {
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
            block.update = true;
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
                if (this.appearance.snapToGrid) {
                    this.draggingBlock.x = Math.round(this.draggingBlock.x / this.appearance.gridSize) * this.appearance.gridSize;
                    this.draggingBlock.y = Math.round(this.draggingBlock.y / this.appearance.gridSize) * this.appearance.gridSize;
                    if (!this.lastMouseX || Math.abs(mouseX - this.lastMouseX) >= this.appearance.gridSize || Math.abs(mouseY - this.lastMouseY) >= this.appearance.gridSize) {
                        this.draggingBlock.x = mouseX - this.offsetX;
                        this.draggingBlock.y = mouseY - this.offsetY;
                        this.render();
                        this.lastMouseX = mouseX;
                        this.lastMouseY = mouseY;
                    }
                } else {
                    if (!this.lastMouseX || Math.abs(mouseX - this.lastMouseX) >= this.appearance.movementResolution || Math.abs(mouseY - this.lastMouseY) >= this.appearance.movementResolution) {
                        this.draggingBlock.x = mouseX - this.offsetX;
                        this.draggingBlock.y = mouseY - this.offsetY;
                        this.render();
                        this.lastMouseX = mouseX;
                        this.lastMouseY = mouseY;
                    }
                }
                return;
            }
            if (this.connection_start && this.connection_end === null) {
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
                if (this._point_line_segment(
                    mouseX, mouseY,
                    conn.start.block.x + conn.start.x, conn.start.block.y + conn.start.y,
                    conn.end.block.x + conn.end.x, conn.end.block.y + conn.end.y
                )) {
                    if (!this.isOverConnection) {
                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.start.block.x + conn.start.x, conn.start.block.y + conn.start.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
                        let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                        this.canvas_context.strokeStyle = startColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();
                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.end.block.x + conn.end.x, conn.end.block.y + conn.end.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
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
                this.draggingBlock = null;
                this.render();
            }
            if (this.connection_start && this.connection_end === null) {
                setTimeout(() => {
                    this.connection_start = null;
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
                    if (this.connection_start === null) {
                        this.connection_start = this._point_details(block, mouseX, mouseY);
                    }
                    else if (this.connection_end === null) {
                        this.connection_end = this._point_details(block, mouseX, mouseY);
                        if (this.connection_start.block !== this.connection_end.block &&
                            !this._connection_exists(this.connection_start, this.connection_end)) {
                            this._connection_create(this.connection_start, this.connection_end);
                            block.addConnection({ id: this.connection_start.block.id, point: this.connection_start.point });
                        } else {
                            this.connection_start = null;
                            this.connection_end = null;
                            this.render();
                        }
                        this.connection_start = null;
                        this.connection_end = null;
                    }
                    return;
                }
            }
        }
        _menu_context(x, y) {
            let div = Q('<div>', { class: [classes.node_preferences, classes.node_preferences_small], style: { position: 'absolute', left: x + 'px', top: y + 'px' } });
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
                const block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this._menu_remove();
                    this._menu_preferences(block, mouseX, mouseY);
                    return;
                }
            }
            for (let i = 0; i < this.connections.length; i++) {
                const conn = this.connections[i];
                if (this._point_line_segment(
                    mouseX, mouseY,
                    conn.start.block.x + conn.start.x, conn.start.block.y + conn.start.y,
                    conn.end.block.x + conn.end.x, conn.end.block.y + conn.end.y
                )) {
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
            return '_' + Math.random().toString(36).substr(2, 9);
        }
        _menu_remove() {
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
                    conn.title = (conn.title && contitle !== null) ? contitle : '';
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
            let div = Q('<div>', { class: [classes.node_preferences, classes.node_preferences_big], id: block.id });
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
            return this.connections.some(conn => {
                const isDirectMatch =
                    conn.start.block === startConn.block && conn.start.point === startConn.point &&
                    conn.end.block === endConn.block && conn.end.point === endConn.point;
                const isReverseMatch =
                    conn.start.block === endConn.block && conn.start.point === endConn.point &&
                    conn.end.block === startConn.block && conn.end.point === startConn.point;
                return isDirectMatch || isReverseMatch;
            });
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
                Object.assign(conn.start, this._point_coords(conn.start.block, conn.start.point));
                Object.assign(conn.end, this._point_coords(conn.end.block, conn.end.point));
            });
        }
        _point_coords(block, pointId) {
            const connections = [
                { coords: block.leftConnCoords, conns: block.connLeft },
                { coords: block.rightConnCoords, conns: block.connRight }
            ];
            for (const { coords, conns } of connections) {
                const index = conns.findIndex(conn => conn.id === pointId);
                if (index !== -1) {
                    return { x: coords[index].x, y: coords[index].y };
                }
            }
            return { x: block.x, y: block.y };
        }
        _connection_over_point(block, x, y) {
            const radius = 5;
            return block.getAllConnectionCoords().some(coord => Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius);
        }
        _point_details(block, x, y) {
            x -= block.x;
            y -= block.y;
            const radius = 5;
            let matchedPoint = null;
            block.leftConnCoords.forEach((coord, index) => {
                if (Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius) {
                    matchedPoint = { block: block, point: block.connLeft[index].id, x: coord.x, y: coord.y, index: index };
                }
            });
            if (!matchedPoint) {
                block.rightConnCoords.forEach((coord, index) => {
                    if (Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius) {
                        matchedPoint = { block: block, point: block.connRight[index].id, x: coord.x, y: coord.y, index: index };
                    }
                });
            }
            return matchedPoint;
        }
        _point_line_segment(px, py, x1, y1, x2, y2) {
            const d1 = Math.hypot(px - x1, py - y1);
            const d2 = Math.hypot(px - x2, py - y2);
            const lineLen = Math.hypot(x2 - x1, y2 - y1);
            return d1 + d2 >= lineLen - 0.1 && d1 + d2 <= lineLen + 0.1;
        }
        _point_line_distance(px, py, x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;
            let t = 0;
            if (lenSq !== 0) {
                t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
                t = Math.max(0, Math.min(1, t));
            }
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;
            return Math.hypot(px - projX, py - projY);
        }
    }
    let appearance = {
        darkTextColor: '#888',
        lightTextColor: '#222',
        background: '#181818',
        grid: true,
        gridColor: '#161616',
        gridSize: 20,
        snapToGrid: false,
        movementResolution: 3,
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
    appearance = Object.assign(appearance, options);
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
    const {
        retries = 5,                   // Number of reconnection attempts (0 means unlimited)
        delay = 1000,                  // Initial delay between reconnections in ms
        protocols = [],                // WebSocket sub-protocols
        backoff = false,               // Exponential backoff toggle
        pingInterval = 0,              // Interval for heartbeat pings (ms); 0 disables
        pingMessage = 'ping',          // Message to send for heartbeat
        queueMessages = false,         // Queue messages if socket is not open yet
        autoReconnect = true,          // Automatically reconnect on close
        onOpen = null,                 // Additional callback on open
        onClose = null,                // Additional callback on close
        onError = null                 // Additional callback on error
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