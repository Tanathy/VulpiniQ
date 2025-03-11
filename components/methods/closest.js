// Name: closest
// Method: Prototype
// Desc: Finds the nearest ancestor node of the first node that matches a given selector.
// Long Desc: This method traverses up the DOM tree from the first selected node and returns the first ancestor that matches the specified CSS selector. If no matching ancestor is found, it returns null. This is useful for event delegation or when you need to find a specific parent element based on its class, id, or other attributes.
// Type: Traversal
// Example: Q(selector).closest(".parent"); // Returns the closest parent with class 'parent' <br> const closestSection = Q(".child").closest("section"); // Finds the closest section ancestor of the first element with the class 'child' <br> const closestForm = Q("#inputField").closest("form"); // Gets the nearest form ancestor of the element with ID 'inputField'
Q.Ext('closest', function (selector) {
    let node = this.nodes[0]; // ...existing code...
    while (node) {
        if (node.matches && node.matches(selector)) {
            return new Q(node);
        }
        node = node.parentElement;
    }
    return null;
});
