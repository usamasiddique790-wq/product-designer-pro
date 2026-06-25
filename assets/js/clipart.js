const PDPClipart = {
  canvas: null,

  items: [
    {
      name: "Star",
      category: "Shapes",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#f59e0b" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>`
    },
    {
      name: "Heart",
      category: "Shapes",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#ef4444" d="M12 21s-7-4.35-10-9.5C-.5 7.2 2.4 3 6.6 3c2.1 0 3.7 1.1 5.4 3 1.7-1.9 3.3-3 5.4-3C21.6 3 24.5 7.2 22 11.5 19 16.65 12 21 12 21z"/>
      </svg>`
    },
    {
      name: "Circle",
      category: "Shapes",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#2563eb"/>
      </svg>`
    },
    {
      name: "Smile",
      category: "Emoji",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#facc15"/>
        <circle cx="8" cy="10" r="1.5" fill="#111827"/>
        <circle cx="16" cy="10" r="1.5" fill="#111827"/>
        <path d="M8 15c1 2 7 2 8 0" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`
    }
  ],

  init(canvas) {
    this.canvas = canvas;
    this.render();
    this.bindSearch();
  },

  render(filter = "") {
    const list = document.getElementById("pdp-clipart-list");
    if (!list) return;

    const keyword = filter.toLowerCase();

    const items = this.items.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
      );
    });

    list.innerHTML = "";

    if (!items.length) {
      list.innerHTML = `<p class="pdp-muted">No clipart found</p>`;
      return;
    }

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pdp-clipart-item";
      btn.innerHTML = `
        <div class="pdp-clipart-preview">${item.svg}</div>
        <span>${item.name}</span>
      `;

      btn.addEventListener("click", () => {
        this.addToCanvas(item.svg);
      });

      list.appendChild(btn);
    });
  },

  bindSearch() {
    document.getElementById("pdp-clipart-search")?.addEventListener("input", (e) => {
      this.render(e.target.value);
    });
  },

  addToCanvas(svg) {
    const area = PDPCanvas.designArea;

    fabric.loadSVGFromString(svg, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);

      obj.set({
        left: area.left + 60,
        top: area.top + 80,
        scaleX: 2,
        scaleY: 2,
      });

      this.canvas.add(obj);
      this.canvas.setActiveObject(obj);

      PDPSelection.setActive(obj);
      PDPLayers.render();
      PDPHistory.saveState();

      this.canvas.renderAll();
    });
  },
};