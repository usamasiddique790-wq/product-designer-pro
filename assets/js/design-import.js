const PDPDesignImport = {
  importDesign(design, canvas) {
    if (!design || !design.views || !canvas) {
      return;
    }

    PDPViewManager.views.front = design.views.front || "[]";
    PDPViewManager.views.back = design.views.back || "[]";
    PDPViewManager.views.frontPreviewPng = design.previews?.front || "";
    PDPViewManager.views.backPreviewPng = design.previews?.back || "";

    PDPViewManager.currentView = design.currentView || "front";
    PDPViewManager.clearUserObjects();

    const saved = PDPViewManager.views[PDPViewManager.currentView] || "[]";

    if (!saved || saved === "[]") {
      PDPCanvas.buildTemplate(canvas);
      canvas.renderAll();
      PDPViewManager.updateButtons();
      return;
    }

    fabric.util.enlivenObjects(JSON.parse(saved), function (objects) {
      objects.forEach(function (obj) {
        canvas.add(obj);
      });

      objects.forEach(function (obj) {
        canvas.bringToFront(obj);
      });

      PDPCanvas.buildTemplate(canvas);
      canvas.discardActiveObject();
      canvas.renderAll();

      PDPSelection.setActive(null);
      PDPLayers.render();
      PDPViewManager.updateButtons();
    });
  },

  loadFromStorage(canvas) {
    const savedDesign = localStorage.getItem("pdp_reedit_design");

    if (!savedDesign) {
      return;
    }

    try {
      this.importDesign(JSON.parse(savedDesign), canvas);
      localStorage.removeItem("pdp_reedit_design");
    } catch (error) {
      console.error("Unable to import design.", error);
    }
  },
};
