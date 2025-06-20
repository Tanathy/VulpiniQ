/**
 * Q.ImageViewer - Egységesített plugin séma
 * @param {Object} options
 */
Q.ImageViewer = function(options = {}) {
    this.options = { ...options };
    let classes = Q.style(`
.image_viewer_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.77);
    transition: background 10s;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: #fff;
}
.image_panel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.image_wrapper {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.15s;
    margin: 0 1px;
    display: flex;
    flex-direction: column;
    animation: fadeInScale 0.3s forwards;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.image_canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: auto;
    transition: width 0.3s, height 0.3s;
}
.image_ambient {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: auto;
    filter: blur(25px);
    opacity: 0.75;
    z-index: 0;
}
@keyframes fadeInScale {
    to {
        opacity: 1;
    }
}
.image_viewer_wrapper .image_panel {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image_top, .image_bottom {
    width: 100%;
    z-index: 1;
    position: absolute;
}
.image_top {
    top: 0;
    text-align: left;
    background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
}
.image_bottom {
    bottom: 0;
}
.side_left, .side_right {
    height: 100%;
    width: 80px;
}
.image_info {
    max-width: 500px;
    padding: 10px;
    text-shadow: 0 1px 3px #000;
}
.image_title {
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 5px;
}
.image_desc {
    font-size: 14px;
}
.side_left:hover, .side_right:hover {
    background: rgba(255,255,255,0.05);
}
.viewer_left_button, .viewer_right_button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1;
    cursor: pointer;
    color: white;
    opacity: 0.5;
}
.viewer_navicon {
    width: 40px;
    height: 40px;
}
.viewer_left_button:hover, .viewer_right_button:hover, .viewer_close_button:hover {
    opacity: 1;
}
.viewer_button_container {
    z-index: 10000;
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
}
.viewer_close_button, .viewer_zoom_in_button, .viewer_zoom_out_button {
    width: 30px;
    height: 30px;
    cursor: pointer;
    color: white;
    opacity: 0.5;
}
    `, {
        'image_viewer_wrapper': 'image_viewer_wrapper',
        'image_panel': 'image_panel',
        'image_wrapper': 'image_wrapper',
        'image_canvas': 'image_canvas',
        'image_ambient': 'image_ambient',
        'image_top': 'image_top',
        'image_bottom': 'image_bottom',
        'image_info': 'image_info',
        'viewer_button_container': 'viewer_button_container',
        'side_left': 'side_left',
        'side_right': 'side_right',
        'viewer_left_button': 'viewer_left_button',
        'viewer_right_button': 'viewer_right_button',
        'viewer_close_button': 'viewer_close_button',
        'viewer_zoom_in_button': 'viewer_zoom_in_button',
        'viewer_zoom_out_button': 'viewer_zoom_out_button',
        'image_title': 'image_title',
        'image_desc': 'image_desc',
        'viewer_navicon': 'viewer_navicon'
    }, false);
    class Viewer {
        constructor() {
            this.selector = null;
            this.images = [];
            this.currentIndex = 0;
            this.eventHandler = this.handleClick.bind(this);
            this.addEventListener();
            this.icons = Q.Icons();
            this.eventListenerActive = false;
            this.loaded = false;
            this.resizing = false;
            this.thumbs = false;
            this.scale = 1;
            this.panX = 0;
            this.panY = 0;
            this.isPanning = false;
            this.startX = 0;
            this.startY = 0;
            this.imageCache = {};
            this.config = {
                panAndZoom: true,
                ambient: true,
                ambientSize: 1.2,
                dynamicBackground: true
            };
        }
        construct() {
            this.image_viewer = Q('<div>', { class: classes.image_viewer_wrapper });
            this.image_panel = Q('<div>', { class: classes.image_panel });
            this.image_wrapper = Q('<div>', { class: classes.image_wrapper });
            this.image_canvas = Q('<canvas>', { class: classes.image_canvas });
            this.image_ambient = Q('<canvas>', { class: classes.image_ambient });
            this.image_top = Q('<div>', { class: classes.image_top });
            this.image_bottom = Q('<div>', { class: classes.image_bottom });
            this.image_info = Q('<div>', { class: classes.image_info });
            this.button_container = Q('<div>', { class: classes.viewer_button_container });
            this.side_left = Q('<div>', { class: classes.side_left });
            this.side_right = Q('<div>', { class: classes.side_right });
            this.left_button = Q('<div>', { class: classes.viewer_left_button });
            this.right_button = Q('<div>', { class: classes.viewer_right_button });
            this.close_button = Q('<div>', { class: classes.viewer_close_button });
            this.zoom_in_button = Q('<div>', { class: classes.viewer_zoom_in_button });
            this.zoom_out_button = Q('<div>', { class: classes.viewer_zoom_out_button });
            this.left_button.append(this.icons.get('navigation-left', classes.viewer_navicon));
            this.right_button.append(this.icons.get('navigation-right', classes.viewer_navicon));
            this.close_button.append(this.icons.get('navigation-close'));
            this.zoom_in_button.append(this.icons.get('zoom-in'));
            this.zoom_out_button.append(this.icons.get('zoom-out'));
            this.side_left.append(this.left_button);
            this.side_right.append(this.right_button);
            this.image_top.append(this.image_info);
            this.button_container.append(this.zoom_in_button, this.zoom_out_button, this.close_button);
            this.image_wrapper.append(this.image_ambient, this.image_canvas, this.image_top, this.image_bottom);
            this.image_panel.append(this.side_left, this.image_wrapper, this.side_right);
            this.image_viewer.append(this.image_panel, this.button_container);
            this.left_button.on('click', () => this.prev());
            this.right_button.on('click', () => this.next());
            this.close_button.on('click', () => this.close());
            this.image_top.on('mouseenter', () => {
                this.image_top.css({ opacity: 1, transition: 'all 0.3s' });
            });
            this.image_top.on('mouseleave', () => {
                this.image_top.css({ opacity: 0, transition: 'all 0.3s', 'transition-delay': '3s' });
            });
            this.image_canvas.on('wheel', (e) => this.handleZoom(e));
            this.image_canvas.on('mousedown', (e) => this.startPan(e));
            this.image_canvas.on('mousemove', (e) => this.pan(e));
            this.image_canvas.on('mouseup', () => this.endPan());
            this.image_canvas.on('mouseleave', () => this.endPan());
            this.image_canvas.on('touchstart', (e) => this.startTouch(e));
            this.image_canvas.on('touchmove', (e) => this.touchPanZoom(e));
            this.image_canvas.on('touchend', () => this.endTouch());
        }
        handleClick(e) {
            if (e.target.closest(this.selector)) {
                const images = Q(this.selector).find('img');
                if (!images.nodes.length) {
                    return;
                }
                images.each((index, el) => {
                    let title, desc, src;
                    if (el.hasAttribute('data-title')) {
                        title = el.getAttribute('data-title');
                    }
                    if (el.hasAttribute('data-desc')) {
                        desc = el.getAttribute('data-desc');
                    }
                    if (el.hasAttribute('data-source')) {
                        src = el.getAttribute('data-source');
                    } else {
                        src = el.src;
                    }
                    this.images[index] = {
                        src: src,
                        title: title,
                        desc: desc
                    }
                });
                this.currentIndex = images.nodes.indexOf(e.target);
                this.open();
            }
        }
        handleResize() {
            if (!this.resizing) {
                this.resizing = true;
                this.image_canvas.css({ filter: 'blur(10px)', transition: 'all 0.1s ease-in-out' });
            }
            Q.Debounce('img_viewer', 500, () => {
                this.scale = 1;
                this.startX = 0;
                this.startY = 0;
                this.panX = 0;
                this.panY = 0;
                this.updateImage();
                this.resizing = false;
                this.image_canvas.css({ filter: 'none', transition: '' });
            });
        }
        handleZoom(e) {
            if (!this.config.panAndZoom) return;
            e.preventDefault();
            const rect = this.image_canvas.nodes[0].getBoundingClientRect();
            const offsetX = (e.clientX - rect.left - this.panX) / this.scale;
            const offsetY = (e.clientY - rect.top - this.panY) / this.scale;
            const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(Math.max(this.scale * scaleAmount, 0.5), 2.5);
            const deltaScale = newScale - this.scale;
            this.panX -= offsetX * deltaScale;
            this.panY -= offsetY * deltaScale;
            this.scale = newScale;
            this.updateImage();
        }
        startPan(e) {
            if (!this.config.panAndZoom) return;
            this.isPanning = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
        }
        pan(e) {
            if (!this.config.panAndZoom) return;
            if (!this.isPanning) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.updateImage();
        }
        endPan() {
            this.isPanning = false;
        }
        startTouch(e) {
            if (!this.config.panAndZoom) return;
            if (e.touches.length === 1) {
                this.isPanning = true;
                this.startX = e.touches[0].clientX - this.panX;
                this.startY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                this.isPanning = false;
                this.initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                this.initialScale = this.scale;
            }
        }
        touchPanZoom(e) {
            if (!this.config.panAndZoom) return;
            e.preventDefault();
            if (e.touches.length === 1 && this.isPanning) {
                this.panX = e.touches[0].clientX - this.startX;
                this.panY = e.touches[0].clientY - this.startY;
                this.updateImage();
            } else if (e.touches.length === 2) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const scaleAmount = currentDistance / this.initialDistance;
                this.scale = Math.min(Math.max(this.initialScale * scaleAmount, 0.5), 2.5);
                this.updateImage();
            }
        }
        endTouch() {
            this.isPanning = false;
        }
        addEventListener() {
            if (!this.eventListenerActive) {
                document.addEventListener('click', this.eventHandler);
                this.eventListenerActive = true;
            }
        }
        removeEventListener() {
            if (this.eventListenerActive) {
                document.removeEventListener('click', this.eventHandler);
                this.eventListenerActive = false;
            }
        }
        fadeTitle() {
            this.image_top.css({ opacity: 1, transition: 'all 0.3s' });
            Q.Debounce('fade_title', 2000, () => {
                this.image_top.css({ opacity: 0, transition: 'all 0.3s' });
            });
        }
        open() {
            this.construct();
            this.updateImage();
            this.updateNavigation();
            Q('body').append(this.image_viewer);
            window.addEventListener('resize', this.handleResize.bind(this));
        }
        close() {
            this.thumbs = false;
            window.removeEventListener('resize', this.handleResize.bind(this));
            this.image_viewer.remove();
        }
        prev() {
            if (this.currentIndex > 0) {
                this.scale = 1;
                this.startX = 0;
                this.startY = 0;
                this.panX = 0;
                this.panY = 0;
                this.currentIndex--;
                this.fadeTitle();
                this.updateImage();
                this.updateNavigation();
            }
        }
        next() {
            if (this.currentIndex < this.images.length - 1) {
                this.scale = 1;
                this.startX = 0;
                this.startY = 0;
                this.panX = 0;
                this.panY = 0;
                this.currentIndex++;
                this.fadeTitle();
                this.updateImage();
                this.updateNavigation();
            }
        }
        updateImage() {
            this.window_width = window.innerWidth;
            this.window_height = window.innerHeight;
            this.image_info.empty();
            if (this.images[this.currentIndex].title) {
                this.image_info.append(Q('<div>', { class: classes.image_title, text: this.images[this.currentIndex].title }));
            }
            if (this.images[this.currentIndex].desc) {
                this.image_info.append(Q('<div>', { class: classes.image_desc, text: this.images[this.currentIndex].desc }));
            }
            const src = this.images[this.currentIndex];
            const img = this.imageCache[src.src] || new Image();
            if (!this.imageCache[src.src]) {
                img.src = src.src;
                this.imageCache[src.src] = img;
            }
            const isAnimated = /\.(webm|apng|gif)$/i.test(src.src);
            img.onload = () => {
                const canvas = this.image_canvas.nodes[0];
                const ambientCanvas = this.image_ambient.nodes[0];
                const ctx = canvas.getContext('2d');
                const ambientCtx = ambientCanvas.getContext('2d');
                canvas.width = this.image_wrapper.nodes[0].clientWidth;
                canvas.height = this.image_wrapper.nodes[0].clientHeight;
                ambientCanvas.width = canvas.width * 1.2;
                ambientCanvas.height = canvas.height * 1.2;
                if (isAnimated) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    if (this.config.ambient) {
                        ambientCtx.drawImage(img, (ambientCanvas.width - canvas.width) / 2, (ambientCanvas.height - canvas.height) / 2, canvas.width, canvas.height);
                    }
                    return;
                }
                const aspectRatio = img.width / img.height;
                let width = this.window_width * this.scale;
                let height = this.window_height * this.scale;
                if (width / height > aspectRatio) {
                    width = height * aspectRatio;
                } else {
                    height = width / aspectRatio;
                }
                const offsetX = (canvas.width - width) / 2;
                const offsetY = (canvas.height - height) / 2;
                ctx.setTransform(this.scale, 0, 0, this.scale, this.panX + offsetX, this.panY + offsetY);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                if (this.config.ambient) {
                    const ambientOffsetX = (ambientCanvas.width - width * this.config.ambientSize) / 2;
                    const ambientOffsetY = (ambientCanvas.height - height * this.config.ambientSize) / 2;
                    ambientCtx.setTransform(this.scale * this.config.ambientSize, 0, 0, this.scale * this.config.ambientSize, this.panX * this.config.ambientSize + ambientOffsetX, this.panY * this.config.ambientSize + ambientOffsetY);
                    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
                    ambientCtx.drawImage(img, 0, 0, width, height);
                }
                if (this.config.dynamicBackground) {
                    Q.Debounce('update_ambient', 1000, () => {
                        Q.AvgColor(canvas, 10, (color) => {
                            this.image_viewer.css('background', `rgba(${color.r}, ${color.g}, ${color.b}, 0.77)`);
                        });
                    });
                }
            };
            if (img.complete) {
                img.onload();
            }
        }
        updateNavigation() {
            if (this.images.length > 1) {
                if (this.currentIndex > 0) {
                    this.left_button.show();
                } else {
                    this.left_button.hide();
                }
                if (this.currentIndex < this.images.length - 1) {
                    this.right_button.show();
                } else {
                    this.right_button.hide();
                }
            } else {
                this.left_button.hide();
                this.right_button.hide();
            }
        }
        setSelector(selector) {
            this.selector = selector;
            this.addEventListener();
        }
        remove() {
            this.removeEventListener();
            this.image_viewer.remove();
        }
        source(images) {
            this.images = images.map((img, index) => ({
                src: img.source,
                title: img.title,
                desc: img.desc
            }));
            this.currentIndex = 0;
        }
    }
    this.viewer = new Viewer();
    return {
        selector: function (selector) {
            this.viewer.setSelector(selector);
            return this;
        },
        open: function (images) {
            this.viewer.open(images);
            return this;
        },
        close: function () {
            this.viewer.close();
            return this;
        },
        remove: function () {
            this.viewer.remove();
            return this;
        },
        config: function (options) {
            Object.assign(this.viewer.config, options);
            return this;
        },
        source: function (images) {
            this.viewer.source(images);
            return this;
        },
        getState: function () {
            return { config: this.viewer.config };
        },
        setState: function (state) {
            if (state && state.config) this.viewer.config(state.config);
        },
        destroy: function () {
            this.remove();
        }
    };
}
