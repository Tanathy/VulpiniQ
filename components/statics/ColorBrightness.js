// Name: ColorBrightness
// Method: Utility
// Desc: Adjusts the brightness of a given color by a specified percentage, making the color lighter or darker. <br> This function can be used to dynamically change colors for various UI elements, providing visual feedback or creating color schemes with different shades. <br> It supports both hexadecimal and RGB/RGBA color formats, making it flexible for different use cases in web design or graphics.
// Type: Color
// Example: Q.ColorBrightness('#000000', 50); // #7f7f7f (black +50%) <br> Q.ColorBrightness('rgb(255, 0, 0)', -30); // rgb(178, 0, 0) (red -30%) <br> Q.ColorBrightness('rgba(0, 0, 255, 0.5)', 20); // rgba(51, 51, 255, 0.5) (blue +20%)
// Variables: hex, alphaColor, color, percent
Q.ColorBrightness = function (color, percent) {
    let r, g, b, a = 1;
    let hex = false;

    // Early return for unsupported color formats
    if (!color.startsWith('#') && !color.startsWith('rgb')) {
        throw new Error('Unsupported color format');
    }

    // Parse hex color
    if (color.startsWith('#')) {
        color = color.replace(/^#/, '');
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        }
        if (color.length === 6) {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        }
        hex = true;
    }

    // Parse rgb/rgba color
    if (color.startsWith('rgb')) {
        const alphaColor = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);
        if (alphaColor) {
            r = parseInt(alphaColor[1]);
            g = parseInt(alphaColor[2]);
            b = parseInt(alphaColor[3]);
            if (alphaColor[4]) {
                a = parseFloat(alphaColor[4]);
            }
        }
    }

    // Adjust each color component
    r = Math.min(255, Math.max(0, r + (r * percent / 100)));
    g = Math.min(255, Math.max(0, g + (g * percent / 100)));
    b = Math.min(255, Math.max(0, b + (b * percent / 100)));

    // Convert back to the appropriate format and return
    if (hex) {
        return '#' +
            ('0' + Math.round(r).toString(16)).slice(-2) +
            ('0' + Math.round(g).toString(16)).slice(-2) +
            ('0' + Math.round(b).toString(16)).slice(-2);
    } else if (color.startsWith('rgb')) {
        if (a === 1) {
            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        } else {
            return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
        }
    }
}
