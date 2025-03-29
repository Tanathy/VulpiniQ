Form.prototype.Uploader = function (options = {}) {
    const defaultOptions = {
        fileTypes: '*', // Accepted file types: 'image/jpeg,image/png' or '.jpg,.png'
        preview: true,  // Show previews for images/videos
        thumbSize: 100, // Thumbnail size (px)
        allowDrop: true, // Allow drag and drop
        multiple: false, // Allow multiple file selection
        placeholder: 'Drop files here or click to select'
    };

    options = Object.assign({}, defaultOptions, options);

    // Initialize uploader CSS if not done yet
    if (!Form.uploaderClassesInitialized) {
        Form.uploaderClasses = Q.style('', `
            .form_uploader_container {
            user-select: none;
                -webkit-user-select: none;
                display: flex;
                flex-direction: column;
                width: 100%;
                border: 2px dashed var(--form-default-input-border-color);
                border-radius: var(--form-default-border-radius);
                background-color: var(--form-default-input-background-color);
                padding: 10px;
            }
            .form_uploader_container.drag_over {
                border-color: var(--form-default-button-background-color);
                background-color: rgba(100, 60, 240, 0.05);
            }
            .form_uploader_drop_area {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                color: var(--form-default-input-text-color);
                min-height: 120px;
            }
            .form_uploader_icon {
                font-size: 32px;
                margin-bottom: 10px;
                opacity: 0.7;
            }
            .form_uploader_text {
                margin-bottom: 10px;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
            .form_uploader_button {
                padding: var(--form-default-padding);
                background-color: var(--form-default-button-background-color);
                color: var(--form-default-button-text-color);
                border: none;
                border-radius: var(--form-default-border-radius);
                cursor: pointer;
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
            }
            .form_uploader_button:hover {
                background-color: var(--form-default-button-hover-background-color);
            }
            .form_uploader_input {
                display: none;
            }
            .form_uploader_preview_container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 5px;
            }
            .form_uploader_preview_item {
                position: relative;
                border-radius: var(--form-default-border-radius);
                overflow: hidden;
                border: 1px solid var(--form-default-input-border-color);
            }
            .form_uploader_preview_image {
                object-fit: cover;
                display: block;
            }
            .form_uploader_preview_video {
                object-fit: cover;
                display: block;
            }
            .form_uploader_preview_icon {
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--form-default-input-text-color);
                background-color: rgba(37, 37, 37, 0.8);
                font-size: 24px;
            }
            .form_uploader_preview_info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 4px 6px;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                font-size: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        `, null, {
            'form_uploader_container': 'form_uploader_container',
            'drag_over': 'drag_over',
            'form_uploader_drop_area': 'form_uploader_drop_area',
            'form_uploader_icon': 'form_uploader_icon',
            'form_uploader_text': 'form_uploader_text',
            'form_uploader_button': 'form_uploader_button',
            'form_uploader_input': 'form_uploader_input',
            'form_uploader_preview_container': 'form_uploader_preview_container',
            'form_uploader_preview_item': 'form_uploader_preview_item',
            'form_uploader_preview_image': 'form_uploader_preview_image',
            'form_uploader_preview_video': 'form_uploader_preview_video',
            'form_uploader_preview_icon': 'form_uploader_preview_icon',
            'form_uploader_preview_info': 'form_uploader_preview_info'
        });
        Form.uploaderClassesInitialized = true;
    }

    // Create container elements
    const container = Q(`<div class="${Form.classes.q_form} ${Form.uploaderClasses.form_uploader_container}"></div>`);
    const dropArea = Q(`<div class="${Form.uploaderClasses.form_uploader_drop_area}"></div>`);
    const uploadIcon = Q(`<div class="${Form.uploaderClasses.form_uploader_icon}">📂</div>`);
    const text = Q(`<div class="${Form.uploaderClasses.form_uploader_text}">${options.placeholder}</div>`);
    const browseButton = Q(`<button type="button" class="${Form.uploaderClasses.form_uploader_button}">Browse Files</button>`);
    const fileInput = Q(`<input type="file" class="${Form.uploaderClasses.form_uploader_input}">`);

    // Set file input attributes
    if (options.multiple) {
        fileInput.attr('multiple', true);
    }

    if (options.fileTypes && options.fileTypes !== '*') {
        fileInput.attr('accept', options.fileTypes);
    }

    // Add elements to container
    dropArea.append(uploadIcon, text, browseButton);
    container.append(dropArea, fileInput);

    // Create preview container if previews are enabled
    let previewContainer = null;
    if (options.preview) {
        previewContainer = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_container}"></div>`);
        container.append(previewContainer);
    }

    // File storage
    const state = {
        files: [],
        fileObjects: []
    };

    // Format file size function
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get file extension without the dot
    function getFileExtension(filename) {
        return filename.split('.').pop().toUpperCase();
    }

    // Handle files function
    function handleFiles(files) {
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            // Create file metadata
            const fileInfo = {
                name: file.name,
                size: file.size,
                formattedSize: formatFileSize(file.size),
                type: file.type,
                extension: getFileExtension(file.name)
            };

            // Add file to state
            state.files.push(fileInfo);
            state.fileObjects.push(file);

            // Generate preview if enabled
            if (options.preview) {
                generatePreview(file, fileInfo);
            }
        });

        // Trigger change callback
        if (typeof container.changeCallback === 'function') {
            container.changeCallback(state.files);
        }
    }

    // Generate preview function
    function generatePreview(file, fileInfo) {
        const previewItem = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_item}"></div>`);
        const fileInfoElement = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_info}">${file.name} (${fileInfo.formattedSize})</div>`);

        // Use the common close button class from Form.js
        const removeButton = Q(`<div class="${Form.classes.form_close_button}">×</div>`);

        // Set dimensions based on thumbSize
        previewItem.css({
            width: options.thumbSize + 'px',
            height: options.thumbSize + 'px'
        });

        // Add title attribute with file details
        const titleInfo = `Name: ${file.name}\nSize: ${fileInfo.formattedSize}\nType: ${file.type}`;
        previewItem.attr('title', titleInfo);

        // Handle based on file type
        if (file.type.startsWith('image/')) {
            // Create image preview
            const img = Q(`<img class="${Form.uploaderClasses.form_uploader_preview_image}" alt="${file.name}">`);
            img.css({
                width: '100%',
                height: '100%'
            });

            // Also add title to the image element
            img.attr('title', titleInfo);

            const reader = new FileReader();
            reader.onload = function (e) {
                img.attr('src', e.target.result);
                fileInfo.preview = e.target.result;
            };
            reader.readAsDataURL(file);

            previewItem.append(img);
        }
        else if (file.type.startsWith('video/')) {
            // Create video preview
            const video = Q(`<video class="${Form.uploaderClasses.form_uploader_preview_video}" controls muted>`);
            video.css({
                width: '100%',
                height: '100%'
            });

            // Also add title to the video element
            video.attr('title', titleInfo);

            const reader = new FileReader();
            reader.onload = function (e) {
                video.attr('src', e.target.result);
                fileInfo.preview = e.target.result;
            };
            reader.readAsDataURL(file);

            previewItem.append(video);
        }
        else {
            // Create icon preview for other file types
            const fileIcon = Q(`<div class="${Form.uploaderClasses.form_uploader_preview_icon}"></div>`);
            fileIcon.css({
                width: '100%',
                height: '100%'
            });

            // Also add title to the icon element
            fileIcon.attr('title', titleInfo);

            // Display file extension as icon text without the dot
            fileIcon.text(fileInfo.extension);

            previewItem.append(fileIcon);
        }

        // Add file info and remove button
        previewItem.append(fileInfoElement, removeButton);

        // Store reference to the preview element
        fileInfo.element = previewItem;

        // Add to preview container
        if (previewContainer) {
            previewContainer.append(previewItem);
        }

        // Set up remove button handler
        removeButton.on('click', () => {
            removeFile(fileInfo);
        });
    }

    // Remove file function
    function removeFile(fileInfo) {
        const index = state.files.indexOf(fileInfo);
        if (index !== -1) {
            // Remove from arrays
            state.files.splice(index, 1);
            state.fileObjects.splice(index, 1);

            // Remove preview element
            if (fileInfo.element) {
                fileInfo.element.remove();
            }

            // Trigger change callback
            if (typeof container.changeCallback === 'function') {
                container.changeCallback(state.files);
            }
        }
    }

    // Reset uploader function
    function resetUploader() {
        state.files = [];
        state.fileObjects = [];

        if (previewContainer) {
            previewContainer.html('');
        }

        fileInput.val('');
    }

    // Set up event handlers
    if (options.allowDrop) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.on(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Highlight drop area when dragging over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.on(eventName, () => {
                container.addClass(Form.uploaderClasses.drag_over);
            });
        });

        // Remove highlight when leaving or after drop
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.on(eventName, () => {
                container.removeClass(Form.uploaderClasses.drag_over);
            });
        });

        // Handle file drop
        dropArea.on('drop', (e) => {
            const files = e.dataTransfer.files;

            // Check if multiple files allowed
            if (!options.multiple && files.length > 1) {
                // If not multiple, just take the first file
                handleFiles([files[0]]);
            } else {
                handleFiles(files);
            }
        });
    }

    // Browse button click handler - FIX HERE
    browseButton.on('click', function () {
        // Use this.element instead of fileInput.element
        fileInput.nodes[0].click();
    });

    // Drop area click handler - FIX HERE
    dropArea.on('click', function (e) {
        // Check if the click target is not the browse button
        if (e.target !== browseButton.nodes[0]) {
            fileInput.nodes[0].click();
        }
    });

    // File input change handler
    fileInput.on('change', function () {
        if (!options.multiple) {
            resetUploader(); // Clear previous files if not multiple
        }

        // Use this.element instead of fileInput.element
        handleFiles(this.files);
    });

    // API methods

    // Get/set value
    container.val = function (value) {
        // Getter
        if (value === undefined) {
            return {
                files: state.files,
                fileObjects: state.fileObjects
            };
        }

        // Setter - Reset to empty
        if (value === '' || value === null) {
            resetUploader();
            return container;
        }

        return container;
    };

    // Reset uploader
    container.reset = function () {
        resetUploader();
        return container;
    };

    // Disable/enable uploader
    container.disabled = function (state) {
        if (state) {
            container.css('opacity', '0.5');
            container.css('pointer-events', 'none');
            fileInput.prop('disabled', true);
        } else {
            container.css('opacity', '1');
            container.css('pointer-events', 'auto');
            fileInput.prop('disabled', false);
        }
        return container;
    };

    // Change callback
    container.change = function (callback) {
        container.changeCallback = callback;
        return container;
    };

    // Add to Form elements
    this.elements.push(container);
    return container;
};
