const PDPExport = {
  exportDesign(canvas) {
    if (typeof PDPViewManager !== "undefined") {
      PDPViewManager.saveCurrentView();
    }

    const product = PDPProductManager.getCurrent();
    const area = PDPCanvas.designArea;
    const currentView = PDPViewManager.currentView || "front";
    const views = PDPViewManager.views;

    const currentPreviewPng = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const currentPrintPng = canvas.toDataURL({
      format: "png",
      left: area.left,
      top: area.top,
      width: area.width,
      height: area.height,
      quality: 1,
      multiplier: 3,
    });

    return {
      product: product.name,
      currentView,

      views: {
        front: views.front || "[]",
        back: views.back || "[]",
      },

      previews: {
        front: views.frontPreviewPng || "",
        back: views.backPreviewPng || "",
      },

      currentPreviewPng,
      currentPrintPng,
    };
  },
};
