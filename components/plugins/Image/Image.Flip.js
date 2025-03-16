// Name: Image.Flip
// Method: Plugin
// Desc: Flip image horizontally or vertically
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Flip method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Flip method directly to the Image object
        Image.Flip = function(direction = 'horizontal', flipOptions = {}) {
            // Default options
            const defaultOptions = {
                smoothing: true,    // Whether to use smoothing
                quality: 'high'     // Smoothing quality: 'low', 'medium', 'high'
            };
            
            const finalOptions = Object.assign({}, defaultOptions, flipOptions);
            
            let temp = Q('<canvas>', { 
                width: canvas_node.width, 
                height: canvas_node.height 
            }).nodes[0];
            
            let ctx = temp.getContext('2d');
            
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
            
            return Image;
        };
        
        return Image;
    };
})();
