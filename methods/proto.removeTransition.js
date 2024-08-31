// Name: removeTransition
// Method: Prototype
// Desc: Removes the transition from each node.
// Type: Display
// Example: Q(selector).removeTransition();
Q.prototype.removeTransition = function () {
    return this.each(el => this.nodes[el].style.transition = '');
};