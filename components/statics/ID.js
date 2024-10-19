// Name: ID
// Method: Static
// Desc: Generates a random hexadecimal ID with a specified length and optional prefix.
// Type: Utility
// Example: Q.ID(8, 'user-'); // user-1a2b3c4d
// Variables: length, prefix
Q.ID = function (length = 8, prefix = '') {
    return prefix + [...Array(length)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
};