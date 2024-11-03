// Name: HSL2RGB
// Method: Utility
// Desc: Converts HSL (Hue, Saturation, Lightness) color values to RGB (Red, Green, Blue) format. <br> This function is essential for applications that require color transformations, allowing developers to switch between different color representations easily. <br> Understanding color models is key in design, and this utility helps bridge the gap between HSL, which is often more intuitive for humans, and RGB, which is commonly used in digital displays.
// Type: Color
// Example: Q.HSL2RGB(0, 0, 1); // [255, 255, 255] <br> Q.HSL2RGB(0, 1, 0.5); // [255, 0, 0] <br> Q.HSL2RGB(0.33, 1, 0.5); // [0, 255, 0]
// Variables: hue2rgb
Q.HSL2RGB = function (h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        let hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
};
