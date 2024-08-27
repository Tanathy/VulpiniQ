Q.prototype.removeTransition = function () {
    // Removes the transition from each node.|Display|Q(selector).removeTransition();
    return this.each(el => this.nodes[el].style.transition = '');
};