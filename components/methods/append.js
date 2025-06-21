Q.Ext('append', function (...contents) {
  const nodes = this.nodes;
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    for (let j = 0, clen = contents.length; j < clen; j++) {
      const child = contents[j];
      if (typeof child === "string") {
        if (parent instanceof SVGElement) {
          // Inserting SVG string: create in SVG namespace
          const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          temp.innerHTML = child;
          Array.from(temp.childNodes).forEach(n => parent.appendChild(n));
        } else {
          parent.insertAdjacentHTML('beforeend', child);
        }
      } else if (child instanceof HTMLElement || child instanceof Q || child instanceof SVGElement) {
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
