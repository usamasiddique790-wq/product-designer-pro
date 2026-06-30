const PDPAlign = {
  align(canvas, type) {
    const obj = PDPSelection.getActive();
    if (!obj || obj.excludeFromExport) return;

    const area = PDPCanvas.designArea;
    const rect = obj.getBoundingRect(true);

    if (type === "left") {
      obj.left += area.left - rect.left;
    }

    if (type === "center") {
      obj.left += area.left + area.width / 2 - (rect.left + rect.width / 2);
    }

    if (type === "right") {
      obj.left += area.left + area.width - (rect.left + rect.width);
    }

    if (type === "top") {
      obj.top += area.top - rect.top;
    }

    if (type === "middle") {
      obj.top += area.top + area.height / 2 - (rect.top + rect.height / 2);
    }

    if (type === "bottom") {
      obj.top += area.top + area.height - (rect.top + rect.height);
    }

    obj.setCoords();
    canvas.renderAll();

    PDPSelection.setActive(obj);
    PDPHistory.saveState();
  },
};
