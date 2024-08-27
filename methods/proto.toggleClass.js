Q.prototype.toggleClass = function (className) {
    // Toggles a class on each node.|Class Manipulation|Q(selector).toggleClass(className);
    return this.each(el => this.nodes[el].classList.toggle(className));
};