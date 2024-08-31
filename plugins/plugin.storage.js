// Name: Storage
// Method: Plugin
// Desc: Provides methods to store and retrieve data from the local storage.
// Type: Plugin
// Example: Q.Storage('key', 'value to store'); Q.Storage('key'); // returns 'value to store'
Q.Storage = function (key, value) {
    if (arguments.length === 2) { 
        if (value === null || value === '') { 
            localStorage.removeItem(key); 
        } else {
            localStorage.setItem(key, JSON.stringify(value)); 
        }
    } else if (arguments.length === 1) { 
        let storedValue = localStorage.getItem(key); 
        try {
            return JSON.parse(storedValue); 
        } catch (e) {
            return storedValue; 
        }
    }
};

