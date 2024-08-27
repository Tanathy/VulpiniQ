Q.prototype.removeProp = function (property) {
    // Removes a property from each node.|Property Manipulation|Q(selector).removeProp(property);
    return this.each(el => delete this.nodes[el][property]);
};