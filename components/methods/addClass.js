// Name: addClass
// Method: Prototype
// Desc: Adds one or more classes to each node, ignoring duplicates.
// Type: Class Manipulation
// Example: Q(selector).addClass("class1"); // Adds a single class <br> Q(selector).addClass("class1 class2"); // Adds multiple classes
// Variables: classes, list, el
Q.Ext('addClass', function (classes) {
    const list = classes.split(' '),
          nodes = this.nodes;
    for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].classList.add(...list);
    }
    return this;
});
