// Name: fadeOut
// Method: Prototype
// Desc: Fades out each node.
// Type: Display
// Example: Q(selector).fadeOut(duration, callback);
// Variables: duration, callback, el
Q.Ext('fadeOut', function(duration, callback) {
    return this.each(el => {
        this.nodes[el].style.transition = `opacity ${duration}ms`;
        this.nodes[el].style.opacity = 0;
        setTimeout(() => {
            this.nodes[el].style.transition = '';
            this.nodes[el].style.display = 'none';
            if (callback) callback();
        }, duration);
    });
});