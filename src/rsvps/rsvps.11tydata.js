export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      return `/${data.page.filePathStem.replace('/rsvps', '/')}/`;
    },
    
    eleventyExcludeFromCollections: ( data ) => {
      return false;
    },
  },
  
  // Set the tag for collections
  tags: [ 'note', 'rsvp' ],
  
  // What layout to use
  layout: 'note.liquid',
};