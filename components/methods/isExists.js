// Name: isExists
// Method: Prototype
// Desc: Checks if the first node exists in the DOM.
// Type: Utilities
// Example: Q(selector).isExists(); or Q.isExists('.ok')
// Variables: selector
Q.Ext('isExists', function () {
    return document.body.contains(this.nodes[0]);
});

Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};