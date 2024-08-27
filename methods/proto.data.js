Q.prototype.data = function (key, value) {
    // Gets or sets data-* attributes on the nodes.|Data Manipulation|Q(selector).data(key, value);
    if (value === undefined) {
        return this.nodes[0]?.dataset[key] || null;
    }
    return this.each(el => this.nodes[el].dataset[key] = value);
};