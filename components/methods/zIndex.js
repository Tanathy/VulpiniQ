// Name: zIndex
// Method: Prototype
// Desc: Gets or sets the z-index of the first node.
// Long Desc: This is a getter/setter method. If a value is passed, it sets the z-index of the first node to that value. If no value is passed, it returns the z-index of the first node.
// Type: Display
// Example: Q(selector).zIndex(value);
// Variables: value, Index, el
Q.Ext('zIndex', function (value) {
    const node = this.nodes[0];
    if (!node) return;
    if (value === undefined) {
        let Index = node.style.zIndex || window.getComputedStyle(node).zIndex;
        return Index;
    }
    this.nodes.forEach(node => node.style.zIndex = value);
    return this;
});