export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace("/reposts", "/")}/`;
    },

    eleventyExcludeFromCollections: (data) => {
      return false;
    },
  },

  // Set the tag for collections
  tags: ["note", "repost", "activity"],

  // What layout to use
  layout: "note.liquid",
};
