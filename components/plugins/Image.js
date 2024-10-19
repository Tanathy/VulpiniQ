// Name: Image
// Method: Plugin
// Desc: Useful to manipulate images.
// Type: Plugin
// Example: var image = Q.Image();
// Dependencies: RGB2HSL, HSL2RGB

Q.Image = function (options) {
    let Canvas = Q('<canvas>');
    let canvas_node = Canvas.nodes[0];

    let defaultOptions = {
        width: 0,
        height: 0,
        format: 'png',
        fill: 'transparent',
        size: 'auto',
        quality: 1
    }

    options = Object.assign(defaultOptions, options);


    Canvas.Load = function (src, callback) {
        let img = new Image();
        img.src = src;
        img.onload = function () {
            canvas_node.width = img.width;
            canvas_node.height = img.height;
            canvas_node.getContext('2d').drawImage(img, 0, 0);
            if (callback) callback();
        };
    }

    Canvas.Get = function (format = options.format, quality = options.quality) {
        if (format === 'jpeg' || format === 'webp') {
            return canvas_node.toDataURL('image/' + format, quality);
        } else {
            return canvas_node.toDataURL('image/' + format);
        }
    }

    Canvas.Save = function (filename, format = options.format, quality = options.quality) {
        let href = Canvas.Get(format, quality);
        let a = Q('<a>', { download: filename, href: href });
        a.click();
    }

    Canvas.Clear = function (fill = options.fill) {
        let ctx = canvas_node.getContext('2d');
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas_node.width, canvas_node.height);
    }

    Canvas.Resize = function (width, height, size = options.size, keepDimensions = false) {
        options.width = width;
        options.height = height;
        options.size = size;

        console.log(keepDimensions);

        let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
        let ctx = temp.getContext('2d');
        let ratio = 1;

        let canvasWidth = canvas_node.width;
        let canvasHeight = canvas_node.height;

        if (size === 'contain') {
            if (keepDimensions) {
                // Keep the dimensions but scale the image to fit within the specified dimensions
                let widthRatio = width / canvasWidth;
                let heightRatio = height / canvasHeight;
                ratio = Math.min(widthRatio, heightRatio);

                // Scale the image to fit within the specified dimensions
                let newWidth = canvasWidth * ratio;
                let newHeight = canvasHeight * ratio;
                let xOffset = (width - newWidth) / 2;
                let yOffset = (height - newHeight) / 2;

                // Draw the image onto the temporary canvas with padding if necessary
                ctx.fillStyle = options.fill;
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
            } else {
                // Scale the image to fit within the specified dimensions
                let widthRatio = width / canvasWidth;
                let heightRatio = height / canvasHeight;
                ratio = Math.min(widthRatio, heightRatio);
                let newWidth = canvasWidth * ratio;
                let newHeight = canvasHeight * ratio;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
            }
        } else if (size === 'cover') {
            // Scale the image to cover the specified dimensions
            let widthRatio = width / canvasWidth;
            let heightRatio = height / canvasHeight;
            ratio = Math.max(widthRatio, heightRatio);

            let newWidth = canvasWidth * ratio;
            let newHeight = canvasHeight * ratio;

            let xOffset = (newWidth - width) / 2;
            let yOffset = (newHeight - height) / 2;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas_node, -xOffset, -yOffset, newWidth, newHeight);
        } else if (size === 'auto') {
            ratio = Math.min(width / canvasWidth, height / canvasHeight);
            let newWidth = canvasWidth * ratio;
            let newHeight = canvasHeight * ratio;

            ctx.fillStyle = options.fill;
            ctx.fillRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
        }

        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    // Canvas.Resize = function (width, height, size = options.size, keepDimensions = false) {
    //     options.width = width;
    //     options.height = height;
    //     options.size = size;

    //     console.log(keepDimensions);

    //     let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
    //     let ctx = temp.getContext('2d');
    //     let ratio = 1;

    //     let canvasWidth = canvas_node.width;
    //     let canvasHeight = canvas_node.height;
    //     let xOffset = 0;
    //     let yOffset = 0;
    //     let newWidth = 0;
    //     let newHeight = 0;
    //     let widthRatio = width / canvasWidth;
    //     let heightRatio = height / canvasHeight;

    //     if (size === 'contain') {
    //         if (keepDimensions) {
    //             ratio = Math.min(widthRatio, heightRatio);

    //             newWidth = canvasWidth * ratio;
    //             newHeight = canvasHeight * ratio;
    //             xOffset = (width - newWidth) / 2;
    //             yOffset = (height - newHeight) / 2;

    //             ctx.fillStyle = options.fill;
    //             ctx.fillRect(0, 0, width, height);
    //             ctx.drawImage(canvas_node, xOffset, yOffset, newWidth, newHeight);
    //         } else {
    //             ratio = Math.min(widthRatio, heightRatio);
    //         }
    //     } else if (size === 'cover') {
    //         ratio = Math.max(widthRatio, heightRatio);
    //          xOffset = (newWidth - width) / 2;
    //          yOffset = (newHeight - height) / 2;
    //     } else if (size === 'auto') {
    //         ratio = Math.min(width / canvasWidth, height / canvasHeight);
    //         ctx.fillStyle = options.fill;
    //         ctx.fillRect(0, 0, width, height);
    //     }

    //     newWidth = canvasWidth * ratio;
    //     newHeight = canvasHeight * ratio;
    //     ctx.imageSmoothingEnabled = true;
    //     ctx.imageSmoothingQuality = 'high';
    //     ctx.drawImage(canvas_node, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
    //     canvas_node.width = width;
    //     canvas_node.height = height;
    //     canvas_node.getContext('2d').drawImage(temp, 0, 0);
    // }


    Canvas.Crop = function (x, y, width, height) {
        let temp = Q('<canvas>', { width: width, height: height });
        temp.getContext('2d').drawImage(canvas_node, x, y, width, height, 0, 0, width, height);
        canvas_node.width = width;
        canvas_node.height = height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    Canvas.Rotate = function (degrees) {
        let temp = Q('<canvas>', { width: canvas_node.height, height: canvas_node.width });
        let ctx = temp.getContext('2d');
        ctx.translate(canvas_node.height / 2, canvas_node.width / 2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(canvas_node, -canvas_node.width / 2, -canvas_node.height / 2);
        canvas_node.width = temp.width;
        canvas_node.height = temp.height;
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    Canvas.Flip = function (direction = 'horizontal')
    {
        let temp = Q('<canvas>', { width: canvas_node.width, height: canvas_node.height });
        let ctx = temp.getContext('2d');
        ctx.translate(canvas_node.width, 0);
        ctx.scale(direction == 'horizontal' ? -1 : 1, direction == 'vertical' ? -1 : 1);
        ctx.drawImage(canvas_node, 0, 0);
        canvas_node.getContext('2d').drawImage(temp, 0, 0);
    }

    Canvas.Grayscale = function () {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Brightness = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] += value;
            pixels[i + 1] += value;
            pixels[i + 2] += value;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Contrast = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let factor = (259 * (value + 255)) / (255 * (259 - value));
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = factor * (pixels[i] - 128) + 128;
            pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
            pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Vivid = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = Math.min(255, pixels[i] * value);
            pixels[i + 1] = Math.min(255, pixels[i + 1] * value);
            pixels[i + 2] = Math.min(255, pixels[i + 2] * value);
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Hue = function (value) {
        let data = canvas_node.getContext('2d').getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let hsl = Q.RGB2HSL(r, g, b);
            hsl[0] += value;
            let rgb = Q.HSL2RGB(hsl[0], hsl[1], hsl[2]);
            pixels[i] = rgb[0];
            pixels[i + 1] = rgb[1];
            pixels[i + 2] = rgb[2];
        }
        canvas_node.getContext('2d').putImageData(data, 0, 0);
    }

    Canvas.Sharpen = function (options) {
        let defaults = {
            amount: 1,
            threshold: 0,
            radius: 1,
            quality: 1
        };

        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;

        let weights = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        let katet = Math.round(Math.sqrt(weights.length));
        let half = Math.floor(katet / 2);

        let divisor = weights.reduce((sum, weight) => sum + weight, 0) || 1;
        let offset = 0;
        let dataCopy = new Uint8ClampedArray(pixels);

        let width = canvas_node.width;
        let height = canvas_node.height;

        let iterations = Math.round(options.quality);
        let iteration = 0;

        while (iteration < iterations) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;

                    let dstOff = (y * width + x) * 4;

                    for (let cy = 0; cy < katet; cy++) {
                        for (let cx = 0; cx < katet; cx++) {
                            let scy = y + cy - half;
                            let scx = x + cx - half;

                            if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                                let srcOff = (scy * width + scx) * 4;
                                let wt = weights[cy * katet + cx];

                                r += dataCopy[srcOff] * wt;
                                g += dataCopy[srcOff + 1] * wt;
                                b += dataCopy[srcOff + 2] * wt;
                            }
                        }
                    }

                    r = Math.min(Math.max((r / divisor) + offset, 0), 255);
                    g = Math.min(Math.max((g / divisor) + offset, 0), 255);
                    b = Math.min(Math.max((b / divisor) + offset, 0), 255);
                    if (Math.abs(dataCopy[dstOff] - r) > options.threshold) {
                        pixels[dstOff] = r;
                        pixels[dstOff + 1] = g;
                        pixels[dstOff + 2] = b;
                    }
                }
            }
            iteration++;
        }
        ctx.putImageData(data, 0, 0);
    }

    Canvas.Emboss = function (options) {
        let defaults = {
            strength: 1,
            direction: 'top-left',
            blend: true,    
            grayscale: true  
        };

        // Merge default options with user-provided options
        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;

        // Create a copy of the original pixels to work from
        let dataCopy = new Uint8ClampedArray(pixels);

        // Emboss kernel based on the direction (3x3 convolution matrix)
        let kernels = {
            'top-left': [-2, -1, 0, -1, 1, 1, 0, 1, 2],
            'top-right': [0, -1, -2, 1, 1, -1, 2, 1, 0],
            'bottom-left': [0, 1, 2, -1, 1, 1, -2, -1, 0],
            'bottom-right': [2, 1, 0, 1, 1, -1, 0, -1, -2]
        };

        // Get the kernel for the chosen direction
        let kernel = kernels[options.direction] || kernels['top-left'];
        let katet = Math.sqrt(kernel.length); 
        let half = Math.floor(katet / 2);

        let strength = options.strength;
        let divisor = 1; 
        let offset = 128; 

        // Loop through each pixel and apply the emboss kernel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                let dstOff = (y * width + x) * 4;

                // Convolution loop: Apply the kernel to each neighboring pixel
                for (let cy = 0; cy < katet; cy++) {
                    for (let cx = 0; cx < katet; cx++) {
                        let scy = y + cy - half;
                        let scx = x + cx - half;

                        // Ensure we're inside the image bounds
                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            let srcOff = (scy * width + scx) * 4; 
                            let wt = kernel[cy * katet + cx];

                            r += dataCopy[srcOff] * wt;
                            g += dataCopy[srcOff + 1] * wt;
                            b += dataCopy[srcOff + 2] * wt;
                        }
                    }
                }

                // Calculate final values
                r = (r / divisor) * strength + offset;
                g = (g / divisor) * strength + offset;
                b = (b / divisor) * strength + offset;

                // Grayscale option: average the RGB channels if grayscale is true
                if (options.grayscale) {
                    let avg = (r + g + b) / 3;
                    r = g = b = avg;
                }

                // Clamp values to the 0-255 range
                r = Math.min(Math.max(r, 0), 255);
                g = Math.min(Math.max(g, 0), 255);
                b = Math.min(Math.max(b, 0), 255);

                // If blending is enabled, blend the original image with the embossed one
                if (options.blend) {
                    pixels[dstOff] = (pixels[dstOff] + r) / 2;
                    pixels[dstOff + 1] = (pixels[dstOff + 1] + g) / 2;
                    pixels[dstOff + 2] = (pixels[dstOff + 2] + b) / 2;
                } else {
                    pixels[dstOff] = r;
                    pixels[dstOff + 1] = g;
                    pixels[dstOff + 2] = b;
                }
            }
        }

        // Write the modified image data back to the canvas
        ctx.putImageData(data, 0, 0);
    }

    Canvas.Blur = function (options) {
        let defaults = {
            radius: 5, 
            quality: 1 
        };

        options = Object.assign(defaults, options);

        let ctx = canvas_node.getContext('2d');
        let data = ctx.getImageData(0, 0, canvas_node.width, canvas_node.height);
        let pixels = data.data;
        let width = canvas_node.width;
        let height = canvas_node.height;

        // Generate Gaussian kernel
        function gaussianKernel(radius) {
            let size = 2 * radius + 1;
            let kernel = new Float32Array(size * size);
            let sigma = radius / 3;
            let sum = 0;
            let center = radius;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let dx = x - center;
                    let dy = y - center;
                    let weight = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
                    kernel[y * size + x] = weight;
                    sum += weight;
                }
            }

            for (let i = 0; i < kernel.length; i++) {
                kernel[i] /= sum;
            }

            return {
                kernel: kernel,
                size: size
            };
        }

        let { kernel, size } = gaussianKernel(options.radius);
        let half = Math.floor(size / 2);
        let iterations = Math.round(options.quality);

        function applyBlur() {
            let output = new Uint8ClampedArray(pixels);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    let dstOff = (y * width + x) * 4;

                    for (let ky = 0; ky < size; ky++) {
                        for (let kx = 0; kx < size; kx++) {
                            let ny = y + ky - half;
                            let nx = x + kx - half;

                            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                let srcOff = (ny * width + nx) * 4;
                                let weight = kernel[ky * size + kx];

                                r += pixels[srcOff] * weight;
                                g += pixels[srcOff + 1] * weight;
                                b += pixels[srcOff + 2] * weight;
                            }
                        }
                    }

                    output[dstOff] = r;
                    output[dstOff + 1] = g;
                    output[dstOff + 2] = b;
                }
            }

            return output;
        }

        // Apply the blur multiple times based on quality
        for (let i = 0; i < iterations; i++) {
            pixels = applyBlur();
        }

        ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
    }
    return Canvas;
}