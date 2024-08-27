Q.prototype.val = function (value) {
    // Gets or sets the value of form elements in the nodes.|Form Manipulation|Q(selector).val(value);
    if (value === undefined) {
        return this.nodes[0]?.value || null;
    }
    return this.each(el => this.nodes[el].value = value);
};