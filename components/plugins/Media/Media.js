function Media(options = {}) {
    if (!(this instanceof Media)) {
        return new Media(options);
    }
    if (!Media.initialized) {
        // Media színek root változóként
        Q.style(`
            --media-timeline-bg: #232323;
            --media-timeline-track-border: #3338;
            --media-timeline-segment-normal: #4caf50;
            --media-timeline-segment-alert: #ff9800;
            --media-timeline-segment-warning: #f44336;
            --media-timeline-handle-bg:rgba(255, 255, 255, 0.21);
        `);
        Media.initialized = true;
        console.log('Media core initialized');
    }
    return this;
};

Q.Media = Media;