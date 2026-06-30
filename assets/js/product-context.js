const PDPProductContext = {
  id: 0,
  name: "",
  image: "",

  init() {
    this.id = Number(document.getElementById("pdp-product-id")?.value || 0);
    this.name = document.getElementById("pdp-product-name")?.value || "";
    this.image = document.getElementById("pdp-product-image")?.value || "";

    console.log("PDP Product Context:", this.get());
  },

  get() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
    };
  },
};
