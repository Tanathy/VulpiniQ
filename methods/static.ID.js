// Name: ID
// Method: Static
// Desc: Generates a random alphanumeric ID of specified length.
// Type: Utility
// Example: Q.ID(10); // "A1b2C3d4E5"
Q.ID = function (length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};