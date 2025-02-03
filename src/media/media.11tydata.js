export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      const d = new Date( data.page.date );
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      return `/${year}/${month}/${data.page.filePathStem.replace('/media', '/')}/`;
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