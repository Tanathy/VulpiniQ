// Make Resize method compatible with new Image.js constructor pattern
Q.Image.Resize = function(width, height, resizeOptions = {}) {
    // Default options
    const defaultOptions = {
        size: 'auto',            // 'auto', 'contain', 'cover'
        keepDimensions: false,   // Keep original dimensions with padding
        fill: 'transparent',     // Background fill color
        smoothing: true,         // Use image smoothing
        quality: 'high'          // 'low', 'medium', 'high'
    };
    
    // Merge with passed options
    const finalOptions = Object.assign({}, defaultOptions, resizeOptions);
    const canvas_node = this.node;
    
    // Create a temporary canvas for resizing
    const temp = document.createElement('canvas');
    temp.width = width;
    temp.height = height;
    const ctx = temp.getContext('2d');
    
    // Set smoothing options
    ctx.imageSmoothingEnabled = finalOptions.smoothing;
    ctx.imageSmoothingQuality = finalOptions.quality;
    
    // Get original dimensions
    const canvasWidth = canvas_node.width;
    const canvasHeight = canvas_node.height;
    
    if (finalOptions.size === 'contain') {
        if (finalOptions.keepDimensions) {
            // Keep the dimensions but scale the image to fit within the specified dimensions
            const widthRatio = width / canvasWidth;
            const heightRatio = height / canvasHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            // Scale the image to fit within the specified dimensions
            const newWidth = canvasWidth * ratio;
            const newHeight = canvasHeight * ratio;
            const xOffset = (width - newWidth) / 2;
            const yOffset = (height - newHeight) / 2;
            
            // Draw the image onto the temporary canvas with padding if necessary
            ctx.fillStyle = finalOptions.fill;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, xOffset, yOffset, newWidth, newHeight);
        } else {
            // Scale the image to fit within the specified dimensions
            const widthRatio = width / canvasWidth;
            const heightRatio = height / canvasHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            const newWidth = canvasWidth * ratio;
            const newHeight = canvasHeight * ratio;
            
            ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
        }
    } else if (finalOptions.size === 'cover') {
        // Scale the image to cover the specified dimensions
        const widthRatio = width / canvasWidth;
        const heightRatio = height / canvasHeight;
        const ratio = Math.max(widthRatio, heightRatio);
        
        const newWidth = canvasWidth * ratio;
        const newHeight = canvasHeight * ratio;
        
        // Fix for negative coordinates
        const sourceX = Math.max(0, (canvasWidth - width / ratio) / 2);
        const sourceY = Math.max(0, (canvasHeight - height / ratio) / 2);
        
        // Ensure we don't exceed the image boundaries
        const sourceWidth = Math.min(canvasWidth, width / ratio);
        const sourceHeight = Math.min(canvasHeight, height / ratio);
        
        ctx.drawImage(canvas_node, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
    } else if (finalOptions.size === 'auto') {
        const ratio = Math.min(width / canvasWidth, height / canvasHeight);
        const newWidth = canvasWidth * ratio;
        const newHeight = canvasHeight * ratio;
        
        ctx.fillStyle = finalOptions.fill;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
    }
    
    // Update the original canvas with the resized image
    canvas_node.width = width;
    canvas_node.height = height;
    canvas_node.getContext('2d').drawImage(temp, 0, 0);
    
    // Explicitly save to history after resize
    // Fix for the new constructor: use the saveToHistory method on this instance
    if (typeof this.saveToHistory === 'function') {
        this.saveToHistory();
    } else if (typeof this.SaveHistory === 'function') {
        this.SaveHistory();
    }
    
    return this;
};