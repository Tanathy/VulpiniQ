// Name: isExists
// Method: Prototype
// Desc: Checks if the first node exists in the DOM.
// Type: Utilities
// Example: Q(selector).isExists();
Q.prototype.isExists = function () {
    return document.body.contains(this.nodes[0]);
};