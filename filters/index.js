import { DateTime } from "luxon";
import Image from "@11ty/eleventy-img";
import metadata from "../data/metadata.js";

export default function (eleventyConfig) {
  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  });

  eleventyConfig.addFilter('splitlines', function(input) {
      const parts = input.split(' ');
      const lines = parts.reduce(function(prev, current) {

      if (!prev.length) {
          return [current];
      }

      let lastOne = prev[prev.length - 1];

      if (lastOne.length + current.length > 19) {
          return [...prev, current];
      }

      prev[prev.length - 1] = lastOne + ' ' + current;

      return prev;
      }, []);

      return lines;
  });

  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy"
    );
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("dateISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toISO();
  });

  eleventyConfig.addFilter("absoluteUrl", (url) => {
    return new URL(url, metadata.url).href;
  });

  eleventyConfig.addFilter("absoluteImageUrl", async (src, width = null) => {
    const imageOptions = {
      // We only need the original width and format
      widths: [width],
      formats: [null],
      // Where the generated image files get saved
      outputDir: "_site/images",
      // Public URL path that's referenced in the img tag's src attribute
      urlPath: "/images",
    };
    const stats = await Image(src, imageOptions);
    const imageUrl = Object.values(stats)[0][0].url;
    return new URL(imageUrl, metadata.url).href;
  });

  eleventyConfig.addFilter("dateRSS", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "ddd, D MMM YYYY HH:mm:ss ZZ"
    );
  });
}
