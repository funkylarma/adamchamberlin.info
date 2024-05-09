
const 
  path = require('node:path'),
  glob = require('fast-glob'),
  outdent = require('outdent'),
  eleventyImageTransformPlugin = require("@11ty/eleventy-img"),
  eleventyRss = require("@11ty/eleventy-plugin-rss"),
  eleventyNavigation = require("@11ty/eleventy-navigation"),
  embedYouTube = require("eleventy-plugin-youtube-embed"),
  eleventySass = require('@11tyrocks/eleventy-plugin-sass-lightningcss'),
  emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");

const { 
  EleventyHtmlBasePlugin
} = require("@11ty/eleventy");

const { 
  DateTime 
} = require("luxon");

// Load the local filters
const {
  excerpt,
  readableDate,
  htmlDateString,
  dateISO,
  dateRSS,
  absoluteUrl,
  absoluteImageUrl
} = require('./filters/filters');

// Load the local shortcodes
const {
  imageShortcode,
  currentBuildDate,
  year
} = require('./shortcodes');

// Load the Markdown plugin
const { 
  markdown 
} = require('./plugins/markdown');

module.exports = function (eleventyConfig) {
  
  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: true,
  });
  
  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({
    //"./src/images": "/images",
    "./src/assets/fonts": "/assets/fonts",
    "./src/assets/images": "/assets/images",
  });
  
  // Custom filters
  eleventyConfig.addFilter('excerpt', excerpt);
  eleventyConfig.addFilter('readableDate', readableDate);
  eleventyConfig.addFilter('htmlDateString', htmlDateString);
  eleventyConfig.addFilter('dateISO', dateISO);
  eleventyConfig.addFilter('absoluteUrl', absoluteUrl);
  eleventyConfig.addFilter('absoluteImageUrl', absoluteImageUrl);
  
  // Custom shortcodes
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('currentBuildDate', currentBuildDate);
  eleventyConfig.addShortcode('year', year);
  
  // Custom collections
  
  // Plugins
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPlugin(embedYouTube, {
    lite: true
  });
  eleventyConfig.addPlugin(eleventyRss);
  eleventyConfig.addPlugin(emojiReadTime, {
    showEmoji: false
  });
  
  eleventyConfig.setLibrary('md', markdown);
  
  // Template filters
  eleventyConfig.addLiquidFilter("dateToRfc822", eleventyRss.dateToRfc822);
  eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", eleventyRss.getNewestCollectionItemDate);

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
      output: "_site"
    },
    pathPrefix: "/",
  };
};