Q.prototype.text = function (content) {
    // Gets or sets the text content of the nodes.|Content Manipulation|Q(selector).text(string);
    if (content === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    return this.each(el => this.nodes[el].textContent = content);
};