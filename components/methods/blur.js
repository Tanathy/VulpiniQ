Q.Ext('blur', function () {
    var nodes = this.nodes; // ...existing code...
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].blur();
    }
    return this;
});
