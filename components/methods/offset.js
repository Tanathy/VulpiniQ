// Name: offset
// Method: Prototype
// Desc: Returns the top and left offset of the first node relative to the document.
// Type: Dimensions
// Example: Q(selector).offset();
// Variables: rect
Q.Ext('offset', function () {
    const rect = this.nodes[0].getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
});