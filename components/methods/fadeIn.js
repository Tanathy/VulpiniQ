// Name: fadeIn
// Method: Prototype
// Desc: Fades in each node.
// Type: Display
// Example: Q(selector).fadeIn(duration, callback);
// Variables: duration, callback, el
Q.Ext('fadeIn', (duration = 400, callback) => {
    return this.each(el => {
        this.nodes[el].style.display = '';
        this.nodes[el].style.transition = `opacity ${duration}ms`;
        this.nodes[el].offsetHeight;
        this.nodes[el].style.opacity = 1;
        setTimeout(() => {
            this.nodes[el].style.transition = '';
            if (callback) callback();
        }, duration);
    });
});