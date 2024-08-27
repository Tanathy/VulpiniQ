Q.prototype.fadeOut = function (duration = 400, callback) {
    // Fades out each node.|Display|Q(selector).fadeOut(duration, callback);
    return this.each(el => {
        this.nodes[el].style.transition = `opacity ${duration}ms`;
        this.nodes[el].style.opacity = 0;
        setTimeout(() => {
            this.nodes[el].style.transition = '';
            this.nodes[el].style.display = 'none';
            if (callback) callback();
        }, duration);
    });
};