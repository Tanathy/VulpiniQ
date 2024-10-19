// Name: toggleClass
// Method: Prototype
// Desc: Toggles a class on each node.
// Type: Class Manipulation
// Example: Q(selector).toggleClass(className);
// Variables: className, el
Q.Ext('toggleClass', className => {
    return this.each(el => this.nodes[el].classList.toggle(className));
});