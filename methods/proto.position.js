Q.prototype.position = function () {
    // Returns the top and left position of the first node relative to its offset parent.|Dimension/Position|Q(selector).position();
    return {
        top: this.nodes[0].offsetTop,
        left: this.nodes[0].offsetLeft
    };
};