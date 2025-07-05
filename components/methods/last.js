Q.Method('last', function () {
    var nodes = this.nodes;
    return new Q(nodes[nodes.length - 1]);
});