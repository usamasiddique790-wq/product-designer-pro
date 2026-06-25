const PDPCanvas = {
  designArea: {
    left: 225,
    top: 170,
    width: 250,
    height: 330,
  },

  init() {
    const canvas = new fabric.Canvas("pdp-canvas", {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    this.buildTemplate(canvas);
    this.bindBoundaries(canvas);

    return canvas;
  },

  buildTemplate(canvas) {
    const oldTemplateObjects = canvas
      .getObjects()
      .filter((obj) => obj.excludeFromExport === true);

    oldTemplateObjects.forEach((obj) => canvas.remove(obj));

    PDPTemplates.addTshirt(canvas, this.designArea);
    canvas.renderAll();
  },

  bindBoundaries(canvas) {
    canvas.on("object:moving", function (e) {
      PDPUtils.keepInsideDesignArea(e.target, PDPCanvas.designArea);
    });
  },
};