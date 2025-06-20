/**
 * Q.String - Egységesített plugin séma
 * @param {Object} options
 *   - value: a feldolgozandó string
 */
Q.String = function(options = {}) {
    const defaults = { value: '' };
    this.options = { ...defaults, ...options };
    this.value = this.options.value;
};
Q.String.prototype.init = function() {
    // nincs külön inicializáció
    return this;
};
Q.String.prototype.capitalize = function() {
    return this.value.charAt(0).toUpperCase() + this.value.slice(1);
};
Q.String.prototype.levenshtein = function(string) {
    const a = this.value, b = string;
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i || j));
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return matrix[a.length][b.length];
};
Q.String.prototype.find = function(stringOrRegex) {
    return this.value.match(stringOrRegex);
};
Q.String.prototype.replaceAll = function(stringOrRegex, replacement) {
    return this.value.replace(new RegExp(stringOrRegex, 'g'), replacement);
};
Q.String.prototype.getState = function() {
    return { value: this.value };
};
Q.String.prototype.setState = function(state) {
    if (state && typeof state.value === 'string') this.value = state.value;
};
Q.String.prototype.destroy = function() {
    this.value = '';
};