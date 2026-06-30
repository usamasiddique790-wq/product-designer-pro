jQuery(function ($) {
  $(document).on("click", ".pdp-view-design", function () {
    const design = $(this).data("design");

    const win = window.open("", "_blank");

    win.document.write(
      "<pre style='white-space:pre-wrap;font-size:14px;padding:20px'>" +
        JSON.stringify(JSON.parse(design), null, 2) +
        "</pre>",
    );
  });
});
