// Name: Icons
// Method: Plugin
// Desc: Additional icons for the VulpiniQ library.
// Type: Plugin
// Example: Q.Icons();
// Dependencies: Style
Q.Icons = function (data, classes) {
    let classes = Q.style(`
:root {
    --svg_arrow-down: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 100.93685,31.353867 C 82.480099,48.598492 67.319803,62.707709 67.247301,62.707709 c -0.0725,0 -15.232809,-14.109215 -33.689561,-31.353842 L 3.5365448e-8,6.6845858e-7 H 67.247301 134.4946 Z"/></svg>');
    --svg_arrow-left: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="M 31.353844,100.93685 C 14.109219,82.480099 1.6018623e-6,67.319803 1.6018623e-6,67.247301 1.6018623e-6,67.174801 14.109217,52.014492 31.353844,33.55774 L 62.70771,0 V 67.247301 134.4946 Z"/></svg>');
    --svg_arrow-right: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.707704 134.4946"><path d="m 31.353868,33.55775 c 17.244625,18.456749 31.353842,33.617045 31.353842,33.689547 0,0.0725 -14.109215,15.232809 -31.353842,33.689563 L 1.6018623e-6,134.4946 V 67.247297 0 Z"/></svg>');
    --svg_arrow-up: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.49459 62.707709"><path d="M 33.55775,31.353843 C 52.014499,14.109218 67.174795,6.6845858e-7 67.247297,6.6845858e-7 67.319797,6.6845858e-7 82.480106,14.109216 100.93686,31.353843 L 134.4946,62.707709 H 67.247297 3.5365448e-8 Z"/></svg>');
    --svg_window-close: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 2.8176856,98.903421 -4.0360052e-7,96.085741 22.611458,73.473146 45.222917,50.860554 22.611458,28.247962 -4.0360052e-7,5.6353711 2.8176856,2.8176851 5.6353716,-9.1835591e-7 28.247963,22.611458 50.860555,45.222916 73.473147,22.611458 96.085743,-9.1835591e-7 98.903423,2.8176851 101.72111,5.6353711 79.109651,28.247962 56.498193,50.860554 79.109651,73.473146 101.72111,96.085741 98.903423,98.903421 96.085743,101.72111 73.473147,79.109651 50.860555,56.498192 28.247963,79.109651 5.6353716,101.72111 Z"/></svg>');
    --svg_window-full: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 H 50.860555 84.417403 V 50.860554 84.417401 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z"/></svg>');
    --svg_window-minimize: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 0.5252846,83.893071 V 79.698469 H 50.860555 101.19582 v 4.194602 4.19461 H 50.860555 0.5252846 Z"/></svg>');
    --svg_window-windowed: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.7211 101.72111"><path d="M 17.303708,50.860554 V 17.303708 h 8.389212 8.389212 V 8.9144961 0.52528408 H 67.638978 101.19582 V 34.082131 67.638977 h -8.389207 -8.38921 v 8.389212 8.389212 H 50.860555 17.303708 Z m 58.724482,0 V 25.692919 H 50.860555 25.69292 V 50.860554 76.028189 H 50.860555 76.02819 Z M 92.806613,34.082131 V 8.9144961 H 67.638978 42.471343 v 4.1946059 4.194606 h 20.973029 20.973031 v 20.973029 20.973029 h 4.1946 4.19461 z"/></svg>');
}
.svg_window-close {
    -webkit-mask: var(--svg_window-close) no-repeat center;
    mask: var(--svg_window-close) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_window-full {
    -webkit-mask: var(--svg_window-full) no-repeat center;
    mask: var(--svg_window-full) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_window-minimize {
    -webkit-mask: var(--svg_window-minimize) no-repeat center;
    mask: var(--svg_window-minimize) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
}
.svg_window-windowed {
    -webkit-mask: var(--svg_window-windowed) no-repeat center;
    mask: var(--svg_window-windowed) no-repeat center;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
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
     `, {});
};