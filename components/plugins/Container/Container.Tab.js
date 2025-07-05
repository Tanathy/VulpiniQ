Container.prototype.Tab = function(data, horizontal = true) {
    if (!Container.tabClassesInitialized) {
        Container.tabClasses = Q.style('', `
            .tab_navigation_buttons {
                box-sizing: border-box;
                width: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
            }
            .tab_navigation_buttons_vertical {
                width: auto;
                height: 20px;
            }
            .tab_navigation_buttons:hover {
                background-color: var(--form-default-background-hover);
            }
            .tab_container {
                width: 100%;
                min-height: 300px;
            }
            .tab_container_vertical {
                display: flex;
            }
            .tab_navigation_header {
                background-color: var(--form-default-background);
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
                background-color: var(--form-default-accent-color);
                color: var(--form-default-accent-text-color);
                color: #fff;
            }
            .tab {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: default;
                padding: var(--form-default-padding);
                font-size: var(--form-default-font-size);
                white-space: nowrap;     /* prevent text wrap */
            }
            .tab_disabled {
                background-color: var(--form-default-background-disabled);
                color: var(--form-default-text-color-disabled);
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
    const wrapper = Q('<div>', { class: Container.tabClasses.tab_container });
    const header = Q('<div>', { class: Container.tabClasses.tab_navigation_header });
    const prevBtn = Q('<div>', { class: Container.tabClasses.tab_navigation_buttons });
    const nextBtn = Q('<div>', { class: Container.tabClasses.tab_navigation_buttons });
    const tabs = Q('<div>', { class: Container.tabClasses.tab_navigation_tabs });
    const contentContainer = Q('<div>', { class: Container.tabClasses.tab_content_container });
    if (!horizontal) {
        wrapper.addClass(Container.tabClasses.tab_container_vertical);
        header.addClass(Container.tabClasses.tab_navigation_header_vertical);
        tabs.addClass(Container.tabClasses.tab_navigation_tabs_vertical);
        prevBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        nextBtn.addClass(Container.tabClasses.tab_navigation_buttons_vertical);
        prevBtn.html('▲');
        nextBtn.html('▼');
    } else {
        prevBtn.html('◀');
        nextBtn.html('▶');
    }
    header.append(prevBtn, tabs, nextBtn);
    wrapper.append(header, contentContainer);
    function updateNavButtons() {
        const el = tabs.nodes[0];
        const hasOverflow = horizontal
            ? el.scrollWidth > el.clientWidth
            : el.scrollHeight > el.clientHeight;
        const disp = hasOverflow ? 'flex' : 'none';
        prevBtn.css('display', disp);
        nextBtn.css('display', disp);
    }
    const data_tabs = {};
    const data_contents = {};
    let activeTab = null;
    prevBtn.off('click').on('click', () => {
        const scrollAmount = horizontal ? tabs.width() : tabs.height();
        const el = tabs.nodes[0];
        if (el && el.scrollBy) {
            el.scrollBy({
                left: horizontal ? -scrollAmount : 0,
                top:  horizontal ? 0 : -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            horizontal ? tabs.scrollLeft(-scrollAmount, true)
                       : tabs.scrollTop(-scrollAmount, true);
        }
    });
    nextBtn.off('click').on('click', () => {
        const scrollAmount = horizontal ? tabs.width() : tabs.height();
        const el = tabs.nodes[0];
        if (el && el.scrollBy) {
            el.scrollBy({
                left: horizontal ?  scrollAmount : 0,
                top:  horizontal ?  0 :  scrollAmount,
                behavior: 'smooth'
            });
        } else {
            horizontal ? tabs.scrollLeft( scrollAmount, true)
                       : tabs.scrollTop( scrollAmount, true);
        }
    });
    data.forEach(item => {
        const tab = Q('<div>', { class: Container.tabClasses.tab })
            .attr('data-value', item.value)
            .text(item.title);
        if (item.disabled) {
            tab.addClass(Container.tabClasses.tab_disabled);
        }
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
        data_tabs[item.value] = tab;
        data_contents[item.value] = content;
        tab.on('click', function() {
            // Prevent loading content if the tab has been disabled
            if (tab.hasClass(Container.tabClasses.tab_disabled)) return;
            const activeTabs = tabs.find('.' + Container.tabClasses.tab_active);
            if (activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(item.value);
        });
        tabs.append(tab);
    });
    updateNavButtons();
    function showContent(value) {
        if (!data_contents[value]) return;
        if (activeTab && data_contents[activeTab]) {
            data_contents[activeTab].detach();
        }
        activeTab = value;
        contentContainer.append(data_contents[value]);
    }
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
        const tab = Q('<div>', { class: Container.tabClasses.tab })
            .attr('data-value', tabData.value)
            .text(tabData.title);
        if (tabData.disabled) {
            tab.addClass(Container.tabClasses.tab_disabled);
        }
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
        data_tabs[tabData.value] = tab;
        data_contents[tabData.value] = content;
        tab.on('click', function() {
            // Prevent loading content if the tab has been disabled
            if (tab.hasClass(Container.tabClasses.tab_disabled)) return;
            const activeTabs = tabs.find('.' + Container.tabClasses.tab_active);
            if (activeTabs) activeTabs.removeClass(Container.tabClasses.tab_active);
            tab.addClass(Container.tabClasses.tab_active);
            showContent(tabData.value);
        });
        tabs.append(tab);
        updateNavButtons();
        return tab;
    };
    wrapper.removeTab = function(value) {
        if (data_tabs[value]) {
            data_tabs[value].remove();
            if (activeTab === value) {
                const availableTab = Object.keys(data_tabs).find(key => key !== value);
                if (availableTab) {
                    this.select(availableTab);
                } else {
                    contentContainer.empty();
                    activeTab = null;
                }
            }
            if (data_contents[value]) {
                data_contents[value].remove();
            }
            delete data_tabs[value];
            delete data_contents[value];
        }
        updateNavButtons();
        return this;
    };
    wrapper.getContent = function(value) {
        return data_contents[value] || null;
    };
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
