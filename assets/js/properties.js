const PDPProperties = {
  init(canvas) {
    this.canvas = canvas;
    this.panel = document.querySelector(".pdp-properties");
    this.textOnly = document.querySelector(".pdp-text-only");

    this.left = document.getElementById("pdp-prop-left");
    this.top = document.getElementById("pdp-prop-top");
    this.width = document.getElementById("pdp-prop-width");
    this.height = document.getElementById("pdp-prop-height");
    this.angle = document.getElementById("pdp-prop-angle");
    this.opacity = document.getElementById("pdp-prop-opacity");
    this.fontSize = document.getElementById("pdp-prop-font-size");
    this.color = document.getElementById("pdp-prop-color");

    this.duplicateBtn = document.getElementById("pdp-prop-duplicate");
    this.lockBtn = document.getElementById("pdp-prop-lock");

    this.bindCanvas();
    this.bindInputs();
    this.hide();
  },

  bindCanvas() {
    this.canvas.on("selection:created", () => this.update());
    this.canvas.on("selection:updated", () => this.update());
    this.canvas.on("selection:cleared", () => this.hide());
    this.canvas.on("object:modified", () => this.update());
    this.canvas.on("object:moving", () => this.update());
    this.canvas.on("object:scaling", () => this.update());
    this.canvas.on("object:rotating", () => this.update());
  },

  active() {
    const obj = this.canvas.getActiveObject();
    if (!obj || obj.excludeFromExport) return null;
    return obj;
  },

  update() {
    const obj = this.active();
    if (!obj) return this.hide();

    this.panel.classList.add("active");

    const bounds = obj.getBoundingRect(true);

    this.left.value = Math.round(obj.left || 0);
    this.top.value = Math.round(obj.top || 0);
    this.width.value = Math.round(bounds.width || 0);
    this.height.value = Math.round(bounds.height || 0);
    this.angle.value = Math.round(obj.angle || 0);
    this.opacity.value = obj.opacity ?? 1;

    if (obj.type === "i-text") {
      this.textOnly.style.display = "block";
      this.fontSize.value = obj.fontSize || 36;
      this.color.value = obj.fill || "#000000";
    } else {
      this.textOnly.style.display = "none";
    }

    this.lockBtn.textContent = obj.lockMovementX ? "Unlock" : "Lock";
  },

  hide() {
    if (this.panel) this.panel.classList.remove("active");
  },

  bindInputs() {
    const updateObject = () => {
      const obj = this.active();
      if (!obj) return;

      obj.set({
        left: Number(this.left.value),
        top: Number(this.top.value),
        angle: Number(this.angle.value),
        opacity: Number(this.opacity.value),
      });

      if (obj.type === "i-text") {
        obj.set({
          fontSize: Number(this.fontSize.value),
          fill: this.color.value,
        });
      }

      obj.setCoords();
      this.canvas.renderAll();
      PDPHistory.saveState();
    };

    [this.left, this.top, this.angle, this.opacity].forEach((input) => {
      input?.addEventListener("input", updateObject);
    });

    this.fontSize?.addEventListener("input", updateObject);
    this.color?.addEventListener("input", updateObject);

    this.width?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj) return;

      const bounds = obj.getBoundingRect(true);
      const newWidth = Number(this.width.value);

      if (bounds.width > 0) {
        obj.scaleX *= newWidth / bounds.width;
        obj.setCoords();
        this.canvas.renderAll();
        PDPHistory.saveState();
      }
    });

    this.height?.addEventListener("input", () => {
      const obj = this.active();
      if (!obj) return;

      const bounds = obj.getBoundingRect(true);
      const newHeight = Number(this.height.value);

      if (bounds.height > 0) {
        obj.scaleY *= newHeight / bounds.height;
        obj.setCoords();
        this.canvas.renderAll();
        PDPHistory.saveState();
      }
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
        this.canvas.renderAll();
        PDPHistory.saveState();
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
      this.update();
      PDPHistory.saveState();
    });
  },
};