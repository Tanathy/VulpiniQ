// Name: removeClass
// Method: Prototype
// Desc: Removes one or more classes from each node.
// Type: Class Manipulation
// Example: Q(selector).removeClass("class1 class2");
Q.prototype.removeClass = function (classes) {
    const classList = classes.split(' ');
    return this.each(el => this.nodes[el].classList.remove(...classList));
};