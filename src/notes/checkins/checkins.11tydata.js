import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace('/notes/checkins', '/')}/`;
    },
  },

  // Set the tag for collections
  tags: ['checkin'],

  // What layout to use
  layout: 'checkin.liquid',
};
