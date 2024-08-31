// Name: fadeToggle
// Method: Prototype
// Desc: Toggles the fade state of each node.
// Type: Display
// Example: Q(selector).fadeToggle(duration, callback);
Q.prototype.fadeToggle = function (duration = 400, callback) {
    return this.each(el => {
        if (window.getComputedStyle(this.nodes[el]).opacity === '0') {
            this.fadeIn(duration, callback);
        } else {
            this.fadeOut(duration, callback);
        }
    });
};