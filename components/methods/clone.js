Q.Method('clone', function () {
    return new Q(this.nodes[0].cloneNode(true));
});
