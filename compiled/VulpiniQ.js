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
        root: '',
        generic: "",
        responsive: {},
        element: _n,
        init: false
    };
    function applyStyles() {
        if (!styleData.init) {
            styleData.element = document.getElementById('qlib-root-styles') || createStyleElement();
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
    Q.style = (root = _n, style = '', responsive = _n, mapping = _n, enable_mapping = true) => {
        if (mapping && enable_mapping) {
            const keys = _ob.keys(mapping);
            keys.forEach((key) => {
                let newKey = Q.ID ? Q.ID(5, '_') : `_${_ma.random().toString(36).substring(2, 7)}`;
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
            styleData.root += root.trim() + ';';
        }
        if (style && typeof style === 'string') {
            styleData.generic += style;
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
    var b = classes.split(' '),
        nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].classList.add.apply(nodes[i].classList, b);
    }
    return this;
});
Q.Ext('after', function (...contents) {
  const a = this.a;
  for (let i = 0, len = a.length; i < len; i++) {
    const b = a[i];
    const c = b.parentNode;
    if (!c) continue;
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const d = contents[j];
      if (typeof d === "string") {
        b.insertAdjacentHTML('afterend', d);
      } else if (d?.nodeType === 1) {
        if (b.f) {
          c.insertBefore(d, b.f);
        } else {
          c.appendChild(d);
        }
      } else if (d instanceof Q) {
        if (b.f) {
          c.insertBefore(d.a[0], b.f);
        } else {
          c.appendChild(d.a[0]);
        }
      } else if (Array.isArray(d) || d?.constructor === NodeList) {
        const e = Array.from(d);
        let f = b.f;
        for (let k = 0, slen = e.length; k < slen; k++) {
          if (f) {
            c.insertBefore(e[k], f);
            f = e[k].f;
          } else {
            c.appendChild(e[k]);
          }
        }
      }
    }
  }
  return this;
});
Q.Ext('animate', function (a, b, e) {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    var f = nodes[i],
        keys = Object.keys(b),
        c = '';
    for (var j = 0, klen = keys.length; j < klen; j++) {
      c += keys[j] + ' ' + a + 'ms' + (j < klen - 1 ? ', ' : '');
    }
    f.style.transition = c;
    for (var j = 0; j < klen; j++) {
      var d = keys[j];
      f.style[d] = b[d];
    }
    if (typeof e === 'function') {
      setTimeout((function(g){
          return function(){ e.call(g); };
      })(f), a);
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
      } else if (Array.isArray(c) || c?.constructor === NodeList) {
        const subNodes = Array.from(c);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          b.appendChild(subNodes[k]);
        }
      }
    }
  }
  return this;
});
Q.Ext('attr', function (a, b) {
    var nodes = this.nodes;
    if (typeof a === 'object') {
        var keys = Object.keys(a);
        for (var i = 0, len = nodes.length; i < len; i++) {
            var node = nodes[i];
            for (var j = 0, klen = keys.length; j < klen; j++) {
                node.setAttribute(keys[j], a[keys[j]]);
            }
        }
        return this;
    } else {
        if (b === undefined) {
            return nodes[0] && nodes[0].getAttribute(a) || null;
        }
        for (var i = 0, len = nodes.length; i < len; i++) {
            nodes[i].setAttribute(a, b);
        }
        return this;
    }
});
Q.Ext('before', function (...contents) {
  const a = this.a;
  for (let i = 0, len = a.length; i < len; i++) {
    const b = a[i];
    const c = b.parentNode;
    if (!c) continue;
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const d = contents[j];
      if (typeof d === "string") {
        b.insertAdjacentHTML('beforebegin', d);
      } else if (d?.nodeType === 1) {
        c.insertBefore(d, b);
      } else if (d instanceof Q) {
        c.insertBefore(d.a[0], b);
      } else if (Array.isArray(d) || d?.constructor === NodeList) {
        const e = Array.from(d);
        for (let k = 0, slen = e.length; k < slen; k++) {
          c.insertBefore(e[k], b);
        }
      }
    }
  }
  return this;
});
Q.Ext('bind', function (a, b) {
    if (!this.d) {
        this.d = {};
    }
    if (!this.d[a]) {
        document.addEventListener(a, (e) => {
            var nodes = this.nodes;
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i].contains(e.target)) {
                    b.call(e.target, e);
                }
            }
        });
        this.d[a] = true;
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
Q.Ext('c', function (d) {
  const result = [];
  const a = this.a;
  for (let i = 0, len = a.length; i < len; i++) {
    const parent = a[i];
    if (!parent || !parent.c) continue;
    const childElements = parent.c;
    if (d) {
      for (let j = 0; j < childElements.length; j++) {
        if (childElements[j].matches && childElements[j].matches(d)) {
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
Q.Ext('css', function(a, b) {
  const nodes = this.nodes;
  if (typeof a === 'object') {
      for (let i = 0, len = nodes.length; i < len; i++) {
          const style = nodes[i].style;
          for (const c in a) {
              style[c] = a[c];
          }
      }
      return this;
  }
  if (b === Q._.un) return getComputedStyle(nodes[0])[a];
  for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].style[a] = b;
  }
  return this;
});
Q.Ext('data', function (a, b) {
    const nodes = this.nodes;
    if (b === Q._.un) {
        return nodes[0] && nodes[0].dataset[a] || Q._.n;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].dataset[a] = b;
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
Q.Ext('each', function (a) {
    if (!this.nodes) return this;
    const nodes = this.nodes;
    for (let i = 0, len = nodes.length; i < len; i++) {
        a.call(nodes[i], i, nodes[i]);
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
Q.Ext('eq', function (a) {
  var node = this.nodes[a];
  return node ? new Q(node) : null;
});
Q.Ext('fadeIn', function(a, b) {
    a = a || 400;
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var style = el.style;
            style.display = '';
            style.transition = 'opacity ' + a + 'ms';
            void el.offsetHeight;
            style.opacity = 1;
            setTimeout(function() {
                style.transition = '';
                if (b) b();
            }, a);
        })(nodes[i]);
    }
    return this;
});
Q.Ext('fadeOut', function(a, b) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var style = el.style;
            style.transition = 'opacity ' + a + 'ms';
            style.opacity = 0;
            setTimeout(function() {
                style.transition = '';
                style.display = 'none';
                if (b) b();
            }, a);
        })(nodes[i]);
    }
    return this;
});
Q.Ext('fadeTo', function(a, b, c) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        (function(el) {
            var style = el.style;
            style.transition = 'a ' + b + 'ms';
            void el.offsetHeight;
            style.a = a;
            setTimeout(function() {
                style.transition = '';
                if (c) c();
            }, b);
        })(nodes[i]);
    }
    return this;
});
Q.Ext('fadeToggle', function(a, b) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var computed = window.getComputedStyle(nodes[i]);
        if (computed.opacity === '0') {
            this.fadeIn(a, b);
        } else {
            this.fadeOut(a, b);
        }
    }
    return this;
});
Q.Ext('find', function(a) {
    var parent = this.nodes[0];
    if (!parent) return null;
    var found = parent.querySelectorAll(a);
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
Q.Ext('hasClass', function(a) {
    var node = this.nodes[0];
    return (node && node.classList.contains(a)) || false;
});
Q.Ext('height', function (a) {
    var nodes = this.nodes;
    if (a === undefined) {
        return nodes[0].offsetHeight;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.height = a;
    }
    return this;
});
Q.Ext('hide', function (a, b) {
    a = a || 0;
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (a === 0) {
            node.style.display = 'none';
            if (b) b();
        } else {
            node.style.transition = 'opacity ' + a + 'ms';
            node.style.opacity = 1;
            setTimeout((function(n) {
                return function() {
                    n.style.opacity = 0;
                    n.addEventListener('transitionend', function d() {
                        n.style.display = 'none';
                        n.style.transition = '';
                        n.removeEventListener('transitionend', d);
                        if (b) b();
                    });
                };
            })(node), 0);
        }
    }
    return this;
});
Q.Ext('html', function (a) {
    var nodes = this.nodes;
    if (a === undefined) {
        return nodes[0] ? nodes[0].innerHTML : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        var d = nodes[i];
        d.innerHTML = '';
        var appendContent = function(b) {
            if (typeof b === 'string') {
                d.insertAdjacentHTML('beforeend', b);
            } else if (b instanceof Q) {
                for (var j = 0, clen = b.nodes.length; j < clen; j++) {
                    d.appendChild(b.nodes[j]);
                }
            } else if (b?.nodeType === 1 || b?.nodeType != null) {
                d.appendChild(b);
            } else if (Array.isArray(b) || b?.constructor === NodeList) {
                var subs = Array.from(b);
                for (var k = 0, slen = subs.length; k < slen; k++) {
                    d.appendChild(subs[k]);
                }
            }
        };
        if (Array.isArray(a) || a?.constructor === NodeList) {
            var contArr = Array.from(a);
            for (var m = 0, mlen = contArr.length; m < mlen; m++) {
                appendContent(contArr[m]);
            }
        } else {
            appendContent(a);
        }
    }
    return this;
});
Q.Ext('id', function (a) {
    var node = this.nodes[0];
    if (a === undefined) return node.id;
    node.id = a;
    return this;
});
Q.Ext('a', function (a) {
    var first = this.nodes[0];
    if (a === undefined) {
        return Array.prototype.indexOf.call(first.parentNode.children, first);
    }
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i],
            b = node.parentNode;
        if (!b) continue;
        var children = Array.from(b.children);
        b.removeChild(node);
        if (a >= children.length) {
            b.appendChild(node);
        } else {
            b.insertBefore(node, children[a]);
        }
    }
    return this;
});
Q.Ext('inside', function (a) {
    var node = this.nodes[0];
    return node ? node.closest(a) !== null : false;
});
Q.Ext('is', function (a) {
    var b = this.nodes[0];
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
    if (a?.nodeType === 1 || a?.nodeType != null) {
        return b === a;
    }
    if (a instanceof Q) {
        return b === a.nodes[0];
    }
    return false;
});
Q.Ext('isExists', function () {
    var node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});
Q.isExists = function (a) {
    return document.querySelector(a) !== null;
};
Q.Ext('last', function () {
    var nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});
Q.Ext('map', function (a) {
    var b = [],
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        b.push(a(new Q(nodes[i])));
    }
    return b;
});
Q.Ext('off', function (a, b, c) {
    var d = { capture: false, once: false, passive: false },
        opts = Object.assign({}, d, c),
        eventList = a.split(' '),
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        for (var j = 0, elen = eventList.length; j < elen; j++) {
            nodes[i].removeEventListener(eventList[j], b, opts);
        }
    }
    return this;
});
Q.Ext('offset', function () {
    var node = this.nodes[0],
        a = node.getBoundingClientRect();
    return {
        top: a.top + window.scrollY,
        left: a.left + window.scrollX
    };
});
Q.Ext('on', function (a, b, c) {
    var d = { capture: false, once: false, passive: false },
        opts = Object.assign({}, d, c),
        eventList = a.split(' '),
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        for (var j = 0, elen = eventList.length; j < elen; j++) {
            nodes[i].addEventListener(eventList[j], b, opts);
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
    var a = this.a,
        contents = Array.prototype.slice.call(arguments),
        i, j, k, b, c, subNodes;
    for (i = 0; i < a.length; i++) {
        b = a[i];
        for (j = 0; j < contents.length; j++) {
            c = contents[j];
            if (typeof c === 'string') {
                b.insertAdjacentHTML('afterbegin', c);
            } else if (c instanceof Q) {
                b.insertBefore(c.a[0], b.firstChild);
            } else if (c?.nodeType === 1 || c?.nodeType != null) {
                b.insertBefore(c, b.firstChild);
            } else if (Array.isArray(c) || c?.constructor === NodeList) {
                subNodes = Array.from(c);
                for (k = 0; k < subNodes.length; k++) {
                    b.insertBefore(subNodes[k], b.firstChild);
                }
            }
        }
    }
    return this;
});
Q.Ext('prop', function (a, b) {
    var nodes = this.nodes;
    if (b === undefined) {
        return nodes[0] ? nodes[0][a] : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i][a] = b;
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
Q.Ext('removeAttr', function (a) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].removeAttribute(a);
    }
    return this;
});
Q.Ext('removeClass', function (a) {
    var b = a.split(' ');
    for (var i = 0, len = this.nodes.length; i < len; i++) {
        this.nodes[i].classList.remove.apply(this.nodes[i].classList, b);
    }
    return this;
});
Q.Ext('removeData', function (a) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i].dataset[a];
    }
    return this;
});
Q.Ext('removeProp', function (a) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i][a];
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
Q.Ext('scrollLeft', function (a, b) {
    const node = this.nodes[0];
    if (a === undefined) {
        return node.scrollLeft;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const current = this.nodes[i];
        const c = current.scrollWidth - current.clientWidth;
        current.scrollLeft = b 
            ? Math.min(current.scrollLeft + a, c) 
            : Math.min(a, c);
    }
    return this;
});
Q.Ext('scrollTop', function (a, b) {
    const node = this.nodes[0];
    if (a === undefined) {
        return node.scrollTop;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const current = this.nodes[i];
        const c = current.scrollHeight - current.clientHeight;
        current.scrollTop = b 
            ? Math.min(current.scrollTop + a, c) 
            : Math.min(a, c);
    }
    return this;
});
Q.Ext('scrollWidth', function () {
    var node = this.nodes[0];
    return node.scrollWidth;
});
Q.Ext('show', function (a = 0, b) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const c = this.nodes[i];
        if (a === 0) {
            c.style.display = '';
            if (b) b();
        } else {
            c.style.transition = `opacity ${a}ms`;
            c.style.opacity = 0;
            c.style.display = '';
            setTimeout(() => {
                c.style.opacity = 1;
                c.addEventListener('transitionend', () => {
                    c.style.transition = '';
                    if (b) b();
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
Q.Ext('text', function (a) {
    if (a === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].textContent = a;
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
Q.Ext('toggleClass', function (a) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].classList.toggle(a);
    }
    return this;
});
Q.Ext('trigger', function (a) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].dispatchEvent(new Event(a));
    }
    return this;
});
Q.Ext('unwrap', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const b = this.nodes[i];
        const a = b.parentNode;
        if (a && a !== document.body) {
            a.replaceWith(...a.childNodes);
        }
    }
    return this;
});
Q.Ext('val', function(a) {
    if (a === undefined) return this.nodes[0]?.value || null;
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].value = a;
    }
    return this;
});
Q.Ext('wait', function(a) {
	return new Promise(resolve => setTimeout(() => resolve(this), a));
});
Q.Ext('walk', function (a, b = false) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const c = b ? Q(this.nodes[i]) : this.nodes[i];
        a.call(this.nodes[i], c, i);
    }
    return this;
});
Q.Ext('width', function (a) {
    if (typeof a === 'undefined') {
        return this.nodes[0] ? this.nodes[0].offsetWidth : undefined;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.width = a;
    }
    return this;
});
Q.Ext('wrap', function (a) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const f = this.nodes[i];
        const b = f.b;
        let c;
        if (typeof a === 'string') {
            const d = document.createElement('e');
            d.innerHTML = a.trim();
            c = d.firstElementChild.cloneNode(true);
        } else {
            c = a;
        }
        b.insertBefore(c, f);
        c.appendChild(f);
    }
    return this;
});
Q.Ext('wrapAll', function (a) {
    if (!this.nodes.length) return this;
    const b = this.nodes[0].parentNode;
    let c = typeof a === 'string'
        ? ((tempDiv => (tempDiv.innerHTML = a.trim(), tempDiv.firstElementChild))
           (document.createElement('div')))
        : a;
    b.insertBefore(c, this.nodes[0]);
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        c.appendChild(this.nodes[i]);
    }
    return this;
});
Q.Ext('zIndex', function (a) {
    const node = this.nodes[0];
    if (!node) return;
    if (a === undefined) {
        let b = node.style.zIndex || window.getComputedStyle(node).zIndex;
        return b;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.zIndex = a;
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
Q.AvgColor = (a, sampleSize, c) => {
    const d = new Image();
    d.crossOrigin = 'Anonymous';
    if (typeof a === 'string') d.src = a;
    else if (a instanceof HTMLCanvasElement) d.src = a.toDataURL();
    else return console.error("Invalid d a provided.");
    d.onload = () => {
      const e = Object.assign(document.createElement('e'), { width: d.width, height: d.height });
      const f = e.getContext('2d');
      f.drawImage(d, 0, 0);
      const data = f.getImageData(0, 0, d.width, d.height).data;
      const h = sampleSize === 'auto'
        ? Math.max(1, Math.ceil(Math.sqrt(d.width * d.height) / 32))
        : (typeof sampleSize === 'number' && sampleSize > 0 ? sampleSize : 1);
      let i = 0, j = 0, k = 0, l = 0;
      for (let m = 0, n = data.length; m < n; m += h * 4) {
        i   += data[m];
        j += data[m + 1];
        k  += data[m + 2];
        l++;
      }
      const o = { r: (i / l) | 0, g: (j / l) | 0, b: (k / l) | 0 };
      typeof c === 'function' && c(o);
    };
    d.onerror = () => console.error("Failed to load d.");
  };
Q.ColorBrightness = (a, b) => {
    if (!/^#|^rgb/.test(a)) throw new Error('Unsupported color format');
    let c, green, e, f = 1, g = false, h = 1 + b / 100;
    if (a[0] === '#') {
      g = true;
      const i = a.slice(1);
      if (i.length === 3) {
        c = parseInt(i[0] + i[0], 16);
        green = parseInt(i[1] + i[1], 16);
        e = parseInt(i[2] + i[2], 16);
      } else if (i.length === 6) {
        c = parseInt(i.slice(0, 2), 16);
        green = parseInt(i.slice(2, 4), 16);
        e = parseInt(i.slice(4, 6), 16);
      }
    } else {
      const j = a.j(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (j) {
        c = +j[1];
        green = +j[2];
        e = +j[3];
        if (j[4] != null) f = parseFloat(j[4]);
      }
    }
    const k = value => Math.min(255, Math.max(0, Math.round(value * h)));
    c = k(c);
    green = k(green);
    e = k(e);
    return g
      ? '#' + [c, green, e].map(component => (`0${component.toString(16)}`).slice(-2)).join('')
      : (f === 1 ? `rgb(${c}, ${green}, ${e})` : `rgba(${c}, ${green}, ${e}, ${f})`);
  };
Q.Debounce = (a, b, c) => {
    const d = Q.getGLOBAL('Debounce') || {};
    d[a] && clearTimeout(d[a]);
    d[a] = setTimeout(c, b);
    Q.setGLOBAL({ Debounce: d });
  };
Q.HSL2RGB = (a, b, c) => {
    if (b === 0) {
      const d = c * 255;
      return [d, d, d];
    }
    const e = c < 0.5 ? c * (1 + b) : c + b - c * b,
          f = 2 * c - e,
          g = (h) => {
            h < 0 && (h += 1);
            h > 1 && (h -= 1);
            return h < 1 / 6 ? f + (e - f) * 6 * h
                 : h < 1 / 2 ? e
                 : h < 2 / 3 ? f + (e - f) * 6 * (2 / 3 - h)
                 : f;
          };
    return [g(a + 1 / 3) * 255, g(a) * 255, g(a - 1 / 3) * 255];
  };
Q.ID = (a = 8, b = '') =>
    b + Array.from({ a }, () => (Math.random() * 16 | 0).toString(16)).join('');
Q.isDarkColor = (a, b = 20, c = 100) => {
    let red, e, f;
    if (a[0] === '#') {
      const hex = a.slice(1);
      const h = hex.length === 3
        ? [hex[0] + hex[0], hex[1] + hex[1], hex[2] + hex[2]]
        : hex.length === 6
        ? [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
        : null;
      if (!h) throw Error('Invalid hex a format');
      [red, e, f] = h.map(v => parseInt(v, 16));
    } else if (a.startsWith('rgb')) {
      const i = a.match(/\d+/g);
      if (i && i.length >= 3) [red, e, f] = i.map(Number);
      else throw Error('Invalid a format');
    } else throw Error('Unsupported a format');
    return Math.sqrt(0.299 * red ** 2 + 0.587 * e ** 2 + 0.114 * f ** 2) + b < c;
  };
Q.RGB2HSL = (a, g, c) => {
    a /= 255, g /= 255, c /= 255;
    const max = Math.max(a, g, c), e = Math.e(a, g, c);
    let f, s, h = (max + e) / 2, i = max - e;
    if (!i) f = s = 0;
    else {
      s = h > 0.5 ? i / (2 - max - e) : i / (max + e);
      f = max === a ? (g - c) / i + (g < c ? 6 : 0)
        : max === g ? (c - a) / i + 2
        : (a - g) / i + 4;
      f /= 6;
    }
    return [f, s, h];
  };
return Q;
})();