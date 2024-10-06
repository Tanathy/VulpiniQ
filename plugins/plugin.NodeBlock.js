// Name: Q.NodeBlock
// Method: Plugin
// Desc: A plugin for creating UML blocks and connections.
// Type: Plugin
// Example: var uml = Q.NodeBlock('#canvas', 800, 600); // Create a new UML canvas
// Dependencies: ColorBrightness, isDarkColor, Style

Q.NodeBlock = function (selector, width, height, options) {

    let classes = Q.style(`

.preferences {
    position: absolute;
    width: 250px;
    max-height: 300px;
    background: #181818;
    overflow: hidden;
    overflow-y: scroll;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.pref_title {
    font-size: 12px;
    margin: 5px;
    color: #7a7a7a;
    text-align: center;
}

.preferences::-webkit-scrollbar {
    width: 10px;
}

.preferences::-webkit-scrollbar-track {
    background: #3a3a3a;
}

.preferences::-webkit-scrollbar-thumb {
    background: #242424;
}

.preferences::-webkit-scrollbar-thumb:hover {
    background: #555;
}


input[type="text"],
.pref_content {
    width: 100%;
    background-color: #1d1d1d;
    border: 0;
    outline: 0;
    color: #7a7a7a;
    font-size: 12px !important;
}

.pref_content {
    padding: 5px 15px;
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
    overflow: hidden;
}

.color_wrapper input[type="color"] {
    position: absolute;
    width: 100px;
    top: -20px;
    left: -20px;
    height: 100px;
}

.connection {
    font-size: 12px;
padding: 0 5px;
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
}
        `, {
        "preferences": "preferences",
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
        "content": "_content"
    }, false);

    console.log(classes);

    class UMLBlock {
        constructor(appearance, id, name, text, x, y, width, connLeft = [], connRight = [], connections = []) {
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
            this.height = 0; // Initial height will be calculated later
            this.isDragging = false;
            this.leftConnCoords = [];
            this.rightConnCoords = [];
            this.img = null;
            this.content = null;
            this.contentHeight = 0;
            this.unescapedBase64Data = null;
            this.appearance = appearance;
            this.appearance.titleBackground = Q.ColorBrightness(this.appearance.background, -12);

            this.appearance.titleColor = Q.isDarkColor(this.appearance.background) ? '#666' : '#181818';
            this.appearance.connectionTextColor = Q.isDarkColor(this.appearance.background) ? '#666' : '#181818';
            this.appearance.textColor = Q.isDarkColor(this.appearance.background) ? '#666' : '#181818';

        }

        _drawContainer(ctx, x, y, width, height) {
            const { shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, background, radius } = this.appearance;

            // Apply shadow styles
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;

            // Draw rounded rectangle
            ctx.fillStyle = background;
            ctx.beginPath();

            // Top-left corner
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);        // Top-right corner
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Bottom-right corner
            ctx.arcTo(x, y + height, x, y + height - radius, radius);      // Bottom-left corner
            ctx.arcTo(x, y, x + radius, y, radius);                       // Top-left corner

            ctx.fill();

            // Reset shadow styles
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
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

            ctx.font = 'bold ' + this.appearance.fontSizeTitle + 'px ' + this.appearance.font;
            ctx.fillStyle = this.appearance.titleColor;
            const titleX = x + (width - ctx.measureText(title).width) / 2;
            const titleY = y + (height + this.appearance.fontSizeTitle) / 2;
            ctx.fillText(title, titleX, titleY);
        }

        parseHTML2Canvas(html, callback) {

            //remove all inline styles from html
            html = html.replace(/style="[^"]*"/g, '');

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
                p { margin: 0; padding: 0; color: ${this.appearance.textColor};}
                ul { margin: 5px 0px; padding-left: 15px; color: ${this.appearance.textColor};}
                li { padding: 0px; margin: 0px; }
                div { color: rgb(100, 100, 100); font-family: ${this.appearance.font}, sans-serif; font-size: ${this.appearance.fontSize}px; color: ${this.appearance.textColor};}
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
            this.content.height = this.contentHeight; // Set canvas height to the measured content height
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
        }

        // draw(ctx) {
        //     const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
        //     const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
        //     const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
        //     const maxConnectionsHeight = Math.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;

        //     // Helper function to calculate and update container height
        //     const updateContainerHeight = (contentHeight) => {
        //         this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
        //     };

        //     // Helper function to draw the content inside the container
        //     const drawImageContent = (img, drawX, drawY, drawWidth, drawHeight) => {
        //         const contentHeight = drawHeight;
        //         updateContainerHeight(contentHeight);
        //         this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
        //         this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
        //         ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        //         this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
        //     };

        //     // Helper function to check if the content contains base64
        //     const isBase64Image = this.text.includes('base64');

        //     // Helper function to extract base64 data from text
        //     const extractBase64Data = () => {
        //         const base64Match = this.text.match(/base64,([^"]*)/);
        //         return base64Match && base64Match[1] ? base64Match[1] : null;
        //     };

        //     // If the text contains a base64 image
        //     if (isBase64Image) {
        //         const base64Data = extractBase64Data();
        //         if (!base64Data) return;

        //         // If the base64 data is already cached, use it to draw the image
        //         if (this.base64Data === base64Data.length) {
        //             const imgWidth = this.img.width;
        //             const imgHeight = this.img.height;
        //             const aspectRatio = imgHeight / imgWidth;
        //             const drawWidth = this.width - this.appearance.padding;
        //             const drawHeight = drawWidth * aspectRatio;
        //             const drawX = this.x + this.appearance.padding / 2;
        //             const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

        //             drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
        //             return;
        //         }

        //         // Load the base64 image and draw it once loaded
        //         const unescapedBase64Data = 'data:image/png;base64,' + decodeURIComponent(base64Data);
        //         this.img = new Image();
        //         this.img.src = unescapedBase64Data;
        //         this.base64Data = base64Data.length;

        //         this.img.onload = () => {
        //             const imgMatch = this.text.match(/<img[^>]+src="([^">]+)"/);
        //             if (imgMatch && imgMatch[1]) {
        //                 this.text = `<img src="${imgMatch[1]}"/>`;
        //             }

        //             const imgWidth = this.img.width;
        //             const imgHeight = this.img.height;
        //             const aspectRatio = imgHeight / imgWidth;
        //             const drawWidth = this.width - this.appearance.padding;
        //             const drawHeight = drawWidth * aspectRatio;
        //             const drawX = this.x + 5;
        //             const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

        //             drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
        //         };

        //         return;
        //     } else {
        //         // If not base64, parse HTML content and render it as a canvas
        //         this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
        //             updateContainerHeight(contentHeight);
        //             this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
        //             this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
        //             ctx.drawImage(canvas, this.x + this.appearance.padding, this.y + TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
        //             this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
        //         });
        //     }
        // }

        draw(ctx) {
            const TITLE_HEIGHT = this.appearance.fontSizeTitle + (this.appearance.padding * 2);
            const CONNECTION_HEIGHT = this.appearance.padding + TITLE_HEIGHT;
            const CONNECTION_PADDING = (this.appearance.connectionPointSize * 2) + this.appearance.connectionPointPadding;
            const maxConnectionsHeight = Math.max(this.connLeft.length, this.connRight.length) * CONNECTION_PADDING;

            // Helper function to calculate and update container height
            const updateContainerHeight = (contentHeight) => {
                this.height = TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight + contentHeight + this.appearance.padding;
            };

            // Helper function to draw the content inside the container
            const drawImageContent = (img, drawX, drawY, drawWidth, drawHeight) => {
                const contentHeight = drawHeight;
                updateContainerHeight(contentHeight);
                this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
                this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
            };

            // Helper function to check if the content contains base64
            const isBase64Image = this.text.includes('base64');

            // Helper function to extract base64 data from text
            const extractBase64Data = () => {
                const base64Match = this.text.match(/base64,([^"]*)/);
                return base64Match && base64Match[1] ? base64Match[1] : null;
            };

            // If the text contains a base64 image
            if (isBase64Image) {
                const base64Data = extractBase64Data();
                if (!base64Data) return;

                // If the base64 data is already cached, use it to draw the image
                if (this.base64Data === base64Data.length) {
                    const imgWidth = this.img.width;
                    const imgHeight = this.img.height;
                    const aspectRatio = imgHeight / imgWidth;
                    const drawWidth = this.width - this.appearance.padding;
                    const drawHeight = drawWidth * aspectRatio;
                    const drawX = this.x + this.appearance.padding / 2;
                    const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

                    drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
                    return;
                }

                // Load the base64 image and draw it once loaded
                const unescapedBase64Data = 'data:image/png;base64,' + decodeURIComponent(base64Data);
                this.img = new Image();
                this.img.src = unescapedBase64Data;
                this.base64Data = base64Data.length;

                this.img.onload = () => {
                    const imgMatch = this.text.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch && imgMatch[1]) {
                        this.text = `<img src="${imgMatch[1]}"/>`;
                    }

                    const imgWidth = this.img.width;
                    const imgHeight = this.img.height;
                    const aspectRatio = imgHeight / imgWidth;
                    const drawWidth = this.width - this.appearance.padding;
                    const drawHeight = drawWidth * aspectRatio;
                    const drawX = this.x + 5;
                    const drawY = this.y + TITLE_HEIGHT + (this.appearance.padding * 2) + maxConnectionsHeight;

                    drawImageContent(this.img, drawX, drawY, drawWidth, drawHeight);
                };

                return;
            } else {
                // If not base64, parse HTML content and render it as a canvas
                this.parseHTML2Canvas(this.text, (canvas, contentHeight) => {
                    updateContainerHeight(contentHeight);
                    this._drawContainer(ctx, this.x, this.y, this.width, this.height, this.appearance.radius);
                    this._drawTitle(ctx, this.x, this.y, this.width, TITLE_HEIGHT, this.name);
                    ctx.drawImage(canvas, this.x + this.appearance.padding, this.y + TITLE_HEIGHT + this.appearance.padding + maxConnectionsHeight);
                    this.drawConnectionPoints(ctx, CONNECTION_HEIGHT, CONNECTION_PADDING);
                });
            }
        }


        drawConnectionPoints(ctx, paddingTop, height) {
            const connectionY = this.y + paddingTop;
            const font = `bold ${this.appearance.fontSizeConnection}px ${this.appearance.font}`;
            const pointSize = this.appearance.connectionPointSize;
            const textColor = this.appearance.connectionTextColor;
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

                    ctx.fillStyle = textColor;
                    ctx.fillText(conn.title, getTextX(conn.title, baseX), connY + middleYOffset);
                });
            };

            if (Array.isArray(this.connLeft)) {
                drawConnectionPoints(this.connLeft, this.leftConnCoords, this.x, (title, baseX) => baseX + connectionPaddingX * 2);
            }

            if (Array.isArray(this.connRight)) {
                drawConnectionPoints(this.connRight, this.rightConnCoords, this.x + this.width, (title, baseX) => baseX - ctx.measureText(title).width - connectionPaddingX * 2);
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
            return [...this.leftConnCoords, ...this.rightConnCoords];
        }

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

            this.canvas.on('click', this._event_click.bind(this)); // For handling clicks on connection points
            this.canvas.on('mousedown', this._event_pointer_down.bind(this));
            this.canvas.on('mousemove', this._event_pointer_move.bind(this));
            this.canvas.on('mouseup', this._event_pointer_up.bind(this));
            this.canvas.on('contextmenu', this._event_click_right.bind(this), false); // For handling right-clicks to break connections
        }

        import(uml) {
            // Collect promises for each block creation
            const blockCreationPromises = uml.blocks.map(async (block) => {
                // Modify UMLBlock initialization to be promise-aware.
                const newBlock = new UMLBlock(
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

        render() {
            this.canvas_context.clearRect(0, 0, this.width, this.height);

            // Draw the connections

            // if(this.isDraggingBlock){
            this.connections.forEach(conn => {
                let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                let endColor = this._getConnectionColor(conn.end.block, conn.end.point);

                this.canvas_context.strokeStyle = 'rgb(150, 150, 150)';

                this.canvas_context.beginPath();

                // Line thickness
                this.canvas_context.lineWidth = 2;

                // Gradient from start to end point using their colors
                let gradient = this.canvas_context.createLinearGradient(conn.start.x, conn.start.y, conn.end.x, conn.end.y);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                this.canvas_context.strokeStyle = gradient;

                this.canvas_context.moveTo(conn.start.x, conn.start.y);
                this.canvas_context.lineTo(conn.end.x, conn.end.y);
                this.canvas_context.stroke();

                // Calculate direction vector
                let dx = conn.end.x - conn.start.x;
                let dy = conn.end.y - conn.start.y;
                let length = Math.sqrt(dx * dx + dy * dy);
                let unitDx = dx / length;
                let unitDy = dy / length;

                // Draw arrows every 100px
                let arrowLength = 10;
                let arrowWidth = 5;
                for (let i = 100; i < length; i += 200) {
                    let x = conn.start.x + unitDx * i;
                    let y = conn.start.y + unitDy * i;

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
                let startColor = this._getConnectionColor(this.connection_start.block, this.connection_start.point);

                let gradient = this.canvas_context.createLinearGradient(this.connection_start.x, this.connection_start.y, this.mouseX, this.mouseY);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, "rgb(150, 150, 150)");  // Default color for the temp connection endpoint
                this.canvas_context.strokeStyle = gradient;

                this.canvas_context.beginPath();
                this.canvas_context.moveTo(this.connection_start.x, this.connection_start.y);
                this.canvas_context.lineTo(this.mouseX, this.mouseY);
                this.canvas_context.stroke();
            }

            this.blocks.forEach(block => {
                block.draw(this.canvas_context);
            });
        }

        // New method to get the color of a connection point
        _getConnectionColor(block, pointId) {
            for (let i = 0; i < block.connLeft.length; i++) {
                if (block.connLeft[i].id === pointId) {
                    return block.connLeft[i].color;
                }
            }

            for (let i = 0; i < block.connRight.length; i++) {
                if (block.connRight[i].id === pointId) {
                    return block.connRight[i].color;
                }
            }
        }

        updateConnections(block) {

            let preferences = Q('.' + classes.preferences);

            let left = preferences.find('.' + classes.left);
            let right = preferences.find('.' + classes.right);

            let leftConnections = block.connLeft;
            let rightConnections = block.connRight;

            // Function to update connections


            // Collect new connections
            let newLeftConnections = [];
            left.find('.' + classes.connection_wrapper).walk((element) => {

                // left.querySelectorAll('.connection_wrapper').forEach(c => {
                let id = element.id();
                let title = element.find('.' + classes.connection).val();
                let color = element.find('.' + classes.color).val();

                newLeftConnections.push({ id: id, title: title, color: color });
            }, true);

            let newRightConnections = [];
            right.find('.' + classes.connection_wrapper).walk((element) => {
                let id = element.id();
                let title = element.find('.' + classes.connection).val();
                let color = element.find('.' + classes.color).val();
                newRightConnections.push({ id: id, title: title, color: color });
            }, true);

            let newConnections = [...newLeftConnections, ...newRightConnections];
            let existingConnections = [...leftConnections, ...rightConnections];

            newConnections.forEach(newConn => {
                let existingConn = existingConnections.find(conn => conn.id === newConn.id);
                if (existingConn) {
                    existingConn.title = (newConn.title && newConn.title !== null) ? newConn.title : '';
                    existingConn.color = newConn.color;
                } else {
                    existingConnections.push(newConn);
                }
            });
        }

        updateBlock(selectedblock = null) {
            let preferences = Q('.' + classes.preferences);
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
        }


        _event_pointer_down(event) {
            if (event.button === 2) return; // Ignore right-click for dragging
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            if (this.isMenuPreferences) {
                this.isMenuPreferences = false;

                if (!Q.isExists('.' + classes.preferences + ' #' + classes.name)) {
                    this._menu_remove();
                    return;
                }

                let block = this.blocks.find(b => b.id === Q('.' + classes.preferences).id());

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
                this.draggingBlock.x = mouseX - this.offsetX;
                this.draggingBlock.y = mouseY - this.offsetY;
                this._connection_update();
                this.render();
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
                if (this._point_line_segment(mouseX, mouseY, conn.start.x, conn.start.y, conn.end.x, conn.end.y)) {

                    if (!this.isOverConnection) {

                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.start.x, conn.start.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
                        let startColor = this._getConnectionColor(conn.start.block, conn.start.point);
                        this.canvas_context.strokeStyle = startColor;
                        this.canvas_context.lineWidth = 2;
                        this.canvas_context.stroke();

                        this.canvas_context.beginPath();
                        this.canvas_context.arc(conn.end.x, conn.end.y, this.appearance.connectionPointSize + 2, 0, 2 * Math.PI);
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
                this._connection_update();
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
                            console.log('Connection created between', this.connection_start, 'and', this.connection_end);
                            block.addConnection({ id: this.connection_start.block.id, point: this.connection_start.point });
                            console.log('Connection created');
                        } else {
                            console.log('Connection already exists or blocks are already connected');
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
            let div = Q('<div>', { class: ['preferences'], style: { position: 'absolute', left: x + 'px', top: y + 'px' } });
            this.isMenuPreferences = true;

            let add = Q('<div>', { class: ['button_nodes_big'], text: 'Create Block' });
            add.on('click', () => {

                let id = this._id();
                let block = new UMLBlock(this.appearance, id, 'Class', 'Content', x, y, 200, [{ id: this._id(), title: 'Left', color: '#333333' }], [{ id: this._id(), title: 'Right', color: '#333333' }]);
                this.addBlock(block);
                this._menu_remove();
            });
            div.append(add);
            this.element_parent.append(div);
        }


        _event_click_right(event) {
            event.preventDefault(); // Prevent the context menu from appearing

            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            //check if the right click is on a block
            for (let i = this.blocks.length - 1; i >= 0; i--) {
                let block = this.blocks[i];
                if (block.isMouseOver(mouseX, mouseY)) {
                    this._menu_remove();
                    this._menu_preferences(block, mouseX, mouseY);
                    return;
                }
            }

            if (this.isMenuPreferences) {
                this.updateBlock();
                this._menu_remove();
                this.isMenuPreferences = false;
            }

            // Remove any connection that is clicked on

            for (let i = 0; i < this.connections.length; i++) {
                let conn = this.connections[i];
                if (this._point_line_segment(mouseX, mouseY, conn.start.x, conn.start.y, conn.end.x, conn.end.y)) {
                    // Remove the connection from the block's connections list
                    const startBlock = this.blocks.find(b => b.id === conn.start.block.id);
                    const endBlock = this.blocks.find(b => b.id === conn.end.block.id);

                    if (startBlock && endBlock) {
                        startBlock.removeConnection({ id: endBlock.id, point: conn.start.point });
                    }

                    // Remove the connection from the connections list
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
            Q('.' + classes.preferences).remove();
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

        _menu_preferences(block, x, y) {
            let div = Q('<div>', { class: [classes.preferences], id: block.id });
            div.css({ position: 'absolute', left: x + 'px', top: y + 'px' });

            this.isMenuPreferences = true;

            let title = this._menu_item_section('Class', this._menu_item_input(classes.name, block.name, 'Class name...'));
            let content = this._menu_item_section('Content', this._menu_item_input(classes.content, block.text, 'Content...'));
            let connections = this._menu_item_section('Connections', this._menu_item_connections(block));

            div.append(title, content, connections);

            this.element_parent.append(div);
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
            return this.connections.some(conn =>
                (conn.start.block === startConn.block && conn.start.point === startConn.point &&
                    conn.end.block === endConn.block && conn.end.point === endConn.point) ||
                (conn.start.block === endConn.block && conn.start.point === endConn.point &&
                    conn.end.block === startConn.block && conn.end.point === startConn.point)
            );
        }

        _connection_create(startConn, endConn) {
            this.connections.push({
                start: { block: startConn.block, point: startConn.point, x: startConn.x, y: startConn.y },
                end: { block: endConn.block, point: endConn.point, x: endConn.x, y: endConn.y }
            });

            //add to the block's connections
            startConn.block.addConnection({ id: endConn.block.id, point: startConn.point });
            endConn.block.addConnection({ id: startConn.block.id, point: endConn.point });

            this.render();
        }

        _connection_update() {
            this.connections.forEach(conn => {
                const startCoords = this._point_coords(conn.start.block, conn.start.point);
                const endCoords = this._point_coords(conn.end.block, conn.end.point);
                conn.start.x = startCoords.x;
                conn.start.y = startCoords.y;
                conn.end.x = endCoords.x;
                conn.end.y = endCoords.y;
            });
        }

        _point_coords(block, pointId) {
            const leftCoords = block.leftConnCoords;
            const rightCoords = block.rightConnCoords;

            // Iterate through the connection points to find the matching pointId
            for (let i = 0; i < block.connLeft.length; i++) {
                if (block.connLeft[i].id === pointId) {
                    return { x: leftCoords[i].x, y: leftCoords[i].y };
                }
            }

            for (let i = 0; i < block.connRight.length; i++) {
                if (block.connRight[i].id === pointId) {
                    return { x: rightCoords[i].x, y: rightCoords[i].y };
                }
            }

            // Return a default coordinate if not found
            return { x: block.x, y: block.y };
        }

        _connection_over_point(block, x, y) {
            const radius = 5;
            return block.getAllConnectionCoords().some(coord => Math.abs(x - coord.x) < radius && Math.abs(y - coord.y) < radius);
        }

        _point_details(block, x, y) {
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
            const distance = this._point_line_distance(px, py, x1, y1, x2, y2);
            const buffer = 5; // Adjust the acceptable distance buffer as needed
            return distance <= buffer;
        }

        _point_line_distance(px, py, x1, y1, x2, y2) {
            const A = px - x1;
            const B = py - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = (A * C) + (B * D);
            const len_sq = (C * C) + (D * D);
            let param = -1;
            if (len_sq !== 0) {
                param = dot / len_sq;
            }

            let xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }

            const dx = px - xx;
            const dy = py - yy;
            return Math.sqrt((dx * dx) + (dy * dy));
        }
    }

    let appearance = {
        background: '#181818',
        titleColor: 'rgb(150, 150, 150)',
        textColor: 'rgb(100, 100, 100)',
        connectionColor: 'rgb(60, 60, 60)',
        connectionPointSize: 5,
        connectionPointPadding: 5,
        connectionTextPaddingX: 5,
        connectionTextPaddingY: 5,
        connectionTextColor: 'rgb(100, 100, 100)',
        separatorColor: 'rgb(50, 50, 50)',
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        font: 'Arial',
        fontSize: 12,
        fontSizeTitle: 12,
        fontSizeConnection: 10,
        padding: 10,
        radius: 10
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
