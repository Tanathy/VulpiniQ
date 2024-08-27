Q.prototype.toggle = function () {
    // Toggles the display of each node.|Utilities|Q(selector).toggle();
    return this.each(el => this.nodes[el].style.display = this.nodes[el].style.display === 'none' ? '' : 'none');
};