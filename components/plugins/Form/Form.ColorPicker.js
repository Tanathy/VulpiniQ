Form.prototype.ColorPicker = function (options = {}) {

    // let defaults = {
    //     width: 300,
    //     height: 300,
    //     globalRadius: 0.46,
    //     outerRingThickness: 0.05,
    //     innerRingThickness: 0.15,
    //     ringPadding: 0.02,
    //     outerSegments: 24,
    //     showDetails: true,
    //     color: '#FF0000'
    // };

    // options = Object.assign(defaults, options);

    if (!Form.ColorPickerClassesInitialized) {
        Form.colorPickerClasses = Q.style('', `
            .q_form_color_picker_wrapper {
                display: flex;
                width: 100%;
                height: 100%;
                align-items: stretch;
                justify-content: space-between;
            }

            .left_wrapper {
                flex: 1;
                width: 100%;
                height: 100%;
                display: flex;
            }

            .right_wrapper {
                display: flex;
                flex-direction: column;
                background-color: rgba(0, 0, 0, 0.1);
                flex: 1;
            }

            .section_snatches, .section_first, .section_second, .section_third, .section_fourth {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .sections {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2px;
                margin: 2px;
                padding: 2px;
                flex: 1;
                border: 1px solid var(--form-default-input-border-color);
            }

            .color_picker_input {
                background-color: var(--form-default-input-background-color);
                border-radius: var(--form-default-border-radius);
                padding: 2px;
                margin: 2px;
                color: var(--form-default-input-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                border: 1px solid var(--form-default-input-border-color);
                width: 50px;
            }

            .input_rgb888, .input_rgb565, .input_hsl
            {
            width: 100%;
            }

            .color_picker_input:focus {
                outline: none;
                background-color: var(--form-default-input-background-color_active);
            }

            /* Hide spinner buttons for number inputs */
            .color_picker_input[type="number"]::-webkit-inner-spin-button,
            .color_picker_input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /* Firefox */
            .color_picker_input[type="number"] {
                -moz-appearance: textfield;
            }
            
            .input_wrapper {
                display: flex;
                align-items: center;
            }

            .input_prefix {
                width: 20px;
                font-size: var(--form-default-font-size);
                color: var(--form-default-input-text-color);
                display:block;
            }
            
            .input_suffix {
                margin-left: 5px;
                font-size: var(--form-default-font-size);
                color: var(--form-default-input-text-color);
                display:block;
            }

            .block_header {
                font-weight: bold;
                color: var(--form-default-input-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                padding: 2px;
                margin-bottom: 5px;
                text-align: center;
                border-bottom: 1px solid var(--form-default-input-border-color);
                grid-column: 1 / -1;
            }

            `, null, {
            'sections': 'sections',
            'q_form_color_picker_wrapper': 'q_form_color_picker_wrapper',
            'left_wrapper': 'left_wrapper',
            'right_wrapper': 'right_wrapper',
            'color_picker_input': 'color_picker_input',
            'input_wrapper': 'input_wrapper',
            'input_prefix': 'input_prefix',
            'input_suffix': 'input_suffix',
            'section_snatches': 'section_snatches',
            'section_first': 'section_first',
            'section_second': 'section_second',
            'section_third': 'section_third',
            'section_fourth': 'section_fourth',

            'block_hsb': 'block_hsb',
            'block_rgb': 'block_rgb',
            'block_lab': 'block_lab',
            'block_cmyk': 'block_cmyk',
            'block_rgb888': 'block_rgb888',
            'block_rgb565': 'block_rgb565',
            'block_rgb': 'block_rgb',
            'block_hex': 'block_hex',
            'block_hsl': 'block_hsl',
            'input_h': 'input_h',
            'input_s': 'input_s',
            'input_b': 'input_b',
            'input_r': 'input_r',
            'input_g': 'input_g',
            'input_b2': 'input_b2',
            'input_l': 'input_l',
            'input_a': 'input_a',
            'input_b3': 'input_b3',
            'input_c': 'input_c',
            'input_m': 'input_m',
            'input_y': 'input_y',
            'input_k': 'input_k',
            'input_rgb888': 'input_rgb888',
            'input_rgb565': 'input_rgb565',
            'input_rgb': 'input_rgb',
            'input_hex': 'input_hex',
            'input_hsl': 'input_hsl',
            'input_lab': 'input_lab',
            'input_cmyk': 'input_cmyk',
            'block_header': 'block_header'
        }, false);
        Form.ColorPickerClassesInitialized = true;
    }



    const width = options.width || 300;
    const height = options.height || 300;
    const showDetails = options.showDetails || true;

    const wrapper = Q('<div>');

    const canvas = Q(`<canvas width="${width}" height="${height}"></canvas>`);


    let input_h, input_s, input_b, input_r, input_g, input_b2, input_l, input_a, input_b3, input_c, input_m, input_y, input_k, input_rgb888, input_rgb565, input_rgb, input_hex, input_hsl, input_lab, input_cmyk;


    if (showDetails) {

        canvas.css({
            'width': '100%',
            'height': '100%',
        });

        wrapper.addClass(Form.colorPickerClasses.q_form_color_picker_wrapper);
        const left_wrapper = Q('<div>', { class: Form.colorPickerClasses.left_wrapper });
        const right_wrapper = Q('<div>', { class: Form.colorPickerClasses.right_wrapper });

        const section_snatches = Q('<div>', { class: Form.colorPickerClasses.section_snatches });
        const section_first = Q('<div>', { class: Form.colorPickerClasses.section_first + ' ' + Form.colorPickerClasses.sections });
        const section_second = Q('<div>', { class: Form.colorPickerClasses.section_second + ' ' + Form.colorPickerClasses.sections });
        const section_third = Q('<div>', { class: Form.colorPickerClasses.section_third + ' ' + Form.colorPickerClasses.sections });
        const section_fourth = Q('<div>', { class: Form.colorPickerClasses.section_fourth + ' ' + Form.colorPickerClasses.sections });

        const block_hsb = Q('<div>', { class: Form.colorPickerClasses.block_hsb });
        const block_rgb = Q('<div>', { class: Form.colorPickerClasses.block_rgb });
        const block_lab = Q('<div>', { class: Form.colorPickerClasses.block_lab });
        const block_cmyk = Q('<div>', { class: Form.colorPickerClasses.block_cmyk });

        const block_rgb888 = Q('<div>', { class: Form.colorPickerClasses.block_rgb888 });
        const block_rgb565 = Q('<div>', { class: Form.colorPickerClasses.block_rgb565 });
        
        // Create the missing HSL block
        const block_hsl = Q('<div>', { class: Form.colorPickerClasses.block_hsl });

        // Create block headers
        const header_hsb = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'HSB Color'
        });

        const header_rgb = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'RGB Color'
        });

        const header_lab = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'LAB Color'
        });

        const header_cmyk = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'CMYK Color'
        });

        const header_rgb888 = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'RGB888'
        });

        const header_rgb565 = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'RGB565'
        });
        
        // Create header for HSL block
        const header_hsl = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'HSL Color'
        });

        // Helper function to create input with prefix and optional suffix
        const createInputWithLabel = (type, className, value, min, max, prefix, suffix) => {
            const wrapper = Q('<div>', { class: Form.colorPickerClasses.input_wrapper });
            const prefixElement = Q('<span>', { class: Form.colorPickerClasses.input_prefix, text: prefix });
            const input = Q('<input>', {
                type: type,
                class: Form.colorPickerClasses.color_picker_input + ' ' + className,
                value: value
            });

            if (type === 'number') {
                input.attr('min', min);
                input.attr('max', max);
            } else if (type === 'text') {
                input.attr('maxlength', max || 20);
            }

            wrapper.append(prefixElement, input);

            if (suffix) {
                const suffixElement = Q('<span>', { class: Form.colorPickerClasses.input_suffix, text: suffix });
                wrapper.append(suffixElement);
            }

            return { wrapper, input };
        };

        // HSB inputs
        const input_h_obj = createInputWithLabel('number', Form.colorPickerClasses.input_h, 0, 0, 360, 'H:', '°');
        const input_s_obj = createInputWithLabel('number', Form.colorPickerClasses.input_s, 0, 0, 100, 'S:', '%');
        const input_b_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b, 0, 0, 100, 'B:', '%');

        // RGB inputs
        const input_r_obj = createInputWithLabel('number', Form.colorPickerClasses.input_r, 0, 0, 255, 'R:');
        const input_g_obj = createInputWithLabel('number', Form.colorPickerClasses.input_g, 0, 0, 255, 'G:');
        const input_b2_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b2, 0, 0, 255, 'B:');

        // LAB inputs
        const input_l_obj = createInputWithLabel('number', Form.colorPickerClasses.input_l, 0, 0, 100, 'L:');
        const input_a_obj = createInputWithLabel('number', Form.colorPickerClasses.input_a, 0, -128, 127, 'a:');
        const input_b3_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b3, 0, -128, 127, 'b:');

        // CMYK inputs
        const input_c_obj = createInputWithLabel('number', Form.colorPickerClasses.input_c, 0, 0, 100, 'C:', '%');
        const input_m_obj = createInputWithLabel('number', Form.colorPickerClasses.input_m, 0, 0, 100, 'M:', '%');
        const input_y_obj = createInputWithLabel('number', Form.colorPickerClasses.input_y, 0, 0, 100, 'Y:', '%');
        const input_k_obj = createInputWithLabel('number', Form.colorPickerClasses.input_k, 0, 0, 100, 'K:', '%');

        // Other format inputs
        const input_rgb888_obj = createInputWithLabel('text', Form.colorPickerClasses.input_rgb888, '0x000000', null, 8, '888:');
        const input_rgb565_obj = createInputWithLabel('text', Form.colorPickerClasses.input_rgb565, '0x0000', null, 6, '565:');
        const input_rgb_obj = createInputWithLabel('text', Form.colorPickerClasses.input_rgb, 'rgb(0,0,0)', null, 20, 'RGB:');
        const input_hex_obj = createInputWithLabel('text', Form.colorPickerClasses.input_hex, '#000000', null, 7, 'Hex:');
        const input_hsl_obj = createInputWithLabel('text', Form.colorPickerClasses.input_hsl, 'hsl(0,0%,0%)', null, 20, 'HSL:');
        const input_lab_obj = createInputWithLabel('text', Form.colorPickerClasses.input_lab, 'lab(0,0,0)', null, 20, 'LAB:');
        const input_cmyk_obj = createInputWithLabel('text', Form.colorPickerClasses.input_cmyk, 'cmyk(0%,0%,0%,0%)', null, 20, 'CMYK:');

        // Store references to input elements
        input_h = input_h_obj.input;
        input_s = input_s_obj.input;
        input_b = input_b_obj.input;
        input_r = input_r_obj.input;
        input_g = input_g_obj.input;
        input_b2 = input_b2_obj.input;
        input_l = input_l_obj.input;
        input_a = input_a_obj.input;
        input_b3 = input_b3_obj.input;
        input_c = input_c_obj.input;
        input_m = input_m_obj.input;
        input_y = input_y_obj.input;
        input_k = input_k_obj.input;
        input_rgb888 = input_rgb888_obj.input;
        input_rgb565 = input_rgb565_obj.input;
        input_rgb = input_rgb_obj.input;
        input_hex = input_hex_obj.input;
        input_hsl = input_hsl_obj.input;
        input_lab = input_lab_obj.input;
        input_cmyk = input_cmyk_obj.input;

        // Add event listeners to all inputs
        function setupInputListeners() {
            // HSB inputs
            input_h.on('input', updateFromHSB);
            input_s.on('input', updateFromHSB);
            input_b.on('input', updateFromHSB);
            
            // RGB inputs
            input_r.on('input', updateFromRGB);
            input_g.on('input', updateFromRGB);
            input_b2.on('input', updateFromRGB);
            
            // LAB inputs
            input_l.on('input', updateFromLAB);
            input_a.on('input', updateFromLAB);
            input_b3.on('input', updateFromLAB);
            
            // CMYK inputs
            input_c.on('input', updateFromCMYK);
            input_m.on('input', updateFromCMYK);
            input_y.on('input', updateFromCMYK);
            input_k.on('input', updateFromCMYK);
            
            // Text format inputs
            input_hex.on('input', updateFromHex);
            input_rgb.on('input', updateFromRGBString);
            input_hsl.on('input', updateFromHSLString);
        }

        function updateFromHSB() {
            const h = parseInt(input_h.val()) / 360;
            const s = parseInt(input_s.val()) / 100;
            const b = parseInt(input_b.val()) / 100;
            
            const [r, g, b2] = Q.HSL2RGB(h, s, (2 * b - b * s) / 2); // Convert HSB to RGB
            
            updatePickerFromRGB(Math.round(r), Math.round(g), Math.round(b2));
        }
        
        function updateFromRGB() {
            const r = parseInt(input_r.val());
            const g = parseInt(input_g.val());
            const b = parseInt(input_b2.val());
            
            updatePickerFromRGB(r, g, b);
        }
        
        function updateFromLAB() {
            const l = parseFloat(input_l.val());
            const a = parseFloat(input_a.val());
            const b = parseFloat(input_b3.val());
            
            // LAB to RGB conversion is complex but we can add a simpler approximation here
            // This is a placeholder, actual conversion would require more complex code
            const [r, g, b2] = labToRGB(l, a, b);
            updatePickerFromRGB(r, g, b2);
        }
        
        function updateFromCMYK() {
            const c = parseInt(input_c.val()) / 100;
            const m = parseInt(input_m.val()) / 100;
            const y = parseInt(input_y.val()) / 100;
            const k = parseInt(input_k.val()) / 100;
            
            // CMYK to RGB conversion
            const r = Math.round(255 * (1 - c) * (1 - k));
            const g = Math.round(255 * (1 - m) * (1 - k));
            const b = Math.round(255 * (1 - y) * (1 - k));
            
            updatePickerFromRGB(r, g, b);
        }
        
        function updateFromHex() {
            const hex = input_hex.val();
            if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                
                updatePickerFromRGB(r, g, b);
            }
        }
        
        function updateFromRGBString() {
            const rgbStr = input_rgb.val();
            const match = rgbStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                
                updatePickerFromRGB(r, g, b);
            }
        }
        
        function updateFromHSLString() {
            const hslStr = input_hsl.val();
            const match = hslStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
            if (match) {
                const h = parseInt(match[1]) / 360;
                const s = parseInt(match[2]) / 100;
                const l = parseInt(match[3]) / 100;
                
                const [r, g, b] = Q.HSL2RGB(h, s, l);
                updatePickerFromRGB(Math.round(r), Math.round(g), Math.round(b));
            }
        }
        
        function updatePickerFromRGB(r, g, b) {
            // Extract just the hue component from the RGB color
            const [h, s, l] = Q.RGB2HSL(r, g, b);
            selectedHue = h; // Store just the hue
            
            // Position both markers based on the new color values
            positionHueMarker(h);
            positionTriangleMarker(s, l);
            
            // Redraw the picker with the new hue
            drawPicker();
            
            // Return the full color including saturation and lightness
            return `rgb(${r},${g},${b})`;
        }
        
        // Helper function to position the hue marker on the wheel
        function positionHueMarker(hue) {
            const angle = hue * 2 * Math.PI;
            const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
            markers.outer = {
                x: centerX + innerRingMiddleRadius * Math.cos(angle),
                y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
            };
            
            // Update any segment selection if needed
            if (outerSegments > 0) {
                const segmentIndex = Math.floor(hue * outerSegments) % outerSegments;
                selectedOuterSegment = (angle >= 0) ? segmentIndex : null;
            }
        }
        
        // Helper function to position the triangle marker based on s and l values
        function positionTriangleMarker(s, l) {
            const totalHeight = bottomLeftVertex.y - topVertex.y;
            const relativeY = 1 - s;
            const y = topVertex.y + relativeY * totalHeight;
            const triangleWidthAtY = (bottomRightVertex.x - bottomLeftVertex.x) * relativeY;
            
            let relativeX;
            if (relativeY === 0) {
                relativeX = 0.5;
            } else {
                if (l <= 0.5) {
                    relativeX = 1 - (l / 0.5);
                } else {
                    relativeX = (1 - l) / 0.5;
                }
            }
            
            const leftX = centerX - triangleWidthAtY / 2;
            const x = leftX + relativeX * triangleWidthAtY;
            
            markers.triangle = { x, y };
        }

        // Function to update all input fields based on the current color
        function updateInputsFromColor(color) {
            if (!color) return;
            
            let r, g, b;
            
            // Parse the color string to get RGB values
            if (color.startsWith('rgb')) {
                const match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                if (match) {
                    r = parseInt(match[1]);
                    g = parseInt(match[2]);
                    b = parseInt(match[3]);
                }
            } else if (color.startsWith('#')) {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            }
            
            if (r === undefined || g === undefined || b === undefined) return;
            
            // Update RGB inputs
            input_r.val(r);
            input_g.val(g);
            input_b2.val(b);
            
            // Update HEX input
            const hex = '#' + 
                r.toString(16).padStart(2, '0') + 
                g.toString(16).padStart(2, '0') + 
                b.toString(16).padStart(2, '0');
            input_hex.val(hex);
            
            // Update RGB string
            input_rgb.val(`rgb(${r},${g},${b})`);
            
            // Convert to HSL and update
            const [h, s, l] = Q.RGB2HSL(r, g, b);
            input_h.val(Math.round(h * 360));
            input_s.val(Math.round(s * 100));
            input_b.val(Math.round((l * 2 / (2 - s)) * 100)); // Convert L to B (brightness)
            input_hsl.val(`hsl(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`);
            
            // Convert to LAB and update
            const [l_val, a_val, b_val] = rgbToLab(r, g, b);
            input_l.val(Math.round(l_val));
            input_a.val(Math.round(a_val));
            input_b3.val(Math.round(b_val));
            input_lab.val(`lab(${Math.round(l_val)},${Math.round(a_val)},${Math.round(b_val)})`);
            
            // Convert to CMYK and update
            const [c, m, y, k] = rgbToCmyk(r, g, b);
            input_c.val(Math.round(c * 100));
            input_m.val(Math.round(m * 100));
            input_y.val(Math.round(y * 100));
            input_k.val(Math.round(k * 100));
            input_cmyk.val(`cmyk(${Math.round(c * 100)}%,${Math.round(m * 100)}%,${Math.round(y * 100)}%,${Math.round(k * 100)}%)`);
            
            // Update RGB888 and RGB565
            input_rgb888.val('0x' + 
                r.toString(16).padStart(2, '0') + 
                g.toString(16).padStart(2, '0') + 
                b.toString(16).padStart(2, '0'));
                
            // RGB565 conversion: 5 bits R, 6 bits G, 5 bits B
            const r5 = Math.round(r * 31 / 255) & 0x1F;
            const g6 = Math.round(g * 63 / 255) & 0x3F;
            const b5 = Math.round(b * 31 / 255) & 0x1F;
            const rgb565 = (r5 << 11) | (g6 << 5) | b5;
            input_rgb565.val('0x' + rgb565.toString(16).padStart(4, '0'));
        }
        
        // Color conversion helpers
        function rgbToCmyk(r, g, b) {
            return Q.RGB2CMYK(r, g, b);
        }
        
        function rgbToLab(r, g, b) {
            return Q.RGB2LAB(r, g, b);
        }
        
        function labToRGB(l, a, b) {
            return Q.LAB2RGB(l, a, b);
        }

        // Set up the input listeners
        setupInputListeners();
        
        // Append headers and inputs to blocks
        block_hsb.append(header_hsb, input_h_obj.wrapper, input_s_obj.wrapper, input_b_obj.wrapper);
        block_rgb.append(header_rgb, input_r_obj.wrapper, input_g_obj.wrapper, input_b2_obj.wrapper);
        block_lab.append(header_lab, input_l_obj.wrapper, input_a_obj.wrapper, input_b3_obj.wrapper);
        block_cmyk.append(header_cmyk, input_c_obj.wrapper, input_m_obj.wrapper, input_y_obj.wrapper, input_k_obj.wrapper);
        block_rgb888.append(header_rgb888, input_rgb888_obj.wrapper);
        block_rgb565.append(header_rgb565, input_rgb565_obj.wrapper);
        
        // Append to HSL block
        block_hsl.append(header_hsl, input_hsl_obj.wrapper);

        section_first.append(block_hsb, block_rgb, block_lab, block_cmyk);
        section_second.append(block_rgb888, block_rgb565, block_hsl);

        // section_second.append(block_rgb888, block_rgb565, block_hsl);
        // section_second.append(block_rgb, block_lab, block_cmyk);

        left_wrapper.append(canvas);
        right_wrapper.append(section_snatches, section_first, section_second, section_third, section_fourth);
        wrapper.append(left_wrapper, right_wrapper);
    }
    else {
        canvas.css({
            'width': width + 'px',
            'height': height + 'px',
        });
        wrapper.append(canvas);
    }

    const ctx = canvas.nodes[0].getContext('2d');

    // const devicePixelRatio = window.devicePixelRatio || 1;
    // canvas.nodes[0].width = width * devicePixelRatio;
    // canvas.nodes[0].height = height * devicePixelRatio;
    // canvas.css({
    //     'width': width + 'px',
    //     'height': height + 'px'
    // });
    // ctx.scale(devicePixelRatio, devicePixelRatio);

    const centerX = width / 2;
    const ringCenterY = height / 2;

    const minDimension = Math.min(width, height);
    const globalRadius = options.globalRadius || (minDimension * 0.46);
    const outerRingThickness = options.outerRingThickness || (globalRadius * 0.05);
    const innerRingThickness = options.innerRingThickness || (globalRadius * 0.15);
    const ringPadding = options.ringPadding || (globalRadius * 0.02);

    const outerRadius = globalRadius;
    const innerRadius = outerRadius - outerRingThickness - ringPadding;
    const innerMostRadius = innerRadius - innerRingThickness - ringPadding;

    const triangleVertexRadius = innerMostRadius - (globalRadius * 0.07);

    const topVertex = {
        x: centerX,
        y: ringCenterY - triangleVertexRadius
    };
    const bottomLeftVertex = {
        x: centerX - triangleVertexRadius * Math.sin(Math.PI / 3),
        y: ringCenterY + triangleVertexRadius * Math.cos(Math.PI / 3)
    };
    const bottomRightVertex = {
        x: centerX + triangleVertexRadius * Math.sin(Math.PI / 3),
        y: ringCenterY + triangleVertexRadius * Math.cos(Math.PI / 3)
    };

    let selectedHue = 0; // Store hue as a number (0-1) instead of a color string

    let selectedOuterSegment = null;

    let activeArea = 'inner';

    let markers = {
        outer: { x: centerX, y: ringCenterY },
        triangle: { x: centerX, y: ringCenterY }

    };

    const outerSegments = options.outerSegments || 24;

    // Modify how outer colors are generated to use pure hue
    const outerColors = Array.from({ length: outerSegments }, (_, i) => {
        const hue = i * (1 / outerSegments);
        const [r, g, b] = Q.HSL2RGB(hue, 1, 0.5);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    });

    const defaultHue = 0;
    const defaultSaturation = 1;
    const defaultLightness = 0.5;

    const middleRingAngle = (defaultHue / 360) * 2 * Math.PI;
    const middleRingRadius = innerRadius - innerRingThickness / 2;
    markers.outer = {
        x: centerX + middleRingRadius * Math.cos(middleRingAngle),
        y: ringCenterY + middleRingRadius * Math.sin(middleRingAngle)
    };

    markers.triangle = {
        x: topVertex.x,
        y: topVertex.y
    };

    function drawPicker() {

        ctx.clearRect(0, 0, width, height);

        drawOuterRing();
        drawMiddleRing();
        drawTriangle();
        drawMarkers();
    }

    function drawOuterRing() {
        const segAngle = (2 * Math.PI) / outerSegments;

        for (let i = 0; i < outerSegments; i++) {
            const startAngle = i * segAngle;
            const endAngle = startAngle + segAngle;

            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = outerColors[i];
            ctx.fill();
        }
    }

    function drawMiddleRing() {
        ctx.save();

        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerRadius, 0, 2 * Math.PI);
        ctx.closePath();

        if (ctx.createConicGradient) {
            const grad = ctx.createConicGradient(0, centerX, ringCenterY);
            grad.addColorStop(0, "hsl(0, 100%, 50%)");
            grad.addColorStop(0.17, "hsl(60, 100%, 50%)");
            grad.addColorStop(0.33, "hsl(120, 100%, 50%)");
            grad.addColorStop(0.5, "hsl(180, 100%, 50%)");
            grad.addColorStop(0.67, "hsl(240, 100%, 50%)");
            grad.addColorStop(0.83, "hsl(300, 100%, 50%)");
            grad.addColorStop(1, "hsl(360, 100%, 50%)");
            ctx.fillStyle = grad;
        } else {
            const grad = ctx.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, "#FF0000");
            grad.addColorStop(0.17, "#FFFF00");
            grad.addColorStop(0.33, "#00FF00");
            grad.addColorStop(0.5, "#00FFFF");
            grad.addColorStop(0.67, "#0000FF");
            grad.addColorStop(0.83, "#FF00FF");
            grad.addColorStop(1, "#FF0000");
            ctx.fillStyle = grad;
        }
        ctx.fill();

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerRadius - innerRingThickness, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function drawTriangle() {
        ctx.save();

        ctx.beginPath();
        ctx.arc(centerX, ringCenterY, innerMostRadius * 0.8, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
        ctx.restore();
        ctx.save();

        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(topVertex.x, topVertex.y);
        ctx.lineTo(bottomLeftVertex.x, bottomLeftVertex.y);
        ctx.lineTo(bottomRightVertex.x, bottomRightVertex.y);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.fill();

        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.moveTo(topVertex.x, topVertex.y);
        ctx.lineTo(bottomLeftVertex.x, bottomLeftVertex.y);
        ctx.lineTo(bottomRightVertex.x, bottomRightVertex.y);
        ctx.closePath();
        ctx.clip();

        const gradHoriz = ctx.createLinearGradient(bottomLeftVertex.x, bottomLeftVertex.y, bottomRightVertex.x, bottomRightVertex.y);
        gradHoriz.addColorStop(0, "rgba(255,255,255,1)");
        gradHoriz.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradHoriz;
        ctx.globalCompositeOperation = 'normal';
        ctx.fillRect(bottomLeftVertex.x, topVertex.y, bottomRightVertex.x - bottomLeftVertex.x, bottomLeftVertex.y - topVertex.y);

        // Create a pure hue color for the triangle gradient
        const [r, g, b] = Q.HSL2RGB(selectedHue, 1, 0.5);
        const pureHueColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

        const gradVert = ctx.createLinearGradient(topVertex.x, topVertex.y, topVertex.x, bottomLeftVertex.y);
        gradVert.addColorStop(0, pureHueColor); // Use pure hue color instead of selectedHue
        gradVert.addColorStop(1, "#000");
        ctx.fillStyle = gradVert;
        ctx.globalCompositeOperation = 'color';
        ctx.fill();

        ctx.restore();
    }

    function drawMarkers() {
        ctx.save();
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;

        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        if (activeArea === 'inner') {

            ctx.beginPath();
            ctx.arc(markers.outer.x, markers.outer.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (activeArea === 'outer' && selectedOuterSegment !== null) {

            const segAngle = (2 * Math.PI) / outerSegments;
            const startAngle = selectedOuterSegment * segAngle;
            const endAngle = startAngle + segAngle;

            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(markers.triangle.x, markers.triangle.y, 5, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.shadowColor = "rgba(0, 0, 0, 0)";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.restore();
    }

    function computeColor() {

        let hue = 0;

        if (typeof selectedHue === 'string') {
            if (selectedHue.startsWith('rgb')) {

                const rgbMatch = selectedHue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
                    const [h] = Q.RGB2HSL(r, g, b);
                    hue = h;
                }
            } else if (selectedHue.startsWith('#')) {

                hue = 0;
            }
        }

        const triangleMarker = markers.triangle;

        const totalHeight = bottomLeftVertex.y - topVertex.y;
        const totalWidth = bottomRightVertex.x - bottomLeftVertex.x;

        const relativeY = (triangleMarker.y - topVertex.y) / totalHeight;

        const triangleWidthAtY = totalWidth * relativeY;
        const leftBoundAtY = centerX - (triangleWidthAtY / 2);

        const relativeX = triangleWidthAtY === 0 ? 0.5 :
            (triangleMarker.x - leftBoundAtY) / triangleWidthAtY;

        let saturation = 1 - (1 - relativeX) * relativeY;
        let lightness = 1 - relativeY * relativeX;

        saturation = Math.max(0, Math.min(1, saturation));
        lightness = Math.max(0, Math.min(1, lightness));

        return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
    }

    let dragging = null;

    function handleEvent(e) {
        const rect = canvas.nodes[0].getBoundingClientRect();

        // Calculate the current scaling factors based on the actual canvas size
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;

        // Get position in canvas coordinate space, accounting for scaling
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        // Use the scaled coordinates for all calculations
        const distFromCenter = Math.sqrt(Math.pow(canvasX - centerX, 2) + Math.pow(canvasY - ringCenterY, 2));

        if (distFromCenter <= outerRadius && distFromCenter >= outerRadius - outerRingThickness) {
            const angle = Math.atan2(canvasY - ringCenterY, canvasX - centerX);
            const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
            const segmentIndex = Math.floor(normalizedAngle / ((2 * Math.PI) / outerSegments));

            selectedOuterSegment = segmentIndex;
            // Calculate the hue value (0-1) from the segment index
            selectedHue = segmentIndex / outerSegments;
            activeArea = 'outer';

            if (e.type === 'mousedown') {
                dragging = false;
            }

            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
        }

        else if (distFromCenter <= innerRadius && distFromCenter >= innerRadius - innerRingThickness) {
            const angle = Math.atan2(canvasY - ringCenterY, canvasX - centerX);
            // Position the marker directly based on the angle
            const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
            markers.outer = {
                x: centerX + innerRingMiddleRadius * Math.cos(angle),
                y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
            };

            // Calculate the hue directly from the angle (0-1 range)
            const hue = (angle >= 0 ? angle : angle + 2 * Math.PI) / (2 * Math.PI);
            selectedHue = hue;

            selectedOuterSegment = null;
            activeArea = 'inner';

            if (e.type === 'mousedown') {
                dragging = 'inner_ring';
            }

            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
        }

        else if (isPointInTriangle(canvasX, canvasY, topVertex, bottomLeftVertex, bottomRightVertex)) {
            markers.triangle = { x: canvasX, y: canvasY };

            const triangleColor = computeTriangleColor(canvasX, canvasY);

            if (e.type === 'mousedown') {
                dragging = 'triangle';
            }

            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }
        }

        drawPicker();
    }

    function computeTriangleColor(x, y) {

        const totalHeight = bottomLeftVertex.y - topVertex.y;

        const relativeY = Math.max(0, Math.min(1, (y - topVertex.y) / totalHeight));

        const triangleWidthAtY = (bottomRightVertex.x - bottomLeftVertex.x) * relativeY;
        const leftX = centerX - triangleWidthAtY / 2;
        const rightX = centerX + triangleWidthAtY / 2;

        const relativeX = Math.max(0, Math.min(1, (x - leftX) / (rightX - leftX)));

        const saturation = 1 - relativeY;

        let lightness = 0.5;

        if (relativeY > 0) {

            lightness = 0.5 * (1 - relativeY) + relativeY * (1 - relativeX);
        }

        const clampedSaturation = Math.max(0, Math.min(1, saturation));
        const clampedLightness = Math.max(0, Math.min(1, lightness));

        // Always use the selectedHue directly instead of parsing from a color string
        const [r, g, b] = Q.HSL2RGB(selectedHue, clampedSaturation, clampedLightness);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    function isPointInTriangle(px, py, v1, v2, v3) {
        const d1 = sign(px, py, v1.x, v1.y, v2.x, v2.y);
        const d2 = sign(px, py, v2.x, v2.y, v3.x, v3.y);
        const d3 = sign(px, py, v3.x, v3.y, v1.x, v1.y);

        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);

        const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
        return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
    }

    canvas.nodes[0].addEventListener('mousedown', e => {
        dragging = true;
        handleEvent(e);
    });

    window.addEventListener('mousemove', e => {
        if (dragging === 'inner_ring' || dragging === 'hue_stripe' ||
            dragging === 'sat_stripe') {
            handleEvent(e);
        } else if (dragging === 'triangle') {
            const rect = canvas.nodes[0].getBoundingClientRect();

            // Calculate the current scaling factors
            const scaleX = width / rect.width;
            const scaleY = height / rect.height;

            // Get position in canvas coordinate space, accounting for scaling
            const canvasX = (e.clientX - rect.left) * scaleX;
            const canvasY = (e.clientY - rect.top) * scaleY;

            const constrainedPosition = constrainToTriangle(canvasX, canvasY, topVertex, bottomLeftVertex, bottomRightVertex);

            markers.triangle = constrainedPosition;

            const triangleColor = computeTriangleColor(constrainedPosition.x, constrainedPosition.y);

            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }

            drawPicker();
        }
    });

    window.addEventListener('mouseup', () => { dragging = false; });

    function constrainToTriangle(x, y, v1, v2, v3) {

        if (isPointInTriangle(x, y, v1, v2, v3)) {
            return { x, y };
        }

        const denominator = ((v2.y - v3.y) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.y - v3.y));
        let a = ((v2.y - v3.y) * (x - v3.x) + (v3.x - v2.x) * (y - v3.y)) / denominator;
        let b = ((v3.y - v1.y) * (x - v3.x) + (v1.x - v3.x) * (y - v3.y)) / denominator;
        let c = 1 - a - b;

        if (a < 0) a = 0;
        if (b < 0) b = 0;
        if (c < 0) c = 0;

        const sum = a + b + c;
        if (sum > 0) {
            a /= sum;
            b /= sum;
            c /= sum;
        } else {

            a = b = c = 1 / 3;
        }

        return {
            x: a * v1.x + b * v2.x + c * v3.x,
            y: a * v1.y + b * v2.y + c * v3.y
        };
    }

    wrapper.change = function (callback) {
        // Store the original callback
        const originalCallback = callback;

        // Create a debounced version of the callback
        wrapper.changeCallback = function (color) {
            Q.Debounce('colorpicker_change', 15, function () {
                // Update all input fields with the new color
                if (showDetails && input_h) {
                    updateInputsFromColor(color);
                }
                originalCallback(color);
            });
        };

        return this;
    };

    wrapper.val = function (color) {
        if (!color) {
            return computeColor();
        }

        if (color.startsWith('#') || color.startsWith('rgb')) {
            let r, g, b;

            if (color.startsWith('rgb')) {
                const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    r = parseInt(rgbMatch[1]);
                    g = parseInt(rgbMatch[2]);
                    b = parseInt(rgbMatch[3]);
                }
            } else if (color.startsWith('#')) {
                const hex = color.slice(1);
                if (hex.length === 3) {
                    r = parseInt(hex[0] + hex[0], 16);
                    g = parseInt(hex[1] + hex[1], 16);
                    b = parseInt(hex[2] + hex[2], 16);
                } else if (hex.length === 6) {
                    r = parseInt(hex.slice(0, 2), 16);
                    g = parseInt(hex.slice(2, 4), 16);
                    b = parseInt(hex.slice(4, 6), 16);
                }
            }

            const [h, s, l] = Q.RGB2HSL(r, g, b);
            // Update just the hue while keeping the color's saturation and lightness for the marker
            selectedHue = h;
            
            // Position both markers using our helper functions
            positionHueMarker(h);
            positionTriangleMarker(s, l);

            drawPicker();

            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(color);
            }
        }

        return this;
    };

    drawPicker();
    console.log('ColorPicker drawn on canvas');

    this.elements.push(wrapper);
    return wrapper;
};