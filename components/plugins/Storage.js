





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
        if (arguments.length > 1) { 
            if (storageValue === null || storageValue === '') {
                localStorage.removeItem(storageKey);
                return;
            }
            
            let dataString = typeof storageValue === 'string'
                ? 'S|' + storageValue
                : 'J|' + JSON.stringify(storageValue);
            if (compressionEnabled) {
                dataString = 'C|' + lzw_compress(dataString);
            }
            localStorage.setItem(storageKey, dataString);
        } else {
            let dataString = localStorage.getItem(storageKey);
            if (dataString === null) return null;
            if (dataString.startsWith('C|')) {
                dataString = lzw_decompress(dataString.slice(2));
            }
            if (dataString.startsWith('S|')) {
                return dataString.slice(2);
            }
            if (dataString.startsWith('J|')) {
                try { return JSON.parse(dataString.slice(2)); } 
                catch (error) { return dataString.slice(2); }
            }
            try { return JSON.parse(dataString); } 
            catch (error) { return dataString; }
        }
    };
})();