// Name: Image.Halftone
// Method: Plugin
// Desc: Apply a halftone effect to an image
// Type: Component
// Dependencies: Image

// Directly extend Q.Image with the Halftone method
(function() {
    // Store the original Image function
    const originalImage = Q.Image;
    
    // Override Q.Image to add our method
    Q.Image = function(options = {}) {
        // Get the original Image object
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        // Add Halftone method directly to the Image object
        Image.Halftone = function(halftoneOptions = {}) {
            // Default options
            const defaultOptions = {
                dotSize: 8,                  // Size of the halftone dots
                shape: "dot",                // Shape of the dots: "dot", "rectangle", "hexagon"
                colored: true,               // Whether to use color or black and white
                backgroundColor: "black",    // Background color
                foregroundColor: "white",    // Foreground color (for non-colored mode)
                spacing: 2                   // Spacing multiplier between dots
            };
            
            const finalOptions = Object.assign({}, defaultOptions, halftoneOptions);
            
            // Create a temporary canvas for processing
            let temp = Q('<canvas>', { 
                width: canvas_node.width, 
                height: canvas_node.height 
            }).nodes[0];
            
            let tempCtx = temp.getContext('2d', { willReadFrequently: true });
            
            // Draw the source canvas to the temp canvas
            tempCtx.drawImage(canvas_node, 0, 0);
            
            // Clear the original canvas with background color
            const ctx = canvas_node.getContext('2d');
            ctx.fillStyle = finalOptions.backgroundColor;
            ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
            
            // Get image data from the temp canvas
            const imageData = tempCtx.getImageData(0, 0, temp.width, temp.height);
            const pixels = imageData.data;
            const width = temp.width;
            const height = temp.height;
            
            // Function to draw a shape at the given coordinates
            function drawShape(x, y, size, color, shapeType) {
                ctx.beginPath();
                
                if (shapeType === "dot") {
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                } else if (shapeType === "rectangle") {
                    ctx.rect(x - size / 2, y - size / 2, size, size);
                } else if (shapeType === "hexagon") {
                    const sideLength = size / 2;
                    const angleStep = (Math.PI * 2) / 6;
                    ctx.moveTo(x + sideLength * Math.cos(0), y + sideLength * Math.sin(0));
                    for (let i = 1; i <= 6; i++) {
                        ctx.lineTo(
                            x + sideLength * Math.cos(angleStep * i), 
                            y + sideLength * Math.sin(angleStep * i)
                        );
                    }
                } else {
                    // Default to dot for invalid shape type
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                }
                
                if (finalOptions.colored) {
                    ctx.fillStyle = color;
                } else {
                    ctx.fillStyle = finalOptions.foregroundColor;
                }
                
                ctx.fill();
            }
            
            // Calculate spacing between dots
            const dotSpacing = finalOptions.dotSize * finalOptions.spacing;
            
            // Process the image to create halftone effect
            for (let y = 0; y < height; y += dotSpacing) {
                for (let x = 0; x < width; x += dotSpacing) {
                    // Sample area to determine average color
                    let r = 0, g = 0, b = 0, count = 0;
                    
                    const sampleSize = finalOptions.dotSize;
                    
                    for (let offsetY = 0; offsetY < sampleSize; offsetY++) {
                        for (let offsetX = 0; offsetX < sampleSize; offsetX++) {
                            const sampleX = x + offsetX;
                            const sampleY = y + offsetY;
                            
                            if (sampleX < width && sampleY < height) {
                                const index = (sampleY * width + sampleX) * 4;
                                r += pixels[index];
                                g += pixels[index + 1];
                                b += pixels[index + 2];
                                count++;
                            }
                        }
                    }
                    
                    // Calculate average color
                    const avgR = Math.floor(r / count);
                    const avgG = Math.floor(g / count);
                    const avgB = Math.floor(b / count);
                    const color = finalOptions.colored ? `rgb(${avgR}, ${avgG}, ${avgB})` : "";
                    
                    // Calculate brightness
                    const brightness = (avgR + avgG + avgB) / 3;
                    
                    // Calculate dot size based on brightness (darker areas = larger dots)
                    const dotSizeBasedOnBrightness = finalOptions.dotSize * (1 - brightness / 255);
                    
                    // Only draw if dot has some size and is within canvas bounds
                    if (dotSizeBasedOnBrightness > 0) {
                        if (x >= 0 && x < width && y >= 0 && y < height) {
                            drawShape(x, y, dotSizeBasedOnBrightness, color, finalOptions.shape);
                        }
                    }
                }
            }
            
            return Image;
        };
        
        return Image;
    };
})();
