(function() {
    const originalImage = Q.Image;
    
    Q.Image = function(options = {}) {
        const Image = originalImage(options);
        const canvas_node = Image.node;
        
        Image.GraphicPen = function(penOptions = {}) {
            
            const defaultOptions = {
                penColor: '#000000',        
                paperColor: '#ffffff',      
                strokeThickness: 1,         
                density: 2.0,               
                contrast: 3.0,              
                detail: 1.0,                
                paperTexture: true,         
                noiseAmount: 5,             
                strokeStyle: 'crosshatch',  
                hatchingAngle: 45           
            };
            
            const finalOptions = Object.assign({}, defaultOptions, penOptions);
            
            
            const sourceCanvas = document.createElement('canvas');
            sourceCanvas.width = canvas_node.width;
            sourceCanvas.height = canvas_node.height;
            const sourceCtx = sourceCanvas.getContext('2d');
            sourceCtx.drawImage(canvas_node, 0, 0);
            
            
            const imageData = sourceCtx.getImageData(0, 0, canvas_node.width, canvas_node.height);
            
            
            const luminanceMap = new Array(canvas_node.height);
            for (let y = 0; y < canvas_node.height; y++) {
                luminanceMap[y] = new Array(canvas_node.width);
                for (let x = 0; x < canvas_node.width; x++) {
                    const idx = (y * canvas_node.width + x) * 4;
                    
                    const r = imageData.data[idx];
                    const g = imageData.data[idx + 1];
                    const b = imageData.data[idx + 2];
                    
                    
                    let luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                    
                    
                    luminance = Math.pow((luminance / 255 - 0.5) * finalOptions.contrast + 0.5, finalOptions.detail) * 255;
                    
                    
                    luminanceMap[y][x] = 1 - Math.min(1, Math.max(0, luminance / 255));
                }
            }
            
            
            const destCanvas = document.createElement('canvas');
            destCanvas.width = canvas_node.width;
            destCanvas.height = canvas_node.height;
            const destCtx = destCanvas.getContext('2d');
            
            
            destCtx.fillStyle = finalOptions.paperColor;
            destCtx.fillRect(0, 0, canvas_node.width, canvas_node.height);
            
            
            destCtx.strokeStyle = finalOptions.penColor;
            destCtx.lineCap = 'round';
            destCtx.lineJoin = 'round';
            
            
            const baseSpacing = Math.max(3, Math.round(20 / finalOptions.density));
            
            
            switch (finalOptions.strokeStyle) {
                case 'crosshatch':
                    drawCrosshatchStrokes(destCtx, luminanceMap, finalOptions, baseSpacing);
                    break;
                case 'hatching':
                    drawHatchingStrokes(destCtx, luminanceMap, finalOptions, baseSpacing);
                    break;
                case 'circular':
                    drawCircularStrokes(destCtx, luminanceMap, finalOptions);
                    break;
                case 'stipple':
                    drawStippleStrokes(destCtx, luminanceMap, finalOptions, baseSpacing);
                    break;
            }
            
            
            if (finalOptions.paperTexture) {
                applyPaperTexture(destCtx, destCanvas.width, destCanvas.height, finalOptions);
            }
            
            
            const ctx = canvas_node.getContext('2d');
            ctx.clearRect(0, 0, canvas_node.width, canvas_node.height);
            ctx.drawImage(destCanvas, 0, 0);
            
            return Image;
            
            
            
            function drawHatchingStrokes(ctx, luminance, options, spacing) {
                const width = canvas_node.width;
                const height = canvas_node.height;
                const angle = options.hatchingAngle * Math.PI / 180;
                
                
                const diagonal = Math.sqrt(width * width + height * height);
                const numLines = Math.ceil(diagonal / spacing) * 2;
                
                
                const cosAngle = Math.cos(angle);
                const sinAngle = Math.sin(angle);
                
                for (let i = 0; i < numLines; i++) {
                    
                    const offset = i * spacing - diagonal / 2;
                    
                    
                    let currentLine = [];
                    let isDrawing = false;
                    
                    
                    for (let t = -0.2; t <= 1.2; t += 0.005) {
                        
                        const nx = t * width;
                        const ny = (offset + nx * sinAngle) / cosAngle;
                        
                        
                        const x = Math.round(nx);
                        const y = Math.round(ny);
                        
                        
                        if (x >= 0 && x < width && y >= 0 && y < height) {
                            
                            const darkness = luminance[y][x];
                            
                            
                            const drawThreshold = 0.15 + Math.random() * 0.1;
                            const shouldDraw = darkness > drawThreshold;
                            
                            if (shouldDraw) {
                                if (!isDrawing) {
                                    
                                    currentLine = [{x, y}];
                                    isDrawing = true;
                                } else {
                                    
                                    currentLine.push({x, y});
                                }
                            } else if (isDrawing && currentLine.length > 1) {
                                
                                drawStrokePath(ctx, currentLine, darkness * options.strokeThickness);
                                isDrawing = false;
                            }
                        } else if (isDrawing && currentLine.length > 1) {
                            
                            drawStrokePath(ctx, currentLine, options.strokeThickness);
                            isDrawing = false;
                        }
                    }
                    
                    
                    if (isDrawing && currentLine.length > 1) {
                        drawStrokePath(ctx, currentLine, options.strokeThickness);
                    }
                }
            }
            
            function drawCrosshatchStrokes(ctx, luminance, options, spacing) {
                
                drawHatchingStrokes(ctx, luminance, options, spacing);
                
                
                const crossOptions = {...options, hatchingAngle: options.hatchingAngle + 90};
                drawHatchingStrokes(ctx, luminance, crossOptions, spacing * 1.2);
                
                
                addTextureStrokes(ctx, luminance, options, spacing);
            }
            
            function addTextureStrokes(ctx, luminance, options, spacing) {
                const width = canvas_node.width;
                const height = canvas_node.height;
                
                
                const numStrokes = Math.floor(width * height / (spacing * spacing) * 0.05);
                
                for (let i = 0; i < numStrokes; i++) {
                    
                    const x = Math.floor(Math.random() * width);
                    const y = Math.floor(Math.random() * height);
                    
                    
                    if (y < luminance.length && x < luminance[y].length && luminance[y][x] > 0.5) {
                        
                        const darkness = luminance[y][x];
                        const strokeLength = Math.floor(darkness * spacing * 1.5);
                        
                        
                        const angle = Math.random() * Math.PI * 2;
                        
                        
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineWidth = options.strokeThickness * (0.5 + darkness * 0.5);
                        
                        const endX = x + Math.cos(angle) * strokeLength;
                        const endY = y + Math.sin(angle) * strokeLength;
                        
                        
                        const midX = (x + endX) / 2 + (Math.random() - 0.5) * spacing / 2;
                        const midY = (y + endY) / 2 + (Math.random() - 0.5) * spacing / 2;
                        
                        ctx.quadraticCurveTo(midX, midY, endX, endY);
                        ctx.stroke();
                    }
                }
            }
            
            function drawCircularStrokes(ctx, luminance, options) {
                const width = canvas_node.width;
                const height = canvas_node.height;
                
                
                const centers = [];
                const samplingStep = Math.max(5, Math.floor(20 / options.density));
                
                
                for (let y = 0; y < height; y += samplingStep) {
                    for (let x = 0; x < width; x += samplingStep) {
                        if (luminance[y][x] > 0.5) {
                            
                            centers.push({
                                x, 
                                y, 
                                darkness: luminance[y][x],
                                radius: 5 + Math.random() * 15 * options.density * luminance[y][x]
                            });
                        }
                    }
                }
                
                
                centers.sort((a, b) => b.darkness - a.darkness);
                
                
                const maxCircles = Math.min(centers.length, Math.floor(width * height * options.density / 5000));
                
                
                for (let i = 0; i < maxCircles; i++) {
                    const center = centers[i];
                    const numCircles = Math.ceil(center.darkness * 5);
                    
                    for (let j = 1; j <= numCircles; j++) {
                        const radius = center.radius * (j / numCircles);
                        
                        
                        ctx.beginPath();
                        
                        
                        const segments = Math.max(12, Math.floor(radius * 2));
                        const angleStep = (Math.PI * 2) / segments;
                        
                        
                        let startAngle = Math.random() * angleStep;
                        ctx.moveTo(
                            center.x + Math.cos(startAngle) * radius, 
                            center.y + Math.sin(startAngle) * radius
                        );
                        
                        for (let k = 1; k <= segments; k++) {
                            const angle = startAngle + k * angleStep;
                            
                            const radiusVar = radius * (0.95 + Math.random() * 0.1);
                            
                            ctx.lineTo(
                                center.x + Math.cos(angle) * radiusVar, 
                                center.y + Math.sin(angle) * radiusVar
                            );
                        }
                        
                        ctx.closePath();
                        ctx.lineWidth = options.strokeThickness * (0.5 + center.darkness * 0.5);
                        ctx.stroke();
                    }
                }
            }
            
            function drawStippleStrokes(ctx, luminance, options, spacing) {
                const width = canvas_node.width;
                const height = canvas_node.height;
                
                
                const dotSpacing = Math.max(2, Math.floor(spacing / 2));
                
                
                for (let y = 0; y < height; y += dotSpacing) {
                    for (let x = 0; x < width; x += dotSpacing) {
                        
                        const darkness = luminance[y][x];
                        
                        
                        if (Math.random() < darkness * options.density * 0.2) {
                            
                            const dotSize = options.strokeThickness * darkness * (0.5 + Math.random() * 0.5);
                            
                            
                            const offsetX = (Math.random() - 0.5) * dotSpacing * 0.6;
                            const offsetY = (Math.random() - 0.5) * dotSpacing * 0.6;
                            
                            ctx.beginPath();
                            ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
                            ctx.fillStyle = options.penColor;
                            ctx.fill();
                        }
                    }
                }
            }
            
            function drawStrokePath(ctx, points, lineWidth) {
                if (points.length < 2) return;
                
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                
                
                ctx.moveTo(points[0].x, points[0].y);
                
                
                for (let i = 1; i < points.length; i++) {
                    
                    const jitter = Math.random() * 0.5;
                    
                    if (i < points.length - 1 && points.length > 3) {
                        
                        const xc = (points[i].x + points[i+1].x) / 2;
                        const yc = (points[i].y + points[i+1].y) / 2;
                        ctx.quadraticCurveTo(
                            points[i].x + jitter, 
                            points[i].y + jitter,
                            xc, yc
                        );
                    } else {
                        
                        ctx.lineTo(points[i].x + jitter, points[i].y + jitter);
                    }
                }
                
                ctx.stroke();
            }
            
            function applyPaperTexture(ctx, width, height, options) {
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    
                    const noise = (Math.random() - 0.5) * options.noiseAmount;
                    
                    
                    let warmTint = 0;
                    if (options.paperColor === '#ffffff' || options.paperColor === 'white') {
                        warmTint = Math.random() * 3;
                    }
                    
                    data[i] = Math.max(0, Math.min(255, data[i] + noise + warmTint));      
                    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise + warmTint * 0.7)); 
                    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));         
                }
                
                ctx.putImageData(imageData, 0, 0);
            }
        };
        
        return Image;
    };
})();
