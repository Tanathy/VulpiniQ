Q.prototype.hasClass = function (className) {
    // Checks if the first node has a specific class.|Class Manipulation|Q(selector).hasClass(className);
    return this.nodes[0]?.classList.contains(className) || false;
};