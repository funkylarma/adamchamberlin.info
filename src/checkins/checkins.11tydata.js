import { DateTime } from 'luxon';

export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      const d = new Date(data.page.date);
      const year = d.getFullYear();
      const month = d.getMonth() +1;
      return `/${year}/${month}/${data.page.filePathStem.replace('/checkins', '/')}/`;
    },

    eleventyExcludeFromCollections: (data) => {

      return false;
    },
  },

  // Set the tag for collections
  tags: 'checkin',

  // What layout to use
  layout: 'checkin.liquid',

  // Apply a class to the body tag
  bodyClass: 'checkin--single',
};
