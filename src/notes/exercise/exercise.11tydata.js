import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      const d = new Date(data.page.date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      return `/${year}/${month}/${data.page.filePathStem.replace('/notes/exercise', '/')}/`;
    },
  },

  // Set the tag for collections
  tags: ['note', 'exercise'],

  // What layout to use
  layout: 'photography.liquid',

};