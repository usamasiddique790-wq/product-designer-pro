const PDPLayers = {
  bringFront(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.bringToFront(obj);
    canvas.renderAll();
  },

  sendBack(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.sendBackwards(obj);
    canvas.renderAll();
  },

  deleteSelected(canvas) {
    const obj = PDPUtils.activeObject(canvas);
    if (!obj || obj.selectable === false) return;

    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
  },
};