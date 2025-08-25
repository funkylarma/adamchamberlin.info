/**
 * If a post is a `draft`, it is for dev mode only.
 *
 * @param {object} data Post data
 * @param {boolean} [data.draft=false] Post draft status
 * @returns {boolean}
 */
function devOnly(data) {
  return Boolean(data.draft);
}

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      // Give it a filename
      const serviceDate = new Date(data.date);
      const year = serviceDate.getFullYear();
      const month = (serviceDate.getMonth() + 1).toString().padStart(2, "0");
      const filename = serviceDate.valueOf();
      return `/${year}/${month}/${filename}/`;
    },

    eleventyExcludeFromCollections: (data) => {
      if (process.env.ELEVENTY_ENV === "production" && devOnly(data)) {
        return true;
      }
      return false;
    },
  },

  // Set the tag for collections
  tags: ["service", "activity"],

  // What layout to use
  layout: "note.liquid",
};
