export default {
  //   eleventyComputed: {
  //     // Modify the permalink
  //     permalink: (data) => {
  //       if (
  //         process.env.NODE_ENV === "production" &&
  //         (data.draft || data.page.date >= new Date())
  //       ) {
  //         return false;
  //       }
  //       return `/${data.page.fileSlug}/`;
  //     },
  //
  //     // Support for drafts
  //     eleventyExcludeFromCollections: (data) => {
  //       if (
  //         process.env.NODE_ENV === "production" &&
  //         (data.draft || data.page.date >= new Date())
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     },
  //   },

  // Set the tag for collections
  tags: "page",

  // What layout to use
  layout: "page.liquid",

  // Apply a class to the body tag
  bodyClass: "page--single",
};
