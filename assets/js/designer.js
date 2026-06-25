document.addEventListener("DOMContentLoaded", function () {
  const canvasElement = document.getElementById("pdp-canvas");

  if (!canvasElement || typeof fabric === "undefined") return;

  const canvas = new fabric.Canvas("pdp-canvas", {
    backgroundColor: "#ffffff",
    preserveObjectStacking: true,
  });

  const DESIGN_AREA = {
    left: 225,
    top: 170,
    width: 250,
    height: 330,
  };

  const tshirt = new fabric.Group(
    [
      new fabric.Rect({
        left: 170,
        top: 70,
        width: 360,
        height: 520,
        rx: 40,
        ry: 40,
        fill: "#f8fafc",
        stroke: "#cbd5e1",
        strokeWidth: 2,
      }),

      new fabric.Polygon(
        [
          { x: 170, y: 110 },
          { x: 80, y: 210 },
          { x: 150, y: 280 },
          { x: 210, y: 180 },
        ],
        {
          fill: "#f8fafc",
          stroke: "#cbd5e1",
          strokeWidth: 2,
        }
      ),

      new fabric.Polygon(
        [
          { x: 530, y: 110 },
          { x: 620, y: 210 },
          { x: 550, y: 280 },
          { x: 490, y: 180 },
        ],
        {
          fill: "#f8fafc",
          stroke: "#cbd5e1",
          strokeWidth: 2,
        }
      ),

      new fabric.Circle({
        left: 295,
        top: 70,
        radius: 55,
        fill: "#ffffff",
        stroke: "#cbd5e1",
        strokeWidth: 2,
      }),
    ],
    {
      selectable: false,
      evented: false,
      excludeFromExport: true,
    }
  );

  canvas.add(tshirt);
  canvas.sendToBack(tshirt);

  const printArea = new fabric.Rect({
    left: DESIGN_AREA.left,
    top: DESIGN_AREA.top,
    width: DESIGN_AREA.width,
    height: DESIGN_AREA.height,
    fill: "rgba(37, 99, 235, 0.04)",
    stroke: "#2563eb",
    strokeWidth: 2,
    strokeDashArray: [8, 6],
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });

  canvas.add(printArea);
  canvas.bringToFront(printArea);

  function keepInsideDesignArea(obj) {
    const bound = obj.getBoundingRect(true);

    let left = obj.left;
    let top = obj.top;

    if (bound.left < DESIGN_AREA.left) {
      left += DESIGN_AREA.left - bound.left;
    }

    if (bound.top < DESIGN_AREA.top) {
      top += DESIGN_AREA.top - bound.top;
    }

    if (bound.left + bound.width > DESIGN_AREA.left + DESIGN_AREA.width) {
      left -= bound.left + bound.width - (DESIGN_AREA.left + DESIGN_AREA.width);
    }

    if (bound.top + bound.height > DESIGN_AREA.top + DESIGN_AREA.height) {
      top -= bound.top + bound.height - (DESIGN_AREA.top + DESIGN_AREA.height);
    }

    obj.set({ left, top });
  }

  canvas.on("object:moving", function (e) {
    keepInsideDesignArea(e.target);
  });

  const addTextBtn = document.getElementById("pdp-add-text");
  const uploadInput = document.getElementById("pdp-upload-image");
  const deleteBtn = document.getElementById("pdp-delete");
  const exportBtn = document.getElementById("pdp-export");
  const colorPicker = document.getElementById("pdp-text-color");
const fontSize = document.getElementById("pdp-font-size");

const boldBtn = document.getElementById("pdp-bold");
const italicBtn = document.getElementById("pdp-italic");

const frontBtn = document.getElementById("pdp-front");
const backBtn = document.getElementById("pdp-back");
  const output = document.getElementById("pdp-output");
function activeText() {
    const obj = canvas.getActiveObject();

    if (!obj) return null;

    if (obj.type !== "i-text") return null;

    return obj;
}
  addTextBtn.addEventListener("click", function () {
    const text = new fabric.IText("Your Text", {
      left: DESIGN_AREA.left + 35,
      top: DESIGN_AREA.top + 60,
      fontSize: 34,
      fill: "#111827",
      fontFamily: "Arial",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.bringToFront(text);
  });

  uploadInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      fabric.Image.fromURL(e.target.result, function (img) {
        img.scaleToWidth(180);

        img.set({
          left: DESIGN_AREA.left + 35,
          top: DESIGN_AREA.top + 100,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.bringToFront(img);
      });
    };

    reader.readAsDataURL(file);
    uploadInput.value = "";
  });

  deleteBtn.addEventListener("click", function () {
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.selectable !== false) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  });

  exportBtn.addEventListener("click", function () {
    const json = canvas.toJSON(["excludeFromExport"]);

    const previewPng = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const printPng = canvas.toDataURL({
      format: "png",
      left: DESIGN_AREA.left,
      top: DESIGN_AREA.top,
      width: DESIGN_AREA.width,
      height: DESIGN_AREA.height,
      quality: 1,
      multiplier: 3,
    });

    output.value = JSON.stringify(
      {
        json,
        previewPng,
        printPng,
      },
      null,
      2
    );
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Delete" || e.key === "Backspace") {
      const activeObject = canvas.getActiveObject();

      if (
        activeObject &&
        activeObject.selectable !== false &&
        document.activeElement.tagName !== "TEXTAREA" &&
        document.activeElement.tagName !== "INPUT"
      ) {
        canvas.remove(activeObject);
        canvas.renderAll();
      }
    }
  });
});
