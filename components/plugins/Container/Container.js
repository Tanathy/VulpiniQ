Q.Container = function (options = {}) {
    // Create the Container namespace
    const Container = {};
    
    // Shared icon function
    Container.Icon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' container_icon');
        return iconElement;
    };

    Q.Icons();

    // Define only basic shared styles
    Container.classes = Q.style(`
        .container_icon {
            width: 100%;
            height: 100%;
            color: #777; /* Default color */
            pointer-events: none;
            z-index: 1;
        }
    `, {
        'container_icon': 'container_icon'
    });

    // Return the Container namespace to be extended by other components
    return Container;
};