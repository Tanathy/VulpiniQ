Q.prototype.addClass = function (classes) {
    // Adds one or more classes to each node.|Class Manipulation|Q(selector).addClass("class1 class2");
    const classList = classes.split(' ');
    return this.each(el => this.nodes[el].classList.add(...classList));
};