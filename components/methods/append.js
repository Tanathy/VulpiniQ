// Name: append
// Method: Prototype
// Desc: Appends child nodes, HTML, or multiple elements to each node.
// Long Desc: Appends child nodes, HTML, or multiple elements to each node. Accepts a string for HTML, an HTMLElement, a Q object, an array of elements, or a NodeList. Strings are added as raw HTML, while elements and objects are appended as child nodes. Arrays and NodeLists append each element individually.
// Type: DOM Manipulation
// Example: Q(selector).append("<p>New paragraph</p>"); // Adds a paragraph as HTML <br> Q(selector).append(document.createElement("div")); // Adds a div element <br> Q(selector).append(Q(otherSelector)); // Appends a Q object <br> Q(selector).append([document.createElement("span"), document.createElement("img")]); // Appends multiple elements <br> Q(selector).append(document.querySelectorAll(".items")); // Appends a NodeList of elements
// Variables: allNodes, parent, child, subchild
Q.Ext('append', function (...allNodes) {
    return this.each(el => {
        const parent = this.nodes[el];
        allNodes.forEach(child => {
            if (typeof child === 'string') {
                parent.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof HTMLElement || child instanceof Q) {
                parent.appendChild(child.nodes[0]);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                Array.from(child).forEach(subchild => parent.appendChild(subchild));
            }
        });
    });
});
