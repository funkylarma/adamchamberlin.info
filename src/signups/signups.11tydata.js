/** @format */

import { DateTime } from "luxon";

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace("/signups", "/")}/`;
    },
  },

  // Set the tag for collections
  tags: ["note", "signup", "activity"],

  // What layout to use
  layout: "note.liquid",
};
