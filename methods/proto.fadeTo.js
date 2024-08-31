// Name: fadeTo
// Method: Prototype
// Desc: Fades each node to a specific opacity.
// Type: Display
// Example: Q(selector).fadeTo(opacity, duration, callback);
Q.prototype.fadeTo = function (opacity, duration = 400, callback) {
    return this.each(el => {
        this.nodes[el].style.transition = `opacity ${duration}ms`;
        this.nodes[el].offsetHeight;
        this.nodes[el].style.opacity = opacity;
        setTimeout(() => {
            this.nodes[el].style.transition = '';
            if (callback) callback();
        }, duration);
    });
};