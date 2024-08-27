Q.prototype.prop = function (property, value) {
    // Gets or sets a property on the nodes.|Property Manipulation|Q(selector).prop(property, value);
    if (value === undefined) {
        return this.nodes[0]?.[property] || null;
    }
    return this.each(function (index, el) {
        el[property] = value;
    });
};