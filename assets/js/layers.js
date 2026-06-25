const PDPLayers = {
  canvas: null,
  list: null,

  init(canvas) {
    this.canvas = canvas;
    this.list = document.getElementById("pdp-layers-list");

    this.bindCanvas();
    this.render();
  },

  bindCanvas() {
    canvas = this.canvas;

    canvas.on("object:added", () => this.render());
    canvas.on("object:removed", () => this.render());
    canvas.on("selection:created", () => this.render());
    canvas.on("selection:updated", () => this.render());
    canvas.on("selection:cleared", () => this.render());
    canvas.on("object:modified", () => this.render());
  },

  userObjects() {
    return this.canvas
      .getObjects()
      .filter((obj) => obj.excludeFromExport !== true)
      .reverse();
  },

  label(obj, index) {
    if (obj.type === "i-text") {
      return obj.text || "Text";
    }

    if (obj.type === "image") {
      return "Image";
    }

    return `Layer ${index + 1}`;
  },

  render() {
    if (!this.list || !this.canvas) return;

    const active = PDPSelection.getActive();
    const objects = this.userObjects();

    this.list.innerHTML = "";

    if (!objects.length) {
      this.list.innerHTML = `<p class="pdp-muted">No layers yet</p>`;
      return;
    }

    objects.forEach((obj, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pdp-layer-item";

      if (obj === active) {
        btn.classList.add("active");
      }

      btn.innerHTML = `
        <span>${this.label(obj, index)}</span>
        <small>${obj.type}</small>
      `;

      btn.addEventListener("click", () => {
        this.canvas.setActiveObject(obj);
        PDPSelection.setActive(obj);
        this.canvas.renderAll();
        this.render();
      });

      this.list.appendChild(btn);
    });
  },

  bringFront(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.bringToFront(obj);
    canvas.renderAll();
    this.render();
    PDPHistory.saveState();
  },

  sendBack(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.sendBackwards(obj);
    canvas.renderAll();
    this.render();
    PDPHistory.saveState();
  },

  deleteSelected(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.remove(obj);
    canvas.discardActiveObject();
    PDPSelection.setActive(null);
    canvas.renderAll();
    this.render();
    PDPHistory.saveState();
  },
};