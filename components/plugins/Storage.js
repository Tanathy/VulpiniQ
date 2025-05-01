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