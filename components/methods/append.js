// Name: append
// Method: Prototype
// Desc: Appends child nodes, HTML, or multiple elements to each node.
// Long Desc: Appends child nodes, HTML, or multiple elements to each node. Accepts a string for HTML, an HTMLElement, a Q object, an array of elements, or a NodeList. Strings are added as raw HTML, while elements and objects are appended as child nodes. Arrays and NodeLists append each element individually.
// Type: DOM Manipulation
// Example: Q(selector).append("<p>New paragraph</p>"); // Adds a paragraph as HTML <br> Q(selector).append(document.createElement("div")); // Adds a div element <br> Q(selector).append(Q(otherSelector)); // Appends a Q object <br> Q(selector).append([document.createElement("span"), document.createElement("img")]); // Appends multiple elements <br> Q(selector).append(document.querySelectorAll(".items")); // Appends a NodeList of elements
// Variables: allNodes, parent, child, subchild
Q.Ext('append', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const child = contents[j];
      if (typeof child === "string") {
        parent.insertAdjacentHTML('beforeend', child);
      } else if (child instanceof HTMLElement || child instanceof Q) {
        // If child is Q, its nodes property is used. Otherwise it's an HTMLElement.
        parent.appendChild(child.nodes ? child.nodes[0] : child);
      } else if (Array.isArray(child) || child instanceof NodeList) {
        const subNodes = Array.from(child);
        for (let k = 0, slen = subNodes.length; k < slen; k++) {
          parent.appendChild(subNodes[k]);
        }
      }
    }
  }
  return this;
});
