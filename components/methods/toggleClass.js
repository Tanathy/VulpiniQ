// Name: toggleClass
// Method: Prototype
// Desc: Toggles a class on each node.
// Type: Class Manipulation
// Example: Q(selector).toggleClass(className);
// Variables: className, el
Q.Ext('toggleClass', function (className) {
    return this.each(function(index, el) {
        el.classList.toggle(className);
    });
});