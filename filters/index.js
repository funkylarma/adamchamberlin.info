import { DateTime } from "luxon";
import Image from "@11ty/eleventy-img";
import metadata from "../data/metadata.js";
import removeMarkdown from "remove-markdown";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { minify } from "terser";

export default function (eleventyConfig) {
  eleventyConfig.addFilter("metaTitle", function (title) {
    title.trim();
    if (this.page.url) {
      if (this.page.url == "/" || this.page.url.includes("page")) {
        title = metadata.tagline;
      } else {
        title = title + " | " + metadata.title;
      }
    }

    return title;
  });

  eleventyConfig.addFilter("metaKeywords", function (tags) {
    return tags.join(", ");
  });

  eleventyConfig.addFilter("metaDescription", function (title) {
    if (this.page.url) {
      if (this.page.url == "/" || this.page.url.includes("page")) {
        return metadata.description;
      }

      if (/\d{4}\//.test(this.page.url)) {
        return (
          title +
          " - an article posted by " +
          metadata.title +
          " on " +
          this.page.date.toDateString()
        );
      }
    }

    return title + " | " + metadata.title;
  });

  eleventyConfig.addFilter("postExcerpt", function (post) {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 400)) + "...";
  });

  eleventyConfig.addFilter("splitLines", function (input) {
    const parts = input.split(" ");
    const lines = parts.reduce(function (prev, current) {
      if (!prev.length) {
        return [current];
      }

      let lastOne = prev[prev.length - 1];

      if (lastOne.length + current.length > 19) {
        return [...prev, current];
      }

      prev[prev.length - 1] = lastOne + " " + current;

      return prev;
    }, []);

    return lines;
  });

  eleventyConfig.addFilter("dateReadable", (dateObj, format, zone) => {
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy"
    );
  });

  eleventyConfig.addFilter("dateHtmlString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, "utc").toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("dateISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toISO();
  });

  eleventyConfig.addFilter("timeReading", function (content) {
    const minutes = Math.ceil(content.trim().split(/\s+/).length / 200);

    return `${minutes} min read`;
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
      outputDir: "_site/images/",
      // Public URL path that's referenced in the img tag's src attribute
      urlPath: "./src/images",
    };
    const stats = await Image(src, imageOptions);
    const imageUrl = Object.values(stats)[0][0].url;
    return absoluteUrl(imageUrl);
  });

  eleventyConfig.addFilter("fileHash", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", DateTime.local().toFormat("X"));
    return `${urlPart}?${params}`;
  });

  eleventyConfig.addFilter("jsmin", async (code) => {
    let minified = await minify(code);
    if (minified.error) {
      console.log("Terser error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Template filters
  eleventyConfig.addLiquidFilter("dateToRfc822", pluginRss.dateToRfc822);

  eleventyConfig.addLiquidFilter(
    "getNewestCollectionItemDate",
    pluginRss.getNewestCollectionItemDate
  );
}
