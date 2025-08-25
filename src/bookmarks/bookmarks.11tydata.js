import { DateTime } from "luxon";

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace("/bookmarks", "/")}/`;
    },
  },

  // Set the tag for collections
  tags: ["bookmark", "activity"],

  // What layout to use
  layout: "note.liquid",
};
