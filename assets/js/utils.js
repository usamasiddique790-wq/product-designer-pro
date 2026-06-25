const PDPUtils = {
  activeObject(canvas) {
    return canvas.getActiveObject();
  },

  activeText(canvas) {
    const obj = canvas.getActiveObject();
    if (!obj) return null;
    if (obj.type !== "i-text") return null;
    return obj;
  },

  keepInsideDesignArea(obj, area) {
    if (!obj || obj.selectable === false) return;

    const bound = obj.getBoundingRect(true);
    let left = obj.left;
    let top = obj.top;

    if (bound.left < area.left) {
      left += area.left - bound.left;
    }

    if (bound.top < area.top) {
      top += area.top - bound.top;
    }

    if (bound.left + bound.width > area.left + area.width) {
      left -= bound.left + bound.width - (area.left + area.width);
    }

    if (bound.top + bound.height > area.top + area.height) {
      top -= bound.top + bound.height - (area.top + area.height);
    }

    obj.set({ left, top });
  },
};