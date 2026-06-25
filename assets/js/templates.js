const PDPTemplates = {
  addProductTemplate(canvas, product) {
    if (product.template === "mug") {
      this.addMug(canvas, product.designArea);
      return;
    }

    this.addTshirt(canvas, product.designArea);
  },

  addTshirt(canvas, designArea) {
    const tshirt = new fabric.Group(
      [
        new fabric.Rect({
          left: 140,
          top: 70,
          width: 340,
          height: 500,
          rx: 40,
          ry: 40,
          fill: "#f8fafc",
          stroke: "#cbd5e1",
          strokeWidth: 2,
        }),

        new fabric.Polygon(
          [
            { x: 140, y: 110 },
            { x: 50, y: 210 },
            { x: 120, y: 280 },
            { x: 185, y: 180 },
          ],
          {
            fill: "#f8fafc",
            stroke: "#cbd5e1",
            strokeWidth: 2,
          }
        ),

        new fabric.Polygon(
          [
            { x: 480, y: 110 },
            { x: 570, y: 210 },
            { x: 500, y: 280 },
            { x: 435, y: 180 },
          ],
          {
            fill: "#f8fafc",
            stroke: "#cbd5e1",
            strokeWidth: 2,
          }
        ),

        new fabric.Circle({
          left: 250,
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

    this.addDesignArea(canvas, designArea);
  },

  addMug(canvas, designArea) {
    const mug = new fabric.Group(
      [
        new fabric.Rect({
          left: 130,
          top: 170,
          width: 330,
          height: 260,
          rx: 35,
          ry: 35,
          fill: "#ffffff",
          stroke: "#cbd5e1",
          strokeWidth: 3,
        }),

        new fabric.Circle({
          left: 420,
          top: 230,
          radius: 70,
          fill: "transparent",
          stroke: "#cbd5e1",
          strokeWidth: 18,
        }),
      ],
      {
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }
    );

    canvas.add(mug);
    canvas.sendToBack(mug);

    this.addDesignArea(canvas, designArea);
  },

  addDesignArea(canvas, designArea) {
    const printArea = new fabric.Rect({
      left: designArea.left,
      top: designArea.top,
      width: designArea.width,
      height: designArea.height,
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
  },
};