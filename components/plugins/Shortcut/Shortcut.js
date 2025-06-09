(function (Q) {
    let _instance = null;
    function ShortCuts(options = {}) {
        if (_instance) {
            throw new Error('ShortCuts instance already exists!');
        }
        if (!(this instanceof ShortCuts)) return new ShortCuts(options);
        this.options = Object.assign({
            typing_speed: 20,
            macros: {},
            allowed_calls: [],
            allowed_vars: [],
            set: {},
        }, options);
        this.shortcuts = {};
        this.isRunning = false;
        this._init();
        _instance = this;
    }

    ShortCuts.prototype._init = function () {
        this._bindKeyListener();
    };

    ShortCuts.prototype._bindKeyListener = function () {
        const self = this;
        Q(document).on('keydown', function (e) {
            if (self.isRunning) return;
            if (e.target && /^(input|textarea|select|button)$/i.test(e.target.tagName)) return;
            if (e.target && e.target.isContentEditable) return;
            for (const key in self.options.set) {
                const sc = self.options.set[key];
                if (sc.enabled === false) continue;
                if (self._eventMatches(e, sc)) {
                    e.preventDefault();
                    self.runMacro(sc.macro);
                    break;
                }
            }
        });
    };

    ShortCuts.prototype._eventMatches = function (e, shortcut) {
        if (!shortcut.key) return false;
        const parts = shortcut.key.toUpperCase().split('+');
        let key = parts.pop();
        let ctrl = parts.includes('CTRL');
        let shift = parts.includes('SHIFT');
        let alt = parts.includes('ALT');
        let meta = parts.includes('META');
        return (
            e.key.toUpperCase() === key &&
            (!!e.ctrlKey === ctrl) &&
            (!!e.shiftKey === shift) &&
            (!!e.altKey === alt) &&
            (!!e.metaKey === meta)
        );
    };

    ShortCuts.prototype.add = function (def) {
        if (!def.key || !def.macro) return;
        this.options.set[def.key] = def;
        this.shortcuts[def.key] = def;
    };

    ShortCuts.prototype.remove = function (key) {
        delete this.options.set[key];
        delete this.shortcuts[key];
    };

    ShortCuts.prototype.edit = function (key, newDef) {
        if (!key || !newDef || !newDef.key || !newDef.macro) return;
        this.options.set[key] = newDef;
        this.shortcuts[key] = newDef;
    };

    ShortCuts.prototype.runMacro = async function (macro) {
        this.isRunning = true;
        try {
            await this._runMacroSteps(macro);
        } catch (e) {
            console.warn('ShortCuts macro error:', e);
        }
        this.isRunning = false;
    };

    ShortCuts.prototype._runMacroSteps = async function (macro) {
        let i = 0;
        const stack = [];
        this._macroVars = this._macroVars || {};
        while (i < macro.length) {
            let step = macro[i];
            if (typeof step === 'string') {
                const [cmd, ...args] = step.split(' ');
                if (cmd === 'VAR') {
                    const varName = args[0];
                    if (this.options.allowed_vars.length && !this.options.allowed_vars.includes(varName)) {
                        console.warn('VAR: variable not allowed:', varName);
                        this._macroVars[varName] = '';
                    } else {
                        this._macroVars[varName] = (typeof window[varName] !== 'undefined') ? window[varName] : '';
                    }
                } else if (cmd === 'IF') {
                    let cond = false;
                    if (args[0] && (args[0].startsWith('.') || args[0].startsWith('#') || args[0].startsWith('[') || /^[a-zA-Z]/.test(args[0]))) {
                        const sel = args[0];
                        const el = Q(sel);
                        if (args[1] === 'IS') {
                            const val = args.slice(2).join(' ');
                            cond = el.isExists() && (el.val() == val || el.text() == val);
                        } else if (args[1] === 'INCLUDES') {
                            const val = args.slice(2).join(' ');
                            cond = el.isExists() && ((el.val() || '').includes(val) || (el.text() || '').includes(val));
                        } else if (args[1] === 'CHECKED') {
                            cond = el.isExists() && el.nodes[0].checked === true;
                        } else if (args[1] === 'UNCHECKED') {
                            cond = el.isExists() && el.nodes[0].checked === false;
                        } else if (args[1] === 'SELECTED') {
                            cond = el.isExists() && el.nodes[0].selected === true;
                        } else if (args[1] === 'FOCUS') {
                            cond = el.isExists() && document.activeElement === el.nodes[0];
                        } else if (args[1] === 'BLUR') {
                            cond = el.isExists() && document.activeElement !== el.nodes[0];
                        } else if (args[1] === undefined) {
                            cond = el.isExists();
                        }
                        if (cond) this._macroElement = el;
                    } else if (args[0] === 'CALL') {
                        const callExpr = args.slice(1).join(' ');
                        const match = callExpr.match(/([^(]+)\(([^)]*)\)\s+IS\s+(.+)/);
                        if (match) {
                            const fnName = match[1].trim();
                            const fnArgs = match[2].split(',').map(s => s.trim()).filter(Boolean);
                            const expected = match[3].trim();
                            if (this.options.allowed_calls.includes(fnName) && typeof window[fnName] === 'function') {
                                const result = window[fnName](...fnArgs);
                                cond = result == expected;
                            }
                        }
                    } else if (args[0] === 'VAR') {
                        const varName = args[1];
                        if (this.options.allowed_vars.length && !this.options.allowed_vars.includes(varName)) {
                            cond = false;
                        } else if (args[2] === 'IS') {
                            const val = args.slice(3).join(' ');
                            cond = (typeof window[varName] !== 'undefined' ? window[varName] : undefined) == val;
                        } else if (args[2] === 'INCLUDES') {
                            const val = args.slice(3).join(' ');
                            cond = ((typeof window[varName] !== 'undefined' ? window[varName] : '') + '').includes(val);
                        }
                    } else if (args[0] === 'FIND') {
                        const condArg = args.slice(1).join(' ');
                        const found = Q(condArg);
                        cond = found.isExists();
                        if (cond) this._macroElement = found;
                    }
                    stack.push({ type: 'IF', cond, elseIdx: null });
                    if (!cond) {
                        let depth = 1;
                        for (let j = i + 1; j < macro.length; ++j) {
                            if (/^IF /.test(macro[j])) depth++;
                            if (/^ENDIF$/.test(macro[j])) depth--;
                            if (depth === 0 || /^ELSE$/.test(macro[j])) {
                                i = j;
                                break;
                            }
                        }
                        continue;
                    }
                } else if (cmd === 'ELSE') {
                    let depth = 1;
                    for (let j = i + 1; j < macro.length; ++j) {
                        if (/^IF /.test(macro[j])) depth++;
                        if (/^ENDIF$/.test(macro[j])) depth--;
                        if (depth === 0) {
                            i = j;
                            break;
                        }
                    }
                    continue;
                } else if (cmd === 'ENDIF') {
                    stack.pop();
                } else if (cmd === 'REPEAT') {
                    const count = parseInt(args[0]);
                    stack.push({ type: 'REPEAT', count, start: i });
                } else if (cmd === 'ENDREPEAT') {
                    const rep = stack[stack.length - 1];
                    if (rep && rep.type === 'REPEAT') {
                        rep.count--;
                        if (rep.count > 0) {
                            i = rep.start;
                        } else {
                            stack.pop();
                        }
                    }
                } else if (cmd === 'WAITFOR') {
                    const ms = parseInt(args[0]);
                    const sel = args.slice(1).join(' ');
                    let found = false;
                    await new Promise((resolve) => {
                        const start = Date.now();
                        const check = () => {
                            if (Q(sel).isExists()) {
                                found = true;
                                resolve();
                            } else if (Date.now() - start > ms) {
                                resolve();
                            } else {
                                setTimeout(check, 50);
                            }
                        };
                        check();
                    });
                    if (!found) {
                        console.warn('WAITFOR: element did not appear:', sel);
                        break;
                    }
                } else {
                    if (cmd === 'TYPE' && /^VAR\s+([a-zA-Z0-9_]+)/.test(args.join(' '))) {
                        const varMatch = args.join(' ').match(/^VAR\s+([a-zA-Z0-9_]+)/);
                        if (varMatch) {
                            const varName = varMatch[1];
                            if (this.options.allowed_vars.length && !this.options.allowed_vars.includes(varName)) {
                                console.warn('TYPE VAR: variable not allowed:', varName);
                                args[0] = '';
                            }
                        }
                    }
                    await this._runMacroCommand(cmd, args.join(' '));
                }
            }
            i++;
        }
    };

    ShortCuts.prototype._runMacroCommand = async function (cmd, arg) {
        switch (cmd) {
            case 'WAIT':
                await new Promise(res => setTimeout(res, parseInt(arg)));
                break;
            case 'FIND':
                this._macroElement = Q(arg);
                if (!this._macroElement.isExists()) {
                    console.warn('FIND: element not found:', arg);
                    this._macroElement = null;
                }
                break;
            case 'CLICK':
                if (this._macroElement && this._macroElement.isExists()) {
                    this._macroElement.click();
                    if (this._macroElement.is('input,textarea,button')) {
                        this._macroElement.focus();
                    }
                } else {
                    console.warn('CLICK: no element!');
                }
                break;
            case 'TYPE': {
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    const el = this._macroElement;
                    let val = arg;
                    const varMatch = val.match(/^VAR\s+([a-zA-Z0-9_]+)/);
                    if (varMatch) {
                        const varName = varMatch[1];
                        if (this.options.allowed_vars.length && !this.options.allowed_vars.includes(varName)) {
                            console.warn('TYPE VAR: variable not allowed:', varName);
                            val = '';
                        } else {
                            val = (typeof window[varName] !== 'undefined') ? window[varName] : '';
                        }
                    }
                    const speed = this.options.typing_speed;
                    let startVal = el.val() || '';
                    if (speed > 0) {
                        for (let i = 0; i < val.length; ++i) {
                            el.val(startVal + val.slice(0, i + 1));
                            await new Promise(res => setTimeout(res, Math.random() * speed));
                        }
                    } else {
                        el.val(val);
                    }
                } else {
                    console.warn('TYPE: no input element!');
                }
                break;
            }
            case 'LEAVE':
                if (this._macroElement && this._macroElement.is('input,textarea,button')) {
                    this._macroElement.blur();
                }
                break;
            case 'CALL': {
                const fnName = arg.replace(/\(.*\)/, '').trim();
                if (this.options.allowed_calls.includes(fnName) && typeof window[fnName] === 'function') {
                    await window[fnName]();
                } else {
                    console.warn('CALL: not allowed or function does not exist:', fnName);
                }
                break;
            }
            case 'SCROLLTO':
                if (this._macroElement && this._macroElement.isExists()) {
                    this._macroElement.nodes[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                break;
            case 'SCROLL': {
                let [x, y] = arg.split(' ');
                x = x && x.endsWith('%') ? window.innerWidth * parseFloat(x) / 100 : parseInt(x);
                y = y && y.endsWith('%') ? window.innerHeight * parseFloat(y) / 100 : parseInt(y);
                window.scrollTo({ left: x || 0, top: y || 0, behavior: 'smooth' });
                break;
            }
            case 'CLEAR':
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    this._macroElement.val('');
                }
                break;
            case 'SELECTALL':
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    this._macroElement.nodes[0].select();
                }
                break;
            case 'COPY':
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    try {
                        await navigator.clipboard.writeText(this._macroElement.val());
                    } catch (e) { console.warn('COPY: failed', e); }
                }
                break;
            case 'PASTE':
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    try {
                        const text = await navigator.clipboard.readText();
                        this._macroElement.val(text);
                    } catch (e) { console.warn('PASTE: failed', e); }
                }
                break;
            case 'APPEND':
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    this._macroElement.val(this._macroElement.val() + arg);
                }
                break;
            case 'PREPEND':
                if (this._macroElement && this._macroElement.is('input,textarea')) {
                    this._macroElement.val(arg + this._macroElement.val());
                }
                break;
            case 'CHECK':
                if (this._macroElement && this._macroElement.nodes[0].checked !== undefined) {
                    this._macroElement.nodes[0].checked = true;
                    this._macroElement.trigger('change');
                }
                break;
            case 'UNCHECK':
                if (this._macroElement && this._macroElement.nodes[0].checked !== undefined) {
                    this._macroElement.nodes[0].checked = false;
                    this._macroElement.trigger('change');
                }
                break;
            case 'TOGGLECHECK':
                if (this._macroElement && this._macroElement.nodes[0].checked !== undefined) {
                    this._macroElement.nodes[0].checked = !this._macroElement.nodes[0].checked;
                    this._macroElement.trigger('change');
                }
                break;
            case 'OPTION':
                if (this._macroElement && this._macroElement.is('select')) {
                    const opts = this._macroElement.nodes[0].options;
                    for (let i = 0; i < opts.length; ++i) {
                        if (opts[i].value === arg || opts[i].text === arg) {
                            this._macroElement.val(opts[i].value);
                            break;
                        }
                    }
                }
                break;
            case 'VALUE':
                if (this._macroElement && this._macroElement.is('input,textarea,select')) {
                    this._macroElement.val(arg);
                }
                break;
            case 'KEYDOWN':
                window.dispatchEvent(new KeyboardEvent('keydown', { key: arg }));
                break;
            case 'KEYUP':
                window.dispatchEvent(new KeyboardEvent('keyup', { key: arg }));
                break;
            case 'KEYPRESS':
                window.dispatchEvent(new KeyboardEvent('keypress', { key: arg }));
                break;
            case 'LMOUSEDOWN':
                if (this._macroElement && this._macroElement.isExists()) {
                    this._macroElement.nodes[0].dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
                }
                break;
            case 'LMOUSEUP':
                if (this._macroElement && this._macroElement.isExists()) {
                    this._macroElement.nodes[0].dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
                }
                break;
            case 'MMOUSEDOWN':
                if (this._macroElement && this._macroElement.isExists()) {
                    this._macroElement.nodes[0].dispatchEvent(new MouseEvent('mousedown', { button: 1 }));
                }
                break;
            case 'MMOUSEUP':
                if (this._macroElement && this._macroElement.isExists()) {
                    this._macroElement.nodes[0].dispatchEvent(new MouseEvent('mouseup', { button: 1 }));
                }
                break;
            default:
                if (cmd) console.warn('Unknown macro command:', cmd, arg);
        }
    };

    Q.ShortCuts = ShortCuts;
})(Q);