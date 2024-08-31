// Name: animate
// Method: Prototype
// Desc: Animates each node with specific CSS properties.
// Type: Animation
// Example: Q(selector).animate(duration, { opacity: 0, left: "50px" }, callback);
Q.prototype.animate = function (duration, properties, callback) {
    return this.each(el => {
        const element = this.nodes[el];
        const transitionProperties = Object.keys(properties).map(prop => `${prop} ${duration}ms`).join(', ');
        element.style.transition = transitionProperties;
        for (const prop in properties) {
            element.style[prop] = properties[prop];
        }
        if (typeof callback === 'function') {
            setTimeout(() => {
                if (callback) callback.call(element);
            }, duration);
        }
    }), this;
};