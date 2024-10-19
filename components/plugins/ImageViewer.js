// Name: ImageViewer
// Method: Plugin
// Desc: A simple image viewer plugin
// Type: Plugin
// Example: Q.ImageViewer().selector('.image').open(['image1.jpg', 'image2.jpg']);
// Dependencies: Style, Icons
// Status: Experimental, Unstable
Q.ImageViewer = function () {
    console.log('ImageViewer Plugin Loaded');
    let classes = Q.style(`
.image_viewer_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

image_viewer_wrapper .image_wrapper {
    position: relative;
    width: 80%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.left_button, .right_button, .close_button {
    position: absolute;
    background: rgba(255,255,255,0.5);
    border: none;
    cursor: pointer;
    padding: 10px;
}

.left_button {
    left: 10px;
}

.right_button {
    right: 10px;
}

.close_button {
    top: 10px;
    right: 10px;
}
    `, {
        'image_viewer_wrapper': 'image_viewer_wrapper'
    });

    class Viewer {
        constructor() {
            this.selector = null;
            this.images = []; 
            this.currentIndex = 0;
            this.construct();
            this.eventHandler = this.handleClick.bind(this);
            this.eventListenerActive = false;
            this.addEventListener();
        }

        construct() {
            this.wrapper = Q('<div>', { class: classes.image_viewer_wrapper });
            this.image_wrapper = Q('<div>', { class: 'image_wrapper' });
            this.left_button = Q('<button>', { class: 'left_button', text: 'Prev' });
            this.right_button = Q('<button>', { class: 'right_button', text: 'Next' });
            this.close_button = Q('<button>', { class: 'close_button', text: 'Close' });

            this.wrapper.append(this.left_button, this.image_wrapper, this.right_button, this.close_button);


            this.left_button.on('click', () => this.prev());
            this.right_button.on('click', () => this.next());
            this.close_button.on('click', () => this.close());

            this.left_button.hide();
            this.right_button.hide();
        }

        handleClick(e) {
            if (e.target.closest(this.selector)) {
                const src = e.target.src;
                if (src) {
                    this.open([src]);
                }
            }
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

        open(images) {
            this.construct(); 
            this.images = images;
            this.currentIndex = 0; 

            this.updateImage();
            this.updateNavigation();
            Q('body').append(this.wrapper);
        }

        close() {
            this.wrapper.remove();
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
            const src = this.images[this.currentIndex];
            this.image_wrapper.empty();
            const img = Q('<img>', { src: src});
            this.image_wrapper.append(img);
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
            this.wrapper.remove();
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
