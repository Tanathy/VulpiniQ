Q.prototype.removeData = function (key) {
    // Removes a data-* attribute from each node.|Data Manipulation|Q(selector).removeData(key);
    return this.each(el => delete this.nodes[el].dataset[key]);
};