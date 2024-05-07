module.exports = function(eleventyConfig) {
  
  const { DateTime } = require("luxon");
  const Image = require("@11ty/eleventy-img");
  const site = require('../_data/site');

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
  
  eleventyConfig.addFilter("absoluteUrl", (url) => {
    return new URL(url, site.url).href;
  });
  
  eleventyConfig.addFilter("absoluteImageUrl", async (src, width = null) => {
    const imageOptions = {
      // We only need the original width and format
      widths: [width],
      formats: [null],
      // Where the generated image files get saved
      outputDir: '_site/images',
      // Public URL path that's referenced in the img tag's src attribute
      urlPath: '/images',
    };
    const stats = await Image(src, imageOptions);
    const imageUrl = Object.values(stats)[0][0].url;
    return new URL(imageUrl, site.url).href;
  });
  
};

