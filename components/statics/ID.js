// Name: ID
// Method: Utility
// Desc: It's useful for creating unique identifiers for users, sessions, or any items requiring distinct identification. <br> The ID is generated using random hexadecimal digits (0-9 and a-f) and can be customized with a prefix for better context or categorization.
// Type: Utility
// Example: Q.ID(8, 'user-'); // user-1a2b3c4d <br> Q.ID(); // 1a2b3c4d <br> Q.ID(12, 'session-'); // session-1a2b3c4d5e6f
// Variables: length, prefix
Q.ID = (length = 8, prefix = '') =>
    prefix + Array.from({ length }, () => (Math.random() * 16 | 0).toString(16)).join('');
