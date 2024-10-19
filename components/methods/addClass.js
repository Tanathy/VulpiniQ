// Name: addClass
// Method: Prototype
// Desc: Adds one or more classes to each node.
// Type: Class Manipulation
// Example: Q(selector).addClass("class1 class2");
// Variables: classes, list, el
Q.Ext('addClass', classes => { 
    const list = classes.split(' ');
    return this.each(el => this.nodes[el].classList.add(...list));
});