// Name: zIndex
// Method: Prototype
// Desc: Gets or sets the z-index of the first node.
// Type: Display
// Example: Q(selector).zIndex(value);
Q.prototype.zIndex = function (value) {
    if (value === undefined) {
        let zIndex = this.nodes[0].style.zIndex;
        if (!zIndex) {
            zIndex = window.getComputedStyle(this.nodes[0]).zIndex;
        }
        return zIndex;
    }
    return this.each(el => this.nodes[el].style.zIndex = value);
};