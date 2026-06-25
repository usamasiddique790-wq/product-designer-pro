const PDPZoomGrid = {
  canvas: null,
  zoom: 1,
  gridVisible: false,
  gridLines: [],

  init(canvas) {
    this.canvas = canvas;
  },

  zoomIn() {
    this.setZoom(this.zoom + 0.1);
  },

  zoomOut() {
    this.setZoom(this.zoom - 0.1);
  },

  resetZoom() {
    this.setZoom(1);
  },

  setZoom(value) {
    this.zoom = Math.max(0.4, Math.min(2, value));

    this.canvas.setZoom(this.zoom);
    this.canvas.setWidth(this.canvas.getWidth());
    this.canvas.setHeight(this.canvas.getHeight());
    this.canvas.renderAll();

    this.updateStatus();
  },

  updateStatus() {
    const zoomEl = document.querySelector(".pdp-statusbar span:first-child");
    if (zoomEl) {
      zoomEl.textContent = `Zoom: ${Math.round(this.zoom * 100)}%`;
    }
  },

  toggleGrid() {
    this.gridVisible = !this.gridVisible;

    if (this.gridVisible) {
      this.showGrid();
    } else {
      this.hideGrid();
    }
  },

  showGrid() {
    this.hideGrid();

    const spacing = 25;
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();

    for (let x = 0; x <= width; x += spacing) {
      this.addGridLine([x, 0, x, height]);
    }

    for (let y = 0; y <= height; y += spacing) {
      this.addGridLine([0, y, width, y]);
    }

    this.canvas.renderAll();
  },

  addGridLine(points) {
    const line = new fabric.Line(points, {
      stroke: "#e5e7eb",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      isGridLine: true,
    });

    this.gridLines.push(line);
    this.canvas.add(line);
    this.canvas.sendToBack(line);
  },

  hideGrid() {
    this.gridLines.forEach((line) => this.canvas.remove(line));
    this.gridLines = [];
    this.canvas.renderAll();
  },
};