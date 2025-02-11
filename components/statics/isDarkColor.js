// Name: isDarkColor
// Method: Utility
// Desc: Determines if a color is dark or light based on the HSP (Hue, Saturation, Perceived brightness) model. <br> This utility helps in designing user interfaces by ensuring adequate contrast between text and background colors, enhancing readability and accessibility. <br> Users can adjust the margin and threshold parameters to fine-tune sensitivity according to their design needs.
// Type: Color
// Example: Q.isDarkColor('#000000'); // true <br> Q.isDarkColor('#ffffff'); // false <br> Q.isDarkColor('#4c4c4c', 30, 90); // true
// Variables: color, margin, threshold, parseHex, hsp, hex, rgba
Q.isDarkColor = (color, margin = 20, threshold = 100) => {
    let red, green, blue;
    if (color[0] === '#') {
      const hex = color.slice(1);
      const parts = hex.length === 3
        ? [hex[0] + hex[0], hex[1] + hex[1], hex[2] + hex[2]]
        : hex.length === 6
        ? [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
        : null;
      if (!parts) throw Error('Invalid hex color format');
      [red, green, blue] = parts.map(v => parseInt(v, 16));
    } else if (color.startsWith('rgb')) {
      const arr = color.match(/\d+/g);
      if (arr && arr.length >= 3) [red, green, blue] = arr.map(Number);
      else throw Error('Invalid color format');
    } else throw Error('Unsupported color format');
    return Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2) + margin < threshold;
  };
