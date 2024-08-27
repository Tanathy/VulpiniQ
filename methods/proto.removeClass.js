Q.prototype.removeClass = function (classes) {
    // Removes one or more classes from each node.|Class Manipulation|Q(selector).removeClass("class1 class2");
    const classList = classes.split(' ');
    return this.each(el => this.nodes[el].classList.remove(...classList));
};