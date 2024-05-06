
const 
  path = require('node:path'),
  eleventySass = require('@11tyrocks/eleventy-plugin-sass-lightningcss'),
  glob = require('fast-glob'),
  eleventyRss = require("@11ty/eleventy-plugin-rss"),
  eleventyNavigation = require("@11ty/eleventy-navigation"),
  embedYouTube = require("eleventy-plugin-youtube-embed"),
  emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  
  // Copy the contents of the `public` folder to the output folder
  eleventyConfig.addPassthroughCopy({
    "./src/images": "/images",
    "./src/assets/fonts": "/assets/fonts",
    "./src/assets/images": "/assets/images",
  });
  
  // Official plugins
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
  
  // Template filters
  eleventyConfig.addLiquidFilter("absoluteUrl", eleventyRss.absoluteUrl);
  eleventyConfig.addLiquidFilter("dateToRfc822", eleventyRss.dateToRfc822);
  eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", eleventyRss.getNewestCollectionItemDate);
  
  // Filters
  // TODO: Put all the filters into external file
  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  });
  
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
  });
  
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });
  
  eleventyConfig.addFilter("dateISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toISO();
  });
  
  eleventyConfig.addFilter("dateRSS", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('ddd, D MMM YYYY HH:mm:ss ZZ');
  });
  
  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
  
    return array.slice(0, n);
  });
  
  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });
  
  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });
  
  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => [ "all", "nav", "post", "posts" ].indexOf(tag) === -1);
  });
  
  // Shortcodes
  // TODO: Refactor all the shortcodes into an external file
  eleventyConfig.addShortcode("currentBuildDate", function () {
    return (new Date()).toISOString();
  });

  eleventyConfig.addShortcode("year", function () {
    return `${new Date().getFullYear()}`;
  });
  
  // // Shortcodes
  // glob.sync('./_shortcodes/*.js').forEach(file => {
  //   let shortcodes = require('./' + file);
  //   Object.keys(shortcodes).forEach(name => eleventyConfig.addShortcode(name, shortcodes[name]));
  // });

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