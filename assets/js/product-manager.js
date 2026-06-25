const PDPProductManager = {
  products: {
    tshirt: {
      name: "T-Shirt",
      canvas: {
        width: 620,
        height: 600,
      },
      designArea: {
        left: 200,
        top: 150,
        width: 220,
        height: 310,
      },
      template: "tshirt",
    },

    mug: {
      name: "Mug",
      canvas: {
        width: 620,
        height: 600,
      },
      designArea: {
        left: 180,
        top: 210,
        width: 260,
        height: 170,
      },
      template: "mug",
    },
  },

  current: "tshirt",

  getCurrent() {
    return this.products[this.current];
  },

  setProduct(key, canvas) {
    if (!this.products[key]) return;
if (typeof PDPViewManager !== "undefined") {
  PDPViewManager.reset();
}
    this.current = key;

    const product = this.getCurrent();

    PDPCanvas.designArea = product.designArea;

    canvas.clear();
    canvas.setWidth(product.canvas.width);
    canvas.setHeight(product.canvas.height);

    PDPTemplates.addProductTemplate(canvas, product);
    canvas.renderAll();

    PDPHistory.undoStack = [];
    PDPHistory.redoStack = [];
    PDPHistory.saveState();

    PDPSelection.setActive(null);
    PDPLayers.render();
  },
};