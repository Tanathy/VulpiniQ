// Name: Image.Crop
// Method: Plugin
// Desc: Crop image to specified dimensions
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Crop method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Crop method directly to the Image object
        Image.Crop = function(x, y, width, height, cropOptions = {}) {
            // Default options
            const defaultOptions = {
                preserveContext: true // Whether to preserve the drawing context properties
            };
            
            const finalOptions = Object.assign({}, defaultOptions, cropOptions);
            
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
            
            return Image;
        };
        
        return Image;
    };
})();
