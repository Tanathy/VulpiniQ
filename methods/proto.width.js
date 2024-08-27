Q.prototype.width = function (value) {
    // Gets or sets the width of the first node.|Dimensions|Q(selector).width(value);
    if (value === undefined) {
        return this.nodes[0].offsetWidth;
    }
    return this.each(el => this.nodes[el].style.width = value);
};