// Name: fadeToggle
// Method: Prototype
// Desc: Toggles the fade state of each node.
// Type: Display
// Example: Q(selector).fadeToggle(duration, callback);
// Variables: duration, callback, el
Q.Ext('fadeToggle', (duration, callback) => {
    return this.each(el => {
        if (window.getComputedStyle(this.nodes[el]).opacity === '0') {
            this.fadeIn(duration, callback);
        } else {
            this.fadeOut(duration, callback);
        }
    });
});