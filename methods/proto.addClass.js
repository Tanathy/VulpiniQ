// Name: addClass
// Desc: Adds one or more classes to each node.
// Type: Class Manipulation
// Example: Q(selector).addClass("class1 class2");
Q.prototype.addClass = function (classes) {
    const classList = classes.split(' ');
    return this.each(el => this.nodes[el].classList.add(...classList));
};