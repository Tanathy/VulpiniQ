// Name: AvgColor
// Method: Utility
// Desc: Calculates the average color of an image by creating a canvas element, drawing the image on it, and analyzing the pixel data to determine the average color. <br> This technique is useful for generating color palettes, creating visual effects, or enhancing user interface elements based on the predominant colors in an image.
// Type: Image Processing
// Example: Q.AvgColor('image.jpg or canvas', sampleSize, callback); // Returns the average color of the image or canvas

Q.AvgColor = function (image, sampleSize, callback) {
    let img = new Image();
    img.crossOrigin = 'Anonymous';

    // Detect image type (URL, Base64, or Canvas)
    if (typeof image === 'string') {
        img.src = image;
    } else if (image instanceof HTMLCanvasElement) {
        img.src = image.toDataURL();
    } else {
        console.error("Invalid image source provided.");
        return;
    }

    img.onload = function () {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let data = ctx.getImageData(0, 0, img.width, img.height).data;
        let length = data.length / 4;

        // Determine sampling rate
        let samplingRate = 1;
        if (sampleSize === 'auto') {
            let factor = Math.ceil(Math.sqrt(img.width * img.height) / 32);
            samplingRate = Math.max(1, factor);
        } else if (typeof sampleSize === 'number' && sampleSize > 0) {
            samplingRate = sampleSize;
        }

        let color = { r: 0, g: 0, b: 0 };
        let count = 0;

        for (let i = 0; i < length; i += samplingRate) {
            let idx = i * 4; // Convert to RGBA index
            color.r += data[idx];
            color.g += data[idx + 1];
            color.b += data[idx + 2];
            count++;
        }

        // Calculate average
        color.r = Math.floor(color.r / count);
        color.g = Math.floor(color.g / count);
        color.b = Math.floor(color.b / count);

        // Call callback if defined
        if (typeof callback === 'function') {
            callback(color);
        }
    };

    img.onerror = function () {
        console.error("Failed to load image.");
    };
};
