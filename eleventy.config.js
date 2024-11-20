import fs from "node:fs";
import path from "node:path";
import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
  EleventyRenderPlugin,
} from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Image from "@11ty/eleventy-img";
import * as sass from 'sass'
import htmlmin from "html-minifier";
import browserslist from "browserslist";
import { transform, browserslistToTargets } from "lightningcss";
import embedYouTube from "eleventy-plugin-youtube-embed";
import postGraph from "@rknightuk/eleventy-plugin-post-graph";
import moment from "moment";

// Import some utilities
import { dir, imagePaths, scriptDirs } from "./utils/constants.js";

// Import the local collections
import pluginCollections from "./collections/index.js";

// Import the local filters
import pluginFilters from "./filters/index.js";

// Import the local shortcodes
import pluginShortcodes from "./shortcodes/index.js";

// Import the Markdown plugin
import { markdown } from "./plugins/markdown.js";

const isDev = process.env.ELEVENTY_ENV === "development";
const isProd = process.env.ELEVENTY_ENV === "production";

export default async function (eleventyConfig) {
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
    outputFileExtension: "css", // optional, default: "html"

    // `compile` is called once per .scss file in the input directory
    compile: async function (inputContent, inputPath) {
      // Skip files like _fileName.scss
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      // Run file content through Sass
      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        sourceMap: true, // or true, your choice!
      });

      let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

      return async () => {
        let { code } = await transform({
          code: Buffer.from(result.css),
          minify: isProd,
          sourceMap: true,
          targets,
        });
        return code;
      };
    },
  });

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({
    "./src/assets/fonts": "/assets/fonts",
    "./src/assets/images": "/assets/images",
    "./src/assets/icons": "/assets/icons",
  });

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpeg}");
  eleventyConfig.watchIgnores.add("src/assets/ogi/**/*");

  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(embedYouTube, {
    lite: true,
  });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(postGraph, {
    highlightColorLight: "var(--main-color-secondary)",
    highlightColorDark: "var(--main-color-quinary)",
    dayBoxTitle: true,
    dayBoxTitleFormat: "MMM D, YYYY",
    sort: "desc",
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: "html",
    // optional, output image formats
    formats: ["jpg", "webp"],
    // optional, output image widths
    widths: ["auto", 400, 900],
    // output directory
    urlPath: "/images/",
    outputDir: "./_site/images/",
    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: "lazy",
      sizes: "900",
      decoding: "async",
    },
  });

  eleventyConfig.setLibrary("md", markdown);

  // Shortcodes
  eleventyConfig.addPlugin(pluginShortcodes);

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  // Collections
  eleventyConfig.addPlugin(pluginCollections);

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (isProd) {
      if (outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDocType: true,
          removeComments: true,
          collapseWhitespace: true,
        });
        return minified;
      }
      return content;
    } else {
      return content;
    }
  });

  eleventyConfig.on("afterBuild", () => {
    const ogiDir = "./src/assets/ogi/";
    fs.readdir(ogiDir, function (err, files) {
      if (files.length > 0) {
        files.forEach(function (filename) {
          if (filename.endsWith(".svg")) {
            let imageUrl = ogiDir + filename;
            Image(imageUrl, {
              formats: ["jpeg"],
              outputDir: "./_site/assets/ogi/",
              filenameFormat: function (id, src, width, format, options) {
                let outputFilename = filename.substring(0, filename.length - 4);
                return `${outputFilename}.${format}`;
              },
            });
          }
        });
      }
    });
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Inputs and outputs:
    dir: {
      input: "./src", // default: "."
      includes: "../includes", // default: "_includes"
      data: "../data", // default: "_data"
      output: "_site",
    },
    pathPrefix: "/",
  };
}
