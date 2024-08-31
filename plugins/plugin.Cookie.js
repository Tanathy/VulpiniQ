// Name: Cookie
// Method: Plugin
// Desc: Provides methods to store and retrieve data from the browser cookies.
// Type: Plugin
// Example: Q.Cookie('key', 'value to store'); Q.Cookie('key'); // returns 'value to store'
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

    if (arguments.length === 2) { 
        if (value === null || value === '') { 
            value = ''; 
            options = { ...options, days: -1 }; 
        }
        return document.cookie = `${key}=${value}; ${_serialize(options)}`; 
    } else if (arguments.length === 1) { 
        return _parse(document.cookie)[key]; 
    }
};