// Name: Image
// Method: Plugin
// Desc: Useful to manipulate images.
// Type: Component
// Example: var image = Q.Image();
// Dependencies: RGB2HSL, HSL2RGB

Q.Image = function (options) {
    // Create the Image namespace
    const Image = {};

    // Default options
    const defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        size: 'auto',
        quality: 1,
        historyLimit: 3,         // Maximum number of history states to keep
        autoSaveHistory: true    // Automatically save history on operations
    };

    // Merge options with defaults
    options = Object.assign({}, defaultOptions, options);

    // Create canvas element
    const Canvas = Q('<canvas>');
    const canvas_node = Canvas.nodes[0];
    
    // History tracking
    const history = {
        states: [],        // Array of ImageData objects
        position: -1,      // Current position in history (-1 means no history yet)
        isUndoRedoing: false // Flag to prevent recording during undo/redo
    };

    // Add the canvas to the Image namespace for access in extensions
    Image.canvas = Canvas;
    Image.node = canvas_node;
    Image.options = options;

    // Save current state to history
    const saveToHistory = function() {
        if (history.isUndoRedoing || !options.autoSaveHistory) return;
        
        // Get current image data - using willReadFrequently for better performance
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        
        // If we're not at the end of the history, truncate the future history
        if (history.position < history.states.length - 1) {
            history.states = history.states.slice(0, history.position + 1);
        }
        
        // Add current state to history
        history.states.push(imageData);
        history.position++;
        
        // Limit history size
        if (history.states.length > options.historyLimit) {
            history.states.shift();
            history.position--;
        }
    };

    // Core functionality: Load an image - enhanced to support URLs, Image elements and Canvas elements
    Image.Load = function (src, callback) {
        // Check what type of source we're dealing with
        if (src instanceof HTMLCanvasElement) {
            // Source is a canvas element - copy directly
            canvas_node.width = src.width;
            canvas_node.height = src.height;
            canvas_node.getContext('2d', { willReadFrequently: true })
                .drawImage(src, 0, 0);
            saveToHistory();
            if (callback) callback();
            return Image;
        } 
        else if (src instanceof HTMLImageElement) {
            // Source is an image element that's already loaded
            if (src.complete && src.naturalWidth !== 0) {
                canvas_node.width = src.naturalWidth;
                canvas_node.height = src.naturalHeight;
                canvas_node.getContext('2d', { willReadFrequently: true })
                    .drawImage(src, 0, 0);
                saveToHistory();
                if (callback) callback();
            } else {
                // Wait for the image to load
                src.onload = function() {
                    canvas_node.width = src.naturalWidth;
                    canvas_node.height = src.naturalHeight;
                    canvas_node.getContext('2d', { willReadFrequently: true })
                        .drawImage(src, 0, 0);
                    saveToHistory();
                    if (callback) callback();
                };
            }
            return Image;
        } 
        else {
            // Source is a URL string (original behavior)
            let img = new window.Image();
            img.crossOrigin = 'Anonymous'; // Add this to handle CORS if needed
            img.src = src;
            img.onload = function () {
                canvas_node.width = img.width;
                canvas_node.height = img.height;
                canvas_node.getContext('2d', { willReadFrequently: true })
                    .drawImage(img, 0, 0);
                saveToHistory();
                if (callback) callback();
            };
            return Image;
        }
    };

    // Get image as data URL
    Image.Get = function (format = options.format, quality = options.quality) {
        if (format === 'jpeg' || format === 'webp') {
            return canvas_node.toDataURL('image/' + format, quality);
        } else {
            return canvas_node.toDataURL('image/' + format);
        }
    };

    // Save image to file with options - improved with FileSaver approach
    Image.Save = function (filename, saveOptions = {}) {
        // Default save options
        const defaultSaveOptions = {
            format: options.format,
            quality: options.quality,
            backgroundColor: options.fill, // Default background color for alpha handling
            preserveTransparency: true     // Whether to preserve transparency in non-alpha formats
        };
        
        // Merge with defaults
        const finalOptions = Object.assign({}, defaultSaveOptions, saveOptions);
        let format = finalOptions.format;
        let quality = finalOptions.quality;
        
        // Handle alpha transparency for formats that don't support it
        let dataUrl;
        if ((format === 'jpeg' || format === 'jpg') && finalOptions.preserveTransparency) {
            // Create a temporary canvas to handle alpha compositing
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas_node.width;
            tempCanvas.height = canvas_node.height;
            
            let tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            
            // Fill with background color first
            tempCtx.fillStyle = finalOptions.backgroundColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw the original image on top, preserving alpha composition
            tempCtx.drawImage(canvas_node, 0, 0);
            
            // Get data URL from the temp canvas
            dataUrl = tempCanvas.toDataURL('image/' + format, quality);
        } else {
            // For formats that support alpha or if not preserving transparency
            dataUrl = canvas_node.toDataURL('image/' + format, format === 'jpeg' || format === 'webp' ? quality : undefined);
        }
        
        // Convert data URL to Blob for better file handling
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeType });
        
        // Create a file save dialog using the modern approach
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // For IE/Edge
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // For other browsers
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);
        }
        
        return Image;
    };

    // Clear the canvas
    Image.Clear = function (fill = options.fill) {
        let ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
        saveToHistory();
        return Image;
    };
    
    // Render the image to a target canvas element or container - fixed version
    Image.Render = function(target) {
        if (!target) {
            console.error('No target provided for rendering');
            return Image;
        }
        
        // Resolve the target element from various input types
        let targetElement;
        
        if (typeof target === 'string') {
            // Try to get element by ID first, then by selector
            targetElement = document.getElementById(target) || document.querySelector(target);
            if (!targetElement) {
                // Try with Q selector as fallback
                const qElement = Q(target);
                if (qElement && qElement.nodes && qElement.nodes.length) {
                    targetElement = qElement.nodes[0];
                }
            }
        } else if (target.nodes && target.nodes.length) {
            // Handle Q selection object
            targetElement = target.nodes[0];
        } else if (target.appendChild) {
            // Handle DOM element
            targetElement = target;
        }
        
        if (!targetElement) {
            console.error('Invalid render target');
            return Image;
        }
        
        // Find or create the appropriate canvas element based on target type
        let renderCanvas;
        const targetTag = targetElement.tagName.toLowerCase();
        
        if (targetTag === 'canvas') {
            // Target is already a canvas - use it directly
            renderCanvas = targetElement;
        } else if (targetTag === 'img') {
            // Target is an image - update its source from our canvas
            canvas_node.toBlob(function(blob) {
                const objectUrl = URL.createObjectURL(blob);
                targetElement.src = objectUrl;
                // Clean up the blob URL once the image loads
                targetElement.onload = function() {
                    URL.revokeObjectURL(objectUrl);
                };
            }, 'image/' + options.format, options.quality);
            return Image;
        } else {
            // Target is a container - find existing render canvas or create one
            renderCanvas = targetElement.querySelector('canvas.q-image-render');
            
            if (!renderCanvas) {
                // Create a new canvas for rendering
                renderCanvas = document.createElement('canvas');
                renderCanvas.className = 'q-image-render';
                targetElement.appendChild(renderCanvas);
            }
        }
        
        // Set canvas dimensions to match source
        renderCanvas.width = canvas_node.width;
        renderCanvas.height = canvas_node.height;
        
        // Draw the image onto the target canvas
        const renderCtx = renderCanvas.getContext('2d', { willReadFrequently: true });
        renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
        renderCtx.drawImage(canvas_node, 0, 0);
        
        return Image;
    };
    
    // History management methods - updated to match requested behavior
    Image.History = function(offset = -1) {
        // Check if we have history
        if (history.states.length === 0) return Image;
        
        // If offset is 0, stay at current position
        if (offset === 0) return Image;
        
        // Calculate target position
        let targetPosition = history.position + offset;
        
        // Ensure we stay within bounds
        if (targetPosition < 0) targetPosition = 0;
        if (targetPosition >= history.states.length) targetPosition = history.states.length - 1;
        
        // Check if we actually need to change position
        if (targetPosition === history.position) return Image;
        
        // Apply history state
        history.isUndoRedoing = true;
        
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const state = history.states[targetPosition];
        
        // Resize canvas if needed
        if (canvas_node.width !== state.width || canvas_node.height !== state.height) {
            canvas_node.width = state.width;
            canvas_node.height = state.height;
        }
        
        ctx.putImageData(state, 0, 0);
        history.position = targetPosition;
        
        history.isUndoRedoing = false;
        
        return Image;
    };

    // Convenience methods for history
    Image.Undo = function() {
        return Image.History(-1);
    };

    Image.Redo = function() {
        return Image.History(1);
    };

    // Enable/disable auto history
    Image.AutoHistory = function(enable = true) {
        options.autoSaveHistory = enable;
        return Image;
    };

    // Manually save a history state
    Image.SaveHistory = function() {
        saveToHistory();
        return Image;
    };

    // Clear history
    Image.ClearHistory = function() {
        history.states = [];
        history.position = -1;
        return Image;
    };

    // Return the Image namespace to be extended by other components
    return Image;
};