// Name: text
// Method: Prototype
// Desc: Gets or sets the text content of the nodes.
// Type: Content Manipulation
// Example: Q(selector).text(string);
// Variables: content, el
Q.Ext('text', function(content){
    if (content === undefined) {
        return this.nodes[0]?.textContent || null;
    }
    return this.each(el => this.nodes[el].textContent = content);
});