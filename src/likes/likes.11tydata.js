export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace("/likes", "/")}/`;
    },

    eleventyExcludeFromCollections: (data) => {
      return false;
    },
  },

  // Set the tag for collections
  tags: ["note", "like", "activity"],

  // What layout to use
  layout: "note.liquid",
};
