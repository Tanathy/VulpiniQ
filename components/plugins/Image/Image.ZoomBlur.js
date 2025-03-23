
Q.Image.prototype.ZoomBlur = function(zoomOptions = {}) {
    const defaultOptions = {
        centerX: 50,            
        centerY: 50,            
        strength: 20,           
        steps: 15,              
        easing: 'linear',       
        opacityStart: 0.7,      
        opacityEnd: 0.1,        
        baseLayerOpacity: 1.0,  
        progressive: true       
    };
    
    const finalOptions = Object.assign({}, defaultOptions, zoomOptions);
    const canvas_node = this.node;
    
    const centerX = (finalOptions.centerX / 100) * canvas_node.width;
    const centerY = (finalOptions.centerY / 100) * canvas_node.height;
    const strength = Math.max(1, Math.min(100, finalOptions.strength));
    const steps = Math.max(3, Math.min(30, finalOptions.steps));
    
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = canvas_node.width;
    sourceCanvas.height = canvas_node.height;
    const sourceCtx = sourceCanvas.getContext('2d');
    sourceCtx.drawImage(canvas_node, 0, 0);
    
    const destCanvas = document.createElement('canvas');
    destCanvas.width = canvas_node.width;
    destCanvas.height = canvas_node.height;
    const destCtx = destCanvas.getContext('2d');
    
    destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
    
    if (finalOptions.progressive) {
        destCtx.globalAlpha = finalOptions.baseLayerOpacity;
        destCtx.drawImage(sourceCanvas, 0, 0);
        
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);  
            let scale;
            
            switch (finalOptions.easing) {
                case 'easeIn':
                    scale = 1 + (strength / 100) * (t * t);
                    break;
                case 'easeOut':
                    scale = 1 + (strength / 100) * (1 - (1 - t) * (1 - t));
                    break;
                default: 
                    scale = 1 + (strength / 100) * t;
            }
            
            const w = canvas_node.width * scale;
            const h = canvas_node.height * scale;
            const x = centerX - (centerX * scale);
            const y = centerY - (centerY * scale);
            
            const layerOpacity = finalOptions.opacityStart + 
                (finalOptions.opacityEnd - finalOptions.opacityStart) * t;
            
            destCtx.globalAlpha = layerOpacity;
            
            destCtx.drawImage(sourceCanvas, 0, 0, canvas_node.width, canvas_node.height,
                             x, y, w, h);
        }
    } else {
        destCtx.globalAlpha = 1.0;
        destCtx.drawImage(sourceCanvas, 0, 0);
        
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            let scale;
            
            switch (finalOptions.easing) {
                case 'easeIn':
                    scale = 1 + (strength / 100) * (t * t);
                    break;
                case 'easeOut':
                    scale = 1 + (strength / 100) * (1 - (1 - t) * (1 - t));
                    break;
                default: 
                    scale = 1 + (strength / 100) * t;
            }
            
            const w = canvas_node.width * scale;
            const h = canvas_node.height * scale;
            const x = centerX - (centerX * scale);
            const y = centerY - (centerY * scale);
            
            destCtx.globalAlpha = 1 / steps;
            destCtx.drawImage(sourceCanvas, 0, 0, canvas_node.width, canvas_node.height,
                             x, y, w, h);
        }
    }
    
    const ctx = canvas_node.getContext('2d');
    ctx.clearRect(0, 0, canvas_node.width, canvas_node.height);
    ctx.drawImage(destCanvas, 0, 0);
    
    return this;
};
