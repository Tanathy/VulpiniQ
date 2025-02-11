// Name: ColorBrightness
// Method: Utility
// Desc: Adjusts the brightness of a given color by a specified percentage, making the color lighter or darker. <br> This function can be used to dynamically change colors for various UI elements, providing visual feedback or creating color schemes with different shades. <br> It supports both hexadecimal and RGB/RGBA color formats, making it flexible for different use cases in web design or graphics.
// Type: Color
// Example: Q.ColorBrightness('#000000', 50); // #7f7f7f (black +50%) <br> Q.ColorBrightness('rgb(255, 0, 0)', -30); // rgb(178, 0, 0) (red -30%) <br> Q.ColorBrightness('rgba(0, 0, 255, 0.5)', 20); // rgba(51, 51, 255, 0.5) (blue +20%)
// Variables: hex, alphaColor, color, percent
Q.ColorBrightness = (inputColor, percent) => {
    if (!/^#|^rgb/.test(inputColor)) throw new Error('Unsupported color format');
    let red, green, blue, alpha = 1, isHex = false, factor = 1 + percent / 100;
    if (inputColor[0] === '#') {
      isHex = true;
      const hexString = inputColor.slice(1);
      if (hexString.length === 3) {
        red = parseInt(hexString[0] + hexString[0], 16);
        green = parseInt(hexString[1] + hexString[1], 16);
        blue = parseInt(hexString[2] + hexString[2], 16);
      } else if (hexString.length === 6) {
        red = parseInt(hexString.slice(0, 2), 16);
        green = parseInt(hexString.slice(2, 4), 16);
        blue = parseInt(hexString.slice(4, 6), 16);
      }
    } else {
      const match = inputColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        red = +match[1];
        green = +match[2];
        blue = +match[3];
        if (match[4] != null) alpha = parseFloat(match[4]);
      }
    }
    const clamp = value => Math.min(255, Math.max(0, Math.round(value * factor)));
    red = clamp(red);
    green = clamp(green);
    blue = clamp(blue);
    return isHex
      ? '#' + [red, green, blue].map(component => (`0${component.toString(16)}`).slice(-2)).join('')
      : (alpha === 1 ? `rgb(${red}, ${green}, ${blue})` : `rgba(${red}, ${green}, ${blue}, ${alpha})`);
  };
