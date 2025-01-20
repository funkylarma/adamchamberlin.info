import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace('/notes/exercise', '/')}/`;
    },
  },

  // Set the tag for collections
  tags: ['exercise'],

  // What layout to use
  layout: 'exercise.liquid',

};
