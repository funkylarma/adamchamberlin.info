import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addShortcode(
    "image",
    async function (src, alt, widths = ["auto", 400, 800], sizes = "100vh") {
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
    }
  );

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });

  eleventyConfig.addShortcode("year", () => {
    return `${new Date().getFullYear()}`;
  });

  eleventyConfig.addShortcode("openGraphImage", function () {
    return `https://adamchamberlin.info/ogi${this.page.url}`;
    // const encodedURL = encodeURIComponent(
    //   `https://adamchamberlin.info/ogi${this.page.url}`
    // );
    // const cacheKey = `_${new Date().valueOf()}`;
    // return `https://v1.screenshot.11ty.dev/${encodedURL}/opengraph/${cacheKey}`;
  });
}
