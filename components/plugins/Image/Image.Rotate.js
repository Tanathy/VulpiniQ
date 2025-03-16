// Name: Image.Rotate
// Method: Plugin
// Desc: Rotate image by specified degrees
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Rotate method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Rotate method directly to the Image object
        Image.Rotate = function(degrees, rotateOptions = {}) {
            // Default options
            const defaultOptions = {
                keepSize: false,     // Whether to keep original canvas size
                smoothing: true,     // Whether to use smoothing
                quality: 'high',     // Smoothing quality: 'low', 'medium', 'high'
                centerOrigin: true   // Whether to rotate around the center
            };
            
            const finalOptions = Object.assign({}, defaultOptions, rotateOptions);
            
            // Calculate new dimensions if we're not keeping the same size
            let width = canvas_node.width;
            let height = canvas_node.height;
            
            if (!finalOptions.keepSize) {
                // Calculate rotated dimensions
                const radians = degrees * Math.PI / 180;
                const newWidth = Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height);
                const newHeight = Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height);
                width = newWidth;
                height = newHeight;
            }
            
            let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
            let ctx = temp.getContext('2d');
            
            // Set smoothing options
            ctx.imageSmoothingEnabled = finalOptions.smoothing;
            ctx.imageSmoothingQuality = finalOptions.quality;
            
            // Set the origin point
            ctx.translate(width / 2, height / 2);
            
            // Rotate the canvas
            ctx.rotate(degrees * Math.PI / 180);
            
            // Draw the image with the origin offset
            ctx.drawImage(
                canvas_node, 
                -canvas_node.width / 2, 
                -canvas_node.height / 2
            );
            
            // Update the original canvas
            canvas_node.width = width;
            canvas_node.height = height;
            canvas_node.getContext('2d').drawImage(temp, 0, 0);
            
            return Image;
        };
        
        return Image;
    };
})();
