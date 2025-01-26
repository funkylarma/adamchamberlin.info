import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      return `/${data.page.filePathStem.replace('/exercise', '/')}/`;
    },
  },
  
  // Set the tag for collections
  tags: [ 'note', 'exercise' ],
  
  // What layout to use
  layout: 'exercise.liquid',
  
};