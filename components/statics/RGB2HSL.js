// Name: RGB2HSL
// Method: Utility
// Desc: Converts RGB color values to HSL format, providing a different way to represent colors that can be more intuitive for artists and designers. <br> HSL stands for Hue, Saturation, and Lightness, making it easier to manipulate colors based on human perception. <br> This conversion is essential for applications requiring color manipulation, such as image editing or web design, where understanding color relationships is crucial.
// Type: Color
// Example: Q.RGB2HSL(255, 255, 255); // [0, 0, 1] <br> Q.RGB2HSL(0, 0, 0); // [0, 0, 0] <br> Q.RGB2HSL(255, 0, 0); // [0, 1, 0.5]
// Variables: min, maximum
Q.RGB2HSL = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2, d = max - min;
    if (!d) h = s = 0;
    else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0)
        : max === g ? (b - r) / d + 2
        : (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  };
