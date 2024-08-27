Q.prototype.fadeTo = function (opacity, duration = 400, callback) {
    // Fades each node to a specific opacity.|Display|Q(selector).fadeTo(opacity, duration, callback);
    return this.each(el => {
        this.nodes[el].style.transition = `opacity ${duration}ms`;
        this.nodes[el].offsetHeight;
        this.nodes[el].style.opacity = opacity;
        setTimeout(() => {
            this.nodes[el].style.transition = '';
            if (callback) callback();
        }, duration);
    });
};