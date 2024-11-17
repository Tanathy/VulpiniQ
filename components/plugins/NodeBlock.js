// Name: NodeBlock
// Method: Plugin
// Desc: A plugin for creating UML blocks and connections.
// Type: Plugin
// Example: var uml = Q.NodeBlock('#canvas', 800, 600); // Create a new UML canvas
// Dependencies: ColorBrightness, isDarkColor, Style
// Status: Experimental, Incomplete

Q.NodeBlock = function (selector, width, height, options) {

    let classes = Q.style(`

.node_preferences {
    position: absolute;
    background: #181818;
    overflow: hidden;
    
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

.node_preferences_big {
    width: 350px;
    max-height: 350px;
    overflow-y: scroll;
}

.node_preferences_small {
width: 200px;
overflow-y: auto;
    }

.pref_content h1, .pref_content h2, .pref_content h3, .pref_content h4, .pref_content h5, .pref_content h6 {
line-break: anywhere;
margin: 0 0 2px 0;
padding: 0;
}

.pref_content h1 { font-size: 150%; }
.pref_content h2 { font-size: 140%; }
.pref_content h3 { font-size: 130%; }
.pref_content h4 { font-size: 120%; }
.pref_content h5 { font-size: 110%; }
.pref_content h6 { font-size: 100%; }

.pref_content p { margin: 0; padding: 0; color: #7a7a7a; }
.pref_content ul { margin: 5px 5px; padding-left: 15px; color: #7a7a7a; }
.pref_content li { padding: 0px; margin: 0px; }
.pref_content table { border-collapse: collapse; width: 100%; }
.pref_content table, th, td { padding: 0; margin: 0; font-size: 90%; line-break: anywhere; border: 1px solid #222; }
.pref_content th, td { padding: 1px; text-align: left; }
.pref_content th { background-color: #222; }
.pref_content tfoot { background-color: #222; }

.pref_title {
    font-size: 12px;
    margin: 5px;
    color: #7a7a7a;
    text-align: center;
}

.node_preferences::-webkit-scrollbar {
    width: 10px;
}

.node_preferences::-webkit-scrollbar-track {
    background: #3a3a3a;
}

.node_preferences::-webkit-scrollbar-thumb {
    background: #242424;
}

.node_preferences::-webkit-scrollbar-thumb:hover {
    background: #555;
}


.pref_content {

    background-color: #1d1d1d;
    border: 0;
    outline: 0;
    color: #7a7a7a;
    font-size: 12px !important;
    padding: 5px 5px;
}

.pref_content img {
    width: 100%;
    height: auto;
}


.connection_content {
    display: flex;
    justify-content: space-between;
}

.left,
.right {
    width: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 5px;
}

.connection_wrapper {
    display: flex;
    justify-content: space-between;
    margin: 1px;
}

.color_wrapper {
    position: relative;
    width: 20px;
    height: 20px;
    overflow: hidden;
    flex-shrink: 0;
}

.color {
    position: absolute;
    width: 100px;
    top: -20px;
    left: -20px;
    height: 100px;
}

.connection {
    font-size: 12px;
padding: 0 5px;
    width: 100%;
    background-color: #1d1d1d;
    border: 0;
    outline: 0;
    color: #7a7a7a;
    font-size: 12px !important;
}

.button_nodes {
    background: #2e2e2e;
    color: #6e6e6e;
    border: 0;
    cursor: pointer;
    font-size: 8px;
    width: 15px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button_nodes_big {
    background: #2e2e2e;
    color: #6e6e6e;
    border: 0;
    cursor: pointer;
    font-size: 12px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button_add
{
    margin:1px;
    width: 20px;
    height: 20px;
}

        `, {
        "node_preferences": "node_preferences",
        "node_preferences_small": "node_preferences_small",
        "node_preferences_big": "node_preferences_big",
        "pref_title": "pref_title",
        "pref_content": "pref_content",
        "connection_content": "connection_content",
        "left": "left",
        "right": "right",
        "connection_wrapper": "connection_wrapper",
        "color_wrapper": "color_wrapper",
        "connection": "connection",
        "button_nodes": "button_nodes",
        "button_nodes_big": "button_nodes_big",
        "button_add": "button_add",
        "name": "_name",
        "content": "_content",
        "manipulation": "manipulation",
        "color": "color",
        "pref_section": "pref_section",
    }, false);

    class UMLBlock {
        constructor(custom_style, appearance, id, name, text, x, y, width, connLeft = [], connRight = [], connections = []) {
            this.name = name;
            this.text = text;
            this.t_text = "";
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.connections = connections;
            this.connLeft = connLeft;
            this.connRight = connRight;
            this.height = 0;
            this.isDragging = false;
            this.leftConnCoords = [];
            this.rightConnCoords = [];
            this.img = null;
            this.content = null;
            this.contentHeight = 0;
            this.unescapedBase64Data = null;
            this.appearance = appearance;
            this.custom_style = custom_style;
            this.appearance = Object.assign({}, this.appearance, custom_style);
            this.darkText = '#ffffff';
            this.lightText = '#000000';


            //render baser of the block
            this.update = true;
            this.compiled_render = document.createElement('canvas');
            this.block_context = this.compiled_render.getContext('2d');



            this._processColors();
        }

        _restyle(object) {
            this.custom_style = object;
            this.appearance = Object.assign({}, this.appearance, object);
            this._processColors();
            this.t_text = '';
        }

        _processColors() {
            const {
                background,
                factorTitleBackground,
                factorDarkColorMargin,
                factorDarkColorThreshold,
                factorLightColors,
                factorDarkColors,
                darkTextColor,
                lightTextColor
            } = this.appearance;

            // Cache color calculations
            const titleBg = Q.ColorBrightness(background, factorTitleBackground);
            const isDark = Q.isDarkColor(background, factorDarkColorMargin, factorDarkColorThreshold);
            const textColor = isDark ? darkTextColor : lightTextColor;
            const borderColor = Q.ColorBrightness(background, isDark ? factorLightColors : factorDarkColors);

            // Batch updates to appearance
            Object.assign(this.appearance, {
                titleBackground: titleBg,
                titleColor: textColor,
                connectionTextColor: textColor,
                textColor: textColor,
                node_table_color: borderColor
            });
        }

        // _processColors() {
        //     this.appearance.titleBackground = Q.ColorBrightness(this.appearance.background, this.appearance.factorTitleBackground);
        //     const isDark = Q.isDarkColor(this.appearance.background, this.appearance.factorDarkColorMargin, this.appearance.factorDarkColorThreshold);
        //     const textColor = isDark ? this.appearance.darkTextColor : this.appearance.lightTextColor;
        //     const borderColor = isDark ? Q.ColorBrightness(this.appearance.background, this.appearance.factorLightColors) : Q.ColorBrightness(this.appearance.background, this.appearance.factorDarkColors);
        //     this.appearance.titleColor = textColor;
        //     this.appearance.connectionTextColor = textColor;
        //     this.appearance.textColor = textColor;
        //     this.appearance.node_table_color = borderColor;
        // }


        _drawContainer(ctx, x, y, width, height) {
            const { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, background, radius, connectionPointSize } = this.appearance;

            // Save current context state
            ctx.save();

            // Set all styles at once
            Object.assign(ctx, {
                fillStyle: background,
                shadowColor,
                shadowBlur,
                shadowOffsetX,
                shadowOffsetY
            });

            // Draw optimized rounded rectangle
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.fill();

            // Restore previous context state
            ctx.restore();
        }

        _drawTitle(ctx, x, y, width, height, title) {
            ctx.fillStyle = this.appearance.titleBackground;
            ctx.beginPath();
            ctx.moveTo(x + this.appearance.radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, this.appearance.radius);
            ctx.arcTo(x + width, y + height, x, y + height, 0);
            ctx.arcTo(x, y + height, x, y, 0);
            ctx.arcTo(x, y, x + width, y, this.appearance.radius);
            ctx.closePath();
            ctx.fill();


            ctx.fillStyle = this.appearance.titleColor;
            ctx.font = 'bold ' + this.appearance.fontSizeTitle + 'px ' + this.appearance.font;
            const titleX = x + (width - ctx.measureText(title).width) / 2;
            const titleY = y + (height + this.appearance.fontSizeTitle) / 2;
            ctx.fillText(title, titleX, titleY);
        }


        parseHTML2Canvas(html, callback) {
            const renderElements = () => {

                if (this.t_text == html) {
                    callback(this.content, this.contentHeight);
                    return;
                }
                this.t_text = html;

                // Create a temporary container to measure the content height
                let tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.visibility = 'hidden';
                tempContainer.style.width = (this.width - this.appearance.fontSize) + 'px';
                document.body.appendChild(tempContainer);

                // Apply the same styles to the temporary container
                let style = document.createElement('style');

                let st = `
        table {border-collapse: collapse; width: 100%;}
        table, th, td {padding: 0; margin: 0; font-size: ${(this.appearance.fontSize * 0.9)}px; line-break: anywhere;border: 1px solid ${this.appearance.node_table_color};}
        th, td {padding: 1px; text-align: left;}
        th {background-color: ${this.appearance.node_table_color};}
        tfoot {background-color: ${this.appearance.node_table_color};}
    
        h1, h2, h3, h4, h5, h6 {line-break: anywhere; margin: 0 0 2px 0; padding: 0;}
        h1 {font-size: ${(this.appearance.fontSize * 1.5)}px;}
        h2 {font-size: ${(this.appearance.fontSize * 1.4)}px;}
        h3 {font-size: ${(this.appearance.fontSize * 1.3)}px;}
        h4 {font-size: ${(this.appearance.fontSize * 1.2)}px;}
        h5 {font-size: ${(this.appearance.fontSize * 1.1)}px;}
        h6 {font-size: ${(this.appearance.fontSize * 1.0)}px;}
                        p { margin: 0; padding: 0; color: ${this.appearance.textColor}; }
                        ul { margin: 5px 5px; padding-left: 15px; color: ${this.appearance.textColor}; }
                        li { padding: 0px; margin: 0px; }
                        div {font-family: ${this.appearance.font}, sans-serif; font-size: ${this.appearance.fontSize}px; color: ${this.appearance.textColor}; }
                    `;

                style.innerHTML = st;
                document.head.appendChild(style);

                // Insert the HTML content into the temporary container
                tempContainer.innerHTML = html;

                // Measure the height of the content with styles applied
                this.contentHeight = tempContainer.offsetHeight + this.appearance.padding;

                // Remove the temporary container and style tag
                document.body.removeChild(tempContainer);
                document.head.removeChild(style);

                // Create the canvas with the measured height          
                this.content = document.createElement('canvas');
                this.content.width = this.width;
                this.content.height = this.contentHeight;
                let ctx = this.content.getContext('2d');

                let data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (this.width - (this.appearance.padding * 2)) + '" height="' + this.contentHeight + '">' + // Update SVG height
                    '<foreignObject width="100%" height="100%">' +
                    '<style>' +
                    st +
                    '</style>' +
                    '<div xmlns="http://www.w3.org/1999/xhtml">' +
                    html +
                    '</div>' +
                    '</foreignObject>' +
                    '</svg>';

                let DOMURL = window.URL || window.webkitURL || window;
                let img = new Image();
                let svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
                let url = DOMURL.createObjectURL(svg);

                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    DOMURL.revokeObjectURL(url);
                    callback(this.content, this.contentHeight);
                };

                img.src = url;
            };


            //remove all inline styles from html
            html = html.replace(/style="[^"]*"/g, '');

            let images = [];

            // remove all <br> tags
            html = html.replace(/<br>/g, '');

            //if html contains img tags, load them first
            if (html.includes('<img')) {
                let imgTags = html.match(/<img[^>]+>/g);

                imgTags.forEach((imgTag, index) => {
                    let src = imgTag.match(/src="([^"]*)"/)[1];
                    let img = new Image();
                    img.src = src;
                    img.onload = () => {
                        images[index] = img;
                        if (images.length === imgTags.length) {
                            renderElements();
                        }
                    };
                });
            }
            else {
                renderElements();
            }



            // renderElements();
        }

        draw(main_context) {
            const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
            const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
            const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
            const maxConnectionsHeight = Math.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;

            if (this.update) {
                // console.log(this.update);


                // Helper function to calculate and update container height
                const updateContainerHeight = (contentHeight) => {
                    this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
                    this.block_context.canvas.height = this.height;
                    this.block_context.canvas.width = this.width + (this.appearance.connectionPointSize * 2);
                };

                this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
                    updateContainerHeight(contentHeight);

                    //draw the container into compiled_render
                    this._drawContainer(this.block_context, this.appearance.connectionPointSize, 0, this.width - 5, this.height, this.appearance.radius);
                    this._drawTitle(this.block_context, this.appearance.connectionPointSize, 0, this.width - this.appearance.connectionPointSize, TITLE_HEIGHT, this.name);
                    this.block_context.drawImage(canvas, this.appearance.padding, TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
                    // main_context.drawImage(this.compiled_render, this.x, this.y);
                    this.drawConnectionPoints(this.block_context, CONNECTION_HEIGHT, CONNECTION_PADDING);
                    main_context.drawImage(this.compiled_render, this.x, this.y);
                });
                //draw the ctx into main_context

                this.update = false;
            }
            else {
                this.drawConnectionPoints(this.block_context, CONNECTION_HEIGHT, CONNECTION_PADDING);
                main_context.drawImage(this.compiled_render, this.x, this.y);
            }
            return;
        }


        drawConnectionPoints(ctx, paddingTop, height) {
            const connectionY = paddingTop;
            const font = `bold ${this.appearance.fontSizeConnection}px ${this.appearance.font}`;
            const pointSize = this.appearance.connectionPointSize;
            const connectionPaddingX = this.appearance.connectionTextPaddingX;
            const middleYOffset = ((pointSize / 2) + (this.appearance.fontSizeConnection / 2)) - this.appearance.connectionTextPaddingY;

            this.leftConnCoords = [];
            this.rightConnCoords = [];

            ctx.font = font;

            const drawConnectionPoints = (connList, coordsArray, baseX, getTextX) => {
                connList.forEach((conn, index) => {
                    const connY = connectionY + index * height;
                    coordsArray.push({ x: baseX, y: connY });

                    ctx.fillStyle = conn.color || this.appearance.connectionColor;
                    ctx.beginPath();
                    ctx.arc(baseX, connY, pointSize, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = this.appearance.connectionTextColor;
                    ctx.fillText(conn.title, getTextX(conn.title, baseX), connY + middleYOffset);
                });
            };

            if (Array.isArray(this.connLeft)) {
                drawConnectionPoints(this.connLeft, this.leftConnCoords, this.appearance.connectionPointSize, (title, baseX) => baseX + connectionPaddingX * 2);
            }

            if (Array.isArray(this.connRight)) {
                drawConnectionPoints(this.connRight, this.rightConnCoords, this.width, (title, baseX) => baseX - ctx.measureText(title).width - connectionPaddingX * 2);
            }
        }


        addConnection(conn) {
            this.connections.push(conn);
        }

        removeConnection(conn) {
            this.connections = this.connections.filter(c => c.id !== conn.id);
        }

        isMouseOver(mouseX, mouseY) {
            return mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height;
        }


        getAllConnectionCoords() {
            return [
                ...this.leftConnCoords.map(coord => ({ x: coord.x + this.x, y: coord.y + this.y })),
                ...this.rightConnCoords.map(coord => ({ x: coord.x + this.x, y: coord.y + this.y }))
            ];
        }

        // getAllConnectionCoords() {
        //     return [...this.leftConnCoords, ...this.rightConnCoords]; 
        // }

        getConnectionCoord(point, index) {
            return point === 'left' ? this.leftConnCoords[index] : this.rightConnCoords[index];
        }
    }

    class UMLCanvas {
        constructor(selector, width, height, appearance, classes) {
            this.element_parent = Q(selector);
            this.canvas = Q('<canvas>', { width: width, height: height });
            this.width = width;
            this.height = height;
            this.element_parent.append(this.canvas);
            this.canvas_context = this.canvas.nodes[0].getContext('2d');
            this.blocks = [];
            this.connections = [];
            this.draggingBlock = null;
            this.offsetX = 0;
            this.offsetY = 0;
            this.connection_start = null;
            this.connection_end = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isMenuPreferences = false;
            this.isDraggingBlock = false;
            this.isOverConnection = false;
            this.appearance = appearance;
            this.classes = classes;

            this.canvas.on('click', this._event_click.bind(this));
            this.canvas.on('mousedown', this._event_pointer_down.bind(this));
            this.canvas.on('mousemove', this._event_pointer_move.bind(this));
            this.canvas.on('mouseup', this._event_pointer_up.bind(this));
            this.canvas.on('contextmenu', this._event_click_right.bind(this), false);
        }

        import(uml) {
            // Collect promises for each block creation
            const blockCreationPromises = uml.blocks.map(async (block) => {
                // Modify UMLBlock initialization to be promise-aware.
                const newBlock = new UMLBlock(
                    block.custom_style,
                    this.appearance,
                    block.id, block.name, block.text, block.x, block.y, block.width,
                    block.connLeft.map(conn => ({ id: conn.id, title: conn.title, color: conn.color })),
                    block.connRight.map(conn => ({ id: conn.id, title: conn.title, color: conn.color })),
                    block.connections
                );
                this.addBlock(newBlock);
            });

            // Wait for all block creations to finish
            Promise.all(blockCreationPromises).then(() => {
                // After all blocks are added, create connections
                uml.connections.forEach(conn => {
                    const startBlock = this.blocks.find(b => b.id === conn.id);
                    const endBlock = this.blocks.find(b => b.id === conn.target);

                    const startCoords = this._point_coords(startBlock, conn.point);
                    const endCoords = this._point_coords(endBlock, conn.targetPoint);

                    if (startCoords && endCoords) {
                        this._connection_create(
                            { block: startBlock, point: conn.point, x: startCoords.x, y: startCoords.y },
                            { block: endBlock, point: conn.targetPoint, x: endCoords.x, y: endCoords.y }
                        );
                    } else {
                        console.error('Connection failed to initialize:', startBlock, endBlock);
                    }
                });
            }).catch(err => {
                console.error('Error during block initialization:', err);
            });
        }

        export() {
            return {
                blocks: this.blocks.map(block => ({
                    custom_style: block.custom_style,
                    id: block.id,
                    name: block.name,
                    text: block.text,
                    x: block.x,
                    y: block.y,
                    width: block.width,
                    connLeft: block.connLeft,
                    connRight: block.connRight,
                    connections: block.connections
                })),
                connections: this.connections.map(conn => ({
                    id: conn.start.block.id,
                    point: conn.start.point,
                    target: conn.end.block.id,
                    targetPoint: conn.end.point
                }))
            };
        }

        async addBlock(block) {
            this.blocks.push(block);
            await this._connections_init(block);
            this.render();
        }

        removeBlock(block) {
            this.blocks = this.blocks.filter(b => b.id !== block.id);
            this.connections = this.connections.filter(conn =>
                conn.start.block.id !== block.id && conn.end.block.id !== block.id
            );
            this.render();
        }


        getJointContent() {
            //Get content of blocks the way as they're connected together by following the connection. First block is the starting block.

            let block = this.blocks[0];
            let content = block.text;
            let connections = block.connections;
            let nextBlock = null;

            while (connections.length > 0) {
                let conn = connections[0];
                nextBlock = this.blocks.find(b => b.id === conn.end.block.id);
                content += nextBlock.text;
                connections = nextBlock.connections;
            }

            return content;
        }


        duplicateBlock(block) {
            let id = this._id();
            const newBlock = new UMLBlock(
                block.custom_style,
                this.appearance,
                id, block.name, block.text, block.x + 50, block.y + 50, block.width,
                block.connLeft, block.connRight, []
            );
            this.addBlock(newBlock);
        }

        render_grid() {
            let ctx = this.canvas_context;
            let w = this.width;
            let h = this.height;
            let grid_size = this.appearance.gridSize;
            let grid_color = this.appearance.gridColor;

            ctx.strokeStyle = grid_color;
            ctx.lineWidth = 1;

            ctx.beginPath();
            for (let x = 0; x <= w; x += grid_size) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
            }
            for (let y = 0; y <= h; y += grid_size) {
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
            }
            ctx.stroke();
        }

        render() {

            this.canvas_context.clearRect(0, 0, this.width, this.height);

            this.render_grid();

            // Draw the connections
            this.connections.forEach(conn => {
                let startBlock = conn.start.block;
                let endBlock = conn.end.block;

                let startColor = this._getConnectionColor(startBlock, conn.start.point);
                let endColor = this._getConnectionColor(endBlock, conn.end.point);

                this.canvas_context.strokeStyle = 'rgb(150, 150, 150)';

                this.canvas_context.beginPath();

                // Line thickness
                this.canvas_context.lineWidth = 2;

                // Gradient from start to end point using their colors
                let gradient = this.canvas_context.createLinearGradient(
                    startBlock.x + conn.start.x, startBlock.y + conn.start.y,
                    endBlock.x + conn.end.x, endBlock.y + conn.end.y
                );
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                this.canvas_context.strokeStyle = gradient;

                this.canvas_context.moveTo(startBlock.x + conn.start.x, startBlock.y + conn.start.y);
                this.canvas_context.lineTo(endBlock.x + conn.end.x, endBlock.y + conn.end.y);
                this.canvas_context.stroke();

                // Calculate direction vector
                let dx = (endBlock.x + conn.end.x) - (startBlock.x + conn.start.x);
                let dy = (endBlock.y + conn.end.y) - (startBlock.y + conn.start.y);
                let length = Math.sqrt(dx * dx + dy * dy);
                let unitDx = dx / length;
                let unitDy = dy / length;

                // Draw arrows every 100px
                let arrowLength = 10;
                let arrowWidth = 5;
                for (let i = 100; i < length; i += 200) {
                    let x = (startBlock.x + conn.start.x) + unitDx * i;
                    let y = (startBlock.y + conn.start.y) + unitDy * i;

                    this.canvas_context.beginPath();
                    this.canvas_context.moveTo(x, y);
                    this.canvas_context.lineTo(x - arrowLength * unitDx + arrowWidth * unitDy, y - arrowLength * unitDy - arrowWidth * unitDx);
                    this.canvas_context.lineTo(x - arrowLength * unitDx - arrowWidth * unitDy, y - arrowLength * unitDy + arrowWidth * unitDx);
                    this.canvas_context.closePath();
                    this.canvas_context.fillStyle = gradient;
                    this.canvas_context.fill();
                }
            });

            // Draw the connection if dragging
            if (this.connection_start && this.connection_end === null) {
                let startBlock = this.connection_start.block;
                let startColor = this._getConnectionColor(startBlock, this.connection_start.point);

                let gradient = this.canvas_context.createLinearGradient(
                    startBlock.x + this.connection_start.x, startBlock.y + this.connection_start.y,
                    this.mouseX, this.mouseY
                );
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, "rgb(150, 150, 150)");
                this.canvas_context.strokeStyle = gradient;

                this.canvas_context.beginPath();
                this.canvas_context.moveTo(startBlock.x + this.connection_start.x, startBlock.y + this.connection_start.y);
                this.canvas_context.lineTo(this.mouseX, this.mouseY);
                this.canvas_context.stroke();
            }

            this.blocks.forEach(block => {
                block.draw(this.canvas_context);
            });
            this._connection_update();
        }

        // New method to get the color of a connection point
        _getConnectionColor(block, pointId) {
            // Check both left and right connections simultaneously
            const connection = [...block.connLeft, ...block.connRight]
                .find(conn => conn.id === pointId);

            return connection ? connection.color : null;
        }

        updateConnections(block) {
            const preferences = Q('.' + classes.node_preferences);

            const collectConnections = (sideClass) => {
                const side = preferences.find('.' + sideClass);
                const connections = [];
                side.find('.' + classes.connection_wrapper).walk((element) => {
                    const id = element.id();
                    const title = element.find('.' + classes.connection).val() || '';
                    const color = element.find('.' + classes.color).val();
                    connections.push({ id, title, color });
                }, true);
                return connections;
            };

            const newLeftConnections = collectConnections(classes.left);
            const newRightConnections = collectConnections(classes.right);

            const newConnections = [...newLeftConnections, ...newRightConnections];
            const existingConnections = [...block.connLeft, ...block.connRight];

            newConnections.forEach(newConn => {
                const existingConn = existingConnections.find(conn => conn.id === newConn.id);
                if (existingConn) {
                    existingConn.title = newConn.title;
                    existingConn.color = newConn.color;
                } else {
                    existingConnections.push(newConn);
                }
            });
        }

        updateBlock(selectedblock = null, callback) {
            let preferences = Q('.' + classes.node_preferences);
            let block;
            if (selectedblock) {
                block = selectedblock;
            }
            else {
                block = this.blocks.find(b => b.id === preferences.id());
            }
            // let block = this.blocks.find(b => b.id === preferences.id());
            let name = preferences.find('#' + classes.name).text();
            let content = preferences.find('#' + classes.content).html();
            block.name = name;
            block.text = content;
            block.update = true;
            if (callback) callback(block);
        }

        _event_pointer_down(event) {
            if (event.button === 2) return;
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            if (this.isMenuPreferences) {
                this.isMenuPreferences = false;

                if (!Q.isExists('.' + classes.node_preferences + ' #' + classes.name)) {
                    this._menu_remove();
                    return;
                }

                let block = this.blocks.find(b => b.id === Q('.' + classes.node_preferences).id());

                this.updateBlock(block);
                this.updateConnections(block);
                this._menu_remove();
                this.render();
            }

            for (let i = this.blocks.length - 1; i >= 0; i--) {
                let block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this.isDraggingBlock = true;
                    // Handle dragging the block
                    this.draggingBlock = block;
                    this.offsetX = mouseX - block.x;
                    this.offsetY = mouseY - block.y;
                    block.isDragging = true;
                    break;
                }
            }
        }
        _event_pointer_move(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            if (this.draggingBlock) {


                if (this.appearance.snapToGrid) {
                    // Snap the block position to the grid
                    this.draggingBlock.x = Math.round(this.draggingBlock.x / this.appearance.gridSize) * this.appearance.gridSize;
                    this.draggingBlock.y = Math.round(this.draggingBlock.y / this.appearance.gridSize) * this.appearance.gridSize;

                    // Check if the mouse has moved by at least the grid size
                    if (!this.lastMouseX || Math.abs(mouseX - this.lastMouseX) >= this.appearance.gridSize || Math.abs(mouseY - this.lastMouseY) >= this.appearance.gridSize) {
                        this.draggingBlock.x = mouseX - this.offsetX;
                        this.draggingBlock.y = mouseY - this.offsetY;

                        // this._connection_update();
                        this.render();


                        // Update the last mouse positions
                        this.lastMouseX = mouseX;
                        this.lastMouseY = mouseY;
                    }
                } else {
                    // this._connection_update();
                    if (!this.lastMouseX || Math.abs(mouseX - this.lastMouseX) >= this.appearance.movementResolution || Math.abs(mouseY - this.lastMouseY) >= this.appearance.movementResolution) {

                        this.draggingBlock.x = mouseX - this.offsetX;
                        this.draggingBlock.y = mouseY - this.offsetY;

                        this.render();
                        // this._connection_update();
                        this.lastMouseX = mouseX;
                        this.lastMouseY = mouseY;
                    }
                }

                return;
            }

            if (this.connection_start && this.connection_end === null) {
                this.mouseX = mouseX;
                this.mouseY = mouseY;
                this.render();
                return;
            }

            if (this.isOverConnection) {
                this.isOverConnection = false;
                this.render();
            }

            this.connections.forEach(conn => {

                //check if hovering over a connection. If so, draw a glow
                if (this._point_line_segment(
                    mouseX, mouseY,
                    conn.start.block.x + conn.start.x, conn.start.block.y + conn.start.y,
                    conn.end.block.x + conn.end.x, conn.end.block.y + conn.end.y
                )) {

                    if (!this.isOverConnection) {

                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.start.block.x + conn.start.x, conn.start.block.y + conn.start.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
                        let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                        this.canvas_context.strokeStyle = startColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();

                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.end.block.x + conn.end.x, conn.end.block.y + conn.end.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
                        let endColor = this._getConnectionColor(conn.end.block, conn.end.point);
                        this.canvas_context.strokeStyle = endColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();

                        this.isOverConnection = true;
                    }
                }
            });
        }
        _event_pointer_up(event) {
            if (this.draggingBlock) {
                this.isDraggingBlock = false;
                this.draggingBlock.isDragging = false;
                this.draggingBlock = null;
                // this._connection_update();
                this.render();
            }

            if (this.connection_start && this.connection_end === null) {
                // Cancel the active connection if mouse is released without connecting
                setTimeout(() => {
                    this.connection_start = null;
                    this.mouseX = 0;
                    this.mouseY = 0;
                    this.render();
                }, 100);
            }
        }

        _event_click(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            for (let block of this.blocks) {
                if (this._connection_over_point(block, mouseX, mouseY)) {
                    if (this.connection_start === null) {
                        this.connection_start = this._point_details(block, mouseX, mouseY);
                    }
                    else if (this.connection_end === null) {
                        this.connection_end = this._point_details(block, mouseX, mouseY);

                        // Ensure there's no self-referencing connections
                        if (this.connection_start.block !== this.connection_end.block &&
                            !this._connection_exists(this.connection_start, this.connection_end)) {
                            // !this._blocks_connected(this.connection_start.block, this.connection_end.block)) {
                            this._connection_create(this.connection_start, this.connection_end);
                            block.addConnection({ id: this.connection_start.block.id, point: this.connection_start.point });
                        } else {
                            this.connection_start = null;
                            this.connection_end = null;
                            this.render();
                        }

                        // Reset the connection points
                        this.connection_start = null;
                        this.connection_end = null;
                    }
                    return;
                }
            }
        }


        _menu_context(x, y) {
            let div = Q('<div>', { class: [classes.node_preferences, classes.node_preferences_small], style: { position: 'absolute', left: x + 'px', top: y + 'px' } });
            this.isMenuPreferences = true;

            let add = Q('<div>', { class: ['button_nodes_big'], text: 'Create Block' });
            add.on('click', () => {

                let id = this._id();

                //count how many blocks are in the canvas
                let nodes = this.blocks.length + 1;

                let block = new UMLBlock({}, this.appearance, id, 'Node ' + nodes, 'Content', x, y, this.appearance.blockWidth, [{ id: this._id(), title: '', color: this.appearance.connectionColor }], [{ id: this._id(), title: '', color: this.appearance.connectionColor }]);
                this.addBlock(block);
                this._menu_remove();
            });
            div.append(add);
            this.element_parent.append(div);
        }


        _event_click_right(event) {
            event.preventDefault();

            const mouseX = event.offsetX;
            const mouseY = event.offsetY;


            if (this.isMenuPreferences) {
                this.isMenuPreferences = false;

                if (!Q.isExists('.' + classes.node_preferences + ' #' + classes.name)) {
                    this._menu_remove();
                    return;
                }

                let block = this.blocks.find(b => b.id === Q('.' + classes.node_preferences).id());

                this.updateBlock(block);
                this.updateConnections(block);
                this._menu_remove();
                this.render();
            }

            //check if the right click is on a block
            for (let i = this.blocks.length - 1; i >= 0; i--) {
                const block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this._menu_remove();
                    this._menu_preferences(block, mouseX, mouseY);
                    return;
                }
            }



            // Remove any connection that is clicked on

            for (let i = 0; i < this.connections.length; i++) {
                const conn = this.connections[i];
                if (this._point_line_segment(
                    mouseX, mouseY,
                    conn.start.block.x + conn.start.x, conn.start.block.y + conn.start.y,
                    conn.end.block.x + conn.end.x, conn.end.block.y + conn.end.y
                )) {
                    const startBlock = this.blocks.find(b => b.id === conn.start.block.id);
                    const endBlock = this.blocks.find(b => b.id === conn.end.block.id);

                    if (startBlock && endBlock) {
                        startBlock.removeConnection({ id: endBlock.id, point: conn.start.point });
                    }

                    this.connections.splice(i, 1);
                    this.render();
                    return;
                }
            }
            this._menu_context(mouseX, mouseY);
            this.render();
        }

        _id() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }


        _menu_remove() {
            Q('.' + classes.node_preferences).remove();
            this.isMenuPreferences = false;
        }

        //DRAW PREFS
        _menu_item_section(title, content) {
            let div = Q('<div>', { class: [classes.pref_section] });
            let titleDiv = Q('<div>', { class: [classes.pref_title], text: title });
            div.append(titleDiv, content);
            return div;
        }

        _menu_item_input(id, content, placeholder) {
            let input = Q('<div>', { class: [classes.pref_content], id: id, contentEditable: true, html: content, placeholder: placeholder });
            return input;
        }

        _menu_item_connections(block) {

            let div = Q('<div>', { class: [classes.connection_content] });
            let left = Q('<div>', { class: [classes.left] });
            let right = Q('<div>', { class: [classes.right] });

            const connItem = (pos, conn) => {

                let connection_wrapper = Q('<div>', { class: [classes.connection_wrapper], id: conn.id });
                let connection = Q('<input>', { class: [classes.connection], type: 'text', value: conn.title, placeholder: 'Point...', maxLength: 10 });
                let color_wrapper = Q('<div>', { class: [classes.color_wrapper] });
                let color = Q('<input>', { class: [classes.color], type: 'color', value: conn.color });

                color_wrapper.append(color);

                color.on('change', () => {
                    conn.color = color.val();
                    this.render();
                });

                connection.on('input', () => {
                    let contitle = connection.val();
                    conn.title = (conn.title && contitle !== null) ? contitle : '';
                    this.updateConnections(block);
                    this.render();
                });
                connection_wrapper.append(color_wrapper, connection);

                let remove = Q('<div>', { class: [classes.button_nodes], text: 'X' });
                remove.on('click', () => {
                    connection_wrapper.remove();
                    this.connections = this.connections.filter(c => {
                        if (c.start.block.id === block.id && c.start.point === conn.id) {
                            let targetBlock = this.blocks.find(b => b.id === c.end.block.id);
                            targetBlock.removeConnection({ id: block.id, point: c.end.point });
                            return false;
                        }
                        if (c.end.block.id === block.id && c.end.point === conn.id) {
                            let targetBlock = this.blocks.find(b => b.id === c.start.block.id);
                            targetBlock.removeConnection({ id: block.id, point: c.start.point });
                            return false;
                        }
                        return true;
                    });
                    if (pos === 'left') { block.connLeft = block.connLeft.filter(c => c.id !== conn.id); }
                    if (pos === 'right') { block.connRight = block.connRight.filter(c => c.id !== conn.id); }
                    this.render();
                });
                connection_wrapper.append(remove);
                return connection_wrapper;
            };

            block.connLeft.forEach(conn => {
                let connection_wrapper = connItem('left', conn);
                left.append(connection_wrapper);
            });

            block.connRight.forEach(conn => {
                let connection_wrapper = connItem('right', conn);
                right.append(connection_wrapper);
            });


            let add = Q('<button>', { class: [classes.button_nodes, classes.button_add], text: '+' });
            add.on('click', () => {

                let id = this._id();
                let connection = { id: id, title: '', color: '#333333' };
                block.connLeft.push(connection);
                left.append(connItem('left', connection));
                left.append(add);
                this.render();
            });
            left.append(add);

            let addRight = Q('<button>', { class: [classes.button_nodes, classes.button_add], text: '+' });
            addRight.on('click', () => {
                let id = this._id();
                let connection = { id: id, title: '', color: '#333333' };
                block.connRight.push(connection);
                right.append(connItem('right', connection));
                right.append(addRight);
                this.render();
            });
            right.append(addRight);

            div.append(left, right);
            return div;
        }

        _menu_manipulation(block) {
            let div = Q('<div>', { class: [classes.manipulation] });
            let color_wrapper = Q('<div>', { class: [classes.color_wrapper] });
            let color = Q('<input>', { class: [classes.color], type: 'color', value: block.appearance.background });
            color_wrapper.append(color);

            color.on('change', () => {
                block._restyle({ background: color.val() });
                this.render();
            });

            div.append(color_wrapper);

            let delete_button = Q('<div>', { class: [classes.button_nodes_big], text: 'Delete Block' });
            delete_button.on('click', () => {
                this.removeBlock(block);
                this._menu_remove();
            });

            let duplicate_button = Q('<div>', { class: [classes.button_nodes_big], text: 'Duplicate Block' });
            duplicate_button.on('click', () => {
                this.duplicateBlock(block);
                this._menu_remove();
            });

            div.append(color_wrapper, delete_button, duplicate_button);

            return div;
        }

        _menu_preferences(block, x, y) {
            let div = Q('<div>', { class: [classes.node_preferences, classes.node_preferences_big], id: block.id });
            div.css({ position: 'absolute', left: x + 'px', top: y + 'px' });
            let title = this._menu_item_section('Class', this._menu_item_input(classes.name, block.name, 'Class name...'));
            let content = this._menu_item_section('Content', this._menu_item_input(classes.content, block.text, 'Content...'));
            let connections = this._menu_item_section('Connections', this._menu_item_connections(block));
            let manipulation = this._menu_item_section('Manipulation', this._menu_manipulation(block));
            div.append(title, content, connections, manipulation);
            this.element_parent.append(div);
            this.isMenuPreferences = true;
        }

        _connections_init(block) {
            block.connections.forEach(conn => {
                const targetBlock = this.blocks.find(b => b.id === conn.id);
                if (targetBlock) {
                    const startCoords = this._point_coords(block, 'right');
                    const endCoords = this._point_coords(targetBlock, 'left');
                    this._connection_create(
                        { block: block, point: 'right', x: startCoords.x, y: startCoords.y },
                        { block: targetBlock, point: conn.point, x: endCoords.x, y: endCoords.y }
                    );
                }
            });
        }

        _blocks_connected(block1, block2) {
            return this.connections.some(connection =>
                (connection.start.block === block1 && connection.end.block === block2) ||
                (connection.start.block === block2 && connection.end.block === block1)
            );
        }

        _connection_exists(startConn, endConn) {
            return this.connections.some(conn => {
                const isDirectMatch =
                    conn.start.block === startConn.block && conn.start.point === startConn.point &&
                    conn.end.block === endConn.block && conn.end.point === endConn.point;
                const isReverseMatch =
                    conn.start.block === endConn.block && conn.start.point === endConn.point &&
                    conn.end.block === startConn.block && conn.end.point === startConn.point;
                return isDirectMatch || isReverseMatch;
            });
        }

        _connection_create(startConn, endConn) {
            this.connections.push({
                start: { block: startConn.block, point: startConn.point, x: startConn.x, y: startConn.y },
                end: { block: endConn.block, point: endConn.point, x: endConn.x, y: endConn.y }
            });
            startConn.block.addConnection({ id: endConn.block.id, point: startConn.point });
            endConn.block.addConnection({ id: startConn.block.id, point: endConn.point });

            this.render();
        }

        _connection_update() {
            this.connections.forEach(conn => {
                Object.assign(conn.start, this._point_coords(conn.start.block, conn.start.point));
                Object.assign(conn.end, this._point_coords(conn.end.block, conn.end.point));
            });
        }

        // _point_coords(block, pointId) {

        //     const connections = [
        //         { coords: block.leftConnCoords, conns: block.connLeft },
        //         { coords: block.rightConnCoords, conns: block.connRight }
        //     ];

        //     console.log(connections);

        //     for (const { coords, conns } of connections) {
        //         const index = conns.findIndex(conn => conn.id === pointId);
        //         if (index !== -1) {
        //             return { x: coords[index].x, y: coords[index].y };
        //         }
        //     }

        //     // Return default coordinates if not found
        //     return { x: block.x, y: block.y };
        // }

        _point_coords(block, pointId) {
            const connections = [
                { coords: block.leftConnCoords, conns: block.connLeft },
                { coords: block.rightConnCoords, conns: block.connRight }
            ];

            for (const { coords, conns } of connections) {
                const index = conns.findIndex(conn => conn.id === pointId);
                if (index !== -1) {
                    return { x: coords[index].x, y: coords[index].y };
                }
            }

            // Return default coordinates if not found
            return { x: block.x, y: block.y };
        }

        _connection_over_point(block, x, y) {
            const radius = 5;
            return block.getAllConnectionCoords().some(coord => Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius);
        }

        _point_details(block, x, y) {

            x -= block.x;
            y -= block.y;

            const radius = 5;
            let matchedPoint = null;

            block.leftConnCoords.forEach((coord, index) => {
                if (Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius) {
                    matchedPoint = { block: block, point: block.connLeft[index].id, x: coord.x, y: coord.y, index: index };
                }
            });

            if (!matchedPoint) {
                block.rightConnCoords.forEach((coord, index) => {
                    if (Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius) {
                        matchedPoint = { block: block, point: block.connRight[index].id, x: coord.x, y: coord.y, index: index };
                    }
                });
            }
            return matchedPoint;
        }

        _point_line_segment(px, py, x1, y1, x2, y2) {
            const d1 = Math.hypot(px - x1, py - y1);
            const d2 = Math.hypot(px - x2, py - y2);
            const lineLen = Math.hypot(x2 - x1, y2 - y1);

            return d1 + d2 >= lineLen - 0.1 && d1 + d2 <= lineLen + 0.1;
        }

        // _point_line_segment(px, py, x1, y1, x2, y2) {
        //     const distance = this._point_line_distance(px, py, x1, y1, x2, y2);
        //     const buffer = 5;
        //     return distance <= buffer;
        // }

        _point_line_distance(px, py, x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;

            let t = 0;
            if (lenSq !== 0) {
                t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
                t = Math.max(0, Math.min(1, t));
            }

            const projX = x1 + t * dx;
            const projY = y1 + t * dy;

            return Math.hypot(px - projX, py - projY);
        }
    }

    let appearance = {
        darkTextColor: '#888',
        lightTextColor: '#222',
        background: '#181818',

        grid: true,
        gridColor: '#161616',
        gridSize: 20,
        snapToGrid: false,

        movementResolution: 3,

        factorTitleBackground: -20,
        factorDarkColors: -30,
        factorLightColors: 80,
        factorDarkColorMargin: 20,
        factorDarkColorThreshold: 127,
        blockWidth: 200,
        connectionColor: '#333333',
        connectionPointSize: 5,
        connectionPointPadding: 5,
        connectionTextPaddingX: 5,
        connectionTextPaddingY: 5,
        // connectionTextColor: '#fff',
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        font: 'Arial',
        fontSize: 12,
        fontSizeTitle: 12,
        fontSizeConnection: 10,
        padding: 5,
        radius: 10
        // node_table_color: '#333333'
    };

    appearance = Object.assign(appearance, options);
    let uml = new UMLCanvas(selector, width, height, appearance, classes);

    return {
        import: function (data) {
            uml.import(data);
        },
        export: function () {
            return uml.export();
        },
        addBlock: function (block) {
            uml.addBlock(block);
        },
        removeBlock: function (block) {
            uml.removeBlock(block);
        }
    };

}
