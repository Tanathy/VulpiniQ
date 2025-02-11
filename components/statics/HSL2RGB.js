// Name: HSL2RGB
// Method: Utility
// Desc: Converts HSL (Hue, Saturation, Lightness) color values to RGB (Red, Green, Blue) format. <br> This function is essential for applications that require color transformations, allowing developers to switch between different color representations easily. <br> Understanding color models is key in design, and this utility helps bridge the gap between HSL, which is often more intuitive for humans, and RGB, which is commonly used in digital displays.
// Type: Color
// Example: Q.HSL2RGB(0, 0, 1); // [255, 255, 255] <br> Q.HSL2RGB(0, 1, 0.5); // [255, 0, 0] <br> Q.HSL2RGB(0.33, 1, 0.5); // [0, 255, 0]
// Variables: hue2rgb
Q.HSL2RGB = (h, s, l) => {
    if (s === 0) {
      const gray = l * 255;
      return [gray, gray, gray];
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q,
          hueToRgb = (t) => {
            t < 0 && (t += 1);
            t > 1 && (t -= 1);
            return t < 1 / 6 ? p + (q - p) * 6 * t
                 : t < 1 / 2 ? q
                 : t < 2 / 3 ? p + (q - p) * 6 * (2 / 3 - t)
                 : p;
          };
    return [hueToRgb(h + 1 / 3) * 255, hueToRgb(h) * 255, hueToRgb(h - 1 / 3) * 255];
  };
