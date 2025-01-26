export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      return `/${data.page.filePathStem.replace('/comments', '/')}/`;
    },
    
    eleventyExcludeFromCollections: ( data ) => {
      return false;
    },
  },
  
  // Set the tag for collections
  tags: [ 'note', 'reply' ],
  
  // What layout to use
  layout: 'note.liquid',
};