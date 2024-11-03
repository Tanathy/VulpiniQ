// Name: click
// Method: Prototype
// Desc: Simulates a click event on each node in the selection.
// Long Desc: This method programmatically triggers a click event on every element in the selected nodes. It can be useful for automating interactions in testing scenarios or for creating dynamic interfaces that respond to user actions without needing manual clicks.
// Type: Event Handling
// Example: Q(selector).click(); // Triggers a click event on all matched elements <br> Q(".button").click(); // Simulates clicks on all elements with the class 'button' <br> Q("a").click(); // Automatically clicks the first anchor element in the selection
Q.Ext('click', function () {
    return this.each(el => this.nodes[el].click());
});
