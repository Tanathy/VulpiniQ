Container.prototype.Tab = function(data, horizontal = true) {
    if (!Container.tabClassesInitialized) {
        Container.tabClasses = Q.style('', `
            .tab_navigation_buttons {
                box-sizing: border-box;
                width: 20px;
                background-color: #333;
                display: flex;
                justify-content: center;
                padding: 4px;
            }
            .tab_navigation_buttons_vertical {
                width: auto;
                height: 20px;
            }
            .tab_navigation_buttons:hover {
                background-color: #555;
            }
            .tab_container {
                width: 100%;
                height: 300px;
            }
            .tab_container_vertical {
                display: flex;
            }
            .tab_navigation_header {
                background-color: #333;
                display: flex;
            }
            .tab_navigation_header_vertical {
                flex-direction: column;
                width: auto;
            }
            .tab_navigation_tabs {
                user-select: none;
                display: flex;
                flex-direction: row;
                width: 100%;
                overflow: hidden;
            }
            .tab_navigation_tabs_vertical {
                flex-direction: column;
            }
            .tab_active {
                background-color: #555;
                color: #fff;
            }
            .tab {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: default;
                padding: 5px 25px;
            }
            .tab_disabled {
                background-color: #333;
                color: #555;
            }
            .tab_content {
                display: none;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
            .tab_content_active {
                display: block;
            }
            .tab_content_container {
                width: 100%;
                height: 100%;
                overflow: auto;
                position: relative;
            }
        `, null, {
            'tab_navigation_buttons': 'tab_navigation_buttons',
            'tab_navigation_buttons_vertical': 'tab_navigation_buttons_vertical',
            'tab_container': 'tab_container',
            'tab_container_vertical': 'tab_container_vertical',
            'tab_navigation_header': 'tab_navigation_header',
            'tab_navigation_header_vertical': 'tab_navigation_header_vertical',
            'tab_navigation_tabs': 'tab_navigation_tabs',
            'tab_navigation_tabs_vertical': 'tab_navigation_tabs_vertical',
            'tab_active': 'tab_active',
            'tab': 'tab',
            'tab_disabled': 'tab_disabled',
            'tab_content_container': 'tab_content_container'
        });
        Container.tabClassesInitialized = true;
    }
    // Simplified DOM structure with fewer elements
    const wrapper = Q('<div>', { class: Container.tabClasses.tab_container });
    const header = Q('<div>', { class: Container.tabClasses.tab_navigation_header });
    const prevBtn = Q('<div>', { class: Container.tabClasses.tab_navigation_buttons });
    const nextBtn = Q('<div>', { class: Container.tabClasses.tab_navigation_buttons });
    const tabs = Q('<div>', { class: Container.tabClasses.tab_navigation_tabs });
    const contentContainer = Q('<div>', { class: Container.tabClasses.tab_content_container });
    // Set vertical or horizontal layout
    if (!horizontal) {
        wrapper.addClass(Container.tabClasses.tab_container_vertical);
        header.addClass(Container.tabClasses.tab_navigation_header_vertical);
        tabs.addClass(Container.tabClasses.tab_navigation_tabs_vertical);
        prevBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        nextBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        // Add arrows
        prevBtn.append(Q('<div>', { class: 'svg_arrow-up container_icon' }));
        nextBtn.append(Q('<div>', { class: 'svg_arrow-down container_icon' }));
    } else {
        prevBtn.append(Q('<div>', { class: 'svg_arrow-left container_icon' }));
        nextBtn.append(Q('<div>', { class: 'svg_arrow-right container_icon' }));
    }
    // Assemble the DOM structure
    header.append(prevBtn, tabs, nextBtn);
    wrapper.append(header, contentContainer);
    // State management
    const data_tabs = {};
    const data_contents = {};
    let activeTab = null;
    // Add navigation functionality
    prevBtn.on('click', () => {
        const scrollAmount = horizontal ? tabs.width() : tabs.height();
        horizontal ? tabs.scrollLeft(-scrollAmount, true) : tabs.scrollTop(-scrollAmount, true);
    });
    nextBtn.on('click', () => {
        const scrollAmount = horizontal ? tabs.width() : tabs.height();
        horizontal ? tabs.scrollLeft(scrollAmount, true) : tabs.scrollTop(scrollAmount, true);
    });
    // Process tab data
    data.forEach(item => {
        // Create and configure tab
        const tab = Q('<div>', { class: Container.tabClasses.tab })
            .attr('data-value', item.value)
            .text(item.title);
        if (item.disabled) {
            tab.addClass(Container.tabClasses.tab_disabled);
        }
        // Create or prepare content (but don't add to DOM yet)
        let content;
        if (typeof item.content === 'string') {
            content = Q('<div>').html(item.content);
        } else if (item.content instanceof Element) {
            content = Q(item.content);
        } else if (item.content instanceof Q) {
            content = item.content;
        } else {
            content = Q('<div>');
        }
        // Store references
        data_tabs[item.value] = tab;
        data_contents[item.value] = content;
        // Tab click handler - activate tab and show content
        tab.on('click', function() {
            if (item.disabled) return;
            // Update active tab
            const activeTabs = tabs.find('.' + Container.tabClasses.tab_active);
            if (activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            // Switch content
            showContent(item.value);
        });
        tabs.append(tab);
    });
    // Function to show content for a specific tab
    function showContent(value) {
        if (!data_contents[value]) return;
        // If there's already active content, detach it (not remove)
        if (activeTab && data_contents[activeTab]) {
            data_contents[activeTab].detach();
        }
        // Set the new active tab and append its content
        activeTab = value;
        contentContainer.append(data_contents[value]);
    }
    // API methods
    wrapper.select = function(value) {
        const tab = data_tabs[value];
        if (tab) tab.click();
        return this;
    };
    wrapper.disabled = function(value, state) {
        const tab = data_tabs[value];
        if (tab) {
            state ? tab.addClass(Container.tabClasses.tab_disabled) : 
                  tab.removeClass(Container.tabClasses.tab_disabled);
        }
        return this;
    };
    wrapper.addTab = function(tabData) {
        if (!tabData) return null;
        // Create and configure new tab
        const tab = Q('<div>', { class: Container.tabClasses.tab })
            .attr('data-value', tabData.value)
            .text(tabData.title);
        if (tabData.disabled) {
            tab.addClass(Container.tabClasses.tab_disabled);
        }
        // Create or prepare content (but don't add to DOM yet)
        let content;
        if (typeof tabData.content === 'string') {
            content = Q('<div>').html(tabData.content);
        } else if (tabData.content instanceof Element) {
            content = Q(tabData.content);
        } else if (tabData.content instanceof Q) {
            content = tabData.content;
        } else {
            content = Q('<div>');
        }
        // Store references
        data_tabs[tabData.value] = tab;
        data_contents[tabData.value] = content;
        // Tab click handler
        tab.on('click', function() {
            if (tabData.disabled) return;
            const activeTabs = tabs.find('.' + Container.tabClasses.tab_active);
            if (activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(tabData.value);
        });
        tabs.append(tab);
        return tab;
    };
    wrapper.removeTab = function(value) {
        if (data_tabs[value]) {
            // Remove tab element
            data_tabs[value].remove();
            // If this is the active tab, find another tab to activate
            if (activeTab === value) {
                // Find first available tab
                const availableTab = Object.keys(data_tabs).find(key => key !== value);
                if (availableTab) {
                    this.select(availableTab);
                } else {
                    // No tabs left, clear content
                    contentContainer.empty();
                    activeTab = null;
                }
            }
            // Remove content and references
            if (data_contents[value]) {
                data_contents[value].remove();
            }
            delete data_tabs[value];
            delete data_contents[value];
        }
        return this;
    };
    // Add direct access to content elements
    wrapper.getContent = function(value) {
        return data_contents[value] || null;
    };
    // Method to update content without replacing it
    wrapper.updateContent = function(value, newContent) {
        if (!data_contents[value]) return this;
        if (typeof newContent === 'string') {
            data_contents[value].html(newContent);
        } else if (newContent instanceof Element || newContent instanceof Q) {
            data_contents[value].empty().append(newContent);
        }
        return this;
    };
    this.elements.push(wrapper);
    return wrapper;
};
