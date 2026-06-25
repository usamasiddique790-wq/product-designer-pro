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

    PDPTemplates.addProductTemplate(canvas, product);
    this.bindBoundaries(canvas);

    return canvas;
  },

  buildTemplate(canvas) {
    const product = PDPProductManager.getCurrent();

    const oldTemplateObjects = canvas
      .getObjects()
      .filter((obj) => obj.excludeFromExport === true);

    oldTemplateObjects.forEach((obj) => canvas.remove(obj));

    PDPTemplates.addProductTemplate(canvas, product);
    canvas.renderAll();
  },

  bindBoundaries(canvas) {
    canvas.on("object:moving", function (e) {
      PDPUtils.keepInsideDesignArea(e.target, PDPCanvas.designArea);
    });
  },
};