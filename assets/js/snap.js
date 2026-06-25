const PDPSnap = {
  canvas: null,
  threshold: 6,
  guides: [],

  init(canvas) {
    this.canvas = canvas;

    canvas.on("object:moving", (e) => {
      this.snapObject(e.target);
    });

    canvas.on("object:modified", () => this.clearGuides());
    canvas.on("mouse:up", () => this.clearGuides());
  },

  snapObject(obj) {
    if (!obj || obj.excludeFromExport) return;

    this.clearGuides();

    const area = PDPCanvas.designArea;
    const rect = obj.getBoundingRect(true);

    this.snapToArea(obj, rect, area);
    this.snapToObjects(obj, rect);

    obj.setCoords();
    this.canvas.renderAll();
  },

  snapToArea(obj, rect, area) {
    const objCenterX = rect.left + rect.width / 2;
    const objCenterY = rect.top + rect.height / 2;
    const areaCenterX = area.left + area.width / 2;
    const areaCenterY = area.top + area.height / 2;

    if (Math.abs(objCenterX - areaCenterX) <= this.threshold) {
      obj.left += areaCenterX - objCenterX;
      this.addVerticalGuide(areaCenterX);
    }

    if (Math.abs(objCenterY - areaCenterY) <= this.threshold) {
      obj.top += areaCenterY - objCenterY;
      this.addHorizontalGuide(areaCenterY);
    }
  },

  snapToObjects(obj, rect) {
    const moving = {
      left: rect.left,
      centerX: rect.left + rect.width / 2,
      right: rect.left + rect.width,
      top: rect.top,
      centerY: rect.top + rect.height / 2,
      bottom: rect.top + rect.height,
    };

    const others = this.canvas
      .getObjects()
      .filter((item) => item !== obj && item.excludeFromExport !== true);

    others.forEach((item) => {
      const r = item.getBoundingRect(true);

      const target = {
        left: r.left,
        centerX: r.left + r.width / 2,
        right: r.left + r.width,
        top: r.top,
        centerY: r.top + r.height / 2,
        bottom: r.top + r.height,
      };

      this.checkVertical(obj, moving, target);
      this.checkHorizontal(obj, moving, target);
    });
  },

  checkVertical(obj, moving, target) {
    const checks = [
      [moving.left, target.left],
      [moving.centerX, target.centerX],
      [moving.right, target.right],
      [moving.left, target.right],
      [moving.right, target.left],
    ];

    checks.forEach(([from, to]) => {
      if (Math.abs(from - to) <= this.threshold) {
        obj.left += to - from;
        this.addVerticalGuide(to);
      }
    });
  },

  checkHorizontal(obj, moving, target) {
    const checks = [
      [moving.top, target.top],
      [moving.centerY, target.centerY],
      [moving.bottom, target.bottom],
      [moving.top, target.bottom],
      [moving.bottom, target.top],
    ];

    checks.forEach(([from, to]) => {
      if (Math.abs(from - to) <= this.threshold) {
        obj.top += to - from;
        this.addHorizontalGuide(to);
      }
    });
  },

  addVerticalGuide(x) {
    const line = new fabric.Line([x, 0, x, this.canvas.height], {
      stroke: "#ec4899",
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    this.guides.push(line);
    this.canvas.add(line);
    this.canvas.bringToFront(line);
  },

  addHorizontalGuide(y) {
    const line = new fabric.Line([0, y, this.canvas.width, y], {
      stroke: "#ec4899",
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    this.guides.push(line);
    this.canvas.add(line);
    this.canvas.bringToFront(line);
  },

  clearGuides() {
    this.guides.forEach((guide) => this.canvas.remove(guide));
    this.guides = [];
  },
};