// Name: show
// Method: Prototype
// Desc: Shows each node, optionally with a fade-in effect over a specified duration.
// Type: Display
// Example: Q(selector).show(duration, callback);
// Variables: duration, callback, element, handler, el
Q.Ext('show', (duration = 0, callback) => {
    return this.each(el => {
        const element = this.nodes[el];
        if (duration === 0) {
            element.style.display = '';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
            element.style.display = '';
            setTimeout(() => {
                element.style.opacity = 1;
                element.addEventListener('transitionend', function handler() {
                    element.style.transition = '';
                    element.removeEventListener('transitionend', handler);
                    if (callback) callback();
                });
            }, 0);
        }
    });
});