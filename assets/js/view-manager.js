const PDPViewManager = {
  currentView: "front",

  views: {
    front: "[]",
    back: "[]",
    frontPreviewPng: "",
    backPreviewPng: "",
  },

  canvas: null,

  init(canvas) {
    this.canvas = canvas;
    this.bindButtons();
    this.updateButtons();
  },

  reset() {
    this.currentView = "front";
    this.views = {
      front: "[]",
      back: "[]",
      frontPreviewPng: "",
      backPreviewPng: "",
    };

    this.updateButtons();
  },

  bindButtons() {
    document.getElementById("pdp-view-front")?.addEventListener("click", () => {
      this.switchView("front");
    });

    document.getElementById("pdp-view-back")?.addEventListener("click", () => {
      this.switchView("back");
    });
  },

  getUserObjects() {
    return this.canvas.getObjects().filter((obj) => obj.excludeFromExport !== true);
  },

  saveCurrentView() {
    const userObjects = this.getUserObjects();

    this.views[this.currentView] = JSON.stringify(userObjects.map((obj) => obj.toObject()));

    this.views[`${this.currentView}PreviewPng`] = this.canvas.toDataURL({
      format: "png",
      quality: 1,
    });
  },

  saveAllViews() {
    this.saveCurrentView();

    if (!this.views.frontPreviewPng && this.currentView === "back") {
      this.views.frontPreviewPng = "";
    }

    if (!this.views.backPreviewPng && this.currentView === "front") {
      this.views.backPreviewPng = "";
    }

    return this.views;
  },

  clearUserObjects() {
    this.getUserObjects().forEach((obj) => {
      this.canvas.remove(obj);
    });
  },

  switchView(view) {
    if (!this.views.hasOwnProperty(view)) return;

    this.saveCurrentView();

    if (this.currentView === view) {
      this.updateButtons();
      return;
    }

    this.currentView = view;
    this.clearUserObjects();

    const saved = this.views[view];

    if (!saved || saved === "[]") {
      this.afterSwitch();
      return;
    }

    fabric.util.enlivenObjects(JSON.parse(saved), (objects) => {
      objects.forEach((obj) => {
        this.canvas.add(obj);
      });

      objects.forEach((obj) => {
        this.canvas.bringToFront(obj);
      });

      this.afterSwitch();
    });
  },

  afterSwitch() {
    PDPCanvas.buildTemplate(this.canvas);

    this.canvas.discardActiveObject();
    this.canvas.renderAll();

    PDPSelection.setActive(null);

    PDPHistory.undoStack = [];
    PDPHistory.redoStack = [];
    PDPHistory.saveState();

    PDPLayers.render();
    this.updateButtons();
  },

  updateButtons() {
    document
      .getElementById("pdp-view-front")
      ?.classList.toggle("active", this.currentView === "front");

    document
      .getElementById("pdp-view-back")
      ?.classList.toggle("active", this.currentView === "back");
  },
};
