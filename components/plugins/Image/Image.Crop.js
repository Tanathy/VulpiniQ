
    Q.Image.prototype.Crop = function(x, y, width, height, cropOptions = {}) {
        // Default options
        const defaultOptions = {
            preserveContext: true // Whether to preserve the drawing context properties
        };
        
        this.saveToHistory(); // Save the current state before cropping
        const finalOptions = Object.assign({}, defaultOptions, cropOptions);
        const canvas_node = this.node;
        
        let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
        let tempCtx = temp.getContext('2d');
        
        // Copy drawing context properties if requested
        if (finalOptions.preserveContext) {
            const ctx = canvas_node.getContext('2d');
            tempCtx.globalAlpha = ctx.globalAlpha;
            tempCtx.globalCompositeOperation = ctx.globalCompositeOperation;
            // Add other properties as needed
        }
        
        tempCtx.drawImage(canvas_node, x, y, width, height, 0, 0, width, height);
        
        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        
        return this;
    };
