const PDPToolbar = {
  init(canvas) {
    document.getElementById("pdp-add-text")?.addEventListener("click", function () {
      PDPText.add(canvas);
    });

    document.getElementById("pdp-upload-image")?.addEventListener("change", function (e) {
      PDPImage.upload(canvas, e.target.files[0]);
      e.target.value = "";
    });

    document.getElementById("pdp-text-color")?.addEventListener("input", function () {
      PDPText.setColor(canvas, this.value);
    });

    document.getElementById("pdp-font-size")?.addEventListener("input", function () {
      PDPText.setSize(canvas, this.value);
    });

    document.getElementById("pdp-bold")?.addEventListener("click", function () {
      PDPText.toggleBold(canvas);
    });

    document.getElementById("pdp-italic")?.addEventListener("click", function () {
      PDPText.toggleItalic(canvas);
    });

    document.getElementById("pdp-front")?.addEventListener("click", function () {
      PDPLayers.bringFront(canvas);
    });

    document.getElementById("pdp-back")?.addEventListener("click", function () {
      PDPLayers.sendBack(canvas);
    });

    document.getElementById("pdp-delete")?.addEventListener("click", function () {
      PDPLayers.deleteSelected(canvas);
    });
document.getElementById("pdp-undo")?.addEventListener("click", function () {
  PDPHistory.undo();
});

document.getElementById("pdp-redo")?.addEventListener("click", function () {
  PDPHistory.redo();
});
    document.getElementById("pdp-export")?.addEventListener("click", function () {
      const data = PDPExport.exportDesign(canvas);
      const output = document.getElementById("pdp-output");

      if (output) {
        output.value = JSON.stringify(data, null, 2);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (
          document.activeElement.tagName !== "TEXTAREA" &&
          document.activeElement.tagName !== "INPUT"
        ) {
          PDPLayers.deleteSelected(canvas);
        }
      }
    });
  },
};