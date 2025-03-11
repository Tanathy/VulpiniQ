// Name: hide
// Method: Prototype
// Desc: Hides each node, optionally with a fade-out effect over a specified duration.
// Type: Display
// Example: Q(selector).hide(duration, callback);
// Variables: duration, callback, element, handler, el
Q.Ext('hide', function (duration = 0, callback) {
    for (const node of this.nodes) {
        if (duration === 0) {
            node.style.display = 'none';
            if (callback) callback();
        } else {
            node.style.transition = `opacity ${duration}ms`;
            node.style.opacity = 1;
            setTimeout(() => {
                node.style.opacity = 0;
                node.addEventListener('transitionend', function handler() {
                    node.style.display = 'none';
                    node.style.transition = '';
                    node.removeEventListener('transitionend', handler);
                    if (callback) callback();
                });
            }, 0);
        }
    }
    return this;
});