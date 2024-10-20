// Name: zIndex
// Method: Prototype
// Desc: Gets or sets the z-index of the first node.
// Type: Display
// Example: Q(selector).zIndex(value);
// Variables: value, Index, el
Q.Ext('zIndex', function (value) {
    if (value === undefined) {
        let Index = this.nodes[0].style.zIndex;
        if (!Index) {
            Index = window.getComputedStyle(this.nodes[0]).zIndex;
        }
        return Index;
    }
    return this.each(el => this.nodes[el].style.zIndex = value);
});