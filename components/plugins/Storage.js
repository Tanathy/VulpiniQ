/**
 * Q.Storage - Egységesített plugin séma
 * @param {Object} options
 *   - compression: tömörítés engedélyezése
 */
Q.Storage = function(options = {}) {
    const defaults = { compression: false };
    this.options = { ...defaults, ...options };
};
Q.Storage.prototype.init = function() { return this; };
Q.Storage.prototype.set = function(key, value) {
    const PREFIX_COMPRESSED = 'C|';
    const PREFIX_STRING = 'S|';
    const PREFIX_JSON = 'J|';
    let dataString = typeof value === 'string' ? PREFIX_STRING + value : PREFIX_JSON + JSON.stringify(value);
    if (this.options.compression) {
        dataString = PREFIX_COMPRESSED + Q.Storage.lzw_compress(dataString);
    }
    localStorage.setItem(key, dataString);
};
Q.Storage.prototype.get = function(key) {
    const PREFIX_COMPRESSED = 'C|';
    const PREFIX_STRING = 'S|';
    const PREFIX_JSON = 'J|';
    let dataString = localStorage.getItem(key);
    if (dataString === null) return null;
    if (dataString.startsWith(PREFIX_COMPRESSED)) {
        dataString = Q.Storage.lzw_decompress(dataString.slice(PREFIX_COMPRESSED.length));
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
};
Q.Storage.prototype.remove = function(key) {
    localStorage.removeItem(key);
};
Q.Storage.prototype.getState = function() {
    return { compression: this.options.compression };
};
Q.Storage.prototype.setState = function(state) {
    if (state && typeof state.compression === 'boolean') this.options.compression = state.compression;
};
Q.Storage.prototype.destroy = function() { /* nincs szükség takarításra */ };
Q.Storage.lzw_compress = function(input) {
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
Q.Storage.lzw_decompress = function(input) {
    let dictionary = {}, current = String.fromCharCode(input.charCodeAt(0)), previous = current, result = current, code = 256, entry;
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