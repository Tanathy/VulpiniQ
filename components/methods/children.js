Q.Ext('children', function () {
    var first = this.nodes[0];
    return new Q(first.children);
});
