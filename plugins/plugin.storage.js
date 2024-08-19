Q.Store = function (key, value) {
    if (arguments.length === 2) { // Check if two arguments are passed
        if (value === null || value === '') { // If value is null or empty string
            localStorage.removeItem(key); // Remove the item from localStorage
        } else {
            localStorage.setItem(key, JSON.stringify(value)); // Store the value as a JSON string
        }
    } else if (arguments.length === 1) { // Check if one argument is passed
        let storedValue = localStorage.getItem(key); // Retrieve the value from localStorage
        try {
            return JSON.parse(storedValue); // Try to parse the value as JSON
        } catch (e) {
            return storedValue; // Return the value as is if parsing fails
        }
    }
};

Q.Cookie = function (key, value, options = {}) {
    function _serialize(options) {
        const { days, path, domain, secure } = options;
        let cookieString = '';

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            cookieString += `expires=${date.toUTCString()}; `;
        }
        if (path) {
            cookieString += `path=${path}; `;
        }
        if (domain) {
            cookieString += `domain=${domain}; `;
        }
        if (secure) {
            cookieString += 'secure; ';
        }
        return cookieString;
    }

    function _parse(cookieString) {
        return cookieString.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            cookies[name] = value;
            return cookies;
        }, {});
    }

    if (arguments.length === 2) { // Check if two arguments are passed
        if (value === null || value === '') { // If value is null or empty string
            value = ''; // Set the value to an empty string
            options = { ...options, days: -1 }; // Set the number of days to -1
        }
        return document.cookie = `${key}=${value}; ${_serialize(options)}`; // Set the cookie
    } else if (arguments.length === 1) { // Check if one argument is passed
        return _parse(document.cookie)[key]; // Retrieve the cookie value
    }
};