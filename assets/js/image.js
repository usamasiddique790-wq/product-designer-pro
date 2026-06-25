const PDPImage = {
  upload(canvas, file) {
    if (!file) return;

    const area = PDPCanvas.designArea;
    const reader = new FileReader();

    reader.onload = function (e) {
      fabric.Image.fromURL(e.target.result, function (img) {
        img.scaleToWidth(180);

        img.set({
          left: area.left + 35,
          top: area.top + 100,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.bringToFront(img);
        canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
  },
};