const PDPSelection = {
  canvas: null,
  activeObject: null,
  listeners: [],

  init(canvas) {
    this.canvas = canvas;

    canvas.on("selection:created", (e) => {
      this.setActive(e.selected?.[0] || canvas.getActiveObject());
    });

    canvas.on("selection:updated", (e) => {
      this.setActive(e.selected?.[0] || canvas.getActiveObject());
    });

    canvas.on("selection:cleared", () => {
      this.setActive(null);
    });

    canvas.on("object:modified", () => {
      this.notify();
    });

    canvas.on("object:moving", () => {
      this.notify();
    });

    canvas.on("object:scaling", () => {
      this.notify();
    });

    canvas.on("object:rotating", () => {
      this.notify();
    });
  },

  setActive(object) {
    if (object && object.excludeFromExport) {
      object = null;
    }

    this.activeObject = object;
    this.notify();
  },

  getActive() {
    return this.activeObject;
  },

  getActiveText() {
    const obj = this.getActive();
    return obj && obj.type === "i-text" ? obj : null;
  },

  onChange(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  },

  notify() {
    this.listeners.forEach((callback) => {
      callback(this.activeObject);
    });

    this.updateStatusBar();
  },

  updateStatusBar() {
    const objectsCountEl = document.getElementById("pdp-status-objects");
    const activeEl = document.getElementById("pdp-status-active");

    if (!this.canvas) return;

    const userObjects = this.canvas
      .getObjects()
      .filter((obj) => obj.excludeFromExport !== true);

    if (objectsCountEl) {
      objectsCountEl.textContent = `Objects: ${userObjects.length}`;
    }

    if (activeEl) {
      if (!this.activeObject) {
        activeEl.textContent = "Active: None";
      } else if (this.activeObject.type === "i-text") {
        activeEl.textContent = "Active: Text";
      } else if (this.activeObject.type === "image") {
        activeEl.textContent = "Active: Image";
      } else {
        activeEl.textContent = `Active: ${this.activeObject.type}`;
      }
    }
  },
};