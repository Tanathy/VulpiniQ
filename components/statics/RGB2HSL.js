// Name: RGB2HSL
// Method: Static
// Desc: Converts RGB to HSL.
// Type: Color
// Example: Q.RGB2HSL(255, 255, 255); // [0, 0, 1]
// Variables: r, g, b, maximum, min, h, s, l, d
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