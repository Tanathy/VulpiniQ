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
    background: rgba(0,0,0,0.8);
    justify-content: center;
    align-items: center;
    z-index: 9999;
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
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.15s;
    animation: fadeInScale 0.3s forwards;
}

@keyframes fadeInScale {
    to {
        opacity: 1;
        transform: scale(1);
    }
}

image_viewer_wrapper .image_panel {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.side_left, .side_right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    width: 80px;
    }

.viewer_left_button, .viewer_right_button, .viewer_close_button {
    width: 40px;
    height: 40px;
    z-index: 10000;
    cursor: pointer;
    color: white;
    opacity: 0.5;
}

.viewer_left_button:hover, .viewer_right_button:hover, .viewer_close_button:hover {
    opacity: 1;
}

.viewer_close_button {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
}
    `, {
        'image_viewer_wrapper': 'image_viewer_wrapper',
        'image_viewer_pseudo': 'image_viewer_pseudo',
    });

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
        }

        construct() {
            this.image_viewer = Q('<div>', { class: classes.image_viewer_wrapper });
            this.image_panel = Q('<div>', { class: 'image_panel' });
            this.image_wrapper = Q('<div>', { class: 'image_wrapper' });

            this.side_left = Q('<div>', { class: 'side_left' });
            this.side_right = Q('<div>', { class: 'side_right' });

            this.left_button = Q('<div>', { class: 'viewer_left_button'});
            this.right_button = Q('<div>', { class: 'viewer_right_button'}); 
            this.close_button = Q('<div>', { class: 'viewer_close_button'});

            this.left_button.append(this.icons.get('navigation-left'));
            this.right_button.append(this.icons.get('navigation-right'));
            this.close_button.append(this.icons.get('navigation-close'));

            this.side_left.append(this.left_button);
            this.side_right.append(this.right_button);

            this.image_panel.append(this.side_left, this.image_wrapper, this.side_right);
            this.image_viewer.append( this.image_panel, this.close_button);


            this.left_button.on('click', () => this.prev());
            this.right_button.on('click', () => this.next());
            this.close_button.on('click', () => this.close());

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

                images.each((index,el) => {
                    this.images[index] = el.src;
                });

                this.currentIndex = images.nodes.indexOf(e.target);
                    this.open();
            }
        }

        handleResize() {

            if (!this.resizing) {
                //add blur to image
                this.resizing = true;
                this.image_wrapper.css({ filter: 'blur(5px)', transition: 'all 0.5s ease-in-out' });
            }

            Q.Debounce('img_viewer', 500, () => {
            this.updateImage();
            this.resizing = false;
            //remove blur from image
            this.image_wrapper.css({ filter: 'none', transition: '' });
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

        open() {
            this.construct();
            this.updateImage();
            this.updateNavigation();
            Q('body').append(this.image_viewer);
            window.addEventListener('resize', this.handleResize.bind(this));
        }

        close() {
            window.removeEventListener('resize', this.handleResize.bind(this));
            this.image_viewer.remove();
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateImage();
                this.updateNavigation();
            }
        }

        next() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
                this.updateImage();
                this.updateNavigation();
            }
        }

        updateImage() {
            this.window_width = window.innerWidth;
            this.window_height = window.innerHeight;
        
            const src = this.images[this.currentIndex];
            const img = new Image();
        
            // Check the file extension to determine if the image is animated
            const isAnimated = /\.(webm|apng|gif)$/i.test(src);
        
            img.onload = () => {
                if (isAnimated) {
                    // If the image is animated, set it directly without resizing
                    this.image_wrapper.css({'background-image': `url(${src})`});
                    return;
                }
        
                const aspectRatio = img.width / img.height;
                let width = this.window_width;
                let height = this.window_height;
        
                if (width / height > aspectRatio) {
                    width = height * aspectRatio;
                } else {
                    height = width / aspectRatio;
                }
        
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
        
                try {
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataURL = canvas.toDataURL();
                    this.image_wrapper.css({'background-image': `url(${dataURL})`});
                } catch (error) {
                    // console.error('Canvas operation failed:', error);
                    this.image_wrapper.css({'background-image': `url(${src})`});
                }
            };
            img.src = src;
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
