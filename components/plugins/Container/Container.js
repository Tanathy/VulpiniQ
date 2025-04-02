function Container(options = {}) {
    if (!(this instanceof Container)) {
        return new Container(options);
    }
    this.elements = [];
    this.options = options;
    if (!Container.initialized) {
        // Define only basic shared styles
        Container.classes = Q.style('', `
            .container_icon {
                width: 100%;
                height: 100%;
                color: #777; /* Default color */
                pointer-events: none;
                z-index: 1;
            }
        `, null, {
            'container_icon': 'container_icon'
        });
        Q.Icons();
        Container.initialized = true;
        console.log('Container core initialized');
    }
}
// Shared icon function - updated to properly use Q.Icons().get()
Container.prototype.Icon = function(icon) {
    // Use the Q.Icons() instance to get the icon with the container_icon class
    const iconInstance = Q.Icons();
    return iconInstance.get(icon, 'container_icon');
};
Q.Container = Container;