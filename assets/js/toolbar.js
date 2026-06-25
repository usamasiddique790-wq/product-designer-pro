const PDPToolbar = {
  init(canvas) {

    document.getElementById("pdp-product-select")?.addEventListener("change", function () {
  PDPProductManager.setProduct(this.value, canvas);
});
    document.getElementById("pdp-add-text")?.addEventListener("click", function () {
      PDPText.add(canvas);
    });
document.getElementById("pdp-align-left")?.addEventListener("click", function () {
  PDPAlign.align(canvas, "left");
});

document.getElementById("pdp-align-center")?.addEventListener("click", function () {
  PDPAlign.align(canvas, "center");
});

document.getElementById("pdp-align-right")?.addEventListener("click", function () {
  PDPAlign.align(canvas, "right");
});
document.getElementById("pdp-zoom-in")?.addEventListener("click", function () {
  PDPZoomGrid.zoomIn();
});

document.getElementById("pdp-zoom-out")?.addEventListener("click", function () {
  PDPZoomGrid.zoomOut();
});

document.getElementById("pdp-zoom-reset")?.addEventListener("click", function () {
  PDPZoomGrid.resetZoom();
});
document.getElementById("pdp-font-family")?.addEventListener("change", function () {
  PDPText.setFontFamily(canvas, this.value);
});
document.getElementById("pdp-toggle-grid")?.addEventListener("click", function () {
  PDPZoomGrid.toggleGrid();
});
document.getElementById("pdp-align-top")?.addEventListener("click", function () {
  PDPAlign.align(canvas, "top");
});

document.getElementById("pdp-align-middle")?.addEventListener("click", function () {
  PDPAlign.align(canvas, "middle");
});

document.getElementById("pdp-align-bottom")?.addEventListener("click", function () {
  PDPAlign.align(canvas, "bottom");
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