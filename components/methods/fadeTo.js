// Name: fadeTo
// Method: Prototype
// Desc: Fades each node to a specific opacity.
// Type: Display
// Example: Q(selector).fadeTo(opacity, duration, callback);
// Variables: opacity, duration, callback, el
Q.Ext('fadeTo', (opacity, duration, callback) => {
    return this.each(el => {
        this.nodes[el].style.transition = `opacity ${duration}ms`;
        this.nodes[el].offsetHeight;
        this.nodes[el].style.opacity = opacity;
        setTimeout(() => {
            this.nodes[el].style.transition = '';
            if (callback) callback();
        }, duration);
    });
});