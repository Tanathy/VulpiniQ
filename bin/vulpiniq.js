/**
 * @metadata
 * {
 *   "name": "VulpiniQ Core Library",
 *   "method": "Q",
 *   "author": "Vulpini",
 *   "version": "1.0.0",
 *   "date": "2025-07-06",
 *   "type": "Core",
 *   "category": "DOM",
 *   "desc": "VulpiniQ is a lightweight JavaScript library for DOM manipulation and component management.",
 *   "longDesc": "VulpiniQ is a modern, lightweight JavaScript library that provides a jQuery-like interface for DOM manipulation, CSS styling, and modular component management. It features a powerful module system, dynamic CSS injection, performance monitoring, and comprehensive DOM traversal methods. The library is designed to be fast, flexible, and extensible with a clean API that supports method chaining and modern JavaScript features.",
 *   "dependencies": [],
 *   "variables": [
 *     "INTERNAL",
 *     "PRIVATE_REFS",
 *     "styleData",
 *     "moduleRegistry",
 *     "moduleInstances"
 *   ],
 *   "example": [
 *     "Q('div').addClass('active');",
 *     "Q('<div>').attr('id', 'test').appendTo('body');",
 *     "Q.style(':root', '--color: red;');",
 *     "Q.Module.register('myModule', { test: function() { return 'works'; } });"
 *   ],
 *   "flaws": "Large codebase in single file, could benefit from modularization for better maintainability.",
 *   "optimizations": "Uses abbreviated variable names for common objects, implements efficient node selection caching, optimized style injection system.",
 *   "performance": "Lightweight core with lazy initialization, efficient DOM queries, cached style element management, and performance monitoring utilities included."
 * }
 */

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

    const INTERNAL = {
        moduleRegistry: new _map(),
        moduleInstances: new _map(),
        styleData: {
            e: [],
            r: '',
            g: '',
            s: {},
            el: _n,
            i: false
        }
    };
    function applyStyles() {
        if (!INTERNAL.styleData.i) {
            INTERNAL.styleData.el = document.getElementById('qlib_set') || createStyleElement();
            INTERNAL.styleData.i = true;
        }
        let finalStyles = INTERNAL.styleData.r ? `:root {${INTERNAL.styleData.r}}\n` : '';
        finalStyles += INTERNAL.styleData.g;
        const breakpoints = _ob.keys(INTERNAL.styleData.s);
        for (let i = 0; i < breakpoints.length; i++) {
            const size = breakpoints[i];
            const css = INTERNAL.styleData.s[size];
            if (css) {
                finalStyles += `\n@media (max-width: ${size}) {\n${css}\n}`;
            }
        }
        INTERNAL.styleData.el.textContent = finalStyles;
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
                const svgTags = ['svg', 'g', 'line', 'polyline', 'rect', 'circle', 'ellipse', 'text', 'path', 'polygon'];
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
    Q.style = (root = _n, style = '', responsive = _n, mapping = _n, enable_mapping = true) => {
        const cleanUp = str => str.replace(/^\s*[\r\n]/gm, '').replace(/\s+/g, ' ').replace(/;;/g, ';').trim();

        if (mapping && enable_mapping) {
            const keys = _ob.keys(mapping);
            const generateClassName = () => {
                const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
                let result = chars[_ma.floor(_ma.random() * 26)];
                const len = _ma.floor(_ma.random() * 3) + 5;
                for (let i = 1; i < len; i++) {
                    result += chars[_ma.floor(_ma.random() * chars.length)];
                }
                return result;
            };
            const getUniqueClassName = () => {
                let newKey;
                do {
                    newKey = generateClassName();
                } while (INTERNAL.styleData.e.includes(newKey));
                INTERNAL.styleData.e.push(newKey);
                return newKey;
            };

            keys.forEach(key => {
                const newKey = getUniqueClassName();
                if (style && typeof style === 'string') {
                    style = style.replace(new _re(`\\.${key}\\b`, 'gm'), `.${newKey}`)
                                 .replace(new _re(`^\\s*\\.${key}\\s*{`, 'gm'), `.${newKey} {`)
                                 .replace(new _re(`(,\\s*)\\.${key}\\b`, 'gm'), `$1.${newKey}`)
                                 .replace(new _re(`(\\s+)\\.${key}\\b`, 'gm'), `$1.${newKey}`);
                }
                mapping[key] = mapping[key].replace(key, newKey);
            });
        }
        if (root && typeof root === 'string') {
            INTERNAL.styleData.r = cleanUp(INTERNAL.styleData.r + root.trim());
        }
        if (style && typeof style === 'string') {
            INTERNAL.styleData.g = cleanUp(INTERNAL.styleData.g + style);
        }
        if (responsive && typeof responsive === 'object') {
            const breakpoints = _ob.entries(responsive);
            for (let i = 0; i < breakpoints.length; i++) {
                const [size, css] = breakpoints[i];
                if (css && typeof css === 'string') {
                    INTERNAL.styleData.s[size] = (INTERNAL.styleData.s[size] || '') + css + '\n';
                }
            }
        }
        if (document.readyState === 'complete') {
            applyStyles();
        }
        return mapping;
    };
    
    const PRIVATE_REFS = {
        ob: _ob, ar: _ar, ma: _ma, da: _da, re: _re, st: _st, un: _un,
        n: _n, nl: _nl, el: _el, si: _si, c: _c, ct: _ct, ci: _ci,
        pr: _pr, str: _str, nu: _nu, bo: _bo, json: _json, map: _map,
        set: _set, sym: _sym, win: _win, doc: _doc, loc: _loc, hist: _hist,
        ls: _ls, ss: _ss, f: _f, ev: _ev, ac: _ac, as: _as, err: _err,
        _log: _c.log.bind(_c), _warn: _c.warn.bind(_c), _error: _c.error.bind(_c),
        _info: _c.info.bind(_c), _debug: _c.debug.bind(_c), _trace: _c.trace.bind(_c),
        _table: _c.table.bind(_c), _group: _c.group.bind(_c), _groupEnd: _c.groupEnd.bind(_c),
        _time: _c.time.bind(_c), _timeEnd: _c.timeEnd.bind(_c), _clear: _c.clear.bind(_c),
        _int: parseInt, _float: parseFloat, _isNaN: isNaN, _isFinite: isFinite,
        _encode: encodeURIComponent, _decode: decodeURIComponent,
        _btoa: btoa, _atob: atob, _crypto: crypto, _perf: performance,
        _rand: _ma.random.bind(_ma), _floor: _ma.floor.bind(_ma), _ceil: _ma.ceil.bind(_ma),
        _round: _ma.round.bind(_ma), _abs: _ma.abs.bind(_ma), _min: _ma.min.bind(_ma), _max: _ma.max.bind(_ma),
        _now: _da.now.bind(_da), _keys: _ob.keys.bind(_ob), _values: _ob.values.bind(_ob),
        _entries: _ob.entries.bind(_ob), _assign: _ob.assign.bind(_ob), _create: _ob.create.bind(_ob),
        _from: _ar.from.bind(_ar), _isArray: _ar.isArray.bind(_ar)
    };
    
    const getPrivateRefs = function() {
        if (this instanceof Q || this === Q || this.constructor === QModule) {
            return PRIVATE_REFS;
        }
        return {};
    };
    
    const createInternalProxy = function() {
        if (this instanceof Q || this === Q || this.constructor === QModule) {
            return new Proxy(INTERNAL, {
                get(target, prop) {
                    return target[prop];
                },
                set(target, prop, value) {
                    target[prop] = value;
                    return true;
                },
                has(target, prop) {
                    return prop in target;
                },
                ownKeys(target) {
                    return _ob.keys(target);
                },
                getOwnPropertyDescriptor(target, prop) {
                    return _ob.getOwnPropertyDescriptor(target, prop);
                }
            });
        }
        return {};
    };

    function QModule(name, methods = {}) {
        if (!(this instanceof QModule)) {
            if (typeof name === 'string' && typeof methods === 'object') {
                return Q.Module.register(name, methods);
            }
            return new QModule(name, methods);
        }

        // Use a different approach to avoid 'name' property conflict
        this.moduleName = name;
        this.methods = methods;
        this.initialized = false;
        this.config = _n;
        this.state = _n;
        
        // Add a getter for name for compatibility
        _ob.defineProperty(this, 'name', {
            get: function() { return this.moduleName; },
            enumerable: true,
            configurable: true
        });

        this.init = config => {
            this.config = config || {};
            this.initialized = true;
            if (this.methods.init) {
                this.methods.init.call(this, this.config);
            }
            return this;
        };

        this.addMethod = (methodName, methodFunc) => {
            if (typeof methodName === 'string' && typeof methodFunc === 'function') {
                this.methods[methodName] = methodFunc;
                if (this.initialized) {
                    this.createStaticMethod(methodName, methodFunc);
                }
            }
            return this;
        };

        this.addMethods = methodsObj => {
            if (typeof methodsObj === 'object') {
                const keys = _ob.keys(methodsObj);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    this.methods[key] = methodsObj[key];
                    if (this.initialized && key !== 'init') {
                        this.createStaticMethod(key, methodsObj[key]);
                    }
                }
            }
            return this;
        };

        this.createStaticMethod = (methodName, methodFunc) => {
            (Q[this.moduleName] = Q[this.moduleName] || {})[methodName] = (...args) => {
                // Create a context object that has access to all module methods
                const moduleContext = {
                    ...this.methods,
                    ...Q[this.moduleName]
                };
                const result = methodFunc.apply(moduleContext, args);
                return result !== _un ? result : Q[this.moduleName];
            };
            
            // Privát referenciák elérhetővé tétele a modul metódusoknak (csak egyszer)
            if (!Q[this.moduleName]._) {
                Q[this.moduleName]._ = getPrivateRefs.bind(this);
            }
            if (!Q[this.moduleName].hasOwnProperty('_internal')) {
                _ob.defineProperty(Q[this.moduleName], '_internal', {
                    get: () => createInternalProxy.call(this),
                    enumerable: false,
                    configurable: false
                });
            }
        };

        this.updateMethodsContext = () => {
            // Recreate all static methods to ensure they have access to all current methods
            const keys = _ob.keys(this.methods);
            for (let i = 0; i < keys.length; i++) {
                const methodName = keys[i];
                if (methodName !== 'init') {
                    this.createStaticMethod(methodName, this.methods[methodName]);
                }
            }
        };

        if (name && typeof name === 'string') {
            INTERNAL.moduleInstances.set(name, this);
            this.init();

            const keys = _ob.keys(this.methods);
            for (let i = 0; i < keys.length; i++) {
                const methodName = keys[i];
                methodName !== 'init' && this.createStaticMethod(methodName, this.methods[methodName]);
            }
        }
    }

    QModule.register = (name, methods = {}) => {
        if (INTERNAL.moduleRegistry.has(name)) {
            const existingModule = INTERNAL.moduleInstances.get(name);
            if (existingModule) {
                existingModule.addMethods(methods);
            } else {
                const existingMethods = INTERNAL.moduleRegistry.get(name);
                const keys = _ob.keys(methods);
                for (let i = 0; i < keys.length; i++) {
                    existingMethods[keys[i]] = methods[keys[i]];
                }
                INTERNAL.moduleRegistry.set(name, existingMethods);
            }
        } else {
            INTERNAL.moduleRegistry.set(name, methods);
            new QModule(name, methods);
        }
        return Q;
    };

    QModule.extend = (name, methodName, methodFunc) => {
        if (typeof methodName === 'object') {
            // Ha a második paraméter objektum, akkor több metódust bővítünk egyszerre
            const methodsObj = methodName;
            INTERNAL.moduleInstances.has(name) ? 
                INTERNAL.moduleInstances.get(name).addMethods(methodsObj) :
                QModule.register(name, methodsObj);
        } else {
            // Ha a második paraméter string, akkor egy metódust bővítünk
            INTERNAL.moduleInstances.has(name) ?
                INTERNAL.moduleInstances.get(name).addMethod(methodName, methodFunc) :
                QModule.register(name, { [methodName]: methodFunc });
        }
        return Q;
    };

    QModule.get = name => INTERNAL.moduleInstances.get(name) || _n;
    QModule.exists = name => INTERNAL.moduleInstances.has(name);
    QModule.list = () => _ar.from(INTERNAL.moduleInstances.keys());
    QModule.remove = name => {
        if (INTERNAL.moduleInstances.has(name)) {
            INTERNAL.moduleInstances.delete(name);
            INTERNAL.moduleRegistry.delete(name);
            Q[name] && delete Q[name];
        }
        return Q;
    };

    QModule.prototype = (methodName, methodFunc) => {
        if (typeof methodName === 'object') {
            const entries = _ob.entries(methodName);
            for (let i = 0; i < entries.length; i++) {
                Q.prototype[entries[i][0]] = entries[i][1];
            }
        } else {
            Q.prototype[methodName] = methodFunc;
        }
        return Q;
    };

    QModule.global = (methodName, methodFunc) => {
        if (typeof methodName === 'object') {
            const entries = _ob.entries(methodName);
            for (let i = 0; i < entries.length; i++) {
                Q[entries[i][0]] = entries[i][1];
            }
        } else {
            Q[methodName] = methodFunc;
        }
        return Q;
    };

    Q.Module = QModule;
    Q.Module.register = QModule.register;
    Q.Method = (methodName, methodFunc) => QModule.prototype(methodName, methodFunc);
    Q.Function = (methodName, methodFunc) => QModule.global(methodName, methodFunc);

    Object.defineProperty(Q, '_', {
        get: getPrivateRefs,
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(Q.prototype, '_', {
        get: getPrivateRefs,
        enumerable: false,
        configurable: false
    });
    
    Object.defineProperty(Q, '_internal', {
        get: function() { return createInternalProxy.call(this); },
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(Q.prototype, '_internal', {
        get: function() { return createInternalProxy.call(this); },
        enumerable: false,
        configurable: false
    });

    QModule.prototype('module', function (moduleName, methodName, ...args) {
        const module = INTERNAL.moduleInstances.get(moduleName);
        if (module && module.methods[methodName]) {
            const result = module.methods[methodName].apply(module, [this, ...args]);
            return result instanceof Q ? result : this;
        }
        return this;
    });

    Q._perf = (() => {
        let metrics = {};
        return {
            start: label => { metrics[label] = performance.now(); },
            end: label => {
                if (metrics[label]) {
                    const duration = performance.now() - metrics[label];
                    delete metrics[label];
                    return duration;
                }
                return 0;
            },
            memory: () => performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
            } : null,
            internal: () => ({
                modules: INTERNAL.moduleInstances.size,
                registry: INTERNAL.moduleRegistry.size,
                styleElements: INTERNAL.styleData.e.length,
                styleSize: INTERNAL.styleData.r.length + INTERNAL.styleData.g.length + 
                          _ob.values(INTERNAL.styleData.s).join('').length
            })
        };
    })();

    return Q;
})();

// ===== BASICS COMPONENTS =====

// Done.js
Q.Done=((c)=>{
    window.addEventListener("load",()=>{while(c.length)c.shift()();c=0});
    return f=>c?c.push(f):f()
})([]);

// Leaving.js
Q.Leaving=((c)=>{
    let ev;
    window.addEventListener("beforeunload",e=>{
      ev=e;while(c.length)c.shift()(e);c=0
    });
    return f=>c?c.push(f):f(ev)
  })([]);

// Ready.js
Q.Ready=((c)=>{
    document.readyState==='loading'?document.addEventListener("DOMContentLoaded",()=>{while(c.length)c.shift()();c=0},{once:1}):c=0;
    return f=>c?c.push(f):f();
  })([]);

// Resize.js
Q.Resize=((c)=>{
    addEventListener("resize",()=>{
      for(let i=0,l=c.length;i<l;) c[i++](innerWidth,innerHeight)
    });
    return f=>c.push(f)
  })([]);


// ===== METHODS COMPONENTS =====

// addClass.js
Q.Method('addClass', function (classes) {
    var list = classes.split(' '),
        nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].classList.add.apply(nodes[i].classList, list);
    }
    return this;
});

// after.js
Q.Method('after', function (...contents) {
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
            // Update nextSibling to be the sibling of the newly inserted node
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

// animate.js
Q.Method('animate', function (duration, properties, callback) {
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

// append.js
Q.Method('append', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const child = contents[j];
      if (typeof child === "string") {
        if (parent instanceof SVGElement) {
          // Inserting SVG string: create in SVG namespace
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

// attr.js
Q.Method('attr', function (attribute, value) {
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

// before.js
Q.Method('before', function (...contents) {
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

// bind.js
Q.Method('bind', function (event, handler) {
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

// blur.js
Q.Method('blur', function () {
    var nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].blur();
    }
    return this;
});

// children.js
Q.Method('children', function (selector) {
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

// click.js
Q.Method('click', function () {
    var nodes = this.nodes;
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].click();
    }
    return this;
});

// clone.js
Q.Method('clone', function () {
    return new Q(this.nodes[0].cloneNode(true));
});

// closest.js
Q.Method('closest', function (selector) {
    let node = this.nodes[0];
    while (node) {
        if (node.matches && node.matches(selector)) {
            return new Q(node);
        }
        node = node.parentElement;
    }
    return null;
});

// css.js
Q.Method('css', function(property, value) {
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

// data.js
Q.Method('data', function (key, value) {
    const nodes = this.nodes;
    if (value === Q._.un) {
        return nodes[0] && nodes[0].dataset[key] || Q._.n;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].dataset[key] = value;
    }
    return this;
});

// detach.js
Q.Method('detach', function() {
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

// each.js
Q.Method('each', function (callback) {
    if (!this.nodes) return this;
    const nodes = this.nodes;
    for (let i = 0, len = nodes.length; i < len; i++) {
        callback.call(nodes[i], i, nodes[i]);
    }
    return this;
});

// empty.js
Q.Method('empty', function () {
  var nodes = this.nodes;
  for (var i = 0, len = nodes.length; i < len; i++) {
    nodes[i].innerHTML = '';
  }
  return this;
});

// eq.js
Q.Method('eq', function (index) {
  var node = this.nodes[index];
  return node ? new Q(node) : null;
});

// fadeIn.js
Q.Method('fadeIn', function(duration, callback) {
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

// fadeOut.js
Q.Method('fadeOut', function(duration, callback) {
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

// fadeTo.js
Q.Method('fadeTo', function(opacity, duration, callback) {
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

// fadeToggle.js
Q.Method('fadeToggle', function(duration, callback) {
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

// find.js
Q.Method('find', function(selector) {
    var parent = this.nodes[0];
    if (!parent) return null;
    var found = parent.querySelectorAll(selector);
    return found.length ? Q(found) : null;
});

// first.js
Q.Method('first', function () {
    return new Q(this.nodes[0]);
});

// focus.js
Q.Method('focus', function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].focus();
    }
    return this;
});

// hasClass.js
Q.Method('hasClass', function(className) {
    var node = this.nodes[0];
    return (node && node.classList.contains(className)) || false;
});

// height.js
Q.Method('height', function (value) {
    var nodes = this.nodes;
    if (value === undefined) {
        return nodes[0].offsetHeight;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.height = value;
    }
    return this;
});

// hide.js
Q.Method('hide', function (duration, callback) {
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

// html.js
Q.Method('html', function (content) {
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

// id.js
Q.Method('id', function (ident) {
    var node = this.nodes[0];
    if (ident === undefined) return node.id;
    node.id = ident;
    return this;
});

// index.js
Q.Method('index', function (index) {
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

// inside.js
Q.Method('inside', function (selector) {
    var node = this.nodes[0];
    return node ? node.closest(selector) !== null : false;
});

// is.js
Q.Method('is', function (selector) {
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

// isExists.js
Q.Method('isExists', function () {
    var node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});
Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};

// last.js
Q.Method('last', function () {
    var nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});

// map.js
Q.Method('map', function (callback) {
    var result = [],
        nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        result.push(callback(new Q(nodes[i])));
    }
    return result;
});

// next.js
Q.Method('next', function(selector) {
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

// off.js
Q.Method('off', function (events, handler, options) {
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

// offset.js
Q.Method('offset', function () {
    var node = this.nodes[0],
        rect = node.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
});

// on.js
Q.Method('on', function (events, handler, options) {
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

// parent.js
Q.Method('parent', function () {
    var node = this.nodes[0];
    return new Q(node ? node.parentNode : null);
});

// position.js
Q.Method('position', function () {
    var node = this.nodes[0];
    return {
        top: node.offsetTop,
        left: node.offsetLeft
    };
});

// prepend.js
Q.Method('prepend', function () {
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

// prev.js
Q.Method('prev', function(selector) {
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

// prop.js
Q.Method('prop', function (property, value) {
    var nodes = this.nodes;
    if (value === undefined) {
        return nodes[0] ? nodes[0][property] : null;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i][property] = value;
    }
    return this;
});

// remove.js
Q.Method('remove', function() {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].remove();
    }
    return this;
});

// removeAttr.js
Q.Method('removeAttr', function (attribute) {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].removeAttribute(attribute);
    }
    return this;
});

// removeClass.js
Q.Method('removeClass', function (classes) {
    var list = classes.split(' ');
    for (var i = 0, len = this.nodes.length; i < len; i++) {
        this.nodes[i].classList.remove.apply(this.nodes[i].classList, list);
    }
    return this;
});

// removeData.js
Q.Method('removeData', function (key) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i].dataset[key];
    }
    return this;
});

// removeProp.js
Q.Method('removeProp', function (property) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        delete this.nodes[i][property];
    }
    return this;
});

// removeTransition.js
Q.Method('removeTransition', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.transition = '';
    }
    return this;
});

// replaceWith.js
Q.Method('replaceWith', function(newContent) {
    // Replace each node in this Q instance with newContent (Q instance or DOM node)
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

// scrollHeight.js
Q.Method('scrollHeight', function () {
    var node = this.nodes[0];
    return node.scrollHeight;
});

// scrollLeft.js
Q.Method('scrollLeft', function (value, increment) {
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

// scrollTop.js
Q.Method('scrollTop', function (value, increment) {
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

// scrollWidth.js
Q.Method('scrollWidth', function () {
    var node = this.nodes[0];
    return node.scrollWidth;
});

// show.js
Q.Method('show', function (duration = 0, callback) {
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

// siblings.js
Q.Method('siblings', function(selector) {
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

// size.js
Q.Method('size', function () {
    const node = this.nodes[0];
	return {
		width: node.offsetWidth,
		height: node.offsetHeight
	};
});

// text.js
Q.Method('text', function (content) {
    if (content === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].textContent = content;
    }
    return this;
});

// toggle.js
Q.Method('toggle', function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].style.display = (nodes[i].style.display === 'none' ? '' : 'none');
    }
    return this;
});

// toggleClass.js
Q.Method('toggleClass', function (className) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].classList.toggle(className);
    }
    return this;
});

// trigger.js
Q.Method('trigger', function (event) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].dispatchEvent(new Event(event));
    }
    return this;
});

// unwrap.js
Q.Method('unwrap', function () {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const el = this.nodes[i];
        const parent = el.parentNode;
        if (parent && parent !== document.body) {
            parent.replaceWith(...parent.childNodes);
        }
    }
    return this;
});

// val.js
Q.Method('val', function(input) {
    if (input === undefined) return this.nodes[0]?.value || null;
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].value = input;
    }
    return this;
});

// wait.js
Q.Method('wait', function(ms) {
	return new Promise(resolve => setTimeout(() => resolve(this), ms));
});

// walk.js
Q.Method('walk', function (callback, useQObject = false) {
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        const node = useQObject ? Q(this.nodes[i]) : this.nodes[i];
        callback.call(this.nodes[i], node, i);
    }
    return this;
});

// width.js
Q.Method('width', function (value) {
    if (typeof value === 'undefined') {
        return this.nodes[0] ? this.nodes[0].offsetWidth : undefined;
    }
    for (let i = 0, n = this.nodes.length; i < n; i++) {
        this.nodes[i].style.width = value;
    }
    return this;
});

// wrap.js
Q.Method('wrap', function (wrapper) {
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

// wrapAll.js
Q.Method('wrapAll', function (wrapper) {
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

// zIndex.js
Q.Method('zIndex', function (value) {
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


// Export Q library
if (typeof module !== "undefined" && module.exports) {
    module.exports = Q;
} else if (typeof window !== "undefined") {
    window.Q = Q;
}
