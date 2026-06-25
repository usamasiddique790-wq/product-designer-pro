const PDPTemplates = {
  addTshirt(canvas, designArea) {
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