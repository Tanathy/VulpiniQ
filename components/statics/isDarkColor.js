// Name: isDarkColor
// Method: Static
// Desc: Determines if a color is dark or light based on HSP.
// Type: Color
// Example: Q.isDarkColor('#000000'); or Q.isDarkColor('#000000', 20, 100); // 20 is margin, 100 is threshold
// Variables: color, margin, threshold, parseHex, hsp, hex, rgba
Q.isDarkColor = (color, margin = 20, threshold = 100) => {
    let r, g, b;

    // Helper to parse hex color
    const parseHex = (hex) => {
        if (hex.length === 3) {
            return [
                parseInt(hex[0] + hex[0], 16),
                parseInt(hex[1] + hex[1], 16),
                parseInt(hex[2] + hex[2], 16),
            ];
        } else if (hex.length === 6) {
            return [
                parseInt(hex.slice(0, 2), 16),
                parseInt(hex.slice(2, 4), 16),
                parseInt(hex.slice(4, 6), 16),
            ];
        }
        throw new Error('Invalid hex color format');
    };

    // Process color
    if (color[0] === '#') {
        [r, g, b] = parseHex(color.slice(1));
    } else if (color.startsWith('rgb')) {
        const rgba = color.match(/\d+/g);
        if (rgba && rgba.length >= 3) {
            [r, g, b] = rgba.map(Number);
        } else {
            throw new Error('Invalid color format');
        }
    } else {
        throw new Error('Unsupported color format');
    }

    // Calculate HSP value using the formula
    const hsp = Math.sqrt(
        0.299 * (r ** 2) +
        0.587 * (g ** 2) +
        0.114 * (b ** 2)
    ) + margin;

    // Return true if color is dark
    return hsp < threshold;
};