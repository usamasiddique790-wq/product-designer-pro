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

  if (window.pdpData && window.pdpData.design_id) {
    window.PDPApp.designId = window.pdpData.design_id;
    loadSavedDesign(window.pdpData.design_id);
  } else {
    addProductBackground();

    if (typeof PDPDesignImport !== "undefined") {
      setTimeout(function () {
        PDPDesignImport.loadFromStorage(PDPApp.canvas);
      }, 300);
    }
  }

  const saveBtn = document.getElementById("pdp-save-design");

  if (!saveBtn) return;

  saveBtn.addEventListener("click", function () {
    saveDesign();
  });

  function addProductBackground() {
    const productImageInput = document.getElementById("pdp-product-image");
    const productImageUrl = productImageInput ? productImageInput.value : "";

    if (!productImageUrl) return;

    const existingProduct = PDPApp.canvas
      .getObjects()
      .find((object) => object.pdpProductBackground === true);

    if (existingProduct) return;

    fabric.Image.fromURL(productImageUrl, function (img) {
      img.scaleToWidth(PDPApp.canvas.getWidth());

      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        pdpProductBackground: true,
        name: "Product Background",
      });

      PDPApp.canvas.add(img);
      PDPApp.canvas.sendToBack(img);
      PDPApp.canvas.requestRenderAll();

      refreshCanvasView();
    });
  }

  function refreshCanvasView() {
    setTimeout(function () {
      PDPApp.canvas.setZoom(1);
      PDPApp.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

      PDPApp.canvas.getObjects().forEach(function (object) {
        object.set({
          visible: true,
          opacity: object.opacity || 1,
        });
        object.setCoords();
      });

      PDPApp.canvas.calcOffset();
      PDPApp.canvas.requestRenderAll();

      if (typeof PDPSelection !== "undefined") {
        PDPSelection.updateStatusBar();
      }

      if (typeof PDPViewManager !== "undefined") {
        PDPViewManager.updateButtons();
      }

      if (typeof PDPLayers !== "undefined" && typeof PDPLayers.render === "function") {
        PDPLayers.render();
      }
    }, 300);
  }

  function getDesignJson() {
    const backgroundObjects = PDPApp.canvas
      .getObjects()
      .filter((object) => object.pdpProductBackground === true);

    backgroundObjects.forEach(function (object) {
      PDPApp.canvas.remove(object);
    });

    const designJson = JSON.stringify(PDPApp.canvas.toJSON());

    backgroundObjects.forEach(function (object) {
      PDPApp.canvas.add(object);
      PDPApp.canvas.sendToBack(object);
    });

    PDPApp.canvas.requestRenderAll();

    return designJson;
  }

  function loadSavedDesign(designId) {
    const formData = new FormData();

    formData.append("action", "pdp_load_design");
    formData.append("nonce", window.pdpData.nonce);
    formData.append("design_id", designId);

    fetch(window.pdpData.ajax_url, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    })
      .then((res) => res.text())
      .then((text) => {
        console.log("LOAD RESPONSE:", text);

        const response = JSON.parse(text);

        if (!response.success) {
          alert(
            response.data && response.data.message ? response.data.message : "Design load failed.",
          );
          return;
        }

        const designJson = response.data.design_json;
        const parsedJson = typeof designJson === "string" ? JSON.parse(designJson) : designJson;

        PDPApp.canvas.clear();

        fabric.util.enlivenObjects(parsedJson.objects || [], function (objects) {
          objects.forEach(function (object) {
            if (object.pdpProductBackground === true) return;
            PDPApp.canvas.add(object);
          });

          addProductBackground();

          const designInput = document.getElementById("pdp-design-id");
          if (designInput) {
            designInput.value = response.data.design_id;
          }

          const jsonInput = document.getElementById("pdp-design-json");
          if (jsonInput) {
            jsonInput.value = designJson;
          }

          window.PDPApp.designId = response.data.design_id;

          refreshCanvasView();

          console.log("Loaded Design ID:", response.data.design_id);
        });
      })
      .catch((error) => {
        console.error("Load design error:", error);
        alert("Something went wrong while loading design.");
      });
  }

  function saveDesign() {
    const canvas = PDPApp.canvas;

    if (!window.pdpData || !window.pdpData.ajax_url || !window.pdpData.nonce) {
      alert("Designer save settings are missing. Please refresh the page.");
      return;
    }

    const designJson = getDesignJson();

    const activeView =
      typeof PDPViewManager !== "undefined" && PDPViewManager.currentView
        ? PDPViewManager.currentView
        : "front";

    let previewFront = "";
    let previewBack = "";

    const preview = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    if (activeView === "back") {
      previewBack = preview;
    } else {
      previewFront = preview;
    }

    const productId = window.pdpData && window.pdpData.product_id ? window.pdpData.product_id : 0;

    const designId =
      window.PDPApp.designId ||
      (window.pdpData && window.pdpData.design_id ? window.pdpData.design_id : 0);

    const formData = new FormData();

    formData.append("action", "pdp_save_design");
    formData.append("nonce", window.pdpData.nonce);
    formData.append("product_id", productId);
    formData.append("design_id", designId);
    formData.append("design_json", designJson);
    formData.append("preview_front", previewFront);
    formData.append("preview_back", previewBack);

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    fetch(window.pdpData.ajax_url, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    })
      .then((res) => res.text())
      .then((text) => {
        console.log("SAVE RESPONSE:", text);

        const response = JSON.parse(text);

        if (response.success) {
          const newDesignId = response.data.design_id;

          window.PDPApp.designId = newDesignId;

          if (window.pdpData) {
            window.pdpData.design_id = newDesignId;
          }

          const designInput = document.getElementById("pdp-design-id");
          if (designInput) {
            designInput.value = newDesignId;
          }

          const jsonInput = document.getElementById("pdp-design-json");
          if (jsonInput) {
            jsonInput.value = designJson;
          }

          const url = new URL(window.location.href);
          url.searchParams.set("pdp_design_id", newDesignId);
          window.history.replaceState({}, "", url.toString());

          console.log("Design ID:", newDesignId);

          alert(response.data.message || "Design saved successfully!");
        } else {
          alert(
            response.data && response.data.message ? response.data.message : "Design save failed.",
          );
        }
      })
      .catch((error) => {
        console.error("Save design error:", error);
        alert("Something went wrong while saving design.");
      })
      .finally(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Design";
      });
  }
});
