export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      if (
        process.env.NODE_ENV === "production" &&
        (data.draft || data.page.date >= new Date())
      ) {
        return false;
      }
      return `/${data.page.filePathStem.replace("/posts", "/")}/`;
    },

    // Support for drafts
    eleventyExcludeFromCollections: (data) => {
      if (
        process.env.NODE_ENV === "production" &&
        (data.draft || data.page.date >= new Date())
      ) {
        return true;
      }
      return false;
    },
  },

  // Set the tag for collections
  tags: "post",

  // What layout to use
  layout: "post.liquid",

  bodyClass: "single",
};
