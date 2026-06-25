const PDPShortcuts = {
  canvas: null,

  init(canvas) {
    this.canvas = canvas;

    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        PDPLayers.deleteSelected(this.canvas);
      }

      if (ctrl && e.key.toLowerCase() === "z") {
        e.preventDefault();
        PDPHistory.undo();
      }

      if (ctrl && e.key.toLowerCase() === "y") {
        e.preventDefault();
        PDPHistory.redo();
      }

      if (ctrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        this.duplicate();
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.move(-1, 0, e.shiftKey);
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.move(1, 0, e.shiftKey);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.move(0, -1, e.shiftKey);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.move(0, 1, e.shiftKey);
      }
    });
  },

  active() {
    return PDPSelection.getActive();
  },

  move(x, y, fast) {
    const obj = this.active();
    if (!obj || obj.excludeFromExport || obj.lockMovementX) return;

    const step = fast ? 10 : 1;

    obj.set({
      left: obj.left + x * step,
      top: obj.top + y * step,
    });

    obj.setCoords();
    this.canvas.renderAll();

    PDPSelection.setActive(obj);
    PDPHistory.saveState();
  },

  duplicate() {
    const obj = this.active();
    if (!obj || obj.excludeFromExport) return;

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
  },
};