// Name: isDarkColor
// Method: Static
// Desc: Determines if a color is dark or light.
// Type: Color
// Example: Q.isDarkColor('#000000'); // true (black)
Q.isDarkColor = function (color, margin = 20, threshold = 100) {
    let r, g, b;

    // Parse hex color
    if (color.startsWith('#')) {
        color = color.replace(/^#/, '');
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        } else if (color.length === 6) {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        } else {
            throw new Error('Invalid hex color format');
        }
    }

    // Parse rgb/rgba color
    else if (color.startsWith('rgb')) {
        const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);
        if (rgba) {
            r = parseInt(rgba[1]);
            g = parseInt(rgba[2]);
            b = parseInt(rgba[3]);
        } else {
            throw new Error('Invalid rgb/rgba color format');
        }
    } else {
        throw new Error('Unsupported color format');
    }

    // Calculate HSP value
    let hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Adjust brightness by ±20
    hsp += margin;

    // Determine if the color is dark
    return hsp < threshold;
}