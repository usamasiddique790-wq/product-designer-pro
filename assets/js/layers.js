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
    const canvas = this.canvas;

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
      .filter((obj) => obj.pdpProductBackground !== true)
      .filter((obj) => obj.name !== "Product Background")
      .filter((obj) => obj.selectable !== false)
      .reverse();
  },

  label(obj, index) {
    if (obj.pdpLayerName) {
      return obj.pdpLayerName;
    }

    if (obj.type === "i-text") {
      return obj.text || `Text ${index + 1}`;
    }

    if (obj.type === "image") {
      return `Image ${index + 1}`;
    }

    if (obj.type === "group") {
      return `Group ${index + 1}`;
    }

    return `Layer ${index + 1}`;
  },

  renameLayer(obj, index) {
    const currentName = this.label(obj, index);
    const newName = window.prompt("Layer name:", currentName);

    if (!newName || !newName.trim()) return;

    obj.set("pdpLayerName", newName.trim());
    this.canvas.requestRenderAll();
    this.render();

    if (typeof PDPHistory !== "undefined") {
      PDPHistory.saveState();
    }
  },

  selectLayer(obj) {
    this.canvas.setActiveObject(obj);

    if (typeof PDPSelection !== "undefined") {
      PDPSelection.setActive(obj);
    }

    this.canvas.requestRenderAll();
    this.render();
  },

  render() {
    if (!this.list || !this.canvas) return;

    const active =
      typeof PDPSelection !== "undefined"
        ? PDPSelection.getActive()
        : this.canvas.getActiveObject();

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

      const name = this.label(obj, index);

      btn.innerHTML = `
        <span>${name}</span>
        <small>${obj.type}</small>
      `;

      btn.addEventListener("click", () => {
        this.selectLayer(obj);
      });

      btn.addEventListener("dblclick", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.renameLayer(obj, index);
      });

      this.list.appendChild(btn);
    });
  },

  groupSelected(canvas) {
    const active = canvas.getActiveObject();

    if (!active || active.type !== "activeSelection") return;

    const group = active.toGroup();
    group.set("pdpLayerName", "Group");

    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    this.render();

    if (typeof PDPHistory !== "undefined") {
      PDPHistory.saveState();
    }
  },

  ungroupSelected(canvas) {
    const active = canvas.getActiveObject();

    if (!active || active.type !== "group") return;

    active.toActiveSelection();
    canvas.requestRenderAll();
    this.render();

    if (typeof PDPHistory !== "undefined") {
      PDPHistory.saveState();
    }
  },

  bringFront(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.bringToFront(obj);
    canvas.requestRenderAll();
    this.render();

    if (typeof PDPHistory !== "undefined") {
      PDPHistory.saveState();
    }
  },

  sendBack(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.sendBackwards(obj);
    canvas.requestRenderAll();
    this.render();

    if (typeof PDPHistory !== "undefined") {
      PDPHistory.saveState();
    }
  },

  deleteSelected(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.remove(obj);
    canvas.discardActiveObject();

    if (typeof PDPSelection !== "undefined") {
      PDPSelection.setActive(null);
    }

    canvas.requestRenderAll();
    this.render();

    if (typeof PDPHistory !== "undefined") {
      PDPHistory.saveState();
    }
  },
};
