import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: ( data ) => {
      return `/${data.page.filePathStem.replace('/checkins', '/')}/`;
    },
  },

  // Set the tag for collections
  tags: [ 'note' ],

  // What layout to use
  layout: 'checkin.liquid',
};
