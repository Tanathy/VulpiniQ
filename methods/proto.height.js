Q.prototype.height = function (value) {
    // Gets or sets the height of the first node.|Dimensions|Q(selector).height(value);
    if (value === undefined) {
        return this.nodes[0].offsetHeight;
    }
    return this.each(el => this.nodes[el].style.height = value);
};