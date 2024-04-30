const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

module.exports = function (eleventyConfig) {
  
  eleventyConfig.addPlugin(eleventySass);
  
  eleventyConfig.ignores.add("content");

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
      input: "public",          // default: "."
      includes: "../includes",  // default: "_includes"
      data: "../data",          // default: "_data"
      output: "_site"
    },
  };
};