// Name: Style
// Method: Plugin
// Desc: Provides methods to apply global styles to the document. It's useful for applying CSS variables from JavaScript. Q.style will be removed after the styles are applied on the document ready event.
// Type: Plugin
// Example: Q.style(':root { --color: red; } body { background-color: var(--color); }');
var glob_styles = {
    styles: '',
    root: '',
    element: null,
    checked: false,
};

Q.style = (function () {
    function applyStyles() {
        if (!glob_styles.checked) {
            glob_styles.element = document.getElementById('qlib-root-styles') || createStyleElement();
            glob_styles.checked = true;
        }

        const finalStyles = `:root {${glob_styles.root}}\n${glob_styles.styles}`.replace(/(\r\n|\n|\r|\t|)/gm, '');
        glob_styles.element.textContent = finalStyles;
    }

    function createStyleElement() {
        const styleElement = document.createElement('style');
        styleElement.id = 'qlib-root-styles';
        document.head.insertBefore(styleElement, document.head.firstChild);
        return styleElement;
    }

    window.addEventListener('load', () => {
        console.log('Styles plugin loaded.');
        delete Q.style;
        delete glob_styles;
    }, { once: true });

    return function (styles) {
        if (typeof styles === 'string') {
            const rootContentMatch = styles.match(/:root\s*{([^}]*)}/);
            if (rootContentMatch) {
                styles = styles.replace(rootContentMatch[0], '');
                const rootContent = rootContentMatch[1].split(';').map(item => item.trim()).filter(item => item);
                glob_styles.root += rootContent.join(';') + ';';
            }
            glob_styles.styles += styles.trim();
        } else {
            console.error('Invalid styles parameter. Expected a string.');
        }
        applyStyles();
    };
})();