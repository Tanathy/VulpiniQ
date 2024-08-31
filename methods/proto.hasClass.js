// Name: hasClass
// Method: Prototype
// Desc: Checks if the first node has a specific class.
// Type: Class Manipulation
// Example: Q(selector).hasClass(className);
Q.prototype.hasClass = function (className) {
    return this.nodes[0]?.classList.contains(className) || false;
};