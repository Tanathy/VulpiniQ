Q.Image.prototype.Flip = function(direction = 'horizontal', flipOptions = {}) {
        // Default options
        const defaultOptions = {
            smoothing: true,    // Whether to use smoothing
            quality: 'high'     // Smoothing quality: 'low', 'medium', 'high'
        };
        const finalOptions = Object.assign({}, defaultOptions, flipOptions);
        const canvas_node = this.node;
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        let ctx = temp.getContext('2d');
        this.saveToHistory(); // Save the current state to history
        // Set smoothing options
        ctx.imageSmoothingEnabled = finalOptions.smoothing;
        ctx.imageSmoothingQuality = finalOptions.quality;
        // Flip based on direction
        if (direction === 'horizontal') {
            ctx.translate(canvas_node.width, 0);
            ctx.scale(-1, 1);
        } else if (direction === 'vertical') {
            ctx.translate(0, canvas_node.height);
            ctx.scale(1, -1);
        } else if (direction === 'both') {
            ctx.translate(canvas_node.width, canvas_node.height);
            ctx.scale(-1, -1);
        }
        ctx.drawImage(canvas_node, 0, 0);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        return this;
    };
