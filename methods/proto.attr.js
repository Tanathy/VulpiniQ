Q.prototype.attr = function (attribute, value) {
    // Gets or sets attributes on the nodes. Can handle multiple attributes if provided as an object.|Attribute Manipulation|Q(selector).attr(attribute, value);
    if (typeof attribute === 'object') {
        return this.each(el => {
            for (let key in attribute) {
                if (attribute.hasOwnProperty(key)) {
                    this.nodes[el].setAttribute(key, attribute[key]);
                }
            }
        });
    } else {
        if (value === undefined) {
            return this.nodes[0]?.getAttribute(attribute) || null;
        }
        return this.each(el => this.nodes[el].setAttribute(attribute, value));
    }
};