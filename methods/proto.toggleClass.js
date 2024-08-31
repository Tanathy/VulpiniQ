// Name: toggleClass
// Method: Prototype
// Desc: Toggles a class on each node.
// Type: Class Manipulation
// Example: Q(selector).toggleClass(className);
Q.prototype.toggleClass = function (className) {
    return this.each(el => this.nodes[el].classList.toggle(className));
};