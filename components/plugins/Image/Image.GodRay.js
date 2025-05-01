Q.Image.prototype.GodRay = function(rayOptions = {}) {
    const defaultOptions = {
        centerX: 50,            
        centerY: 50,            
        threshold: 200,         
        length: 50,             
        samples: 20,            
        strength: 1.0,          
        decay: 0.95,            
        exposure: 0.3,          
        angle: null,            
        tintColor: null,        
        blendMode: 'screen',
        fadeOut: 0.1,           // NEW: fade amount per step (0..1)
        fadeOutType: 'ease'     // NEW: "ease" or "linear"
    };
    
    this.saveToHistory();
    const finalOptions = Object.assign({}, defaultOptions, rayOptions);
    const canvas_node = this.node;
    
    const centerX = (finalOptions.centerX / 100) * canvas_node.width;
    const centerY = (finalOptions.centerY / 100) * canvas_node.height;
    const samples = Math.max(5, Math.min(50, finalOptions.samples));
    const length = Math.max(1, Math.min(100, finalOptions.length)) / 100;
    const maxScale = 1 + length;
    
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = canvas_node.width;
    sourceCanvas.height = canvas_node.height;
    const sourceCtx = sourceCanvas.getContext('2d');
    sourceCtx.drawImage(canvas_node, 0, 0);
    
    const brightCanvas = document.createElement('canvas');
    brightCanvas.width = canvas_node.width;
    brightCanvas.height = canvas_node.height;
    const brightCtx = brightCanvas.getContext('2d');
    
    const imageData = sourceCtx.getImageData(0, 0, canvas_node.width, canvas_node.height);
    const brightData = brightCtx.createImageData(canvas_node.width, canvas_node.height);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        
        const brightness = Math.max(r, g, b);
        
        if (brightness >= finalOptions.threshold) {
            
            const factor = finalOptions.exposure * (brightness - finalOptions.threshold) / (255 - finalOptions.threshold);
            
            if (finalOptions.tintColor) {
                const color = parseColor(finalOptions.tintColor);
                brightData.data[i] = Math.min(255, r * color.r / 255 * factor);
                brightData.data[i + 1] = Math.min(255, g * color.g / 255 * factor);
                brightData.data[i + 2] = Math.min(255, b * color.b / 255 * factor);
            } else {
                brightData.data[i] = Math.min(255, r * factor);
                brightData.data[i + 1] = Math.min(255, g * factor);
                brightData.data[i + 2] = Math.min(255, b * factor);
            }
            brightData.data[i + 3] = 255; 
        } else {
            
            brightData.data[i] = 0;
            brightData.data[i + 1] = 0;
            brightData.data[i + 2] = 0;
            brightData.data[i + 3] = 0;
        }
    }
    
    brightCtx.putImageData(brightData, 0, 0);
    
    const rayCanvas = document.createElement('canvas');
    rayCanvas.width = canvas_node.width;
    rayCanvas.height = canvas_node.height;
    const rayCtx = rayCanvas.getContext('2d');
    
    switch (finalOptions.blendMode) {
        case 'screen':
            rayCtx.globalCompositeOperation = 'screen';
            break;
        case 'add':
            rayCtx.globalCompositeOperation = 'lighter';
            break;
        case 'lighten':
            rayCtx.globalCompositeOperation = 'lighten';
            break;
        default:
            rayCtx.globalCompositeOperation = 'screen';
    }
    
    // --- FadeOut calculation ---
    function getFade(progress) {
        // progress: 0..1
        if (finalOptions.fadeOutType === 'linear') {
            return Math.max(0, 1 - finalOptions.fadeOut * progress * samples);
        } else if (finalOptions.fadeOutType === 'ease') {
            // ease-out: slow fade at start, fast at end
            return Math.max(0, 1 - finalOptions.fadeOut * Math.pow(progress, 0.5) * samples);
        }
        // fallback
        return Math.max(0, 1 - finalOptions.fadeOut * progress * samples);
    }
    
    for (let i = 0; i < samples; i++) {
        
        const progress = i / (samples - 1);
        const scale = 1 + progress * length;
        
        // Opacity: decay * strength * fadeOut
        const fade = getFade(progress);
        const opacity = Math.pow(finalOptions.decay, i) * finalOptions.strength * fade;
        
        let x, y, w, h;
        
        if (finalOptions.angle !== null) {
            
            const angleDeg = parseFloat(finalOptions.angle);
            const angleRad = (angleDeg * Math.PI) / 180;
            const distance = progress * length * 50; 
            
            x = centerX - (Math.cos(angleRad) * distance);
            y = centerY - (Math.sin(angleRad) * distance);
            w = canvas_node.width;
            h = canvas_node.height;
        } else {
            
            w = canvas_node.width * scale;
            h = canvas_node.height * scale;
            x = centerX - (centerX * scale);
            y = centerY - (centerY * scale);
        }
        
        rayCtx.globalAlpha = opacity;
        rayCtx.drawImage(brightCanvas, 0, 0, brightCanvas.width, brightCanvas.height, 
                       x, y, w, h);
    }
    
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas_node.width;
    finalCanvas.height = canvas_node.height;
    const finalCtx = finalCanvas.getContext('2d');
    
    finalCtx.drawImage(sourceCanvas, 0, 0);
    
    finalCtx.globalCompositeOperation = 'screen';
    finalCtx.drawImage(rayCanvas, 0, 0);
    
    const ctx = canvas_node.getContext('2d');
    ctx.clearRect(0, 0, canvas_node.width, canvas_node.height);
    ctx.drawImage(finalCanvas, 0, 0);
    
    return this;
    
    function parseColor(color) {
        
        let r = 255, g = 255, b = 255;
        
        if (typeof color === 'string') {
            
            if (color.startsWith('#')) {
                if (color.length === 4) {
                    
                    r = parseInt(color[1] + color[1], 16);
                    g = parseInt(color[2] + color[2], 16);
                    b = parseInt(color[3] + color[3], 16);
                } else if (color.length === 7) {
                    r = parseInt(color.substring(1, 3), 16);
                    g = parseInt(color.substring(3, 5), 16);
                    b = parseInt(color.substring(5, 7), 16);
                }
            } 
            
            else if (color.startsWith('rgb')) {
                const parts = color.match(/\d+/g);
                if (parts && parts.length >= 3) {
                    r = parseInt(parts[0]);
                    g = parseInt(parts[1]);
                    b = parseInt(parts[2]);
                }
            }
        }
        
        return { r, g, b };
    }
};
