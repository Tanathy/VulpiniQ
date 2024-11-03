// Name: blur
// Method: Prototype
// Desc: Removes focus from the first node in the selection, effectively blurring it.
// Long Desc: Triggers the blur event on the first node in the selection. This is particularly useful for form elements, as it will remove focus, allowing for better user experience in forms or interactive elements. 
// Type: Form Manipulation
// Example: Q(selector).blur(); // Removes focus from the first matched input field <br> Q(".active").blur(); // Blurs the first active element <br> Q("textarea").blur(); // Blurs the first textarea in the selection
// Variables: el
Q.Ext('blur', function () {
    return this.each(el => this.nodes[el].blur());
});
