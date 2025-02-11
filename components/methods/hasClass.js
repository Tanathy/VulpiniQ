// Name: hasClass
// Method: Prototype
// Desc: Checks if the first node has a specific class.
// Type: Class Manipulation
// Example: Q(selector).hasClass(className);
// Variables: className
Q.Ext('hasClass', function(className) {
    return this.nodes[0]?.classList.contains(className) || false;
  });
