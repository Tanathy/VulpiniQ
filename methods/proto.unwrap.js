Q.prototype.unwrap = function () {
    // Removes the parent wrapper of each node.|DOM Manipulation|Q(selector).unwrap();
    return this.each(el => {
        const parent = this.nodes[el].parentNode;
        if (parent !== document.body) {
            parent.replaceWith(...this.nodes);
        }
    });
};