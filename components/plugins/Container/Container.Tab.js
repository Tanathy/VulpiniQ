Q.Container.Tab = function (options = {}) {
    const Container = Q.Container();
    const Icon = Container.Icon;
    const sharedClasses = Container.classes;
    
    // Define Tab-specific styles
    const classes = Object.assign({}, sharedClasses, Q.style(`
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
    `, {
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
        'tab_disabled': 'tab_disabled'
    }));

    return function (data, horizontal = true) {
        let wrapper = Q('<div>', { class: classes.tab_container });
        let tabs_wrapper = Q('<div>', { class: classes.tab_navigation_header });
        let tabs_nav_left = Q('<div>', { class: classes.tab_navigation_buttons });
        let tabs_nav_right = Q('<div>', { class: classes.tab_navigation_buttons });
        let tabs = Q('<div>', { class: classes.tab_navigation_tabs });

        tabs_wrapper.append(tabs_nav_left, tabs, tabs_nav_right);

        let content = Q('<div>');
        wrapper.append(tabs_wrapper, content);
        if (!horizontal) {
            wrapper.addClass(classes.tab_container_vertical);
            tabs.addClass(classes.tab_navigation_tabs_vertical);
            tabs_wrapper.addClass(classes.tab_navigation_header_vertical);
            tabs_nav_left.addClass(classes.tab_navigation_buttons_vertical);
            tabs_nav_right.addClass(classes.tab_navigation_buttons_vertical);
            tabs_nav_left.append(Icon('arrow-up'));
            tabs_nav_right.append(Icon('arrow-down'));
        }
        else {
            tabs_nav_left.append(Icon('arrow-left'));
            tabs_nav_right.append(Icon('arrow-right'));
        }

        let data_tabs = {};
        let data_contents = {};

        data.forEach((item) => {
            const tab = Q('<div>', { class: classes.tab, 'data-value': item.value }).text(item.title);
            if (item.disabled) {
                tab.addClass(classes.tab_disabled);
            }

            data_tabs[item.value] = tab;
            data_contents[item.value] = item.content;

            tab.on('click', function () {
                if (item.disabled) {
                    return;
                }

                let foundTabs = tabs.find('.' + classes.tab_active);

                if (foundTabs) {
                    foundTabs.removeClass(classes.tab_active);
                }

                tab.addClass(classes.tab_active);
                content.html(data_contents[item.value]);
            });
            tabs.append(tab);
        });

        tabs_nav_left.on('click', function () {
            if (!horizontal) {
                tabs.scrollTop(-tabs.height(), true);
            } else {
                tabs.scrollLeft(-tabs.width(), true);
            }
        });

        tabs_nav_right.on('click', function () {
            if (!horizontal) {
                tabs.scrollTop(tabs.height(), true);
            } else {
                tabs.scrollLeft(tabs.width(), true);
            }
        });

        wrapper.select = function (value) {
            Object.keys(data_tabs).forEach(key => {
                if (data_tabs[key].data('value') === value) {
                    data_tabs[key].click();
                }
            });
        };

        wrapper.disabled = function (value, state) {
            if (data_tabs[value]) {
                if (state) {
                    data_tabs[value].addClass(classes.tab_disabled);
                } else {
                    data_tabs[value].removeClass(classes.tab_disabled);
                }
            }
        };

        return wrapper;
    };
};
