Q.Ext('children', function (selector) {
  const result = [];
  const nodes = this.nodes;
  
  for (let i = 0, len = nodes.length; i < len; i++) {
    const parent = nodes[i];
    
    // Ellenőrizzük, hogy a parent érvényes DOM elem-e
    if (!parent || !parent.children) continue;
    
    // Használjuk a natív children gyűjteményt
    const childElements = parent.children;
    
    if (selector) {
      // Ha van szelektor, csak a megfelelő elemeket adjuk hozzá
      for (let j = 0; j < childElements.length; j++) {
        if (childElements[j].matches && childElements[j].matches(selector)) {
          result.push(childElements[j]);
        }
      }
    } else {
      // Ha nincs szelektor, minden gyermeket adjunk hozzá
      for (let j = 0; j < childElements.length; j++) {
        result.push(childElements[j]);
      }
    }
  }
  
  return new Q(result);
});
