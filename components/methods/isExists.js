// Name: isExists
// Method: Prototype and Static
// Desc: Checks if the first node exists in the DOM.
// Type: Utilities
// Example: Q(selector).isExists(); or Q.isExists('.ok')
// Variables: selector
// Prototype method
Q.Ext('isExists', function () {
    return document.body.contains(this.nodes[0]);
});

// Static method
Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};