// Name: Cookie
// Method: Plugin
// Desc: Provides methods to store and retrieve data from the browser cookies.
// Type: Plugin
// Example: Q.Cookie('key', 'value to store'); Q.Cookie('key'); // returns 'value to store'
// Variables: key, value, options, days, path, domain, secure, _serialize, _parse, cookieStringBuilder, date, name, cookies, cookieData, allCookies
Q.Cookie = function (key, value, options = {}) { 
    function _serialize(options) {
        const { days, path, domain, secure } = options;
        let cookieStringBuilder = '';

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            cookieStringBuilder += `expires=${date.toUTCString()}; `;
        }
        if (path) {
            cookieStringBuilder += `path=${path}; `;
        }
        if (domain) {
            cookieStringBuilder += `domain=${domain}; `;
        }
        if (secure) {
            cookieStringBuilder += 'secure; ';
        }
        return cookieStringBuilder;
    }

    function _parse(cookieStringBuilder) {
        return cookieStringBuilder.split(';').reduce((allCookies, cookieData) => {
            const [name, value] = cookieData.split('=').map(c => c.trim());
            allCookies[name] = value;
            return allCookies;
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