Q.Method('eq', function (index) {
  var node = this.nodes[index];
  return node ? new Q(node) : null;
});