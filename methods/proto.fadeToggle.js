Q.prototype.fadeToggle = function (duration = 400, callback) {
    // Toggles the fade state of each node.|Display|Q(selector).fadeToggle(duration, callback);
    return this.each(el => {
        if (window.getComputedStyle(this.nodes[el]).opacity === '0') {
            this.fadeIn(duration, callback);
        } else {
            this.fadeOut(duration, callback);
        }
    });
};