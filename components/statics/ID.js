Q.ID = (length = 8, prefix = '') =>
    prefix + Array.from({ length }, () => (Math.random() * 16 | 0).toString(16)).join('');
