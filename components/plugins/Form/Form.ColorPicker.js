Form.prototype.ColorPicker = function(options = {}) {
    
    const width = options.width || 300;
    const height = options.height || 350;
    
    
    const wrapper = Q('<div>').addClass('q_form_color_picker_wrapper');
    wrapper.css({
        'width': width + 'px',
        'height': height + 'px',
        'position': 'relative',
        'border': '1px solid #444',
        'border-radius': '4px',
        'overflow': 'hidden',
        'display': 'block'
    });
    
    const canvas = Q(`<canvas width="${width}" height="${height}"></canvas>`);
    canvas.css({
        'display': 'block',
        'width': '100%',
        'height': '100%'
    });
    
    
    wrapper.append(canvas);
    
    
    const ctx = canvas.nodes[0].getContext('2d');
    
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.nodes[0].width = width * devicePixelRatio;
    canvas.nodes[0].height = height * devicePixelRatio;
    canvas.css({
        'width': width + 'px',
        'height': height + 'px'
    });
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    
    const centerX = width / 2;
    const ringCenterY = height / 2; 
    
    
    const minDimension = Math.min(width, height);
    const globalRadius = options.globalRadius || (minDimension * 0.46); 
    const outerRingThickness = options.outerRingThickness || (globalRadius * 0.05); 
    const innerRingThickness = options.innerRingThickness || (globalRadius * 0.15); 
    const ringPadding = options.ringPadding || (globalRadius * 0.02); 

    
    const outerRadius = globalRadius;
    const innerRadius = outerRadius - outerRingThickness - ringPadding;
    const innerMostRadius = innerRadius - innerRingThickness - ringPadding;

    
    const triangleVertexRadius = innerMostRadius - (globalRadius * 0.07); 

    
    const topVertex = {
        x: centerX,
        y: ringCenterY - triangleVertexRadius 
    };
    const bottomLeftVertex = {
        x: centerX - triangleVertexRadius * Math.sin(Math.PI / 3), 
        y: ringCenterY + triangleVertexRadius * Math.cos(Math.PI / 3) 
    };
    const bottomRightVertex = {
        x: centerX + triangleVertexRadius * Math.sin(Math.PI / 3), 
        y: ringCenterY + triangleVertexRadius * Math.cos(Math.PI / 3) 
    };

    
    let selectedHue = "#FF0000";
    
    
    let selectedOuterSegment = null;
    
    
    let activeArea = 'inner'; 
    
    
    let markers = {
        outer: { x: centerX, y: ringCenterY },
        triangle: { x: centerX, y: ringCenterY }
        
    };

    
    const outerSegments = options.outerSegments || 24;

    
    const outerColors = Array.from({ length: outerSegments }, (_, i) => {
        const hue = Math.floor(i * 360 / outerSegments); 
        const [r, g, b] = Q.HSL2RGB(hue / 360, 1, 0.5); 
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    });

    
    const defaultHue = 0; 
    const defaultSaturation = 1; 
    const defaultLightness = 0.5; 

    
    const middleRingAngle = (defaultHue / 360) * 2 * Math.PI;
    const middleRingRadius = innerRadius - innerRingThickness / 2;
    markers.outer = {
        x: centerX + middleRingRadius * Math.cos(middleRingAngle),
        y: ringCenterY + middleRingRadius * Math.sin(middleRingAngle)
    };

    
    markers.triangle = {
        x: topVertex.x, 
        y: topVertex.y
    };

    

    function drawPicker() {
        
        ctx.clearRect(0, 0, width, height);
        
        
        drawOuterRing();
        drawMiddleRing();
        drawTriangle();
        drawMarkers();
    }
    
    
    function drawOuterRing() {
        const segAngle = (2 * Math.PI) / outerSegments;

        for (let i = 0; i < outerSegments; i++) {
            const startAngle = i * segAngle;
            const endAngle = startAngle + segAngle;

            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = outerColors[i];
            ctx.fill();
        }
    }
    
    
    function drawMiddleRing() {
        ctx.save();
        
        
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerRadius, 0, 2 * Math.PI);
        ctx.closePath();

        if (ctx.createConicGradient) {
            const grad = ctx.createConicGradient(0, centerX, ringCenterY);
            grad.addColorStop(0, "hsl(0, 100%, 50%)");
            grad.addColorStop(0.17, "hsl(60, 100%, 50%)");
            grad.addColorStop(0.33, "hsl(120, 100%, 50%)");
            grad.addColorStop(0.5, "hsl(180, 100%, 50%)");
            grad.addColorStop(0.67, "hsl(240, 100%, 50%)");
            grad.addColorStop(0.83, "hsl(300, 100%, 50%)");
            grad.addColorStop(1, "hsl(360, 100%, 50%)");
            ctx.fillStyle = grad;
        } else {
            const grad = ctx.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, "#FF0000");
            grad.addColorStop(0.17, "#FFFF00");
            grad.addColorStop(0.33, "#00FF00");
            grad.addColorStop(0.5, "#00FFFF");
            grad.addColorStop(0.67, "#0000FF");
            grad.addColorStop(0.83, "#FF00FF");
            grad.addColorStop(1, "#FF0000");
            ctx.fillStyle = grad;
        }
        ctx.fill();
        
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerRadius - innerRingThickness, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    
    function drawTriangle() {
        ctx.save();

        
        
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerMostRadius*0.8, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
        ctx.restore();
        ctx.save();

        
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;

        
        ctx.beginPath();
        ctx.moveTo(topVertex.x, topVertex.y);
        ctx.lineTo(bottomLeftVertex.x, bottomLeftVertex.y);
        ctx.lineTo(bottomRightVertex.x, bottomRightVertex.y);
        ctx.closePath();
        ctx.fillStyle = "#000"; 
        ctx.fill();

        
        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        
        ctx.beginPath();
        ctx.moveTo(topVertex.x, topVertex.y);
        ctx.lineTo(bottomLeftVertex.x, bottomLeftVertex.y);
        ctx.lineTo(bottomRightVertex.x, bottomRightVertex.y);
        ctx.closePath();
        ctx.clip();

        


        
        const gradHoriz = ctx.createLinearGradient(bottomLeftVertex.x, bottomLeftVertex.y, bottomRightVertex.x, bottomRightVertex.y);
        gradHoriz.addColorStop(0, "rgba(255,255,255,1)");
        gradHoriz.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradHoriz;
        ctx.globalCompositeOperation = 'normal';
        ctx.fillRect(bottomLeftVertex.x, topVertex.y, bottomRightVertex.x - bottomLeftVertex.x, bottomLeftVertex.y - topVertex.y);
        

        const gradVert = ctx.createLinearGradient(topVertex.x, topVertex.y, topVertex.x, bottomLeftVertex.y);
        gradVert.addColorStop(0, selectedHue);
        gradVert.addColorStop(1, "#000");
        ctx.fillStyle = gradVert;
        ctx.globalCompositeOperation = 'color';
        ctx.fill();

        ctx.restore();
    }
    
    

    
    function drawMarkers() {
        ctx.save();
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;

        
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        
        if (activeArea === 'inner') {
            
            ctx.beginPath();
            ctx.arc(markers.outer.x, markers.outer.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (activeArea === 'outer' && selectedOuterSegment !== null) {
            
            const segAngle = (2 * Math.PI) / outerSegments;
            const startAngle = selectedOuterSegment * segAngle;
            const endAngle = startAngle + segAngle;

            
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.stroke();
        }

        
        
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(markers.triangle.x, markers.triangle.y, 5, 0, 2 * Math.PI);
        ctx.stroke();

        
        
        
        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.restore();
    }
    
    
    function computeColor() {
        
        let hue = 0;
        
        if (typeof selectedHue === 'string') {
            if (selectedHue.startsWith('rgb')) {
                
                const rgbMatch = selectedHue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
                    const [h] = Q.RGB2HSL(r, g, b);
                    hue = h;
                }
            } else if (selectedHue.startsWith('#')) {
                
                
                hue = 0;
            }
        }
        
        
        const triangleMarker = markers.triangle;
        
        
        const totalHeight = bottomLeftVertex.y - topVertex.y;
        const totalWidth = bottomRightVertex.x - bottomLeftVertex.x;
        
        
        const relativeY = (triangleMarker.y - topVertex.y) / totalHeight;
        
        
        const triangleWidthAtY = totalWidth * relativeY;
        const leftBoundAtY = centerX - (triangleWidthAtY / 2);
        
        
        const relativeX = triangleWidthAtY === 0 ? 0.5 : 
                          (triangleMarker.x - leftBoundAtY) / triangleWidthAtY;
        
        
        let saturation = 1 - (1 - relativeX) * relativeY; 
        let lightness = 1 - relativeY * relativeX; 
        
        
        saturation = Math.max(0, Math.min(1, saturation));
        lightness = Math.max(0, Math.min(1, lightness));
        
        
        return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
    }
    
    
    let dragging = null;
    
    function handleEvent(e) {
        const rect = canvas.nodes[0].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - ringCenterY, 2));

        
        if (distFromCenter <= outerRadius && distFromCenter >= outerRadius - outerRingThickness) {
            const angle = Math.atan2(y - ringCenterY, x - centerX);
            const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
            const segmentIndex = Math.floor(normalizedAngle / ((2 * Math.PI) / outerSegments));

            selectedOuterSegment = segmentIndex;
            selectedHue = outerColors[segmentIndex];
            activeArea = 'outer';

            if (e.type === 'mousedown') {
                dragging = false;
            }

            
            if (typeof wrapper.changeCallback === 'function') {
                
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
        }
        
        else if (distFromCenter <= innerRadius && distFromCenter >= innerRadius - innerRingThickness) {
            const angle = Math.atan2(y - ringCenterY, x - centerX);
            const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
            markers.outer = {
                x: centerX + innerRingMiddleRadius * Math.cos(angle),
                y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
            };

            const hue = (angle >= 0 ? angle : angle + 2 * Math.PI) * 180 / Math.PI;
            const [r, g, b] = Q.HSL2RGB(hue / 360, 1, 0.5);
            selectedHue = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

            selectedOuterSegment = null;
            activeArea = 'inner';

            if (e.type === 'mousedown') {
                dragging = 'inner_ring';
            }

            
            if (typeof wrapper.changeCallback === 'function') {
                
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
        }
        
        else if (isPointInTriangle(x, y, topVertex, bottomLeftVertex, bottomRightVertex)) {
            markers.triangle = { x, y };

            
            const triangleColor = computeTriangleColor(x, y);

            if (e.type === 'mousedown') {
                dragging = 'triangle';
            }

            
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }
        }
        

        drawPicker();
    }

    
    function computeTriangleColor(x, y) {
        
        const totalHeight = bottomLeftVertex.y - topVertex.y;
        
        
        const relativeY = Math.max(0, Math.min(1, (y - topVertex.y) / totalHeight));
        
        
        const triangleWidthAtY = (bottomRightVertex.x - bottomLeftVertex.x) * relativeY;
        const leftX = centerX - triangleWidthAtY / 2;
        const rightX = centerX + triangleWidthAtY / 2;
        
        
        const relativeX = Math.max(0, Math.min(1, (x - leftX) / (rightX - leftX)));
        
        
        
        const saturation = 1 - relativeY;
        
        
        
        let lightness = 0.5;
        
        if (relativeY > 0) {
            
            lightness = 0.5 * (1 - relativeY) + relativeY * (1 - relativeX);
        }
        
        
        const clampedSaturation = Math.max(0, Math.min(1, saturation));
        const clampedLightness = Math.max(0, Math.min(1, lightness));
        
        
        let hue = 0;
        if (typeof selectedHue === 'string') {
            if (selectedHue.startsWith('rgb')) {
                
                const rgbMatch = selectedHue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
                    const [h] = Q.RGB2HSL(r, g, b);
                    hue = h;
                }
            } else if (selectedHue.startsWith('#')) {
                
                hue = 0;
            }
        }
        
        
        const [r, g, b] = Q.HSL2RGB(hue, clampedSaturation, clampedLightness);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    
    function isPointInTriangle(px, py, v1, v2, v3) {
        const d1 = sign(px, py, v1.x, v1.y, v2.x, v2.y);
        const d2 = sign(px, py, v2.x, v2.y, v3.x, v3.y);
        const d3 = sign(px, py, v3.x, v3.y, v1.x, v1.y);

        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);

        const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    function sign (p1x, p1y, p2x, p2y, p3x, p3y) {
        return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
    }
    
    
    canvas.nodes[0].addEventListener('mousedown', e => {
        dragging = true;
        handleEvent(e);
    });

    window.addEventListener('mousemove', e => {
        if(dragging === 'inner_ring' || dragging === 'hue_stripe' || 
           dragging === 'sat_stripe') {
            handleEvent(e);
        } else if(dragging === 'triangle') {
            
            const rect = canvas.nodes[0].getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            
            const constrainedPosition = constrainToTriangle(x, y, topVertex, bottomLeftVertex, bottomRightVertex);
            
            
            markers.triangle = constrainedPosition;
            
            
            const triangleColor = computeTriangleColor(constrainedPosition.x, constrainedPosition.y);
            
            
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }
            
            
            drawPicker();
        }
    });

    window.addEventListener('mouseup', () => { dragging = false; });

    
    function constrainToTriangle(x, y, v1, v2, v3) {
        
        if (isPointInTriangle(x, y, v1, v2, v3)) {
            return { x, y };
        }
        
        
        const denominator = ((v2.y - v3.y) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.y - v3.y));
        let a = ((v2.y - v3.y) * (x - v3.x) + (v3.x - v2.x) * (y - v3.y)) / denominator;
        let b = ((v3.y - v1.y) * (x - v3.x) + (v1.x - v3.x) * (y - v3.y)) / denominator;
        let c = 1 - a - b;
        
        
        if (a < 0) a = 0;
        if (b < 0) b = 0;
        if (c < 0) c = 0;
        
        
        const sum = a + b + c;
        if (sum > 0) {
            a /= sum;
            b /= sum;
            c /= sum;
        } else {
            
            a = b = c = 1/3;
        }
        
        
        return {
            x: a * v1.x + b * v2.x + c * v3.x,
            y: a * v1.y + b * v2.y + c * v3.y
        };
    }
    
    
    wrapper.change = function(callback) {
        // Store the original callback
        const originalCallback = callback;
        
        // Create a debounced version of the callback
        wrapper.changeCallback = function(color) {
            Q.Debounce('colorpicker_change', 15, function() {
                originalCallback(color);
            });
        };
        
        return this;
    };
    
    
    wrapper.val = function(color) {
        if (!color) {
            return computeColor();
        }
        
        
        if (color.startsWith('#') || color.startsWith('rgb')) {
            
            selectedHue = color;
            
            
            let h = 0, s = 0, l = 0;
            
            if (color.startsWith('rgb')) {
                
                const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
                    const [hue, sat, light] = Q.RGB2HSL(r, g, b);
                    h = hue;
                    s = sat;
                    l = light;
                }
            } else if (color.startsWith('#')) {
                
                const hex = color.slice(1);
                let r, g, b;
                
                if (hex.length === 3) {
                    r = parseInt(hex[0] + hex[0], 16);
                    g = parseInt(hex[1] + hex[1], 16);
                    b = parseInt(hex[2] + hex[2], 16);
                } else if (hex.length === 6) {
                    r = parseInt(hex.slice(0, 2), 16);
                    g = parseInt(hex.slice(2, 4), 16);
                    b = parseInt(hex.slice(4, 6), 16);
                }
                
                const [hue, sat, light] = Q.RGB2HSL(r, g, b);
                h = hue;
                s = sat;
                l = light;
            }
            
            
            const angle = h * 2 * Math.PI;
            const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
            markers.outer = {
                x: centerX + innerRingMiddleRadius * Math.cos(angle),
                y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
            };
            
            
            selectedOuterSegment = null;
            activeArea = 'inner';
            
            
            
            const totalHeight = bottomLeftVertex.y - topVertex.y;
            
            
            const relativeY = 1 - s;
            const y = topVertex.y + relativeY * totalHeight;
            
            
            const triangleWidthAtY = (bottomRightVertex.x - bottomLeftVertex.x) * relativeY;
            
            
            
            
            
            let relativeX;
            if (relativeY === 0) {
                
                relativeX = 0.5;
            } else {
                
                if (l <= 0.5) {
                    
                    relativeX = 1 - (l / 0.5);
                } else {
                    
                    relativeX = (1 - l) / 0.5;
                }
            }
            
            const leftX = centerX - triangleWidthAtY / 2;
            const x = leftX + relativeX * triangleWidthAtY;
            
            markers.triangle = { x, y };
            
            
            
            
            
            drawPicker();
            
            
            if(typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(color);
            }
        }
        
        return this;
    };
    
    
    drawPicker();
    console.log('ColorPicker drawn on canvas');
    
    
    this.elements.push(wrapper);
    return wrapper;
};