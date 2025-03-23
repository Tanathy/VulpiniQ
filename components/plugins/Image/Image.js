Q.Image = function (options) {
    const Image = {};

    const defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        size: 'auto',
        quality: 1,
        historyLimit: 3,         
        autoSaveHistory: true    
    };

    options = Object.assign({}, defaultOptions, options);

    const Canvas = Q('<canvas>');
    const canvas_node = Canvas.nodes[0];
    
    const history = {
        states: [],        
        position: -1,      
        isUndoRedoing: false 
    };

    Image.canvas = Canvas;
    Image.node = canvas_node;
    Image.options = options;

    const saveToHistory = function() {
        if (history.isUndoRedoing || !options.autoSaveHistory) return;
        
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        
        if (history.position < history.states.length - 1) {
            history.states = history.states.slice(0, history.position + 1);
        }
        
        history.states.push(imageData);
        history.position++;
        
        if (history.states.length > options.historyLimit) {
            history.states.shift();
            history.position--;
        }
        
        console.log(`History saved: Position=${history.position}, States=${history.states.length}`);
    };

    // Define all existing methods on the prototype
    Q.Image.prototype = {
        saveToHistory: saveToHistory,
        
        Load: function (src, callback) {
            if (src instanceof HTMLCanvasElement) {
                this.node.width = src.width;
                this.node.height = src.height;
                this.node.getContext('2d', { willReadFrequently: true })
                    .drawImage(src, 0, 0);
                this.saveToHistory();
                if (callback) callback();
                return this;
            } 
            else if (src instanceof HTMLImageElement) {
                if (src.complete && src.naturalWidth !== 0) {
                    this.node.width = src.naturalWidth;
                    this.node.height = src.naturalHeight;
                    this.node.getContext('2d', { willReadFrequently: true })
                        .drawImage(src, 0, 0);
                    this.saveToHistory();
                    if (callback) callback();
                } else {
                    src.onload = () => {
                        this.node.width = src.naturalWidth;
                        this.node.height = src.naturalHeight;
                        this.node.getContext('2d', { willReadFrequently: true })
                            .drawImage(src, 0, 0);
                        this.saveToHistory();
                        if (callback) callback();
                    };
                }
                return this;
            } 
            else {
                let img = new window.Image();
                img.crossOrigin = 'Anonymous';
                img.src = src;
                img.onload = () => {
                    this.node.width = img.width;
                    this.node.height = img.height;
                    this.node.getContext('2d', { willReadFrequently: true })
                        .drawImage(img, 0, 0);
                    this.saveToHistory();
                    if (callback) callback();
                };
                return this;
            }
        },

        Get: function (format = this.options.format, quality = this.options.quality) {
            if (format === 'jpeg' || format === 'webp') {
                return this.node.toDataURL('image/' + format, quality);
            } else {
                return this.node.toDataURL('image/' + format);
            }
        },

        Save: function (filename, saveOptions = {}) {
            const defaultSaveOptions = {
                format: this.options.format,
                quality: this.options.quality,
                backgroundColor: this.options.fill,
                preserveTransparency: true    
            };
            
            const finalOptions = Object.assign({}, defaultSaveOptions, saveOptions);
            let format = finalOptions.format;
            let quality = finalOptions.quality;
            
            let dataUrl;
            if ((format === 'jpeg' || format === 'jpg') && finalOptions.preserveTransparency) {
                let tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.node.width;
                tempCanvas.height = this.node.height;
                
                let tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
                
                tempCtx.fillStyle = finalOptions.backgroundColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                tempCtx.drawImage(this.node, 0, 0);
                
                dataUrl = tempCanvas.toDataURL('image/' + format, quality);
            } else {
                dataUrl = this.node.toDataURL('image/' + format, format === 'jpeg' || format === 'webp' ? quality : undefined);
            }
            
            const byteString = atob(dataUrl.split(',')[1]);
            const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
            
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            
            const blob = new Blob([ab], { type: mimeType });
            
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
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
            
            return this;
        },

        Clear: function (fill = this.options.fill) {
            let ctx = this.node.getContext('2d', { willReadFrequently: true });
            ctx.fillStyle = fill;
            ctx.fillRect(0, 0, this.node.width, this.node.height);
            this.saveToHistory();
            return this;
        },
        
        Render: function(target) {
            if (!target) {
                console.error('No target provided for rendering');
                return this;
            }
            
            let targetElement;
            
            if (typeof target === 'string') {
                targetElement = document.getElementById(target) || document.querySelector(target);
                if (!targetElement) {
                    const qElement = Q(target);
                    if (qElement && qElement.nodes && qElement.nodes.length) {
                        targetElement = qElement.nodes[0];
                    }
                }
            } else if (target.nodes && target.nodes.length) {
                targetElement = target.nodes[0];
            } else if (target.appendChild) {
                targetElement = target;
            }
            
            if (!targetElement) {
                console.error('Invalid render target');
                return this;
            }
            
            let renderCanvas;
            const targetTag = targetElement.tagName.toLowerCase();
            
            if (targetTag === 'canvas') {
                renderCanvas = targetElement;
            } else if (targetTag === 'img') {
                this.node.toBlob((blob) => {
                    const objectUrl = URL.createObjectURL(blob);
                    targetElement.src = objectUrl;
                    targetElement.onload = function() {
                        URL.revokeObjectURL(objectUrl);
                    };
                }, 'image/' + this.options.format, this.options.quality);
                return this;
            } else {
                renderCanvas = targetElement.querySelector('canvas.q-image-render');
                
                if (!renderCanvas) {
                    renderCanvas = document.createElement('canvas');
                    renderCanvas.className = 'q-image-render';
                    targetElement.appendChild(renderCanvas);
                }
            }
            
            renderCanvas.width = this.node.width;
            renderCanvas.height = this.node.height;
            
            const renderCtx = renderCanvas.getContext('2d', { willReadFrequently: true });
            renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
            renderCtx.drawImage(this.node, 0, 0);
            
            return this;
        },
        
        History: function(offset = -1) {
            if (history.states.length === 0) {
                console.log("No history available");
                return this;
            }
            
            if (offset === 0) return this;
            
            let targetPosition = history.position + offset;
            
            if (targetPosition < 0) targetPosition = 0;
            if (targetPosition >= history.states.length) targetPosition = history.states.length - 1;
            
            if (targetPosition === history.position) {
                console.log(`Already at position ${targetPosition}`);
                return this;
            }
            
            console.log(`History navigation: ${history.position} -> ${targetPosition}`);
            
            history.isUndoRedoing = true;
            
            const ctx = this.node.getContext('2d', { willReadFrequently: true });
            const state = history.states[targetPosition];
            
            if (this.node.width !== state.width || this.node.height !== state.height) {
                this.node.width = state.width;
                this.node.height = state.height;
            }
            
            ctx.putImageData(state, 0, 0);
            history.position = targetPosition;
            
            history.isUndoRedoing = false;
            
            return this;
        },

        Undo: function() {
            return this.History(-1);
        },

        Redo: function() {
            return this.History(1);
        },

        AutoHistory: function(enable = true) {
            this.options.autoSaveHistory = enable;
            return this;
        },

        SaveHistory: function() {
            this.saveToHistory();
            return this;
        },

        ClearHistory: function() {
            history.states = [];
            history.position = -1;
            return this;
        }
    };

    // Set up prototype chain and assign methods to instance
    Object.setPrototypeOf(Image, Q.Image.prototype);
    
    // Setup canvas context method overrides for history tracking
    const originalCtxPutImageData = CanvasRenderingContext2D.prototype.putImageData;
    const originalCtxDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    
    CanvasRenderingContext2D.prototype.putImageData = function() {
        const result = originalCtxPutImageData.apply(this, arguments);
        
        if (this.canvas === canvas_node && options.autoSaveHistory && !history.isUndoRedoing) {
            saveToHistory();
        }
        
        return result;
    };
    
    CanvasRenderingContext2D.prototype.drawImage = function() {
        const result = originalCtxDrawImage.apply(this, arguments);
        
        if (this.canvas === canvas_node && options.autoSaveHistory && !history.isUndoRedoing) {
            saveToHistory();
        }
        
        return result;
    };

    return Image;
};