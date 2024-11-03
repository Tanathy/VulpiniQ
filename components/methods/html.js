// Name: html
// Method: Prototype
// Desc: Gets or sets the innerHTML of the nodes. This method allows for easy manipulation of the content inside the selected elements.
// Long Desc: The html method retrieves or modifies the innerHTML of the nodes in the Q object. If a string is provided, it sets the innerHTML of each node to that string. If no argument is given, it returns the innerHTML of the first node, making it a flexible way to manage the contents of elements in the DOM.
// Type: Content Manipulation
// Example: const currentHtml = Q(selector).html(); // Retrieves the innerHTML of the first selected element <br> Q(selector).html('<div>New Content</div>'); // Sets the innerHTML of each selected element to '<div>New Content</div>' <br> Q(selector).html(['<span>First</span>', '<span>Second</span>']); // Sets the innerHTML with an array of strings <br> const newNode = Q('<p>Paragraph</p>'); Q(selector).html(newNode); // Sets the innerHTML with a Q object containing a new node <br> Q(selector).html(document.createElement('div')); // Sets the innerHTML with a new HTMLElement <br> const nodeList = document.querySelectorAll('.child'); Q(selector).html(nodeList); // Sets the innerHTML with a NodeList of child elements <br> Q(selector).html([]); // Sets the innerHTML to an empty string <br> Q(selector).html(null); // Sets the innerHTML to an empty string
// Variables: content, child, el, node, subchild
Q.Ext('html', function (content) {
    if (content === undefined) {
        return this.nodes[0]?.innerHTML || null;
    }
    return this.each(el => {
        el = this.nodes[el];
        el.innerHTML = '';
        content.forEach(child => {
            if (typeof child === 'string') {
                el.insertAdjacentHTML('beforeend', child);
            } else if (child instanceof Q) {
                child.nodes.forEach(node => el.appendChild(node));
            } else if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else if (Array.isArray(child) || child instanceof NodeList) {
                Array.from(child).forEach(subchild => el.appendChild(subchild));
            }
        });
    });
});