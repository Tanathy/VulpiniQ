/**
 * Q.Media - Unified plugin schema
 * @param {Object} options
 */
Q.Media = function(options = {}) {
    if (!Q.Media.initialized) {
        Q.style(`
            --media-timeline-bg: #232323;
            --media-timeline-track-border: #3338;
            --media-timeline-segment-normal: #4caf50;
            --media-timeline-segment-alert: #ff9800;
            --media-timeline-segment-warning: #f44336;
            --media-timeline-handle-bg:rgba(255, 255, 255, 0.21);
        `);
        Q.Media.initialized = true;
        console.log('Media core initialized');
    }
    this.options = { ...options };
};
Q.Media.prototype.init = function() { return this; };
Q.Media.prototype.getState = function() { return { initialized: Q.Media.initialized }; };
Q.Media.prototype.setState = function(state) { /* no interpretable state */ };
Q.Media.prototype.destroy = function() { /* no cleanup needed */ };