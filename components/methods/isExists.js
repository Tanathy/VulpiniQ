// Name: isExists
// Method: Prototype
// Desc: Checks if the first node exists in the DOM.
// Type: Utilities
// Example: Q(selector).isExists(); or Q.isExists('.ok')
// Variables: selector
Q.Ext('isExists', function () {
    const node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});

Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};