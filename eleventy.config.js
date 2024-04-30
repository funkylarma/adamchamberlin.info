
const 
  path = require('node:path'),
  eleventySass = require('@11tyrocks/eleventy-plugin-sass-lightningcss'),
  glob = require('fast-glob'),
  pluginRss = require("@11ty/eleventy-plugin-rss");

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  
  // Copy the contents of the `public` folder to the output folder
  eleventyConfig.addPassthroughCopy({
    "./src/images": "/images"
  });
  
  // Official plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLiquidFilter("absoluteUrl", pluginRss.absoluteUrl);
  
  // Third party plugins
  eleventyConfig.addPlugin(eleventySass);
  
  // Filters
  glob.sync('./_filters/*.js').forEach(file => {
    let filters = require('./' + file);
    Object.keys(filters).forEach(name => eleventyConfig.addFilter(name, filters[name]));
  });
  
  // // Shortcodes
  glob.sync('./_shortcodes/*.js').forEach(file => {
    let shortcodes = require('./' + file);
    Object.keys(shortcodes).forEach(name => eleventyConfig.addShortcode(name, shortcodes[name]));
  });

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
      includes: "../_includes",  // default: "_includes"
      data: "../_data",          // default: "_data"
      output: "public"
    },
    pathPrefix: "/",
  };
};