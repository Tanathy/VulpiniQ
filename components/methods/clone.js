// Name: clone
// Method: Prototype
// Desc: Creates a deep copy of the first node in the selection, including its child nodes.
// Long Desc: This method duplicates the first element in the selected nodes, preserving its structure and all attributes. By passing `true` to `cloneNode`, it ensures that all descendant nodes are also cloned. This is useful for scenarios where you want to replicate elements with their associated data and styles, allowing for dynamic content generation or manipulation.
// Type: DOM Manipulation
// Example: Q(selector).clone(); // Clones the first matched element <br> const newElement = Q(".item").clone(); // Clones the first element with the class 'item' and stores it in newElement <br> const clonedDiv = Q("#myDiv").clone(); // Clones the element with the ID 'myDiv' 
Q.Ext('clone', function () {
    return new Q(this.nodes[0].cloneNode(true));
});
