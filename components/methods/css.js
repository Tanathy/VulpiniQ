// Name: css
// Method: Prototype
// Desc: Gets or sets CSS styles on the nodes. Can handle multiple styles if provided as an object.
// Type: Style Manipulation
// Example: Q(selector).css(property, value);
// Variables: property, value, key, el
Q.Ext('css', function(property, value){
    if (typeof property === 'object') {
        return this.each(el => {
            for (let key in property) {
                if (property.hasOwnProperty(key)) {
                    this.nodes[el].style[key] = property[key];
                }
            }
        });
    } else {
        if (value === undefined) {
            return getComputedStyle(this.nodes[0])[property];
        }
        return this.each(el => this.nodes[el].style[property] = value);
    }
});