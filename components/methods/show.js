// Name: show
// Method: Prototype
// Desc: Shows each node, optionally with a fade-in effect over a specified duration.
// Type: Display
// Example: Q(selector).show(duration, callback);
// Variables: duration, callback, element, handler, el
Q.Ext('show', function (duration = 0, callback) {
    return this.each(index => {
        const element = this.nodes[index];
        if (duration === 0) {
            element.style.display = '';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
            element.style.display = '';
            setTimeout(() => {
                element.style.opacity = 1;
                element.addEventListener('transitionend', () => {
                    element.style.transition = '';
                    if (callback) callback();
                }, { once: true });
            }, 0);
        }
    });
});