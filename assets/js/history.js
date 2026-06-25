const PDPHistory = {
  undoStack: [],
  redoStack: [],
  isRestoring: false,

  init(canvas) {
    this.canvas = canvas;
    this.saveState();

    canvas.on("object:added", (e) => {
      if (e.target?.excludeFromExport) return;
      this.saveState();
    });

    canvas.on("object:modified", (e) => {
      if (e.target?.excludeFromExport) return;
      this.saveState();
    });

    canvas.on("object:removed", (e) => {
      if (e.target?.excludeFromExport) return;
      this.saveState();
    });
  },

  getUserObjectsJson() {
    const userObjects = this.canvas
      .getObjects()
      .filter((obj) => obj.excludeFromExport !== true);

    return JSON.stringify(userObjects.map((obj) => obj.toObject()));
  },

  saveState() {
    if (this.isRestoring || !this.canvas) return;

    const json = this.getUserObjectsJson();

    if (this.undoStack[this.undoStack.length - 1] === json) return;

    this.undoStack.push(json);

    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }

    this.redoStack = [];
  },

  restoreState(json) {
    this.isRestoring = true;

    const userObjects = this.canvas
      .getObjects()
      .filter((obj) => obj.excludeFromExport !== true);

    userObjects.forEach((obj) => this.canvas.remove(obj));

    fabric.util.enlivenObjects(JSON.parse(json), (objects) => {
      objects.forEach((obj) => {
        this.canvas.add(obj);
      });

      PDPCanvas.buildTemplate(this.canvas);

      objects.forEach((obj) => this.canvas.bringToFront(obj));

      this.canvas.discardActiveObject();
      this.canvas.renderAll();

      this.isRestoring = false;
    });
  },

  undo() {
    if (this.undoStack.length <= 1 || !this.canvas) return;

    const current = this.undoStack.pop();
    this.redoStack.push(current);

    const previous = this.undoStack[this.undoStack.length - 1];
    this.restoreState(previous);
  },

  redo() {
    if (this.redoStack.length === 0 || !this.canvas) return;

    const next = this.redoStack.pop();
    this.undoStack.push(next);

    this.restoreState(next);
  },
};