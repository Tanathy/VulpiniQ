// Name: css
// Method: Prototype
// Desc: Retrieves or sets CSS styles on the selected nodes. Supports setting multiple styles if provided as an object.
// Long Desc: This method allows you to get or set CSS styles for the nodes in the collection. If a string is provided for the property, it retrieves the computed style for that property from the first node. If an object is provided, it sets multiple CSS properties on each node. This method is useful for dynamic style manipulation in your applications.
// Type: Style Manipulation
// Example: Q(selector).css('color', 'red'); // Sets the text color of the first selected element to red <br> const backgroundColor = Q(selector).css('background-color'); // Gets the background color of the first selected element <br> Q(selector).css({ margin: '10px', padding: '5px' }); // Sets multiple styles on each selected element
// Variables: property, value, key, el
Q.Ext('css', function(property, value) {
  const nodes = this.nodes;
  if (typeof property === 'object') {
      for (let i = 0, len = nodes.length; i < len; i++) {
          const style = nodes[i].style;
          for (const key in property) {
              style[key] = property[key];
          }
      }
      return this;
  }
  if (value === undefined) return getComputedStyle(nodes[0])[property];
  for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].style[property] = value;
  }
  return this;
});
