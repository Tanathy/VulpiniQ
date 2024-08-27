Q.prototype.each = function (callback) {
    // Iterates over all nodes in the Q object and executes a callback on each node.|Iteration|Q(selector).each((index, element) => console.log(index, element));
    this.nodes.forEach((el, index) => callback.call(el, index, el));
    return this;
};