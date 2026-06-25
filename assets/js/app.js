document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("pdp-canvas")) return;
  if (typeof fabric === "undefined") return;

  window.PDPApp = {};
  PDPApp.canvas = PDPCanvas.init();

  PDPHistory.init(PDPApp.canvas);
  PDPProperties.init(PDPApp.canvas);
  PDPToolbar.init(PDPApp.canvas);
});