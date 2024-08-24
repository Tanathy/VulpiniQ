Q.Container = function () {
    Q.style(`
        :root {
  	--svg_arrow-down: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 100.93685,31.353867 C 82.480099,48.598492 67.319803,62.707709 67.247301,62.707709 c -0.0725,0 -15.232809,-14.109215 -33.689561,-31.353842 L 3.5365448e-8,6.6845858e-7 H 67.247301 134.4946 Z"/></svg>');
	--svg_arrow-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="M 31.353844,100.93685 C 14.109219,82.480099 1.6018623e-6,67.319803 1.6018623e-6,67.247301 1.6018623e-6,67.174801 14.109217,52.014492 31.353844,33.55774 L 62.70771,0 V 67.247301 134.4946 Z"/></svg>');
	--svg_arrow-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="m 31.353868,33.55775 c 17.244625,18.456749 31.353842,33.617045 31.353842,33.689547 0,0.0725 -14.109215,15.232809 -31.353842,33.689563 L 1.6018623e-6,134.4946 V 67.247297 0 Z"/></svg>');
	--svg_arrow-up: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 33.55775,31.353843 C 52.014499,14.109218 67.174795,6.6845858e-7 67.247297,6.6845858e-7 67.319797,6.6845858e-7 82.480106,14.109216 100.93686,31.353843 L 134.4946,62.707709 H 67.247297 3.5365448e-8 Z"/></svg>');
        }
 
 .svg_arrow-down {
     -webkit-mask: var(--svg_arrow-down) no-repeat center;
     mask: var(--svg_arrow-down) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
 .svg_arrow-left {
     -webkit-mask: var(--svg_arrow-left) no-repeat center;
     mask: var(--svg_arrow-left) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
 .svg_arrow-right {
     -webkit-mask: var(--svg_arrow-right) no-repeat center;
     mask: var(--svg_arrow-right) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
 .svg_arrow-up {
     -webkit-mask: var(--svg_arrow-up) no-repeat center;
     mask: var(--svg_arrow-up) no-repeat center;
     background-color: currentColor;
     -webkit-mask-size: contain;
     mask-size: contain;
 }
 
         .container_icon {
             width: 100%;
             height: 100%;
             color: #777; /* Default color */
         }

 `);

    Q.style(`
         .q_tabs_nav {
         box-sizing: border-box;
            width: 20px;
            background-color: #333;
            display: flex;
            justify-content: center;
            padding: 4px;
        }
        
        .q_tabs_nav_vertical {
            width: auto;
            height: 20px;
        }
        
        .q_tabs_nav:hover {
            background-color: #555;
        }
        
        .q_tabcontainer {
            width: 100%;
            height: 300px;
        }
        
        .q_tc_vertical {
        display: flex;
                }
        
        .q_tabs_wrapper {
        
            background-color: #333;
            display: flex;
        }
        
        .q_tabs_wrapper_vertical {
            flex-direction: column;
                width: auto;
        }
        
        .q_tabs {
        user-select: none;
            display: flex;
            flex-direction: row;
            width: 100%;
            overflow: hidden;
        }
        
        .q_tabs_vertical {
            flex-direction: column;
        }
        
        .q_tab_active {
            background-color: #555;
            color: #fff;
        }
        
        .q_tab {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: default;
            padding: 5px 25px;
        }
        
        .q_tab_disabled {
            background-color: #333;
            color: #555;
        }

`);


    let createIcon = function (icon) {
        let iconElement = Q('<div>');
        iconElement.addClass('svg_' + icon + ' container_icon');
        return iconElement;
    }

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
                tabs_nav_left.append(createIcon('arrow-up'));
                tabs_nav_right.append(createIcon('arrow-down'));
            }
            else {
                tabs_nav_left.append(createIcon('arrow-left'));
                tabs_nav_right.append(createIcon('arrow-right'));
            }

            let data_tabs = {};
            let data_contents = {};

            data.forEach((item) => {
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