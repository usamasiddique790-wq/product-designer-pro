const PDPProperties = {
  canvas: null,
  panel: null,
  textOnly: null,
  shapeOnly: null,

  init(canvas) {
    this.canvas = canvas;
    this.panel = document.querySelector(".pdp-properties");
    this.textOnly = document.querySelector(".pdp-text-only");
    this.shapeOnly = document.querySelector(".pdp-shape-only");

    this.fields = {
      left: document.getElementById("pdp-prop-left"),
      top: document.getElementById("pdp-prop-top"),
      width: document.getElementById("pdp-prop-width"),
      height: document.getElementById("pdp-prop-height"),
      angle: document.getElementById("pdp-prop-angle"),
      opacity: document.getElementById("pdp-prop-opacity"),
      fontSize: document.getElementById("pdp-prop-font-size"),
      color: document.getElementById("pdp-prop-color"),
      shapeColor: document.getElementById("pdp-prop-shape-color"),
    };

    this.duplicateBtn = document.getElementById("pdp-prop-duplicate");
    this.lockBtn = document.getElementById("pdp-prop-lock");

    this.bindSelection();
    this.bindInputs();
    this.hide();
  },

  bindSelection() {
    PDPSelection.onChange(() => {
      this.update();
    });
  },

  active() {
    return PDPSelection.getActive();
  },

  isShape(obj) {
    return ["group", "path", "circle", "rect", "polygon"].includes(obj.type);
  },

  getObjectFill(obj) {
    if (obj.type === "group" && obj.getObjects) {
      const child = obj.getObjects().find((item) => item.fill);
      return child?.fill || "#2563eb";
    }

    return obj.fill || "#2563eb";
  },

  update() {
    const obj = this.active();

    if (!obj) {
      this.hide();
      return;
    }

    this.show();

    const bounds = obj.getBoundingRect(true);

    this.fields.left.value = Math.round(obj.left || 0);
    this.fields.top.value = Math.round(obj.top || 0);
    this.fields.width.value = Math.round(bounds.width || 0);
    this.fields.height.value = Math.round(bounds.height || 0);
    this.fields.angle.value = Math.round(obj.angle || 0);
    this.fields.opacity.value = obj.opacity ?? 1;

    if (obj.type === "i-text") {
      this.textOnly.style.display = "block";
      this.fields.fontSize.value = obj.fontSize || 36;
      this.fields.color.value = obj.fill || "#000000";
    } else {
      this.textOnly.style.display = "none";
    }

    if (this.isShape(obj)) {
      if (this.shapeOnly) this.shapeOnly.style.display = "block";
      if (this.fields.shapeColor) {
        this.fields.shapeColor.value = this.getObjectFill(obj);
      }
    } else {
      if (this.shapeOnly) this.shapeOnly.style.display = "none";
    }

    this.lockBtn.textContent = obj.lockMovementX ? "Unlock" : "Lock";
  },

  show() {
    this.panel.classList.add("active");
  },

  hide() {
    this.panel.classList.remove("active");
  },

  bindInputs() {
    const updateBasic = () => {
      const obj = this.active();
      if (!obj) return;

      obj.set({
        left: Number(this.fields.left.value),
        top: Number(this.fields.top.value),
        angle: Number(this.fields.angle.value),
        opacity: Number(this.fields.opacity.value),
      });

      obj.setCoords();
      this.canvas.renderAll();

      PDPSelection.setActive(obj);
      PDPHistory.saveState();
    };

    [this.fields.left, this.fields.top, this.fields.angle, this.fields.opacity].forEach((field) => {
      field?.addEventListener("input", updateBasic);
    });

    this.fields.width?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj) return;

      const bounds = obj.getBoundingRect(true);
      const newWidth = Number(this.fields.width.value);

      if (bounds.width > 0) {
        obj.scaleX *= newWidth / bounds.width;
        obj.setCoords();
        this.canvas.renderAll();
        PDPSelection.setActive(obj);
        PDPHistory.saveState();
      }
    });

    this.fields.height?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj) return;

      const bounds = obj.getBoundingRect(true);
      const newHeight = Number(this.fields.height.value);

      if (bounds.height > 0) {
        obj.scaleY *= newHeight / bounds.height;
        obj.setCoords();
        this.canvas.renderAll();
        PDPSelection.setActive(obj);
        PDPHistory.saveState();
      }
    });

    this.fields.fontSize?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj || obj.type !== "i-text") return;

      obj.set({
        fontSize: Number(this.fields.fontSize.value),
      });

      obj.setCoords();
      this.canvas.renderAll();
      PDPSelection.setActive(obj);
      PDPHistory.saveState();
    });

    this.fields.color?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj || obj.type !== "i-text") return;

      obj.set({
        fill: this.fields.color.value,
      });

      this.canvas.renderAll();
      PDPSelection.setActive(obj);
      PDPHistory.saveState();
    });

    this.fields.shapeColor?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj || !this.isShape(obj)) return;

      const color = this.fields.shapeColor.value;

      if (obj.type === "group" && obj.getObjects) {
        obj.getObjects().forEach((child) => {
          if (child.set && child.fill) {
            child.set("fill", color);
          }
        });
      } else {
        obj.set("fill", color);
      }

      this.canvas.renderAll();
      PDPSelection.setActive(obj);
      PDPHistory.saveState();
    });

    this.duplicateBtn?.addEventListener("click", () => {
      const obj = this.active();
      if (!obj) return;

      obj.clone((clone) => {
        clone.set({
          left: obj.left + 20,
          top: obj.top + 20,
        });

        this.canvas.add(clone);
        this.canvas.setActiveObject(clone);
        PDPSelection.setActive(clone);
        this.canvas.renderAll();
        PDPHistory.saveState();
        PDPLayers.render();
      });
    });

    this.lockBtn?.addEventListener("click", () => {
      const obj = this.active();
      if (!obj) return;

      const locked = !obj.lockMovementX;

      obj.set({
        lockMovementX: locked,
        lockMovementY: locked,
        lockScalingX: locked,
        lockScalingY: locked,
        lockRotation: locked,
      });

      this.canvas.renderAll();
      PDPSelection.setActive(obj);
      PDPHistory.saveState();
    });
  },
};
