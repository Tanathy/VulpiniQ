// Name: removeClass
// Method: Prototype
// Desc: Removes one or more classes from each node.
// Type: Class Manipulation
// Example: Q(selector).removeClass("class1 class2");
// Variables: classes, list, el
Q.Ext('removeClass', function (classes) {
    const list = classes.split(' ');
    for (const node of this.nodes) {
        node.classList.remove(...list);
    }
    return this;
});