// Name: find
// Method: Prototype
// Desc: Finds child nodes of the first node that match a specific selector.
// Type: Traversal
// Example: Q(selector).find(".child");
// Variables: selector, parentElement, foundElements
Q.Ext('find', function(selector) {
    const parentElement = this.nodes[0];
    if (!parentElement) {
      return null;
    }
    const foundElements = parentElement.querySelectorAll(selector);
    return foundElements.length ? Q(foundElements) : null;
  });
  