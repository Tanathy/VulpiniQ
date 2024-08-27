Q.prototype.isExists = function () {
    // Checks if the first node exists in the DOM.|Utilities|Q(selector).isExists();
    return document.body.contains(this.nodes[0]);
};