const PDPText = {
  add(canvas) {
    const area = PDPCanvas.designArea;

    const text = new fabric.IText("Your Text", {
      left: area.left + 35,
      top: area.top + 60,
      fontSize: 34,
      fill: "#111827",
      fontFamily: "Arial",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringToFront(text);
    canvas.renderAll();
  },

  setColor(canvas, color) {
    const text = PDPUtils.activeText(canvas);
    if (!text) return;

    text.set({ fill: color });
    canvas.renderAll();
  },

  setSize(canvas, size) {
    const text = PDPUtils.activeText(canvas);
    if (!text) return;

    text.set({ fontSize: parseInt(size, 10) });
    canvas.renderAll();
  },

  toggleBold(canvas) {
    const text = PDPUtils.activeText(canvas);
    if (!text) return;

    text.set({
      fontWeight: text.fontWeight === "bold" ? "normal" : "bold",
    });

    canvas.renderAll();
  },

  toggleItalic(canvas) {
    const text = PDPUtils.activeText(canvas);
    if (!text) return;

    text.set({
      fontStyle: text.fontStyle === "italic" ? "normal" : "italic",
    });

    canvas.renderAll();
  },
};