Q.Ext('isExists', function () {
    var node = this.nodes[0];
    return node ? document.body.contains(node) : false;
});

Q.isExists = function (selector) {
    return document.querySelector(selector) !== null;
};