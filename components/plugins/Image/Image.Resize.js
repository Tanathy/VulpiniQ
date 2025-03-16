// Name: Image.Resize
// Method: Plugin
// Desc: Image resizing operations
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Resize method
(function() {
    // Store the original Image function - important to use this exact naming
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Resize method directly to the Image object
        Image.Resize = function(width, height, resizeOptions = {}) {
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
            
            // Calculate ratio based on the resize mode
            let ratio = 1;
            
            if (finalOptions.size === 'contain') {
                if (finalOptions.keepDimensions) {
                    // Keep the dimensions but scale the image to fit within the specified dimensions
                    const widthRatio = width / canvasWidth;
                    const heightRatio = height / canvasHeight;
                    ratio = Math.min(widthRatio, heightRatio);
                    
                    // Scale the image to fit within the specified dimensions
                    const newWidth = canvasWidth * ratio;
                    const newHeight = canvasHeight * ratio;
                    const xOffset = (width - newWidth) / 2;
                    const yOffset = (height - newHeight) / 2;
                    
                    // Draw the image onto the temporary canvas with padding if necessary
                    ctx.fillStyle = finalOptions.fill;
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
                } else {
                    // Scale the image to fit within the specified dimensions
                    const widthRatio = width / canvasWidth;
                    const heightRatio = height / canvasHeight;
                    ratio = Math.min(widthRatio, heightRatio);
                    const newWidth = canvasWidth * ratio;
                    const newHeight = canvasHeight * ratio;
                    
                    ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
                }
            } else if (finalOptions.size === 'cover') {
                // Scale the image to cover the specified dimensions
                const widthRatio = width / canvasWidth;
                const heightRatio = height / canvasHeight;
                ratio = Math.max(widthRatio, heightRatio);
                
                const newWidth = canvasWidth * ratio;
                const newHeight = canvasHeight * ratio;
                
                const xOffset = (newWidth - width) / 2;
                const yOffset = (newHeight - height) / 2;
                ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
            } else if (finalOptions.size === 'auto') {
                ratio = Math.min(width / canvasWidth, height / canvasHeight);
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
            
            return Image;
        };
        
        return Image;
    };
})();
