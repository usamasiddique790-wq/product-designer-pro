const PDPExport = {
  exportDesign(canvas) {
    const area = PDPCanvas.designArea;

    const json = canvas.toJSON(["excludeFromExport"]);

    const previewPng = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const printPng = canvas.toDataURL({
      format: "png",
      left: area.left,
      top: area.top,
      width: area.width,
      height: area.height,
      quality: 1,
      multiplier: 3,
    });

    return {
      json,
      previewPng,
      printPng,
    };
  },
};