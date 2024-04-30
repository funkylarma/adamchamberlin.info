module.exports = {
  eleventyComputed: {
    /**
     * Adds support for drafts.
     * If a page has `draft: true` in its YAML frontmatter then this snippet
     * will set its permalink to false and exclude it from collections.
     *
     * For dev builds we will always render the page.
     * Taken from https://github.com/11ty/eleventy/issues/26
     */
    permalink: data => {
      if (process.env.NODE_ENV === "production" && (data.draft || data.page.date >= new Date())) {
        return false;
      }
      return `/${data.page.fileSlug}/`;
    },
    //   permalink: data => data.page.filePathStem.match(/.*\/(?:\d{1,}-){0,3}(.*)/)[1] + '/'
    
    eleventyExcludeFromCollections: data => {
      if (process.env.NODE_ENV === "production" &&  (data.draft || data.page.date >= new Date())) {
        return true;
      }
      return false;
    }
  },
  
  // Set the tags
  tags: [
    "posts"
  ],
  
  // What layout to use
  layout: "post.liquid",

};