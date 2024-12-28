export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace('/videos', '/')}/`;
    },

    eleventyExcludeFromCollections: (data) => {
      return false;
    },
  },

  // Set the tag for collections
  tags: 'note',

  // What layout to use
  layout: 'article.liquid',

  // Apply a class to the body tag
  bodyClass: 'checkin--single',
};
