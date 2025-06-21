Container.prototype.Window = function (options = {}) {

    const defaultOptions = {
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
        animate: 150,
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        shadowSpread: 0,
    };

    if (!Container.windowClassesInitialized) {
        Container.windowClasses = Q.style(`
            --window-bg-color:rgb(37, 37, 37);
            --window-shadow-color: rgba(0, 0, 0, 0.1);
            --window-titlebar-bg:rgb(17, 17, 17);
            --window-titlebar-text: #ffffff;
            --window-button-bg:rgb(17, 17, 17);
            --window-button-hover-bg: #777777;
            --window-button-text: #ffffff;
            --window-close-color: #e74c3c;
            --window-titlebar-height: 28px; /* Add fixed titlebar height */
            --window-container-border: 1px solid rgba(255,255,255,0.1);
        `, `
            .window_container {
                position: fixed; /* Change from absolute to fixed */
                min-width: 200px;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 1000;
                transition-property: opacity, transform, width, height, top, left;
                transition-timing-function: ease-out;
                outline: var(--window-container-border);
            }
            .window_container.window_active {
                box-shadow: 0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 8px 0 rgba(0,0,0,0.25);
            }
            .window_container:not(.window_active) {
                box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);
            }
            .window_titlebar.window_inactive {
                background-color: #333 !important;
            }
            .window_titlebar {
                color: var(--window-titlebar-text);
                background-color: var(--window-titlebar-bg);
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
                text-shadow: 0px 1px 5px rgba(0, 0, 0, 1.0);
            }
            .window_controls {
                display: flex;
                height:100%;
            }
            .window_button {
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
                display: none !important; /* Ensure it really does not appear */
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
            .window_taskbar_btn {
            user-select: none;
                min-width: 100px;
                max-width: 220px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background: #222;
                margin-right: 1px;
                outline: none;
                color: #fff;
                border-radius: 4px;
                padding: 0 12px;
                height: 28px;
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 13px;
                box-sizing: border-box;
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
            'window_button_icon': 'window_button_icon',
            'window_taskbar_btn': 'window_taskbar_btn'
        }, false);
        Container.windowClassesInitialized = true;
    }


    if (!Container.taskbar) {

        let taskbarStyle = {
            position: 'fixed',
            height: '32px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            maxWidth: '100vw',
            minHeight: '0',
            minWidth: '0'
        };

        switch (defaultOptions.minimizePosition || 'bottom-left') {
            case 'bottom-right':
                taskbarStyle.right = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.bottom = defaultOptions.minimizeOffset + 'px';
                break;
            case 'top-left':
                taskbarStyle.left = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.top = defaultOptions.minimizeOffset + 'px';
                break;
            case 'top-right':
                taskbarStyle.right = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.top = defaultOptions.minimizeOffset + 'px';
                break;
            case 'bottom-left':
            default:
                taskbarStyle.left = defaultOptions.minimizeOffset + 'px';
                taskbarStyle.bottom = defaultOptions.minimizeOffset + 'px';
                break;
        }
        Container.taskbar = Q('<div>', { class: Container.windowClasses.window_taskbar || 'window_taskbar' }).css(taskbarStyle);
        Q('body').append(Container.taskbar);
    }

    const settings = Object.assign({}, defaultOptions, options);
    const windowElement = Q('<div>', { class: Container.windowClasses.window_container });

    if (settings.shadow) {
        windowElement.css({
            boxShadow: `${settings.shadowOffsetX}px ${settings.shadowOffsetY}px ${settings.shadowBlur}px ${settings.shadowSpread}px ${settings.shadowColor}`
        });
    } else {
        windowElement.css({ boxShadow: 'none' });
    }


    const titlebar = Q('<div>', { class: Container.windowClasses.window_titlebar });


    const titleElement = Q('<div>', { class: Container.windowClasses.window_title }).text(settings.title);
    const controls = Q('<div>', { class: Container.windowClasses.window_controls });
    const contentContainer = Q('<div>', { class: Container.windowClasses.window_content });
    // Button visibility according to options
    if (settings.minimizable && settings.maximizable) {
        const minimizeButton = Q('<div>', {
            class: Container.windowClasses.window_button + ' ' + Container.windowClasses.window_minimize
        });
        minimizeButton.append(this.Icon('window-minimize').addClass(Container.windowClasses.window_button_icon));
        controls.append(minimizeButton);
    }
    if (settings.minimizable && settings.maximizable) {
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


    let taskbarButton = null;

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
            position: 'fixed',
            width: settings.width + 'px',
            height: settings.height + 'px',
            left: position.left + 'px',
            top: position.top + 'px',
            zIndex: settings.zIndex
        });
        previousState.x = position.left;
        previousState.y = position.top;
    }
    function updateActiveWindowClass() {
        const allWindows = document.querySelectorAll('.' + Container.windowClasses.window_container);
        let maxZ = -Infinity, activeWindow = null;
        allWindows.forEach(win => {
            const z = parseInt(win.style.zIndex || window.getComputedStyle(win).zIndex, 10) || 0;
            if (z > maxZ) {
                maxZ = z;
                activeWindow = win;
            }
        });
        allWindows.forEach(win => {
            const tb = win.querySelector('.' + Container.windowClasses.window_titlebar);
            if (!tb) return;
            if (win === activeWindow) {
                win.classList.add('window_active');
                tb.classList.remove('window_inactive');
            } else {
                win.classList.remove('window_active');
                tb.classList.add('window_inactive');
            }
        });
    }
    function bringToFront() {
        const windowIndex = Container.openWindows.indexOf(windowElement.nodes[0]);
        if (windowIndex !== -1) {
            Container.openWindows.splice(windowIndex, 1);
        }
        Container.openWindows.push(windowElement.nodes[0]);
        updateZIndices();
        setTimeout(updateActiveWindowClass, 0);
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


        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            if (isMinimized) {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const minWidth = windowElement.width();
                const minHeight = windowElement.height();
                const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - minWidth));
                const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - minHeight));
                windowElement.css({
                    left: constrainedLeft + 'px',
                    top: constrainedTop + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
                return;
            }
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = windowElement.width();
            const windowHeight = windowElement.height();
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
        }
        function onMouseUp() {
            isDragging = false;
            Q(document).off('mousemove', onMouseMove);
            Q(document).off('mouseup', onMouseUp);
        }

        Q(titlebar).on('mousedown', function (e) {
            if (isMaximized || isMinimized) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(windowElement.css('left'), 10);
            startTop = parseInt(windowElement.css('top'), 10);
            bringToFront();
            Q(document).on('mousemove', onMouseMove);
            Q(document).on('mouseup', onMouseUp);
            e.preventDefault();
        });

        Q(titlebar).on('dblclick', function (e) {
            if (settings.maximizable) {
                toggleMaximize();
            }
        });
    }
    function setupResizable() {
        if (!settings.resizable) return;
        let isResizing = false;
        let resizeDirection = '';
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        const resizeHandles = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_resize_handle);

        function onMouseMove(e) {
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
        }
        function onMouseUp() {
            isResizing = false;
            Q(document).off('mousemove', onMouseMove);
            Q(document).off('mouseup', onMouseUp);
        }

        for (let i = 0; i < resizeHandles.length; i++) {
            const handle = resizeHandles[i];
            Q(handle).on('mousedown', function (e) {
                if (isMaximized || isMinimized) return;
                isResizing = true;
                resizeDirection = this.getAttribute('data-resize');
                startX = e.clientX;
                startY = e.clientY;
                startWidth = windowElement.width();
                startHeight = windowElement.height();
                startLeft = parseInt(windowElement.css('left'), 10);
                startTop = parseInt(windowElement.css('top'), 10);
                windowElement.css('zIndex', settings.zIndex + 10);
                Q(document).on('mousemove', onMouseMove);
                Q(document).on('mouseup', onMouseUp);
                e.preventDefault();
                e.stopPropagation();
            });
        }
    }
    function setupControls() {
        const minimizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_minimize);
        if (minimizeButtons.length) {
            for (let i = 0; i < minimizeButtons.length; i++) {
                Q(minimizeButtons[i]).on('click', function () {
                    bringToFront();
                    toggleMinimize();
                });
            }
        }
        const maximizeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_maximize);
        if (maximizeButtons.length) {
            for (let i = 0; i < maximizeButtons.length; i++) {
                Q(maximizeButtons[i]).on('click', function () {
                    bringToFront();
                    toggleMaximize();
                });
            }
        }
        const closeButtons = windowElement.nodes[0].querySelectorAll('.' + Container.windowClasses.window_close);
        if (closeButtons.length) {
            for (let i = 0; i < closeButtons.length; i++) {
                Q(closeButtons[i]).on('click', function () {
                    closeWindow();
                });
            }
        }
        Q(contentContainer).on('mousedown', function () {
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
        if (!isMinimized) {

            const rect = windowElement.nodes[0].getBoundingClientRect();
            const start = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
                opacity: 1
            };

            let taskbarRect = { left: 0, top: window.innerHeight, width: 160, height: 28 };
            if (Container.taskbar && taskbarButton) {
                const btnRect = taskbarButton.nodes[0].getBoundingClientRect();
                taskbarRect = {
                    left: btnRect.left,
                    top: btnRect.top,
                    width: btnRect.width,
                    height: btnRect.height
                };
            } else if (Container.taskbar) {
                const barRect = Container.taskbar.nodes[0].getBoundingClientRect();
                taskbarRect.left = barRect.left;
                taskbarRect.top = barRect.top;
            }

            windowElement.css({
                willChange: 'width,height,left,top,opacity',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`
            });
            windowElement.css({
                width: start.width + 'px',
                height: start.height + 'px',
                left: start.left + 'px',
                top: start.top + 'px',
                opacity: 1
            });

            setTimeout(() => {
                windowElement.css({
                    width: taskbarRect.width + 'px',
                    height: taskbarRect.height + 'px',
                    left: taskbarRect.left + 'px',
                    top: taskbarRect.top + 'px',
                    opacity: 0.2
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });

                if (!taskbarButton) {
                    let shortTitle = settings.title;
                    if (shortTitle.length > 18) {
                        shortTitle = shortTitle.slice(0, 15) + '...';
                    }
                    taskbarButton = Q('<div>', { class: Container.windowClasses.window_taskbar_btn, text: shortTitle });
                    taskbarButton.on('click', function () {
                        toggleMinimize();
                    });
                    if (settings.minimizePosition === 'bottom-left' || settings.minimizePosition === 'top-left') {
                        Q(Container.taskbar).prepend(taskbarButton);
                    } else {
                        Q(Container.taskbar).append(taskbarButton);
                    }
                }
                windowElement.detach();
                isMinimized = true;
                isAnimating = false;
                setTimeout(updateActiveWindowClass, 0);
            }, settings.animate + 10);
        } else {


            Q('body').append(windowElement);

            let btnRect = { left: 0, top: window.innerHeight, width: 160, height: 28 };
            if (taskbarButton) {
                const rect = taskbarButton.nodes[0].getBoundingClientRect();
                btnRect = {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            }

            const end = {
                width: previousState.width,
                height: previousState.height,
                left: previousState.x,
                top: previousState.y,
                opacity: 1
            };
            windowElement.css({
                willChange: 'width,height,left,top,opacity',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`,
                width: btnRect.width + 'px',
                height: btnRect.height + 'px',
                left: btnRect.left + 'px',
                top: btnRect.top + 'px',
                opacity: 0.2,
                display: ''
            });
            setTimeout(() => {
                windowElement.css({
                    width: end.width + 'px',
                    height: end.height + 'px',
                    left: end.left + 'px',
                    top: end.top + 'px',
                    opacity: 1
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                if (taskbarButton) {
                    taskbarButton.remove();
                    taskbarButton = null;
                }
                isMinimized = false;
                bringToFront();
                isAnimating = false;
                setTimeout(updateActiveWindowClass, 0);
            }, settings.animate + 10);
        }
    }
    function toggleMaximize() {
        if (isAnimating) return;
        isAnimating = true;
        if (!isMaximized) {

            const rect = windowElement.nodes[0].getBoundingClientRect();
            const start = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top
            };
            windowElement.css({
                willChange: 'width,height,left,top',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`,
                width: start.width + 'px',
                height: start.height + 'px',
                left: start.left + 'px',
                top: start.top + 'px'
            });
            setTimeout(() => {
                windowElement.addClass(Container.windowClasses.window_maximized);
                windowElement.css({
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    borderRadius: 0
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                isMaximized = true;
                previousState.width = start.width;
                previousState.height = start.height;
                previousState.x = start.left;
                previousState.y = start.top;
                isAnimating = false;
                setTimeout(updateActiveWindowClass, 0);
            }, settings.animate + 10);
        } else {

            const end = {
                width: previousState.width,
                height: previousState.height,
                left: previousState.x,
                top: previousState.y
            };
            windowElement.removeClass(Container.windowClasses.window_maximized);
            windowElement.css({
                willChange: 'width,height,left,top',
                transition: `all ${settings.animate}ms cubic-bezier(.4,0,.2,1)`,
                width: '100vw',
                height: '100vh',
                left: 0,
                top: 0,
                borderRadius: '0'
            });
            setTimeout(() => {
                windowElement.css({
                    width: end.width + 'px',
                    height: end.height + 'px',
                    left: end.left + 'px',
                    top: end.top + 'px',
                    borderRadius: '4px'
                });
            }, 10);
            setTimeout(() => {
                windowElement.css({ transition: '', willChange: '' });
                isMaximized = false;
                isAnimating = false;
                setTimeout(updateActiveWindowClass, 0);
            }, settings.animate + 10);
        }
    }
    function closeWindow() {
        if (isAnimating) return;
        if (taskbarButton) {
            taskbarButton.remove();
            taskbarButton = null;
        }
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
                setTimeout(updateActiveWindowClass, 0);
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
            setTimeout(updateActiveWindowClass, 0);
        }

        setTimeout(function () {

            const selector = '.' + (Container.windowClasses.window_container || 'window_container');
            if (!Q(selector).nodes.length) {
                if (Container.taskbar) {
                    Q(Container.taskbar).remove();
                    Container.taskbar = null;
                }
            }
        }, 0);
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
        Open: function () {
            if (!isOpen) {
                Q('body').append(windowElement);
                setInitialPositionAndSize();
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
                setTimeout(updateActiveWindowClass, 0);
            } else {
                windowElement.show();
                bringToFront();
                setTimeout(updateActiveWindowClass, 0);
            }
            return this;
        },
        Close: function () {
            closeWindow();
            setTimeout(updateActiveWindowClass, 0);
            return this;
        },
        Content: function (content) {
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
        Title: function (title) {
            if (title === undefined) {
                return titleElement.text();
            }
            titleElement.text(title);
            return this;
        },
        Position: function (x, y) {
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
        Size: function (width, height) {
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
        Minimize: function () {
            if (!isMinimized) {
                toggleMinimize();
            }
            return this;
        },
        Maximize: function () {
            if (!isMaximized) {
                toggleMaximize();
            }
            return this;
        },
        Restore: function () {
            if (isMinimized) {
                toggleMinimize();
            } else if (isMaximized) {
                toggleMaximize();
            }
            return this;
        },
        IsMinimized: function () {
            return isMinimized;
        },
        IsMaximized: function () {
            return isMaximized;
        },
        IsOpen: function () {
            return isOpen;
        },
        Element: function () {
            return windowElement;
        },
        BringToFront: function () {
            bringToFront();
            return this;
        },
        MinimizePosition: function (position, container, offset) {
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
        Animation: function (duration) {
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
