Container.prototype.Window = function(options = {}) {
    if (!Container.windowClassesInitialized) {
        
        Container.windowClasses = Q.style(`
            --window-bg-color:rgb(37, 37, 37);
            --window-border-color: rgba(255, 255, 255, 0.2);
            --window-shadow-color: rgba(0, 0, 0, 0.1);
            --window-titlebar-bg:rgb(17, 17, 17);
            --window-titlebar-text: #ffffff;
            --window-button-bg:rgb(17, 17, 17);
            --window-button-hover-bg: #777777;
            --window-button-text: #ffffff;
            --window-close-color: #e74c3c;
            --window-titlebar-height: 28px; /* Add fixed titlebar height */
        `, `
            .window_container {
                position: fixed; /* Change from absolute to fixed */
                min-width: 200px;
                background-color: var(--window-bg-color);
                border: 1px solid var(--window-border-color);
                border-radius: 4px;
                box-shadow: 0 4px 8px var(--window-shadow-color);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transition-property: opacity, transform, width, height, top, left;
                transition-timing-function: ease-out;
            }
            
            .window_titlebar {
                background-color: var(--window-titlebar-bg);
                color: var(--window-titlebar-text);
                font-size: 12px;
                cursor: default;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                height: var(--window-titlebar-height); /* Fixed height for titlebar */
            }
            
            .window_title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                margin: 0 10px;
            }
            
            .window_controls {
                display: flex;
                height:100%;
            }
            
            .window_button {
                background-color: var(--window-button-bg);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: 100%;
                width: 30px;
            }

            .window_button:hover {
                background-color: var(--window-button-hover-bg);
            }

            .window_close:hover {
                background-color: var(--window-close-color);
            }
            
            .window_content {
                flex: 1;
                overflow: auto;
                padding: 10px;
                position: relative;
                background-color: var(--window-bg-color);
                box-sizing: border-box;
            }

            .window_content:empty {
            padding: 0;
            }
            
            .window_resize_handle {
                position: absolute;
                z-index: 1;
            }
            
            .window_resize_n {
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                cursor: n-resize;
            }
            
            .window_resize_e {
                top: 0;
                right: 0;
                bottom: 0;
                width: 5px;
                cursor: e-resize;
            }
            
            .window_resize_s {
                bottom: 0;
                left: 0;
                right: 0;
                height: 5px;
                cursor: s-resize;
            }
            
            .window_resize_w {
                top: 0;
                left: 0;
                bottom: 0;
                width: 5px;
                cursor: w-resize;
            }
            
            .window_resize_nw {
                top: 0;
                left: 0;
                width: 10px;
                height: 10px;
                cursor: nw-resize;
            }
            
            .window_resize_ne {
                top: 0;
                right: 0;
                width: 10px;
                height: 10px;
                cursor: ne-resize;
            }
            
            .window_resize_se {
                bottom: 0;
                right: 0;
                width: 10px;
                height: 10px;
                cursor: se-resize;
            }
            
            .window_resize_sw {
                bottom: 0;
                left: 0;
                width: 10px;
                height: 10px;
                cursor: sw-resize;
            }
            
            .window_minimized {
                height: var(--window-titlebar-height) !important; /* Fixed to titlebar height */
                width: auto !important;
                min-width: 200px;
                position: fixed !important;
                bottom: 10px;
                left: 10px;
                overflow: hidden;
            }
            
            .window_minimized .window_content {
                display: none !important; /* Biztosítjuk, hogy valóban ne jelenjen meg */
                height: 0 !important;
            }
            
            .window_minimized .window_resize_handle {
                display: none;
            }
            
            .window_maximized {
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 0;
                position: fixed !important;
            }
            
            .window_maximized .window_resize_handle {
                display: none;
            }
            
            .window_button_icon {
                width: 10px;
                height: 10px;
                color: var(--window-button-text);
                pointer-events: none;
            }
        `, null, {
            'window_container': 'window_container',
            'window_titlebar': 'window_titlebar',
            'window_title': 'window_title',
            'window_controls': 'window_controls',
            'window_button': 'window_button',
            'window_minimize': 'window_minimize',
            'window_maximize': 'window_maximize',
            'window_restore': 'window_restore',
            'window_close': 'window_close',
            'window_content': 'window_content',
            'window_resize_handle': 'window_resize_handle',
            'window_resize_n': 'window_resize_n',
            'window_resize_e': 'window_resize_e',
            'window_resize_s': 'window_resize_s',
            'window_resize_w': 'window_resize_w',
            'window_resize_nw': 'window_resize_nw',
            'window_resize_ne': 'window_resize_ne',
            'window_resize_se': 'window_resize_se',
            'window_resize_sw': 'window_resize_sw',
            'window_minimized': 'window_minimized',
            'window_maximized': 'window_maximized',
            'window_button_icon': 'window_button_icon'
        });
        
        Container.windowClassesInitialized = true;
    }
    
    
    const defaults = {
        title: 'Window',
        content: '',
        resizable: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        draggable: true,
        x: 50,     
        y: 50,     
        width: 400, 
        height: 300, 
        minWidth: 200,
        minHeight: 150,
        zIndex: 1000,
        minimizePosition: 'bottom-left', 
        minimizeContainer: null, 
        minimizeOffset: 10, 
        animate: 150
    };
    
    const settings = Object.assign({}, defaults, options);
    
    
    const windowElement = Q('<div>', { class: Container.windowClasses.window_container });
    const titlebar = Q('<div>', { class: Container.windowClasses.window_titlebar });
    const titleElement = Q('<div>', { class: Container.windowClasses.window_title }).text(settings.title);
    const controls = Q('<div>', { class: Container.windowClasses.window_controls });
    const contentContainer = Q('<div>', { class: Container.windowClasses.window_content });
    
    
    if (settings.minimizable) {
        const minimizeButton = Q('<div>', { 
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_minimize
        });
        minimizeButton.append(this.Icon('window-minimize').addClass(Container.windowClasses.window_button_icon));
        controls.append(minimizeButton);
    }
    
    if (settings.maximizable) {
        const maximizeButton = Q('<div>', { 
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_maximize
        });
        maximizeButton.append(this.Icon('window-full').addClass(Container.windowClasses.window_button_icon));
        controls.append(maximizeButton);
    }
    
    if (settings.closable) {
        const closeButton = Q('<div>', { 
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_close
        });
        closeButton.append(this.Icon('window-close').addClass(Container.windowClasses.window_button_icon));
        controls.append(closeButton);
    }
    
    
    titlebar.append(titleElement, controls);
    windowElement.append(titlebar, contentContainer);
    
    
    if (settings.resizable) {
        const resizeHandles = [
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_n, 'data-resize': 'n' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_e, 'data-resize': 'e' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_s, 'data-resize': 's' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_w, 'data-resize': 'w' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_nw, 'data-resize': 'nw' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_ne, 'data-resize': 'ne' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_se, 'data-resize': 'se' }),
            Q('<div>', { class: Container.windowClasses.window_resize_handle + ' ' + Container.windowClasses.window_resize_sw, 'data-resize': 'sw' })
        ];
        
        for (let i = 0; i < resizeHandles.length; i++) {
            windowElement.append(resizeHandles[i]);
        }
    }
    
    
    if (settings.content) {
        if (typeof settings.content === 'string') {
            contentContainer.html(settings.content);
        } else if (settings.content instanceof Element || settings.content instanceof Q) {
            contentContainer.append(settings.content);
        }
    }
    
    
    let isMinimized = false;
    let isMaximized = false;
    let previousState = {
        width: settings.width,
        height: settings.height,
        x: 0,
        y: 0
    };
    let isOpen = false;
    let isAnimating = false;
    
    
    function setTransitionDuration(duration) {
        if (!settings.animate) return;
        windowElement.css('transition-duration', duration + 'ms');
    }
    
    
    function resetTransition() {
        setTimeout(() => {
            windowElement.css('transition-duration', '');
            isAnimating = false;
        }, settings.animate);
    }
    
    
    function calculateInitialPosition() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const windowWidth = settings.width;
        const windowHeight = settings.height;
        
        let left = (viewportWidth * settings.x / 100) - (windowWidth / 2);
        let top = (viewportHeight * settings.y / 100) - (windowHeight / 2);
        
        
        left = Math.max(0, Math.min(left, viewportWidth - windowWidth));
        top = Math.max(0, Math.min(top, viewportHeight - windowHeight));
        
        return { left, top };
    }
    
    
    function setInitialPositionAndSize() {
        const position = calculateInitialPosition();
        windowElement.css({
            position: 'fixed', // Use fixed instead of absolute
            width: settings.width + 'px',
            height: settings.height + 'px',
            left: position.left + 'px',
            top: position.top + 'px',
            zIndex: settings.zIndex
        });
        
        
        previousState.x = position.left;
        previousState.y = position.top;
    }
    
    
    function bringToFront() {
        
        const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
        if (windowIndex !== -1) {
            Container.openWindows.splice(windowIndex, 1);
        }
        
        
        Container.openWindows.push(windowElement.nodes[0]);
        
        
        updateZIndices();
    }
    
    
    function updateZIndices() {
        const baseZIndex = settings.zIndex;
        
        
        for (let i = 0; i < Container.openWindows.length; i++) {
            const windowNode = Container.openWindows[i];
            
            windowNode.style.zIndex = baseZIndex + i;
        }
        
        
        Container.highestZIndex = baseZIndex + Container.openWindows.length - 1;
        
        
        
    }
    
    
    function setupDraggable() {
        if (!settings.draggable) return;
        
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        titlebar.on('mousedown', function(e) {
            if (isMaximized) return;
            
            // Special handling for minimized state
            if (isMinimized) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                // Get current position
                if (windowElement.css('left') !== 'auto') {
                    startLeft = parseInt(windowElement.css('left'), 10);
                } else {
                    // If using right positioning
                    const viewportWidth = window.innerWidth;
                    startLeft = viewportWidth - parseInt(windowElement.css('right'), 10) - windowElement.width();
                }
                
                if (windowElement.css('top') !== 'auto') {
                    startTop = parseInt(windowElement.css('top'), 10);
                } else {
                    // If using bottom positioning
                    const viewportHeight = window.innerHeight;
                    startTop = viewportHeight - parseInt(windowElement.css('bottom'), 10) - windowElement.height();
                }
                
                bringToFront();
                e.preventDefault();
                return;
            }
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(windowElement.css('left'), 10);
            startTop = parseInt(windowElement.css('top'), 10);
            
            
            bringToFront();
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            
            // Different handling for minimized windows
            if (isMinimized) {
                // Get viewport dimensions
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const minWidth = windowElement.width();
                const minHeight = windowElement.height();
                
                // Constrain position to prevent dragging outside viewport
                const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - minWidth));
                const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - minHeight));
                
                // Apply constrained position
                windowElement.css({
                    left: constrainedLeft + 'px',
                    top: constrainedTop + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
                return;
            }
            
            // For normal windows, ensure they stay within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = windowElement.width();
            const windowHeight = windowElement.height();
            
            // Calculate constrained position to keep window within viewport
            const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - windowWidth));
            const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - windowHeight));
            
            windowElement.css({
                left: constrainedLeft + 'px',
                top: constrainedTop + 'px',
                right: 'auto',
                bottom: 'auto'
            });
            
            
            previousState.x = constrainedLeft;
            previousState.y = constrainedTop;
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            
            // If minimized, update minimizePosition based on current position
            if (isMinimized) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const currentLeft = parseInt(windowElement.css('left'), 10);
                const currentTop = parseInt(windowElement.css('top'), 10);
                
                // Determine position relative to viewport quadrants
                const isRight = currentLeft > viewportWidth / 2;
                const isBottom = currentTop > viewportHeight / 2;
                
                if (isRight && isBottom) {
                    settings.minimizePosition = 'bottom-right';
                } else if (isRight && !isBottom) {
                    settings.minimizePosition = 'top-right';
                } else if (!isRight && isBottom) {
                    settings.minimizePosition = 'bottom-left';
                } else {
                    settings.minimizePosition = 'top-left';
                }
            }
        });
    }
    
    
    function setupResizable() {
        if (!settings.resizable) return;
        
        let isResizing = false;
        let resizeDirection = '';
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        
        
        const resizeHandles = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_resize_handle);
        
        for (let i = 0; i < resizeHandles.length; i++) {
            const handle = resizeHandles[i];
            handle.addEventListener('mousedown', function(e) {
                if (isMaximized) return;
                isResizing = true;
                resizeDirection = this.getAttribute('data-resize');
                startX = e.clientX;
                startY = e.clientY;
                startWidth = windowElement.width();
                startHeight = windowElement.height();
                startLeft = parseInt(windowElement.css('left'), 10);
                startTop = parseInt(windowElement.css('top'), 10);
                
                windowElement.css('zIndex', settings.zIndex + 10);
                
                e.preventDefault();
                e.stopPropagation();
            });
        }
        
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;
            
            
            if (resizeDirection.includes('e')) {
                newWidth = startWidth + dx;
            }
            if (resizeDirection.includes('s')) {
                newHeight = startHeight + dy;
            }
            if (resizeDirection.includes('w')) {
                newWidth = startWidth - dx;
                newLeft = startLeft + dx;
            }
            if (resizeDirection.includes('n')) {
                newHeight = startHeight - dy;
                newTop = startTop + dy;
            }
            
            
            if (newWidth < settings.minWidth) {
                if (resizeDirection.includes('w')) {
                    newLeft = startLeft + startWidth - settings.minWidth;
                }
                newWidth = settings.minWidth;
            }
            
            if (newHeight < settings.minHeight) {
                if (resizeDirection.includes('n')) {
                    newTop = startTop + startHeight - settings.minHeight;
                }
                newHeight = settings.minHeight;
            }
            
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            
            if (newLeft + newWidth > viewportWidth) {
                if (resizeDirection.includes('e')) {
                    newWidth = viewportWidth - newLeft;
                }
            }
            
            if (newTop + newHeight > viewportHeight) {
                if (resizeDirection.includes('s')) {
                    newHeight = viewportHeight - newTop;
                }
            }
            
            if (newLeft < 0) {
                if (resizeDirection.includes('w')) {
                    const adjustment = -newLeft;
                    newLeft = 0;
                    newWidth -= adjustment;
                }
            }
            
            if (newTop < 0) {
                if (resizeDirection.includes('n')) {
                    const adjustment = -newTop;
                    newTop = 0;
                    newHeight -= adjustment;
                }
            }
            
            
            windowElement.css({
                width: newWidth + 'px',
                height: newHeight + 'px',
                left: newLeft + 'px',
                top: newTop + 'px'
            });
            
            
            previousState.width = newWidth;
            previousState.height = newHeight;
            previousState.x = newLeft;
            previousState.y = newTop;
        });
        
        document.addEventListener('mouseup', function() {
            isResizing = false;
        });
    }
    
    
    function setupControls() {
        
        const minimizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_minimize);
        if (minimizeButtons.length) {
            for (let i = 0; i < minimizeButtons.length; i++) {
                minimizeButtons[i].addEventListener('click', function() {
                    bringToFront(); 
                    toggleMinimize();
                });
            }
        }
        
        
        const maximizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_maximize);
        if (maximizeButtons.length) {
            for (let i = 0; i < maximizeButtons.length; i++) {
                maximizeButtons[i].addEventListener('click', function() {
                    bringToFront(); 
                    toggleMaximize();
                });
            }
        }
        
        
        const closeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_close);
        if (closeButtons.length) {
            for (let i = 0; i < closeButtons.length; i++) {
                closeButtons[i].addEventListener('click', function() {
                    closeWindow();
                });
            }
        }
        
        
        contentContainer.on('mousedown', function() {
            bringToFront();
        });
    }
    
    
    if (!Container.highestZIndex) {
        Container.highestZIndex = settings.zIndex;
        Container.openWindows = [];
    }
    
    
    function toggleMinimize() {
        if (isAnimating) return;
        isAnimating = true;
        
        if (isMaximized) {
            
            
            
            isMaximized = false;
            windowElement.removeClass(Container.windowClasses.window_maximized);
        }
        
        isMinimized = !isMinimized;
        
        let detachedContent = null;
        
        if (isMinimized) {
            // Calculate position for minimized state
            let minimizedPosition = {};
            
            // Check if we should minimize to a specific container
            if (settings.minimizeContainer) {
                let container;
                if (typeof settings.minimizeContainer === 'string') {
                    
                    container = document.querySelector(settings.minimizeContainer);
                } else if (settings.minimizeContainer instanceof Element) {
                    container = settings.minimizeContainer;
                } else if (settings.minimizeContainer instanceof Q) {
                    container = settings.minimizeContainer.nodes[0];
                }
                
                if (container) {
                    
                    container.appendChild(windowElement.nodes[0]);
                    
                    
                    minimizedPosition = {
                        position: 'relative',
                        left: 'auto',
                        right: 'auto',
                        top: 'auto',
                        bottom: 'auto',
                        margin: settings.minimizeOffset + 'px'
                    };
                }
            } else {
                // Position at the specified screen edge
                switch (settings.minimizePosition) {
                    case 'bottom-right':
                        minimizedPosition = {
                            position: 'fixed',
                            left: 'auto',
                            right: settings.minimizeOffset + 'px',
                            top: 'auto',
                            bottom: settings.minimizeOffset + 'px'
                        };
                        break;
                        
                    case 'top-left':
                        minimizedPosition = {
                            position: 'fixed',
                            left: settings.minimizeOffset + 'px',
                            right: 'auto',
                            top: settings.minimizeOffset + 'px',
                            bottom: 'auto'
                        };
                        break;
                        
                    case 'top-right':
                        minimizedPosition = {
                            position: 'fixed',
                            left: 'auto',
                            right: settings.minimizeOffset + 'px',
                            top: settings.minimizeOffset + 'px',
                            bottom: 'auto'
                        };
                        break;
                        
                    case 'bottom-left':
                    default:
                        minimizedPosition = {
                            position: 'fixed',
                            left: settings.minimizeOffset + 'px',
                            right: 'auto',
                            top: 'auto',
                            bottom: settings.minimizeOffset + 'px'
                        };
                        break;
                }
            }
            
            if (settings.animate) {
                setTransitionDuration(settings.animate);
                
                // Detach content to avoid rendering it when minimized
                detachedContent = contentContainer.children();
                if (detachedContent.nodes && detachedContent.nodes.length > 0) {
                    windowElement.data('detached-content', detachedContent.detach());
                }
                
                // First animate the height to collapse
                const currentHeight = windowElement.height();
                const titlebarHeight = parseInt(getComputedStyle(titlebar.nodes[0]).height, 10);
                
                windowElement.css({
                    height: titlebarHeight + 'px'
                });
                
                // Then apply minimized class and position
                setTimeout(() => {
                    windowElement.addClass(Container.windowClasses.window_minimized);
                    windowElement.css(minimizedPosition);
                    resetTransition();
                }, settings.animate / 2);
            } else {
                // Non-animated version
                detachedContent = contentContainer.children();
                if (detachedContent.nodes && detachedContent.nodes.length > 0) {
                    windowElement.data('detached-content', detachedContent.detach());
                }
                
                windowElement.addClass(Container.windowClasses.window_minimized);
                windowElement.css(minimizedPosition);
                isAnimating = false;
            }
            
            // Update maximize button icon
            const maximizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_maximize);
            if (maximizeButtons.length) {
                for (let i = 0; i < maximizeButtons.length; i++) {
                    maximizeButtons[i].innerHTML = '';
                    const iconElement = Container.prototype.Icon('window-full');
                    iconElement.addClass(Container.windowClasses.window_button_icon);
                    maximizeButtons[i].appendChild(iconElement.nodes[0]);
                }
            }
        } else {
            // Restoring from minimized state
            if (settings.animate) {
                setTransitionDuration(settings.animate);
                
                // Reset position but stay as fixed
                windowElement.css({
                    position: 'fixed',
                    left: previousState.x + 'px',
                    top: previousState.y + 'px',
                    right: 'auto',
                    bottom: 'auto',
                    margin: '0'
                });
                
                // Remove minimized class
                windowElement.removeClass(Container.windowClasses.window_minimized);
                
                // Animate to full height
                windowElement.css({
                    height: previousState.height + 'px'
                });
                
                // Re-append to body if it was minimized to a container
                if (settings.minimizeContainer) {
                    document.body.appendChild(windowElement.nodes[0]);
                }
                
                // Re-attach content after height animation
                setTimeout(() => {
                    const savedContent = windowElement.data('detached-content');
                    if (savedContent) {
                        contentContainer.append(savedContent);
                        windowElement.removeData('detached-content');
                    }
                    
                    resetTransition();
                }, settings.animate / 2);
            } else {
                // Non-animated version
                windowElement.removeClass(Container.windowClasses.window_minimized);
                windowElement.css({
                    position: 'fixed',
                    left: previousState.x + 'px',
                    top: previousState.y + 'px',
                    right: 'auto',
                    bottom: 'auto',
                    margin: '0',
                    height: previousState.height + 'px',
                    width: previousState.width + 'px'
                });
                
                if (settings.minimizeContainer) {
                    document.body.appendChild(windowElement.nodes[0]);
                }
                
                const savedContent = windowElement.data('detached-content');
                if (savedContent) {
                    contentContainer.append(savedContent);
                    windowElement.removeData('detached-content');
                }
                
                isAnimating = false;
            }
        }
    }
    
    
    function toggleMaximize() {
        if (isAnimating) return;
        isAnimating = true;
        
        isMaximized = !isMaximized;
        
        if (isMaximized) {
            
            if (!isMinimized) {
                previousState.width = windowElement.width();
                previousState.height = windowElement.height();
                previousState.x = parseInt(windowElement.css('left'), 10);
                previousState.y = parseInt(windowElement.css('top'), 10);
            } else {
                
                windowElement.removeClass(Container.windowClasses.window_minimized);
                
                
                if (previousState.width < settings.minWidth) {
                    previousState.width = settings.width;
                    previousState.height = settings.height;
                    const position = calculateInitialPosition();
                    previousState.x = position.left;
                    previousState.y = position.top;
                }
            }
            
            if (settings.animate) {
                
                setTransitionDuration(settings.animate);
                
                
                windowElement.css({
                    position: 'fixed',
                    top: previousState.y + 'px',
                    left: previousState.x + 'px',
                    width: previousState.width + 'px',
                    height: previousState.height + 'px'
                });
                
                
                void windowElement.nodes[0].offsetWidth;
                
                
                windowElement.css({
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    borderRadius: '0'
                });
                
                
                setTimeout(() => {
                    windowElement.addClass(Container.windowClasses.window_maximized);
                    resetTransition();
                }, settings.animate);
            } else {
                windowElement.addClass(Container.windowClasses.window_maximized);
                isAnimating = false;
            }
            
            
            const maximizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_maximize);
            if (maximizeButtons.length) {
                for (let i = 0; i < maximizeButtons.length; i++) {
                    maximizeButtons[i].innerHTML = '';
                    const iconElement = Container.prototype.Icon('window-windowed');
                    iconElement.addClass(Container.windowClasses.window_button_icon);
                    maximizeButtons[i].appendChild(iconElement.nodes[0]);
                }
            }
        } else {
            if (settings.animate) {
                
                windowElement.removeClass(Container.windowClasses.window_maximized);
                
                
                setTransitionDuration(settings.animate);
                
                
                windowElement.css({
                    position: 'fixed',
                    top: previousState.y + 'px',
                    left: previousState.x + 'px',
                    width: previousState.width + 'px',
                    height: previousState.height + 'px',
                    borderRadius: '4px' 
                });
                
                resetTransition();
            } else {
                windowElement.removeClass(Container.windowClasses.window_maximized);
                windowElement.css({
                    position: 'fixed',
                    width: previousState.width + 'px',
                    height: previousState.height + 'px',
                    left: previousState.x + 'px',
                    top: previousState.y + 'px',
                    borderRadius: '4px'
                });
                isAnimating = false;
            }
            
            
            const maximizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_maximize);
            if (maximizeButtons.length) {
                for (let i = 0; i < maximizeButtons.length; i++) {
                    maximizeButtons[i].innerHTML = '';
                    const iconElement = Container.prototype.Icon('window-full');
                    iconElement.addClass(Container.windowClasses.window_button_icon);
                    maximizeButtons[i].appendChild(iconElement.nodes[0]);
                }
            }
        }
    }
    
    
    function closeWindow() {
        if (isAnimating) return;
        
        const savedContent = windowElement.data('detached-content');
        if (savedContent) {
            windowElement.removeData('detached-content');
        }
        
        if (settings.animate) {
            isAnimating = true;
            
            
            setTransitionDuration(settings.animate);
            windowElement.css({
                opacity: '0',
                transform: 'scale(0.90)'
            });
            
            
            setTimeout(() => {
                
                if (windowElement.nodes[0]._resizeHandler) {
                    window.removeEventListener('resize', windowElement.nodes[0]._resizeHandler);
                    windowElement.nodes[0]._resizeHandler = null;
                }
                
                
                const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
                if (windowIndex !== -1) {
                    Container.openWindows.splice(windowIndex, 1);
                    
                    updateZIndices();
                }
                
                windowElement.remove();
                isOpen = false;
            }, settings.animate);
        } else {
            
            if (windowElement.nodes[0]._resizeHandler) {
                window.removeEventListener('resize', windowElement.nodes[0]._resizeHandler);
                windowElement.nodes[0]._resizeHandler = null;
            }
            
            
            const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
            if (windowIndex !== -1) {
                Container.openWindows.splice(windowIndex, 1);
                
                updateZIndices();
            }
            
            windowElement.remove();
            isOpen = false;
        }
    }
    
    
    function handleWindowResize() {
        if (isMaximized) {
            
            return;
        }
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const currentWidth = windowElement.width();
        const currentHeight = windowElement.height();
        let currentLeft = parseInt(windowElement.css('left'), 10);
        let currentTop = parseInt(windowElement.css('top'), 10);
        let needsUpdate = false;
        
        
        if (currentWidth > viewportWidth) {
            
            windowElement.css('width', viewportWidth + 'px');
            previousState.width = viewportWidth;
            needsUpdate = true;
        }
        
        if (currentHeight > viewportHeight) {
            
            windowElement.css('height', viewportHeight + 'px');
            previousState.height = viewportHeight;
            needsUpdate = true;
        }
        
        
        if (currentLeft + currentWidth > viewportWidth) {
            currentLeft = Math.max(0, viewportWidth - currentWidth);
            needsUpdate = true;
        }
        
        if (currentTop + currentHeight > viewportHeight) {
            currentTop = Math.max(0, viewportHeight - currentHeight);
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            windowElement.css({
                left: currentLeft + 'px',
                top: currentTop + 'px'
            });
            
            
            previousState.x = currentLeft;
            previousState.y = currentTop;
        }
    }
    
    function setupWindowResizeHandler() {
        
        function resizeHandler() {
            handleWindowResize();
        }
        
        
        windowElement.nodes[0]._resizeHandler = resizeHandler;
        
        
        window.addEventListener('resize', resizeHandler);
    }
    
    
    const windowAPI = {
        Open: function() {
            if (!isOpen) {
                document.body.appendChild(windowElement.nodes[0]);
                setInitialPositionAndSize(); // This now uses fixed positioning
                
                if (settings.animate) {
                    
                    windowElement.css({
                        opacity: '0',
                        transform: 'scale(0.90)'
                    });
                    
                    
                    void windowElement.nodes[0].offsetWidth;
                    
                    
                    isAnimating = true;
                    setTransitionDuration(settings.animate);
                    windowElement.css({
                        opacity: '1',
                        transform: 'scale(1)'
                    });
                    
                    resetTransition();
                }
                
                setupDraggable();
                setupResizable();
                setupControls();
                setupWindowResizeHandler();
                isOpen = true;
                bringToFront();
            } else {
                windowElement.show();
                bringToFront();
            }
            return this;
        },
        
        Close: function() {
            closeWindow();
            return this;
        },
        
        Content: function(content) {
            if (content === undefined) {
                return contentContainer.html();
            }
            
            contentContainer.empty();
            
            if (typeof content === 'string') {
                contentContainer.html(content);
            } else if (content instanceof Element || content instanceof Q) {
                contentContainer.append(content);
            }
            
            return this;
        },
        
        Title: function(title) {
            if (title === undefined) {
                return titleElement.text();
            }
            
            titleElement.text(title);
            return this;
        },
        
        Position: function(x, y) {
            if (x === undefined || y === undefined) {
                return {
                    x: parseInt(windowElement.css('left'), 10),
                    y: parseInt(windowElement.css('top'), 10)
                };
            }
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = windowElement.width();
            const windowHeight = windowElement.height();
            
            
            let left = typeof x === 'string' && x.endsWith('%') 
                ? (viewportWidth * parseInt(x, 10) / 100) - (windowWidth / 2)
                : x;
                
            let top = typeof y === 'string' && y.endsWith('%')
                ? (viewportHeight * parseInt(y, 10) / 100) - (windowHeight / 2)
                : y;
            
            
            left = Math.max(0, Math.min(left, viewportWidth - windowWidth));
            top = Math.max(0, Math.min(top, viewportHeight - windowHeight));
            
            windowElement.css({
                left: left + 'px',
                top: top + 'px'
            });
            
            
            previousState.x = left;
            previousState.y = top;
            
            return this;
        },
        
        Size: function(width, height) {
            if (width === undefined || height === undefined) {
                return {
                    width: windowElement.width(),
                    height: windowElement.height()
                };
            }
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let currentLeft = parseInt(windowElement.css('left'), 10);
            let currentTop = parseInt(windowElement.css('top'), 10);
            
            
            width = Math.max(settings.minWidth, width);
            height = Math.max(settings.minHeight, height);
            
            
            if (currentLeft + width > viewportWidth) {
                currentLeft = Math.max(0, viewportWidth - width);
                windowElement.css('left', currentLeft + 'px');
                previousState.x = currentLeft;
            }
            
            if (currentTop + height > viewportHeight) {
                currentTop = Math.max(0, viewportHeight - height);
                windowElement.css('top', currentTop + 'px');
                previousState.y = currentTop;
            }
            
            windowElement.css({
                width: width + 'px',
                height: height + 'px'
            });
            
            
            previousState.width = width;
            previousState.height = height;
            
            return this;
        },
        
        Minimize: function() {
            if (!isMinimized) {
                toggleMinimize();
            }
            return this;
        },
        
        Maximize: function() {
            if (!isMaximized) {
                toggleMaximize();
            }
            return this;
        },
        
        Restore: function() {
            if (isMinimized) {
                toggleMinimize();
            } else if (isMaximized) {
                toggleMaximize();
            }
            return this;
        },
        
        IsMinimized: function() {
            return isMinimized;
        },
        
        IsMaximized: function() {
            return isMaximized;
        },
        
        IsOpen: function() {
            return isOpen;
        },
        
        Element: function() {
            return windowElement;
        },
        
        
        BringToFront: function() {
            bringToFront();
            return this;
        },
        
        MinimizePosition: function(position, container, offset) {
            if (position === undefined) {
                return {
                    position: settings.minimizePosition,
                    container: settings.minimizeContainer,
                    offset: settings.minimizeOffset
                };
            }
            
            if (position) {
                settings.minimizePosition = position;
            }
            
            if (container !== undefined) {
                settings.minimizeContainer = container;
            }
            
            if (offset !== undefined) {
                settings.minimizeOffset = offset;
            }
            
            
            if (isMinimized) {
                toggleMinimize();
                toggleMinimize();
            }
            
            return this;
        },
        
        
        Animation: function(duration) {
            if (duration === undefined) {
                return settings.animate;
            }
            
            settings.animate = parseInt(duration) || 0;
            return this;
        }
    };
    
    
    this.elements.push(windowAPI);
    return windowAPI;
};
