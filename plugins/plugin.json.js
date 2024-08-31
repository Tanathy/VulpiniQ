// Name: JSON
// Method: Plugin
// Desc: Provides methods to parse, deflate, and inflate, modify JSON objects.
// Type: Plugin
// Example: var json = Q.JSON({ key: 'value' }); json.Parse({ modify: true, recursive: true }, (key, value) => value + ' modified');
Q.JSON = function (json) {
    if (!(this instanceof Q.JSON)) {
        return new Q.JSON(json);
    }
    this.json = json;
};

Q.JSON.prototype.Parse = function (options = { modify: false, recursive: false }, callback) {
    const process = (data) => {
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const newValue = callback(key, data[key]);
                    if (modify) {
                        data[key] = newValue;
                    }
                    if (recursive && typeof data[key] === 'object' && data[key] !== null) {
                        process(data[key]);
                    }
                }
            }
        }
    };

    process(this.json);
    return this.json;
};

Q.JSON.prototype.deflate = function (level) {
    const map = {};
    let counter = 1;

    function replaceRecursive(obj) {
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                if (typeof obj[key] === 'object') {
                    replaceRecursive(obj[key]);
                }

                if (key.length >= level) {
                    if (!map[key]) {
                        map[key] = `[${counter}]`;
                        counter++;
                    }
                    const newKey = map[key];
                    obj[newKey] = obj[key];
                    delete obj[key];
                }

                if (typeof obj[key] === 'string' && obj[key].length >= level) {
                    if (!map[obj[key]]) {
                        map[obj[key]] = `[${counter}]`;
                        counter++;
                    }
                    obj[key] = map[obj[key]];
                }
            }
        }
    }

    const compressedData = JSON.parse(JSON.stringify(this.json));
    replaceRecursive(compressedData);

    return { data: compressedData, map: map };
};

Q.JSON.prototype.inflate = function (deflatedJson) {
    const { data, map } = deflatedJson;
    const reverseMap = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));

    function restoreRecursive(obj) {
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                const originalKey = reverseMap[key] || key;
                const value = obj[key];

                delete obj[key];
                obj[originalKey] = value;

                if (typeof obj[originalKey] === 'object') {
                    restoreRecursive(obj[originalKey]);
                } else if (reverseMap[obj[originalKey]]) {
                    obj[originalKey] = reverseMap[obj[originalKey]];
                }
            }
        }
    }

    const inflatedData = JSON.parse(JSON.stringify(data));
    restoreRecursive(inflatedData);
    return inflatedData;
};