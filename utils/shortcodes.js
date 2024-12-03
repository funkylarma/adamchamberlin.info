import Image from "@11ty/eleventy-img";

export default {
  image: async function (
    src,
    alt,
    widths = ["auto", 400, 800],
    sizes = "100vh"
  ) {
    let metadata = await Image(src, {
      widths,
      formats: ["jpg", "webp"],
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    // You bet we throw an error on a missing alt (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  },

  currentBuildDate: function () {
    return new Date().toISOString();
  },

  year: function () {
    return `${new Date().getFullYear()}`;
  },
};
