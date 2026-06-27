document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("pdp-canvas")) return;
  if (typeof fabric === "undefined") return;

  window.PDPApp = {};
  PDPProductContext.init();
  PDPApp.canvas = PDPCanvas.init();

  PDPHistory.init(PDPApp.canvas);
  PDPSelection.init(PDPApp.canvas);
  PDPSnap.init(PDPApp.canvas);
  PDPZoomGrid.init(PDPApp.canvas);
  PDPViewManager.init(PDPApp.canvas);
  PDPLayers.init(PDPApp.canvas);
  PDPProperties.init(PDPApp.canvas);
  PDPClipart.init(PDPApp.canvas);
  PDPToolbar.init(PDPApp.canvas);

  PDPShortcuts.init(PDPApp.canvas);

  PDPSelection.updateStatusBar();
  PDPViewManager.updateButtons();
});
