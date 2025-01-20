import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      // const d = new Date(data.page.date);
      // const year = d.getFullYear();
      // const month = d.getMonth() + 1;
      // return `/${year}/${month}/${data.page.filePathStem.replace('/notes/checkins', '/')}/`;
      return `/${data.page.filePathStem.replace('/notes/checkins', '/')}/`;
    },
  },

  // Set the tag for collections
  tags: ['note', 'checkin'],

  // What layout to use
  layout: 'checkin.liquid',
};