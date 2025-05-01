
Q.Image.prototype.Crop = function (x, y, width, height, cropOptions = {}) {

    const defaultOptions = {
        preserveContext: true
    };

    this.saveToHistory();
    const finalOptions = Object.assign({}, defaultOptions, cropOptions);
    const canvas_node = this.node;

    let temp = Q('<canvas>', { width: width, height: height }).nodes[0];
    let tempCtx = temp.getContext('2d');


    if (finalOptions.preserveContext) {
        const ctx = canvas_node.getContext('2d');
        tempCtx.globalAlpha = ctx.globalAlpha;
        tempCtx.globalCompositeOperation = ctx.globalCompositeOperation;

    }

    tempCtx.drawImage(canvas_node, x, y, width, height, 0, 0, width, height);

    canvas_node.width = width;
    canvas_node.height = height;
    canvas_node.getContext('2d').drawImage(temp, 0, 0);

    return this;
};
