/**
 * If a post is a `draft`, it is for dev mode only.
 *
 * @param {object} data Post data
 * @param {boolean} [data.draft=false] Post draft status
 * @returns {boolean}
 */
function devOnly ( data ) {
  return Boolean( data.draft );
}

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      if ( process.env.ELEVENTY_ENV === 'production' && devOnly( data ) ) {
        return false;
      }
      return `/${data.page.filePathStem.replace('/photos', '/')}/`;
    },
    
    eleventyExcludeFromCollections: ( data ) => {
      if ( process.env.ELEVENTY_ENV === 'production' && devOnly( data ) ) {
        return true;
      }
      return false;
    },
  },
  
  // Set the tag for collections
  tags: [ 'note' ],
  
  // What layout to use
  layout: 'photography.liquid',
  
};