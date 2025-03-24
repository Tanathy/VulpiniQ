Q.Image = function (options) {

    const defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        quality: 1,
        historyLimit: 10,
        autoSaveHistory: true    
    };

    this.options = Object.assign({}, defaultOptions, options);
    this.canvas = Q('<canvas>');
    this.node = this.canvas.nodes[0];
    
    // Set initial canvas size if specified in options
    if (this.options.width && this.options.height) {
        this.node.width = this.options.width;
        this.node.height = this.options.height;
    }

    this.history = {
        states: [],        
        position: -1,      
        isUndoRedoing: false 
    };

    // Don't save initial empty state automatically
};


Q.Image.prototype.Load = function(src, callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
        // Use image dimensions if canvas is empty or too small
        if (this.node.width === 0 || this.node.height === 0 || 
            this.options.width === 0 || this.options.height === 0) {
            this.node.width = img.width;
            this.node.height = img.height;
        }
        
        const ctx = this.node.getContext('2d');
        // Clear the canvas before drawing
        ctx.clearRect(0, 0, this.node.width, this.node.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 
                      0, 0, this.node.width, this.node.height);
        
        // Clear history when loading a new image
        this.history.states = [];
        this.history.position = -1;
        
        // Save this as the first history state
        this.saveToHistory();
        
        if (callback) callback.call(this, null);
    };
    img.onerror = (err) => {
        console.error('Hiba a kép betöltésekor:', src, err);
        if (callback) callback.call(this, new Error('Error loading image'));
    };
    img.src = typeof src === 'string' ? src : src.src;
    
    return this; // Láncolhatóság!
};

Q.Image.prototype.Clear = function(fill = this.options.fill) {
    let ctx = this.node.getContext('2d');
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, this.node.width, this.node.height);
    this.saveToHistory();
    
    return this; 
};

Q.Image.prototype.Render = function(target) {
    const targetNode = (typeof target === 'string')
        ? document.querySelector(target)
        : (target instanceof HTMLElement)
            ? target
            : (target.nodes ? target.nodes[0] : null);

    if (!targetNode) {
        console.error('Invalid render target');
        return this;
    }

    let ctxTarget;
    if (targetNode.tagName.toLowerCase() === 'canvas') {
        targetNode.width = this.node.width;
        targetNode.height = this.node.height;
        ctxTarget = targetNode.getContext('2d');
        ctxTarget.drawImage(this.node, 0, 0);
    } else if (targetNode.tagName.toLowerCase() === 'img') {
        targetNode.src = this.node.toDataURL(`image/${this.options.format}`, this.options.quality);
    } else {
        console.error('Unsupported element for rendering');
    }

    return this;
};

Q.Image.prototype.Save = function(filename) {
    const dataUrl = this.node.toDataURL('image/' + this.options.format, this.options.quality);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    link.remove();
    
    return this;
};

Q.Image.prototype.saveToHistory = function() {
    if (this.history.isUndoRedoing || !this.options.autoSaveHistory) return;
    
    // Only save if canvas has valid dimensions
    if (this.node.width === 0 || this.node.height === 0) return;

    const ctx = this.node.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, this.node.width, this.node.height);
    
    // Remove future states if we're in the middle of history
    if (this.history.position < this.history.states.length - 1) {
        this.history.states.length = this.history.position + 1;
    }

    this.history.states.push(imageData);
    if (this.history.states.length > this.options.historyLimit) {
        this.history.states.shift();
        // Adjust position if we removed the oldest state
        if (this.history.position > 0) {
            this.history.position--;
        }
    } else {
        this.history.position++;
    }
};

/* 
 * IMPORTANT: Every image manipulation method should call saveToHistory() 
 * after modifying the canvas to ensure proper history tracking.
 */

Q.Image.prototype.Undo = function() {
    return this.History(-1);
};

Q.Image.prototype.Redo = function() {
    return this.History(1);
};

Q.Image.prototype.History = function(offset) {
    // Check if we have any history states
    if (this.history.states.length === 0) {
        console.warn('No history states available.');
        return this;
    }
    
    const target = this.history.position + offset;
    if (target < 0 || target >= this.history.states.length) {
        console.warn('Nem lehetséges további visszalépés vagy előreugrás.');
        return this;
    }

    this.history.isUndoRedoing = true;
    const ctx = this.node.getContext('2d', { willReadFrequently: true });
    
    // Make sure canvas dimensions match the history state
    const historyState = this.history.states[target];
    if (this.node.width !== historyState.width || this.node.height !== historyState.height) {
        this.node.width = historyState.width;
        this.node.height = historyState.height;
    }
    
    ctx.putImageData(historyState, 0, 0);
    this.history.position = target;
    this.history.isUndoRedoing = false;

    return this;
};