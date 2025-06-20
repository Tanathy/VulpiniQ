/**
 * Q.JSON - Egységesített plugin séma
 * @param {Object} options
 *   - json: feldolgozandó JSON objektum
 */
Q.JSON = function(options = {}) {
    const defaults = { json: {} };
    this.options = { ...defaults, ...options };
    this.json = this.options.json;
};
Q.JSON.prototype.init = function() { return this; };
Q.JSON.prototype.Parse = function(options = { modify: false, recursive: false }, callback) {
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
Q.JSON.prototype.deflate = function(level) {
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
Q.JSON.prototype.inflate = function(deflatedJson) {
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
Q.JSON.prototype.getState = function() { return { json: this.json }; };
Q.JSON.prototype.setState = function(state) { if (state && state.json) this.json = state.json; };
Q.JSON.prototype.destroy = function() { this.json = {}; };