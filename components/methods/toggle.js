// Name: toggle
// Method: Prototype
// Desc: Toggles the display of each node.
// Type: Utilities
// Example: Q(selector).toggle();
// Variables: el
Q.Ext('toggle', function () {
    return this.each(el => this.nodes[el].style.display = this.nodes[el].style.display === 'none' ? '' : 'none');
});