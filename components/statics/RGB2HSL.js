// Name: RGB2HSL
// Method: Utility
// Desc: Converts RGB color values to HSL format, providing a different way to represent colors that can be more intuitive for artists and designers. <br> HSL stands for Hue, Saturation, and Lightness, making it easier to manipulate colors based on human perception. <br> This conversion is essential for applications requiring color manipulation, such as image editing or web design, where understanding color relationships is crucial.
// Type: Color
// Example: Q.RGB2HSL(255, 255, 255); // [0, 0, 1] <br> Q.RGB2HSL(0, 0, 0); // [0, 0, 0] <br> Q.RGB2HSL(255, 0, 0); // [0, 1, 0.5]
// Variables: min, maximum
Q.RGB2HSL = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let maximum = Math.max(r, g, b), minimum = Math.min(r, g, b);
    let h, s, l = (maximum + minimum) / 2;

    if (maximum === minimum) {
        h = s = 0;
    } else {
        let d = maximum - minimum;
        s = l > 0.5 ? d / (2 - maximum - minimum) : d / (maximum + minimum);
        switch (maximum) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
};
