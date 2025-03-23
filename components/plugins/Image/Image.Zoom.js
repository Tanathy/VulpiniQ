
    Q.Image.prototype.Zoom = function(factor = 1.5, zoomOptions = {}) {
        // Default options
        const defaultOptions = {
            centerX: this.node.width / 2,   // Default center point X
            centerY: this.node.height / 2,  // Default center point Y
            smoothing: true,                // Whether to use smoothing
            quality: 'high',                // Smoothing quality: 'low', 'medium', 'high'
            background: 'transparent'       // Background for areas outside the image when zooming out
        };
        
        const finalOptions = Object.assign({}, defaultOptions, zoomOptions);
        const canvas_node = this.node;
        
        // Create a temporary canvas for the zoomed image
        let temp = Q('<canvas>', { 
            width: canvas_node.width, 
            height: canvas_node.height 
        }).nodes[0];
        
        let ctx = temp.getContext('2d');
        
        // Set smoothing options
        ctx.imageSmoothingEnabled = finalOptions.smoothing;
        ctx.imageSmoothingQuality = finalOptions.quality;
        
        // Clear the temporary canvas with the specified background
        ctx.fillStyle = finalOptions.background;
        ctx.fillRect(0, 0, temp.width, temp.height);
        
        if (factor >= 1) {
            // Zoom in: Take a smaller portion of the original image and stretch it
            const sWidth = canvas_node.width / factor;
            const sHeight = canvas_node.height / factor;
            
            // Calculate source coordinates centered around the specified point
            const sx = finalOptions.centerX - (sWidth / 2);
            const sy = finalOptions.centerY - (sHeight / 2);
            
            // Ensure source coordinates are within bounds
            const boundedSx = Math.max(0, Math.min(canvas_node.width - sWidth, sx));
            const boundedSy = Math.max(0, Math.min(canvas_node.height - sHeight, sy));
            
            // Draw the zoomed portion to fill the entire canvas
            ctx.drawImage(
                canvas_node,
                boundedSx, boundedSy, sWidth, sHeight,
                0, 0, canvas_node.width, canvas_node.height
            );
        } else {
            // Zoom out: Scale down the entire image and center it
            const scaledWidth = canvas_node.width * factor;
            const scaledHeight = canvas_node.height * factor;
            
            // Calculate destination coordinates to center the scaled image
            const dx = (canvas_node.width - scaledWidth) / 2;
            const dy = (canvas_node.height - scaledHeight) / 2;
            
            // Draw the entire image scaled down
            ctx.drawImage(
                canvas_node,
                0, 0, canvas_node.width, canvas_node.height,
                dx, dy, scaledWidth, scaledHeight
            );
        }
        
        // Replace the original canvas with the zoomed version
        canvas_node.getContext('2d').clearRect(0, 0, canvas_node.width, canvas_node.height);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
        
        return this;
    };
