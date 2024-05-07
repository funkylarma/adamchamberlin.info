
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

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  
  // Copy the contents of the `public` folder to the output folder
  eleventyConfig.addPassthroughCopy({
    //"./src/images": "/images",
    "./src/assets/fonts": "/assets/fonts",
    "./src/assets/images": "/assets/images",
  });
  
  // Sass
  eleventyConfig.addPlugin(eleventySass);
  
  // html base
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  
  // Navigation
  eleventyConfig.addPlugin(eleventyNavigation);
  
  // YouTube Lite embed
  eleventyConfig.addPlugin(embedYouTube, {
    lite: true
  });
  
  // RSS feeds
  eleventyConfig.addPlugin(eleventyRss);
  
  // Read time
  eleventyConfig.addPlugin(emojiReadTime, {
    showEmoji: false
  });
  
  // Template filters
  eleventyConfig.addLiquidFilter("absoluteUrl", eleventyRss.absoluteUrl);
  eleventyConfig.addLiquidFilter("dateToRfc822", eleventyRss.dateToRfc822);
  eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", eleventyRss.getNewestCollectionItemDate);
  
  // Filters
  eleventyConfig.addPlugin(require('./filters'));
  
  // Shortcodes
  eleventyConfig.addPlugin(require('./shortcodes'));

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