document.addEventListener("click", function (event) {
  const button = event.target.closest(".pdp-view-design");

  if (!button) {
    return;
  }

  const rawDesign = button.dataset.design || "";
  let design;

  try {
    design = JSON.parse(rawDesign);
  } catch (error) {
    alert("Invalid design JSON.");
    return;
  }

  const prettyJson = JSON.stringify(design, null, 2);
  const previews = design.previews || {};
  const defaultView = design.currentView || "front";

  const modal = document.createElement("div");
  modal.className = "pdp-admin-modal";
  modal.innerHTML = `
    <div class="pdp-admin-modal-backdrop"></div>

    <div class="pdp-admin-modal-box">
      <div class="pdp-admin-modal-header">
        <h2>Product Design Preview</h2>
        <button type="button" class="pdp-admin-modal-close">×</button>
      </div>

      <div class="pdp-admin-modal-body">
        <div class="pdp-admin-preview-wrap">
          <div class="pdp-admin-tabs">
            <button type="button" class="button pdp-preview-tab" data-view="front">Front</button>
            <button type="button" class="button pdp-preview-tab" data-view="back">Back</button>
          </div>

          <div class="pdp-admin-preview">
            <img class="pdp-preview-image" src="" alt="Product Design Preview">
            <pre class="pdp-preview-json" style="display:none;"></pre>
          </div>
        </div>

        <div class="pdp-admin-actions">
          <button type="button" class="button button-primary pdp-download-png">
            Download Current PNG
          </button>

          <button type="button" class="button pdp-download-json">
            Download JSON
          </button>

          <button type="button" class="button button-secondary pdp-reedit-design">
            Re-edit Design
          </button>

          <p>This is the saved customer design.</p>
        </div>
      </div>

      <div class="pdp-admin-modal-footer">
        <button type="button" class="button pdp-admin-modal-close">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  let activeView = defaultView;

  const image = modal.querySelector(".pdp-preview-image");
  const jsonPreview = modal.querySelector(".pdp-preview-json");

  function renderView(view) {
    activeView = view;

    modal.querySelectorAll(".pdp-preview-tab").forEach((tab) => {
      tab.classList.toggle("button-primary", tab.dataset.view === view);
    });

    const previewPng = previews[view] || "";

    if (previewPng) {
      image.src = previewPng;
      image.style.display = "block";
      jsonPreview.style.display = "none";
      return;
    }

    image.style.display = "none";
    jsonPreview.style.display = "block";
    jsonPreview.textContent = design.views?.[view] || "No design found.";
  }

  modal.querySelectorAll(".pdp-preview-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      renderView(tab.dataset.view);
    });
  });

  modal.querySelectorAll(".pdp-admin-modal-close, .pdp-admin-modal-backdrop").forEach((el) => {
    el.addEventListener("click", function () {
      modal.remove();
    });
  });

  modal.querySelector(".pdp-download-json").addEventListener("click", function () {
    downloadFile("product-design.json", prettyJson, "application/json");
  });

  modal.querySelector(".pdp-reedit-design").addEventListener("click", function () {
    localStorage.setItem("pdp_reedit_design", JSON.stringify(design));
    window.open("/designer/?pdp_reedit=1", "_blank");
  });

  modal.querySelector(".pdp-download-png").addEventListener("click", function () {
    const previewPng = previews[activeView] || "";

    if (!previewPng) {
      alert("PNG preview not found for this side.");
      return;
    }

    downloadFile(`product-design-${activeView}.png`, previewPng, "image/png", true);
  });

  renderView(previews[activeView] ? activeView : "front");
});

function downloadFile(filename, content, mimeType, isDataUrl = false) {
  const link = document.createElement("a");

  link.download = filename;
  link.href = isDataUrl ? content : URL.createObjectURL(new Blob([content], { type: mimeType }));

  document.body.appendChild(link);
  link.click();
  link.remove();
}
