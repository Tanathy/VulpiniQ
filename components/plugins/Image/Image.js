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

    Image.Load = function (src, callback) {
        if (src instanceof HTMLCanvasElement) {
            canvas_node.width = src.width;
            canvas_node.height = src.height;
            canvas_node.getContext('2d', { willReadFrequently: true })
                .drawImage(src, 0, 0);
            saveToHistory();
            if (callback) callback();
            return Image;
        } 
        else if (src instanceof HTMLImageElement) {
            if (src.complete && src.naturalWidth !== 0) {
                canvas_node.width = src.naturalWidth;
                canvas_node.height = src.naturalHeight;
                canvas_node.getContext('2d', { willReadFrequently: true })
                    .drawImage(src, 0, 0);
                saveToHistory();
                if (callback) callback();
            } else {
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
            let img = new window.Image();
            img.crossOrigin = 'Anonymous';
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

    Image.Get = function (format = options.format, quality = options.quality) {
        if (format === 'jpeg' || format === 'webp') {
            return canvas_node.toDataURL('image/' + format, quality);
        } else {
            return canvas_node.toDataURL('image/' + format);
        }
    };

    Image.Save = function (filename, saveOptions = {}) {
        const defaultSaveOptions = {
            format: options.format,
            quality: options.quality,
            backgroundColor: options.fill,
            preserveTransparency: true    
        };
        
        const finalOptions = Object.assign({}, defaultSaveOptions, saveOptions);
        let format = finalOptions.format;
        let quality = finalOptions.quality;
        
        let dataUrl;
        if ((format === 'jpeg' || format === 'jpg') && finalOptions.preserveTransparency) {
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas_node.width;
            tempCanvas.height = canvas_node.height;
            
            let tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            
            tempCtx.fillStyle = finalOptions.backgroundColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            tempCtx.drawImage(canvas_node, 0, 0);
            
            dataUrl = tempCanvas.toDataURL('image/' + format, quality);
        } else {
            dataUrl = canvas_node.toDataURL('image/' + format, format === 'jpeg' || format === 'webp' ? quality : undefined);
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
        
        return Image;
    };

    Image.Clear = function (fill = options.fill) {
        let ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
        saveToHistory();
        return Image;
    };
    
    Image.Render = function(target) {
        if (!target) {
            console.error('No target provided for rendering');
            return Image;
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
            return Image;
        }
        
        let renderCanvas;
        const targetTag = targetElement.tagName.toLowerCase();
        
        if (targetTag === 'canvas') {
            renderCanvas = targetElement;
        } else if (targetTag === 'img') {
            canvas_node.toBlob(function(blob) {
                const objectUrl = URL.createObjectURL(blob);
                targetElement.src = objectUrl;
                targetElement.onload = function() {
                    URL.revokeObjectURL(objectUrl);
                };
            }, 'image/' + options.format, options.quality);
            return Image;
        } else {
            renderCanvas = targetElement.querySelector('canvas.q-image-render');
            
            if (!renderCanvas) {
                renderCanvas = document.createElement('canvas');
                renderCanvas.className = 'q-image-render';
                targetElement.appendChild(renderCanvas);
            }
        }
        
        renderCanvas.width = canvas_node.width;
        renderCanvas.height = canvas_node.height;
        
        const renderCtx = renderCanvas.getContext('2d', { willReadFrequently: true });
        renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
        renderCtx.drawImage(canvas_node, 0, 0);
        
        return Image;
    };
    
    Image.History = function(offset = -1) {
        if (history.states.length === 0) {
            console.log("No history available");
            return Image;
        }
        
        if (offset === 0) return Image;
        
        let targetPosition = history.position + offset;
        
        if (targetPosition < 0) targetPosition = 0;
        if (targetPosition >= history.states.length) targetPosition = history.states.length - 1;
        
        if (targetPosition === history.position) {
            console.log(`Already at position ${targetPosition}`);
            return Image;
        }
        
        console.log(`History navigation: ${history.position} -> ${targetPosition}`);
        
        history.isUndoRedoing = true;
        
        const ctx = canvas_node.getContext('2d', { willReadFrequently: true });
        const state = history.states[targetPosition];
        
        if (canvas_node.width !== state.width || canvas_node.height !== state.height) {
            canvas_node.width = state.width;
            canvas_node.height = state.height;
        }
        
        ctx.putImageData(state, 0, 0);
        history.position = targetPosition;
        
        history.isUndoRedoing = false;
        
        return Image;
    };

    Image.Undo = function() {
        return Image.History(-1);
    };

    Image.Redo = function() {
        return Image.History(1);
    };

    Image.AutoHistory = function(enable = true) {
        options.autoSaveHistory = enable;
        return Image;
    };

    Image.SaveHistory = function() {
        saveToHistory();
        return Image;
    };
    
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

    Image.ClearHistory = function() {
        history.states = [];
        history.position = -1;
        return Image;
    };

    return Image;
};