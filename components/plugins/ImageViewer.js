// Name: ImageViewer
// Method: Plugin
// Desc: A simple image viewer plugin
// Type: Plugin
// Example: Q.ImageViewer().selector('.image').open(['image1.jpg', 'image2.jpg']);
// Dependencies: Style, Icons
// Status: Experimental, Unstable
Q.ImageViewer = function () {
    let classes = Q.style(`
.image_viewer_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
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
max-width: 100%;
max-height: 100%;
margin: auto;
transition: width 0.3s, height 0.3s;
}

@keyframes fadeInScale {
    to {
        opacity: 1;
    }
}

image_viewer_wrapper .image_panel {
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
    z-index: 10000;
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

.image_thumbs {
    display: flex;
    justify-content: center;
    align-items: center;
        padding: 1px;
        width:300px;
        overflow: hidden;
    }

.image_thumb {
width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.8);
    transition: all 0.3s;
    }

.img_hidden {
transform: scale(0.5);
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
        'image_viewer_pseudo': 'image_viewer_pseudo',
    },false);

    class Viewer {
        constructor() {
            this.selector = null;
            this.images = [];
            this.currentIndex = 0;
            // this.construct();
            this.eventHandler = this.handleClick.bind(this);
            this.eventListenerActive = false;
            this.addEventListener();
            this.loaded = false;
            this.icons = Q.Icons();
            this.resizing = false;
            this.thumbs = false;
        }

        construct() {
            this.image_viewer = Q('<div>', { class: classes.image_viewer_wrapper });
            this.image_panel = Q('<div>', { class: 'image_panel' });
            this.image_wrapper = Q('<div>', { class: 'image_wrapper' });
            this.image_canvas = Q('<canvas>', { class: 'image_canvas' });
            this.image_top = Q('<div>', { class: 'image_top' });
            this.image_bottom = Q('<div>', { class: 'image_bottom' });
            this.image_info = Q('<div>', { class: 'image_info' });
            this.button_container = Q('<div>', { class: 'viewer_button_container' });

            this.side_left = Q('<div>', { class: 'side_left' });
            this.side_right = Q('<div>', { class: 'side_right' });

            this.left_button = Q('<div>', { class: 'viewer_left_button' });
            this.right_button = Q('<div>', { class: 'viewer_right_button' });
            this.close_button = Q('<div>', { class: 'viewer_close_button' });
            this.zoom_in_button = Q('<div>', { class: 'viewer_zoom_in_button' });
            this.zoom_out_button = Q('<div>', { class: 'viewer_zoom_out_button' });

            this.left_button.append(this.icons.get('navigation-left', 'viewer_navicon'));
            this.right_button.append(this.icons.get('navigation-right', 'viewer_navicon'));
            this.close_button.append(this.icons.get('navigation-close'));
            this.zoom_in_button.append(this.icons.get('zoom-in'));
            this.zoom_out_button.append(this.icons.get('zoom-out'));

            this.side_left.append(this.left_button);
            this.side_right.append(this.right_button);

            this.image_top.append(this.image_info);
            this.button_container.append(this.zoom_in_button, this.zoom_out_button, this.close_button);

            this.image_wrapper.append(this.image_canvas, this.image_top, this.image_bottom);

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

            // this.left_button.hide();
            // this.right_button.hide();
        }

        handleClick(e) {
            if (e.target.closest(this.selector)) {

                // get images from selector
                const images = Q(this.selector).find('img');

                if (!images.nodes.length) {
                    return;
                }

                images.each((index, el) => {
                    let title, desc;

                    if (el.hasAttribute('data-title')) {
                        title = el.getAttribute('data-title');
                    }
                    if (el.hasAttribute('data-desc')) {
                        desc = el.getAttribute('data-desc');
                    }

                    this.images[index] = {
                        src: el.src,
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
                //add blur to image
                this.resizing = true;
                this.image_canvas.css({ filter: 'blur(10px)', transition: 'all 0.1s ease-in-out' });
            }

            Q.Debounce('img_viewer', 500, () => {
                this.updateImage();
                this.resizing = false;
                //remove blur from image
                this.image_canvas.css({ filter: 'none', transition: '' });
            });

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
                this.currentIndex--;
                this.fadeTitle();
                this.updateImage();
                this.updateNavigation();
            }
        }

        next() {
            if (this.currentIndex < this.images.length - 1) {
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
                this.image_info.append(Q('<div>', { class: "image_title", text: this.images[this.currentIndex].title }));
            }
            if (this.images[this.currentIndex].desc) {
                this.image_info.append(Q('<div>', { class: "image_desc", text: this.images[this.currentIndex].desc }));
            }

            //get window scale (zoom)
            this.window_zoom = window.devicePixelRatio;

            const src = this.images[this.currentIndex];
            const img = new Image();

            // Check the file extension to determine if the image is animated
            const isAnimated = /\.(webm|apng|gif)$/i.test(src.src);

            img.onload = () => {
                const canvas = this.image_canvas.nodes[0];
                const ctx = canvas.getContext('2d');

                if (isAnimated) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    return;
                }

                const aspectRatio = img.width / img.height;
                let width = this.window_width * this.window_zoom;
                let height = this.window_height * this.window_zoom;

                if (width / height > aspectRatio) {
                    width = height * aspectRatio;
                } else {
                    height = width / aspectRatio;
                }

                //if upscale happens, rather apply the original as background
                if (width > img.width && height > img.height) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    return;
                }

                canvas.width = width;
                canvas.height = height;

                try {
                    ctx.drawImage(img, 0, 0, width, height);
                } catch (error) {
                    // console.error('Canvas operation failed:', error);
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
            };
            img.src = src.src;
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
    }

    let viewer = new Viewer();

    return {
        selector: function (selector) {
            viewer.setSelector(selector);
            return this;
        },
        open: function (images) {
            viewer.open(images);
            return this;
        },
        close: function () {
            viewer.close();
            return this;
        },
        remove: function () {
            viewer.remove();
            return this;
        }
    };
}
