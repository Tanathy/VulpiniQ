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
                flex: 1;
                padding: 5px;
            }
            .section_snatches, .section_second, .section_third, .section_fourth {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .sections {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2px;
                flex: 1;
            }
            .color_picker_input {
                background-color: var(--form-default-background);
                border-radius: var(--form-default-border-radius);
                padding: 2px;
                margin: 2px;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                outline: var(--form-default-outline);
                border: 0;
                width: 45px;
                text-align: center;
            }
            .input_rgb888, .input_rgb565, .input_hsl
            {
            width: 100%;
            }
            .color_picker_input:focus {
                outline: none;
                background-color: var(--form-default-background-focus);
                outline: var(--form-default-outline-focus);
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
            .half_snatch {
                height: 50%;
                width: 100%;
        }
        .picker_blocks {
        background: rgba(0, 0, 0, 0.1);
        border-radius: var(--form-default-border-radius);
        padding: 5px;
        margin: 2px;
        }
            .input_snatches {
            width:40px;
            height:40px;
            border-radius: 10px;
            background-color: var(--form-default-background);
            color: var(--form-default-text-color);
            font-family: var(--form-default-font-family);
            font-size: var(--form-default-font-size);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .snatches_wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
        }
        .input_snatch_wrapper {
            display: flex;
            flex-direction: column;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            overflow: hidden;
        }
            .input_prefix {
            user-select: none;
                width: 20px;
                font-size: var(--form-default-font-size);
                color: var(--form-default-text-color);
                display:block;
            }
            .input_suffix {
            user-select: none;
                margin-left: 5px;
                font-size: var(--form-default-font-size);
                color: var(--form-default-text-color);
                display:block;
            }
            .block_header {
            user-select: none;
                font-weight: bold;
                color: var(--form-default-text-color);
                font-family: var(--form-default-font-family);
                font-size: var(--form-default-font-size);
                text-align: center;
                grid-column: 1 / -1;
            }
            .snatches_add {
            cursor: pointer;
            user-select: none;
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
            'input_snatches': 'input_snatches',
            'input_snatch_wrapper': 'input_snatch_wrapper',
            'half_snatch': 'half_snatch',
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
            'block_header': 'block_header',
            'snatches_wrapper': 'snatches_wrapper',
            'picker_blocks': 'picker_blocks',
            'snatches_add': 'snatches_add'
        }, false);
        Form.ColorPickerClassesInitialized = true;
    }
    const width = options.width || 300;
    const height = options.height || 300;
    const showDetails = options.showDetails !== undefined ? options.showDetails : true;
    const initialColor = options.color || '#FF0000';
    const wrapper = Q('<div>');
    const canvas = Q(`<canvas width="${width}" height="${height}"></canvas>`);
    let current_color, previous_color, input_h, input_s, input_b, input_r, input_g, input_b2, input_l, input_a, input_b3, input_c, input_m, input_y, input_k, input_rgb888, input_rgb565, input_rgb, input_hex, input_hsl, input_lab, input_cmyk;
    let snatches = [];
    if (showDetails) {
        canvas.css({
            'width': '100%',
            'height': '100%',
        });
        wrapper.addClass(Form.colorPickerClasses.q_form_color_picker_wrapper);
        const left_wrapper = Q('<div>', { class: Form.colorPickerClasses.left_wrapper });
        const right_wrapper = Q('<div>', { class: Form.colorPickerClasses.right_wrapper });
        const snatches_wrapper = Q('<div>', { class: Form.colorPickerClasses.snatches_wrapper + ' ' + Form.colorPickerClasses.picker_blocks });
        const section_snatches = Q('<div>', { class: Form.colorPickerClasses.section_snatches });
        const section_first = Q('<div>', { class: Form.colorPickerClasses.section_first });
        const section_second = Q('<div>', { class: Form.colorPickerClasses.section_second + ' ' + Form.colorPickerClasses.sections });
        const section_third = Q('<div>', { class: Form.colorPickerClasses.section_third + ' ' + Form.colorPickerClasses.sections });
        const section_fourth = Q('<div>', { class: Form.colorPickerClasses.section_fourth + ' ' + Form.colorPickerClasses.sections });
        const block_hsb = Q('<div>', { class: Form.colorPickerClasses.block_hsb + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_rgb = Q('<div>', { class: Form.colorPickerClasses.block_rgb + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_lab = Q('<div>', { class: Form.colorPickerClasses.block_lab + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_cmyk = Q('<div>', { class: Form.colorPickerClasses.block_cmyk + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_rgb888 = Q('<div>', { class: Form.colorPickerClasses.block_rgb888 + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_rgb565 = Q('<div>', { class: Form.colorPickerClasses.block_rgb565 + ' ' + Form.colorPickerClasses.picker_blocks });
        const block_hsl = Q('<div>', { class: Form.colorPickerClasses.block_hsl + ' ' + Form.colorPickerClasses.picker_blocks });
        // Create block headers
        const header_hsb = Q('<div>', {
            class: Form.colorPickerClasses.block_header,
            text: 'HSL Color' // Changed from 'HSB Color' to 'HSL Color'
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
        const snatch_add = Q('<div>', { class: Form.colorPickerClasses.input_snatches + ' ' + Form.colorPickerClasses.snatches_add, text: '+' });
        const snatch_1 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_2 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_3 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_4 = Q('<div>', { class: Form.colorPickerClasses.input_snatches});
        const snatch_prev_current_wrapper = Q('<div>', { class: Form.colorPickerClasses.input_snatch_wrapper });
        current_color = Q('<div>', { class: Form.colorPickerClasses.half_snatch });
        previous_color = Q('<div>', { class: Form.colorPickerClasses.half_snatch });
        snatch_prev_current_wrapper.append(current_color,previous_color);
        // collect history slots
        snatches = [snatch_1, snatch_2, snatch_3, snatch_4];
        // click on a snatch to load it into picker
        snatches.forEach(slot => slot.on('click', () => {
            const col = slot.css('background-color');
            if (col) wrapper.val(col);
        }));
        // "+" adds current color to front, shifts others down
        snatch_add.on('click', () => {
            for (let i = snatches.length - 1; i > 0; i--) {
                snatches[i].css('background-color', snatches[i - 1].css('background-color'));
            }
            snatches[0].css('background-color', current_color.css('background-color'));
        });
        // HSB inputs (renamed to HSL)
        const input_h_obj = createInputWithLabel('number', Form.colorPickerClasses.input_h, 0, 0, 360, 'H:', '°');
        const input_s_obj = createInputWithLabel('number', Form.colorPickerClasses.input_s, 0, 0, 100, 'S:', '%');
        const input_b_obj = createInputWithLabel('number', Form.colorPickerClasses.input_b, 0, 0, 100, 'L:', '%'); // Changed 'B:' to 'L:'
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
        // --- CENTRAL COLOR UPDATE FUNCTION ---
        function setColor({r, g, b, h, s, l, lab, cmyk, hex, hsl, source}) {
            // If RGB is present, calculate everything from it
            if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
                // RGB -> HSL
                [h, s, l] = Q.RGB2HSL(r, g, b);
                // RGB -> LAB
                lab = Q.RGB2LAB(r, g, b);
                // RGB -> CMYK
                cmyk = Q.RGB2CMYK(r, g, b);
                // RGB -> HEX
                hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                // RGB -> HSL string
                hsl = `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
            } else if (typeof h === 'number' && typeof s === 'number' && typeof l === 'number') {
                // HSL -> RGB
                [r, g, b] = Q.HSL2RGB(h, s, l);
                // RGB -> LAB
                lab = Q.RGB2LAB(r, g, b);
                // RGB -> CMYK
                cmyk = Q.RGB2CMYK(r, g, b);
                // RGB -> HEX
                hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                // HSL string
                hsl = `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
            } else if (lab && lab.length === 3) {
                // LAB -> RGB
                [r, g, b] = Q.LAB2RGB(lab[0], lab[1], lab[2]);
                [h, s, l] = Q.RGB2HSL(r, g, b);
                cmyk = Q.RGB2CMYK(r, g, b);
                hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                hsl = `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
            } else if (cmyk && cmyk.length === 4) {
                // CMYK -> RGB
                r = Math.round(255 * (1 - cmyk[0]) * (1 - cmyk[3]));
                g = Math.round(255 * (1 - cmyk[1]) * (1 - cmyk[3]));
                b = Math.round(255 * (1 - cmyk[2]) * (1 - cmyk[3]));
                [h, s, l] = Q.RGB2HSL(r, g, b);
                lab = Q.RGB2LAB(r, g, b);
                hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                hsl = `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
            } else if (typeof hex === 'string' && hex.length === 7) {
                r = parseInt(hex.slice(1, 3), 16);
                g = parseInt(hex.slice(3, 5), 16);
                b = parseInt(hex.slice(5, 7), 16);
                [h, s, l] = Q.RGB2HSL(r, g, b);
                lab = Q.RGB2LAB(r, g, b);
                cmyk = Q.RGB2CMYK(r, g, b);
                hsl = `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
            } else if (typeof hsl === 'string') {
                const match = hsl.match(/hsl\((\d+),(\d+)%?,(\d+)%?\)/);
                if (match) {
                    h = parseInt(match[1])/360;
                    s = parseInt(match[2])/100;
                    l = parseInt(match[3])/100;
                    [r, g, b] = Q.HSL2RGB(h, s, l);
                    lab = Q.RGB2LAB(r, g, b);
                    cmyk = Q.RGB2CMYK(r, g, b);
                    hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                }
            } else {
                return;
            }
            // --- UPDATE ALL INPUTS ---
            input_r.val(Math.round(r));
            input_g.val(Math.round(g));
            input_b2.val(Math.round(b));
            input_h.val(Math.round(h*360));
            input_s.val(Math.round(s*100));
            input_b.val(Math.round(l*100));
            input_l.val(Math.round(lab[0]));
            input_a.val(Math.round(lab[1]));
            input_b3.val(Math.round(lab[2]));
            input_c.val(Math.round(cmyk[0]*100));
            input_m.val(Math.round(cmyk[1]*100));
            input_y.val(Math.round(cmyk[2]*100));
            input_k.val(Math.round(cmyk[3]*100));
            input_hex.val(hex);
            input_rgb.val(`rgb(${r},${g},${b})`);
            input_hsl.val(hsl);
            input_lab.val(`lab(${Math.round(lab[0])},${Math.round(lab[1])},${Math.round(lab[2])})`);
            input_cmyk.val(`cmyk(${Math.round(cmyk[0]*100)}%,${Math.round(cmyk[1]*100)}%,${Math.round(cmyk[2]*100)}%,${Math.round(cmyk[3]*100)}%)`);
            input_rgb888.val('0x' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'));
            const r5 = Math.round(r * 31 / 255) & 0x1F;
            const g6 = Math.round(g * 63 / 255) & 0x3F;
            const b5 = Math.round(b * 31 / 255) & 0x1F;
            const rgb565 = (r5 << 11) | (g6 << 5) | b5;
            input_rgb565.val('0x' + rgb565.toString(16).padStart(4, '0'));            // --- MARKER AND CANVAS UPDATE ---
            selectedHue = h;
            positionHueMarker(h);
            positionTriangleMarker(r, g, b);
            drawPicker();
            current_color.css('background-color', hex);
            // --- CALLBACK ---
            if (typeof wrapper.changeCallback === 'function' && source !== 'callback') {
                wrapper.changeCallback(hex);
            }
        }
        // Every input event calls this:
        function setupInputListeners() {
            input_h.on('input', function(){ setColor({h:parseInt(input_h.val())/360, s:parseInt(input_s.val())/100, l:parseInt(input_b.val())/100, source:'input'}); });
            input_s.on('input', function(){ setColor({h:parseInt(input_h.val())/360, s:parseInt(input_s.val())/100, l:parseInt(input_b.val())/100, source:'input'}); });
            input_b.on('input', function(){ setColor({h:parseInt(input_h.val())/360, s:parseInt(input_s.val())/100, l:parseInt(input_b.val())/100, source:'input'}); });
            input_r.on('input', function(){ setColor({r:parseInt(input_r.val()), g:parseInt(input_g.val()), b:parseInt(input_b2.val()), source:'input'}); });
            input_g.on('input', function(){ setColor({r:parseInt(input_r.val()), g:parseInt(input_g.val()), b:parseInt(input_b2.val()), source:'input'}); });
            input_b2.on('input', function(){ setColor({r:parseInt(input_r.val()), g:parseInt(input_g.val()), b:parseInt(input_b2.val()), source:'input'}); });
            input_l.on('input', function(){ setColor({lab:[parseFloat(input_l.val()),parseFloat(input_a.val()),parseFloat(input_b3.val())], source:'input'}); });
            input_a.on('input', function(){ setColor({lab:[parseFloat(input_l.val()),parseFloat(input_a.val()),parseFloat(input_b3.val())], source:'input'}); });
            input_b3.on('input', function(){ setColor({lab:[parseFloat(input_l.val()),parseFloat(input_a.val()),parseFloat(input_b3.val())], source:'input'}); });
            input_c.on('input', function(){ setColor({cmyk:[parseInt(input_c.val())/100,parseInt(input_m.val())/100,parseInt(input_y.val())/100,parseInt(input_k.val())/100], source:'input'}); });
            input_m.on('input', function(){ setColor({cmyk:[parseInt(input_c.val())/100,parseInt(input_m.val())/100,parseInt(input_y.val())/100,parseInt(input_k.val())/100], source:'input'}); });
            input_y.on('input', function(){ setColor({cmyk:[parseInt(input_c.val())/100,parseInt(input_m.val())/100,parseInt(input_y.val())/100,parseInt(input_k.val())/100], source:'input'}); });
            input_k.on('input', function(){ setColor({cmyk:[parseInt(input_c.val())/100,parseInt(input_m.val())/100,parseInt(input_y.val())/100,parseInt(input_k.val())/100], source:'input'}); });
            input_hex.on('input', function(){ setColor({hex:input_hex.val(), source:'input'}); });
            input_rgb.on('input', function(){
                const match = input_rgb.val().match(/rgb\((\d+),(\d+),(\d+)\)/);
                if (match) setColor({r:parseInt(match[1]),g:parseInt(match[2]),b:parseInt(match[3]), source:'input'});
            });
            input_hsl.on('input', function(){ setColor({hsl:input_hsl.val(), source:'input'}); });
        }
        // --- INPUT VALIDATION HELPERS ---
        function clampInt(val, min, max) {
            val = Math.floor(Number(val));
            if (isNaN(val)) return min;
            return Math.max(min, Math.min(max, val));
        }
        function validateRGBInput(e) {
            let v = e.target.value;
            v = v.replace(/[^0-9]/g, ''); // Only digits
            v = clampInt(v, 0, 255);
            e.target.value = v;
        }
        function validateHInput(e) {
            let v = e.target.value;
            v = v.replace(/[^0-9]/g, '');
            v = clampInt(v, 0, 360);
            e.target.value = v;
        }
        function validateSLInput(e) {
            let v = e.target.value;
            v = v.replace(/[^0-9]/g, '');
            v = clampInt(v, 0, 100);
            e.target.value = v;
        }
        // Attach validation to RGB inputs
        input_r.on('input', validateRGBInput);
        input_g.on('input', validateRGBInput);
        input_b2.on('input', validateRGBInput);
        // Attach validation to HSL inputs
        input_h.on('input', validateHInput);
        input_s.on('input', validateSLInput);
        input_b.on('input', validateSLInput);
        // Optionally, add to CMYK if you want only 0-100 ints
        input_c.on('input', validateSLInput);
        input_m.on('input', validateSLInput);
        input_y.on('input', validateSLInput);
        input_k.on('input', validateSLInput);
        // --- CMYK calculation note ---
        // Q.RGB2CMYK is standard, but if you want a different formula, specify it.
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
        }        // Helper function to position the triangle marker based on RGB values using optimized sampling
        function positionTriangleMarker(targetR, targetG, targetB) {
            // If we have HSL values instead of RGB, convert them first
            if (arguments.length === 2) {
                const s = arguments[0];
                const l = arguments[1];
                const [r, g, b] = Q.HSL2RGB(selectedHue, s, l);
                targetR = Math.round(r);
                targetG = Math.round(g);
                targetB = Math.round(b);
            }
            let bestX = topVertex.x;
            let bestY = topVertex.y;
            let minDistance = Infinity;
            // Coarse sampling first (faster)
            const coarseSampleStep = 8;
            let coarseBestX = bestX;
            let coarseBestY = bestY;
            let coarseMinDistance = Infinity;
            // Get triangle bounding box
            const minX = Math.min(topVertex.x, bottomLeftVertex.x, bottomRightVertex.x);
            const maxX = Math.max(topVertex.x, bottomLeftVertex.x, bottomRightVertex.x);
            const minY = Math.min(topVertex.y, bottomLeftVertex.y, bottomRightVertex.y);
            const maxY = Math.max(topVertex.y, bottomLeftVertex.y, bottomRightVertex.y);
            // Coarse pass
            for (let x = minX; x <= maxX; x += coarseSampleStep) {
                for (let y = minY; y <= maxY; y += coarseSampleStep) {
                    if (!isPointInTriangle(x, y, topVertex, bottomLeftVertex, bottomRightVertex)) {
                        continue;
                    }
                    const [r, g, b] = getTriangleColorAtPosition(x, y);
                    const distance = Math.sqrt(
                        (r - targetR) * (r - targetR) +
                        (g - targetG) * (g - targetG) +
                        (b - targetB) * (b - targetB)
                    );
                    if (distance < coarseMinDistance) {
                        coarseMinDistance = distance;
                        coarseBestX = x;
                        coarseBestY = y;
                    }
                }
            }
            // Fine pass around the best coarse position
            const fineRadius = coarseSampleStep;
            const fineSampleStep = 1;
            for (let x = coarseBestX - fineRadius; x <= coarseBestX + fineRadius; x += fineSampleStep) {
                for (let y = coarseBestY - fineRadius; y <= coarseBestY + fineRadius; y += fineSampleStep) {
                    if (x < minX || x > maxX || y < minY || y > maxY) continue;
                    if (!isPointInTriangle(x, y, topVertex, bottomLeftVertex, bottomRightVertex)) {
                        continue;
                    }
                    const [r, g, b] = getTriangleColorAtPosition(x, y);
                    const distance = Math.sqrt(
                        (r - targetR) * (r - targetR) +
                        (g - targetG) * (g - targetG) +
                        (b - targetB) * (b - targetB)
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestX = x;
                        bestY = y;
                    }
                    // Early exit if exact match found
                    if (distance < 1) {
                        break;
                    }
                }
                // Early exit if exact match found
                if (minDistance < 1) {
                    break;
                }
            }
            markers.triangle = { x: bestX, y: bestY };
        }
        // Helper function to get RGB color at a specific triangle position
        function getTriangleColorAtPosition(x, y) {
            const denominator = (bottomLeftVertex.y - bottomRightVertex.y) * (topVertex.x - bottomRightVertex.x) + 
                               (bottomRightVertex.x - bottomLeftVertex.x) * (topVertex.y - bottomRightVertex.y);
            if (Math.abs(denominator) < 1e-10) return [0, 0, 0];
            const u = ((bottomLeftVertex.y - bottomRightVertex.y) * (x - bottomRightVertex.x) + 
                       (bottomRightVertex.x - bottomLeftVertex.x) * (y - bottomRightVertex.y)) / denominator;
            const v = ((bottomRightVertex.y - topVertex.y) * (x - bottomRightVertex.x) + 
                       (topVertex.x - bottomRightVertex.x) * (y - bottomRightVertex.y)) / denominator;
            const w = 1 - u - v;
            // Normalize coordinates
            const sum = u + v + w;
            const normalizedU = sum > 0 ? u / sum : 0;
            const normalizedV = sum > 0 ? v / sum : 0;
            // Calculate RGB color at this position
            const s = Math.max(0, Math.min(1, normalizedU));
            const l = Math.max(0, Math.min(1, normalizedV + normalizedU * 0.5));
            const [r, g, b] = Q.HSL2RGB(selectedHue, s, l);
            return [Math.round(r), Math.round(g), Math.round(b)];
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
        snatches_wrapper.append(snatch_prev_current_wrapper, snatch_1, snatch_2, snatch_3, snatch_4, snatch_add);
        section_first.append(snatches_wrapper);
        section_second.append(block_hsb, block_rgb, block_lab, block_cmyk);
        section_third.append(block_rgb888, block_rgb565, block_hsl);
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
    const outerSegments = options.outerSegments || 18;
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
        current_color.css({
            'background-color': `rgb(${input_r.val()},${input_g.val()},${input_b2.val()})`
        });
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
        ctx.lineWidth = 4;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        if (activeArea === 'inner') {
            // Use innerRingThickness for the marker size to match the ring
            const markerSize = innerRingThickness / 3; // Half the thickness for better visibility
            ctx.beginPath();
            ctx.arc(markers.outer.x, markers.outer.y, markerSize, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (activeArea === 'outer' && selectedOuterSegment !== null) {
            const segAngle = (2 * Math.PI) / outerSegments;
            const startAngle = selectedOuterSegment * segAngle;
            const endAngle = startAngle + segAngle;
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(centerX, ringCenterY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, ringCenterY, outerRadius - outerRingThickness, endAngle, startAngle, true);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;
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
        // Special handling for triangle dragging - allow dragging outside the triangle
        if (dragging === 'triangle') {
            // Constrain the point to within the triangle boundaries
            const constrained = constrainToTriangle(canvasX, canvasY, topVertex, bottomLeftVertex, bottomRightVertex);
            markers.triangle = constrained;
            const triangleColor = computeTriangleColor(constrained.x, constrained.y);
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(triangleColor);
            }
            if (showDetails && input_h) {
                updateInputsFromColor(triangleColor);
            }
            drawPicker();
            return;
        }
        // Special handling for hue ring dragging - allow dragging outside the ring
        if (dragging === 'inner_ring') {
            // Constrain the point to the middle of the hue ring
            const constrained = constrainToHueRing(canvasX, canvasY);
            markers.outer = constrained;
            // Calculate the hue directly from the angle
            const angle = Math.atan2(constrained.y - ringCenterY, constrained.x - centerX);
            const hue = (angle >= 0 ? angle : angle + 2 * Math.PI) / (2 * Math.PI);
            selectedHue = hue;
            if (typeof wrapper.changeCallback === 'function') {
                wrapper.changeCallback(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
            if (showDetails && input_h) {
                updateInputsFromColor(computeTriangleColor(markers.triangle.x, markers.triangle.y));
            }
            drawPicker();
            return;
        }
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
            if (showDetails && input_h) {
                updateInputsFromColor(computeTriangleColor(markers.triangle.x, markers.triangle.y));
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
            if (showDetails && input_h) {
                updateInputsFromColor(computeTriangleColor(markers.triangle.x, markers.triangle.y));
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
            if (showDetails && input_h) {
                updateInputsFromColor(triangleColor);
            }
        }
        drawPicker();
    }
    // Add function to constrain a point to the hue ring
    function constrainToHueRing(x, y) {
        // Calculate the angle from the center point to the mouse position
        const angle = Math.atan2(y - ringCenterY, x - centerX);
        // Find the middle radius of the inner ring
        const innerRingMiddleRadius = innerRadius - innerRingThickness / 2;
        // Calculate the position on the middle of the ring at this angle
        return {
            x: centerX + innerRingMiddleRadius * Math.cos(angle),
            y: ringCenterY + innerRingMiddleRadius * Math.sin(angle)
        };
    }    function computeTriangleColor(x, y) {
        // Helyes barycentrikus koordináták számítása
        const denominator = (bottomLeftVertex.y - bottomRightVertex.y) * (topVertex.x - bottomRightVertex.x) + 
                           (bottomRightVertex.x - bottomLeftVertex.x) * (topVertex.y - bottomRightVertex.y);
        if (Math.abs(denominator) < 1e-10) return `rgb(0, 0, 0)`;
        // Barycentrikus koordináták: u=topVertex, v=bottomLeftVertex, w=bottomRightVertex
        const u = ((bottomLeftVertex.y - bottomRightVertex.y) * (x - bottomRightVertex.x) + 
                   (bottomRightVertex.x - bottomLeftVertex.x) * (y - bottomRightVertex.y)) / denominator;
        const v = ((bottomRightVertex.y - topVertex.y) * (x - bottomRightVertex.x) + 
                   (topVertex.x - bottomRightVertex.x) * (y - bottomRightVertex.y)) / denominator;
        const w = 1 - u - v;
        // Biztonsági normalizálás
        const sum = u + v + w;
        const normalizedU = sum > 0 ? u / sum : 0;
        const normalizedV = sum > 0 ? v / sum : 0;
        const normalizedW = sum > 0 ? w / sum : 0;
        // HSL értékek kinyerése - HELYES LOGIKA:
        // topVertex (u) = pure hue, maximális telítettség
        // bottomLeftVertex (v) = fehér 
        // bottomRightVertex (w) = fekete
        const s = Math.max(0, Math.min(1, normalizedU));  // telítettség = topVertex súlya
        const l = Math.max(0, Math.min(1, normalizedV + normalizedU * 0.5));  // világosság számítás
        // Always use the selectedHue directly instead of parsing from a color string
        const [r, g, b] = Q.HSL2RGB(selectedHue, s, l);
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
    // Replace the old event listeners with better scoped ones
    let onMouseMoveHandler, onMouseUpHandler;
    function attachGlobalListeners() {
        onMouseMoveHandler = handleMouseMove.bind(this);
        onMouseUpHandler = handleMouseUp.bind(this);
        Q(document).on('mousemove', onMouseMoveHandler);
        Q(document).on('mouseup', onMouseUpHandler);
    }
    function removeGlobalListeners() {
        Q(document).off('mousemove', onMouseMoveHandler);
        Q(document).off('mouseup', onMouseUpHandler);
    }
    function handleMouseDown(e) {
        handleEvent(e);
        if (dragging) {
            previous_color.css({
                'background-color': `rgb(${input_r.val()},${input_g.val()},${input_b2.val()})`
            });
            attachGlobalListeners();
        }
    }
    function handleMouseMove(e) {
        if (dragging === 'inner_ring' || dragging === 'hue_stripe' || dragging === 'triangle') {
            handleEvent(e);
        }
    }
    function handleMouseUp(e) {
        dragging = false;
        removeGlobalListeners();
    }
    // Add event listener to canvas using Q's on method
    canvas.on('mousedown', handleMouseDown);
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
            console.log('ColorPicker change callback triggered with color:', color);
            Q.Debounce('colorpicker_change', 10, function () {
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
            setColor({r, g, b, source:'val'});
        }
        return this;
    };
    // Add a destroy method to clean up event listeners
    wrapper.destroy = function () {
        // Remove canvas event listener using Q's off method
        canvas.off('mousedown', handleMouseDown);
        // Remove document listeners if still active
        removeGlobalListeners();
        // Clear any other references
        dragging = false;
        return this;
    };
    // expose history color getter
    wrapper.Snatch = function (index) {
        return snatches[index]
            ? snatches[index].css('background-color')
            : null;
    };    drawPicker();
    console.log('ColorPicker drawn on canvas');
    // set all input fields to the initial color on load
    if (showDetails) {
        updateInputsFromColor(initialColor);
        // initialize half_snatch swatches
        current_color.css('background-color', initialColor);
        previous_color.css('background-color', initialColor);
        // Initialize triangle marker position based on initial color
        setColor({hex: initialColor, source: 'init'});
    } else {
        // Initialize triangle marker position for non-detailed mode
        const canvas = wrapper.find('canvas');
        if (canvas && canvas.nodes[0]) {
            // Parse initial color to RGB
            let r, g, b;
            if (initialColor.startsWith('#')) {
                r = parseInt(initialColor.substr(1, 2), 16);
                g = parseInt(initialColor.substr(3, 2), 16);
                b = parseInt(initialColor.substr(5, 2), 16);
            }
            if (r !== undefined && g !== undefined && b !== undefined) {
                // Convert to HSL to get hue
                const [h, s, l] = Q.RGB2HSL(r, g, b);
                selectedHue = h;
                positionHueMarker(h);
                positionTriangleMarker(r, g, b);
                drawPicker();
            }
        }
    }
    this.elements.push(wrapper);
    return wrapper;
};