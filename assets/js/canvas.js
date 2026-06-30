const PDPCanvas = {
  designArea: null,

  init() {
    const product = PDPProductManager.getCurrent();
    this.designArea = product.designArea;

    const canvas = new fabric.Canvas("pdp-canvas", {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    canvas.setWidth(product.canvas.width);
    canvas.setHeight(product.canvas.height);

    this.loadProductImage(canvas, product);
    this.bindBoundaries(canvas);

    return canvas;
  },

  loadProductImage(canvas, product) {
    const context = PDPProductContext.get();

    if (!context.image) {
      PDPTemplates.addProductTemplate(canvas, product);
      return;
    }

    fabric.Image.fromURL(
      context.image,
      (img) => {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        const scale = Math.min((canvasWidth * 0.8) / img.width, (canvasHeight * 0.85) / img.height);

        img.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          pdpProductImage: true,
        });

        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll();
      },
      {
        crossOrigin: "anonymous",
      },
    );
  },

  buildTemplate(canvas) {
    const product = PDPProductManager.getCurrent();

    const oldTemplateObjects = canvas.getObjects().filter((obj) => obj.excludeFromExport === true);

    oldTemplateObjects.forEach((obj) => canvas.remove(obj));

    this.loadProductImage(canvas, product);
    canvas.renderAll();
  },

  bindBoundaries(canvas) {
    canvas.on("object:moving", function (e) {
      PDPUtils.keepInsideDesignArea(e.target, PDPCanvas.designArea);
    });
  },
};
