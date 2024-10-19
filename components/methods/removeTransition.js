// Name: removeTransition
// Method: Prototype
// Desc: Removes the transition from each node.
// Type: Display
// Example: Q(selector).removeTransition();
// Variables: el
Q.Ext('removeTransition', () => {
    return this.each(el => this.nodes[el].style.transition = '');
});