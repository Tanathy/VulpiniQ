Q.prototype.offset = function () {
    // Returns the top and left offset of the first node relative to the document.|Dimensions|Q(selector).offset();
    const rect = this.nodes[0].getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
};