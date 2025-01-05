// Name: Style
// Method: Plugin
// Desc: Provides methods to apply global styles to the document. It's useful for applying CSS variables from JavaScript. Q.style will be removed after the styles are applied on the document ready event.
// Type: Plugin
// Example: Q.style(':root { --color: red; } body { background-color: var(--color); }');
// Dependencies: ID
Q.style = (function () {
    let styleData = {
        gen: "",
        root: '',
        element: null,
        checked: false,
    };

    function applyStyles() {
        if (!styleData.init) {
            styleData.element = document.getElementById('qlib-root-styles') || createStyleElement();
            styleData.init = true;
        }

        let finalStyles = '';

        if (styleData.root) {
            //add only root styles if they exist
            finalStyles = `:root {${styleData.root}}\n`;
        }

        finalStyles += styleData.gen;

        styleData.element.textContent = finalStyles;
    }

    function createStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.id = 'qlib-root-styles';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
    }

    window.addEventListener('load', () => {
        console.log('Styles plugin loaded.');

        //we should destroy the Q.style function after the document is loaded to prevent further usage.
        delete Q.style;

    }, { once: true });

    return function (styles, mapping = null) {
        if (typeof styles === 'string') {
            const rootContentMatch = styles.match(/:root\s*{([^}]*)}/);
            if (rootContentMatch) {
                styles = styles.replace(rootContentMatch[0], '');
                const rootContent = rootContentMatch[1].split(';').map(item => item.trim()).filter(item => item);
                styleData.root += rootContent.join(';') + ';';
            }

            //obfuscate the class and id names using the mapping object. mapping object may contain . and #.
            if (mapping) {
                const keys = Object.keys(mapping);
                keys.forEach((key) => {
                    let newKey = Q.ID(5, '_');

                    //replace all occurrences of the key in the styles string and update the mapping object value.
                    styles = styles.replace(new RegExp(`\\b${key}\\b`, 'gm'), newKey);
                    //replace the value of the key in the mapping object as well.
                    mapping[key] = mapping[key].replace(key, newKey);
                });
                console.log(mapping);
            }

            styleData.gen += styles;

            applyStyles();
            return mapping;
        } else {
            console.error('Invalid styles parameter. Expected a string.');
        }
    };
})();