Q.Method('replaceWith', function(newContent) {
    // Replace each node in this Q instance with newContent (Q instance or DOM node)
    const nodes = this.nodes;
    let newNodes = (newContent instanceof Q) ? newContent.nodes : [newContent];
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        if (node && node.parentNode) {
            for (let j = 0; j < newNodes.length; j++) {
                node.parentNode.insertBefore(newNodes[j].cloneNode(true), node);
            }
            node.parentNode.removeChild(node);
        }
    }
    return this;
});
