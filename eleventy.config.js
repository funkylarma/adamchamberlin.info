import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventySass from "@11tyrocks/eleventy-plugin-sass-lightningcss";
import embedYouTube from "eleventy-plugin-youtube-embed";
import emojiReadTime from "@11tyrocks/eleventy-plugin-emoji-readtime";

// Import some utilities
import { dir, imagePaths, scriptDirs } from "./utils/constants.js";

// Import the local filters
import pluginFilters from "./filters/index.js";

// Import the local shortcodes
import pluginShortcodes from "./shortcodes/index.js";

// Import the Markdown plugin
import { markdown } from "./plugins/markdown.js";

export default async function (eleventyConfig) {

  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: true,
  });

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({
    "./src/assets/fonts": "/assets/fonts",
    "./src/assets/images": "/assets/images",
  });

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpeg}");

  // Custom collections

  // Plugins
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(embedYouTube, {
    lite: true,
  });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(emojiReadTime, {
    showEmoji: false,
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: "html",
    // optional, output image formats
    formats: ["jpg", "webp"],
    // optional, output image widths
    widths: ["auto", 400, 800],
    // output directory
    urlPath: "/images/",
    outputDir: "./_site/images/",
    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: "lazy",
      sizes: "100vw",
      decoding: "async",
    },
  });

  eleventyConfig.setLibrary("md", markdown);

  // Shortcodes
  eleventyConfig.addPlugin(pluginShortcodes);

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  // Template filters
  eleventyConfig.addLiquidFilter("dateToRfc822", pluginRss.dateToRfc822);
  eleventyConfig.addLiquidFilter(
    "getNewestCollectionItemDate",
    pluginRss.getNewestCollectionItemDate
  );

  return {

    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
    ],

    // Inputs and outputs:
    dir: {
      input: "./src",             // default: "."
      includes: "../includes",  // default: "_includes"
      data: "../data",          // default: "_data"
      output: "_site"
    },
    pathPrefix: "/",
  };
}
