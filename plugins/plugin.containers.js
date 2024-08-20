Q.Container = function () {



    return {
        Tab: function (data, horizontal = true) {

            let wrapper = Q('<div class="q_tabcontainer">');
            let tabs_wrapper = Q('<div class="q_tabs_wrapper">');
            let tabs_nav_left = Q('<div class="q_tabs_nav q_tabs_nav_left">');
            let tabs_nav_right = Q('<div class="q_tabs_nav q_tabs_nav_right">');
            let tabs = Q('<div class="q_tabs">');
            tabs_wrapper.append(tabs_nav_left, tabs, tabs_nav_right);
            let content = Q('<div class="q_tabcontent">');
            wrapper.append(tabs_wrapper, content);

            if (!horizontal) {
                wrapper.addClass('q_tc_vertical');
                tabs.addClass('q_tabs_vertical');
                tabs_wrapper.addClass('q_tabs_wrapper_vertical');
                tabs_nav_left.addClass('q_tabs_nav_vertical');
                tabs_nav_right.addClass('q_tabs_nav_vertical');
            }

            let data_tabs = {};
            let data_contents = {};

            data.forEach((item, index) => {
                const tab = Q(`<div class="q_tab" data-value="${item.value}">${item.title}</div>`);
                if (item.disabled) {
                    tab.addClass('q_form_disabled');
                }

                data_tabs[item.value] = tab;
                data_contents[item.value] = item.content;

                tab.on('click', function () {

                    if (item.disabled) {
                        return;
                    }

                    let foundTabs = tabs.find('.q_tab_active');

                    if (foundTabs) {
                        foundTabs.removeClass('q_tab_active');
                    }

                    tab.addClass('q_tab_active');
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
                data_tabs.forEach(tab => {
                    if (tab.data('value') === value) {
                        tab.click();
                    }
                });
            };

            wrapper.disabled = function (value, state) {
                if (data_tabs[value]) {
                    if (state) {
                        data_tabs[value].addClass('q_form_disabled');
                    } else {
                        data_tabs[value].removeClass('q_form_disabled');
                    }
                }
            };

            return wrapper;
        }
    };




};