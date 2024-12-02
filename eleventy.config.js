// Node imports
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

// Web imports
import * as sass from "sass";
import htmlmin from "html-minifier";
import { minify } from "terser";
import browserslist from "browserslist";
import { transform, browserslistToTargets } from "lightningcss";

// 11ty Imports
import {
  HtmlBasePlugin as pluginHtmlBase,
  EleventyRenderPlugin as pluginEleventyRender,
} from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin as pluginImageTransform } from "@11ty/eleventy-img";

// 3rd Party Imports
import pluginPostGraph from "@rknightuk/eleventy-plugin-post-graph";

// Import the local functions
import events from "./utils/events.js";
import collections from "./utils/collections.js";
import filters from "./utils/filters.js";
import shortcodes from "./utils/shortcodes.js";
import transforms from "./utils/transforms.js";
import { markdown } from "./utils/markdown.js";

// Environmental
const isDev = process.env.ELEVENTY_ENV === "development";
const isProd = process.env.ELEVENTY_ENV === "production";

export default async function (eleventyConfig) {
  eleventyConfig.addGlobalData("env", process.env);

  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: true,
  });

  eleventyConfig.addBundle("css", {
    outputFileExtension: "css",
  });

  // Add sass/scss support
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

      if (isProd) {
        let result = sass.compileString(inputContent, {
          loadPaths: [parsed.dir],
          sourceMap: true,
        });

        return async () => {
          let { code } = await transform({
            code: Buffer.from(result.css),
            minify: isProd,
            sourceMap: true,
            targets,
          });
          return code;
        };
      }

      if (isDev) {
        return async (data) => {
          let result = sass.compileString(inputContent, {
            loadPaths: [parsed.dir],
            sourceMap: true,
            minify: isProd,
            targets,
          });
          return result.css;
        };
      }
    },
  });

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({
    "./src/assets/fonts": "/assets/fonts",
    "./src/assets/images": "/assets/images",
    "./src/assets/icons": "/assets/icons",
    "./src/assets/templates": "/assets/templates",
  });

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("./src/**/*.{svg,webp,png,jpeg}");
  eleventyConfig.watchIgnores.add("./src/assets/ogi/**/*");

  // Plugins
  eleventyConfig.addPlugin(pluginEleventyRender);
  eleventyConfig.addPlugin(pluginHtmlBase);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginPostGraph, {
    highlightColorLight: "var(--main-color-secondary)",
    highlightColorDark: "var(--main-color-quinary)",
    dayBoxTitle: true,
    dayBoxTitleFormat: "MMM D, YYYY",
    sort: "desc",
  });
  eleventyConfig.addPlugin(pluginImageTransform, {
    extensions: "html",
    formats: ["jpg", "webp"],
    widths: ["auto", 400, 600, 800],
    urlPath: "/images/",
    outputDir: "./_site/images/",
    defaultAttributes: {
      loading: "lazy",
      sizes: "(min-width: 880px) 640px, calc(76.07vw - 14px)",
      decoding: "async",
    },
  });

  // Markdown
  eleventyConfig.setLibrary("md", markdown);

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Collections
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });

  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName]);
  });

  // After build to copy all the OpenGraph images
  eleventyConfig.on("afterBuild", events.afterBuild);

  // Base config
  return {
    // Control which files Eleventy will process
    templateFormats: ["md", "njk", "html", "liquid", "scss", "js"],

    // Inputs and outputs:
    dir: {
      input: "./src", // default: '.'
      includes: "../includes", // default: '_includes'
      data: "../data", // default: '_data'
      output: "_site",
    },
    pathPrefix: "/",
  };
}
