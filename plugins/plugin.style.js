// Name: Style
// Method: Plugin
// Desc: Provides methods to apply global styles to the document. It's useful for applying CSS variables from JavaScript. Q.style will be removed after the styles are applied on the document ready event.
// Type: Plugin
// Example: Q.style(':root { --color: red; } body { background-color: var(--color); }');
Q.style = (function () {
    let styleData = {
        styles: '',
        root: '',
        element: null,
        checked: false,
    };
    const sID = (length = 4) => '_' + Math.random().toString(16).substr(2, length);


    function applyStyles() {
        if (!styleData.init) {
            styleData.element = document.getElementById('qlib-root-styles') || createStyleElement();
            styleData.init = true;
        }

        const finalStyles = `:root {${styleData.root}}\n${styleData.gen}`.replace(/(\r\n|\n|\r|\t|)/gm, '');
        // const finalStyles = `:root {${styleData.root}}\n${styleData.gen}`;
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

    return function (styles, mapping = null, disableObfuscation = false) {
        if (typeof styles === 'string') {
            const rootContentMatch = styles.match(/:root\s*{([^}]*)}/);
            if (rootContentMatch) {
                styles = styles.replace(rootContentMatch[0], '');
                const rootContent = rootContentMatch[1].split(';').map(item => item.trim()).filter(item => item);
                styleData.root += rootContent.join(';') + ';';
            }

            if (!disableObfuscation && Object.keys(mapping).length === 0) {
                const generatedKeys = new Set();
                mapping = Object.keys(mapping).reduce((acc, key) => {
                    let newKey;
                    do {
                        newKey = sID(5);
                    } while (generatedKeys.has(newKey));

                    generatedKeys.add(newKey);
                    acc[key] = newKey;
                    styles = styles.replace(new RegExp(`\\b${key}\\b`, 'gm'), acc[key]);
                    return acc;
                }, {});
            }
            styleData.gen += styles.trim();

            applyStyles();
                return mapping;
        } else {
            console.error('Invalid styles parameter. Expected a string.');
        }
    };
})();