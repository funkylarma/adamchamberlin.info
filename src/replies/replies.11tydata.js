export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      return `/${data.page.filePathStem.replace('/replies', '/')}/`;
    },

    eleventyExcludeFromCollections: ( data ) => {
      return false;
    },
  },

  // Set the tag for collections
  tags: [ 'note' ],

  // What layout to use
  layout: 'note.liquid',
};
