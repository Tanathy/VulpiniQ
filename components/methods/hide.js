// Name: hide
// Method: Prototype
// Desc: Hides each node, optionally with a fade-out effect over a specified duration.
// Type: Display
// Example: Q(selector).hide(duration, callback);
// Variables: duration, callback, element, handler, el
Q.Ext('hide', (duration = 0, callback) => {
    return this.each(el => {
        const element = this.nodes[el];
        if (duration === 0) {
            element.style.display = 'none';
            if (callback) callback();
        } else {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 1;
            setTimeout(() => {
                element.style.opacity = 0;
                element.addEventListener('transitionend', function handler() {
                    element.style.display = 'none';
                    element.style.transition = '';
                    element.removeEventListener('transitionend', handler);
                    if (callback) callback();
                });
            }, 0);
        }
    });
});