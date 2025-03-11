// Name: Cookie
// Method: Plugin
// Desc: Provides methods to store and retrieve data from the browser cookies.
// Type: Plugin
// Example: Q.Cookie('key', 'value to store'); Q.Cookie('key'); // returns 'value to store'
// Variables: cookieKey, cookieValue, cookieOptions
Q.Cookie = function (cookieKey, cookieValue, cookieOptions = {}) {
    const buildOptions = (options) => {
      let optionsStr = '';
      if (options.days) optionsStr += `expires=${new Date(Date.now() + options.days * 86400000).toUTCString()}; `;
      if (options.path) optionsStr += `path=${options.path}; `;
      if (options.domain) optionsStr += `domain=${options.domain}; `;
      if (options.secure) optionsStr += 'secure; ';
      return optionsStr;
    };
  
    if (arguments.length > 1) {
      if (cookieValue === null || cookieValue === '') {
        cookieValue = '';
        cookieOptions = { ...cookieOptions, days: -1 };
      }
      return document.cookie = `${cookieKey}=${cookieValue}; ${buildOptions(cookieOptions)}`;
    }
  
    const allCookies = document.cookie.split('; ');
    for (let i = 0, len = allCookies.length; i < len; i++) {
      const currentCookie = allCookies[i];
      const indexEqual = currentCookie.indexOf('=');
      if (indexEqual > -1 && currentCookie.slice(0, indexEqual).trim() === cookieKey) {
        return currentCookie.slice(indexEqual + 1);
      }
    }
    return undefined;
  };