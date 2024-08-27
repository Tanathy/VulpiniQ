Q.prototype.size = function () {
    // Returns the width and height of the first node.|Dimensions|Q(selector).size();
    return {
        width: this.nodes[0].offsetWidth,
        height: this.nodes[0].offsetHeight
    };
};