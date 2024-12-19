export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {

      return `/${data.page.filePathStem.replace('/mentions', '/')}/`;
    },

    eleventyExcludeFromCollections: (data) => {

      return false;
    },
  },

  // Set the tag for collections
  tags: 'comment',

  // What layout to use
  layout: 'mention.liquid',

  // Apply a class to the body tag
  bodyClass: 'checkin--single',
};
