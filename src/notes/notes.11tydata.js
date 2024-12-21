export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      return `/${data.page.filePathStem.replace('/notes', '/')}/`;
    },

    //     title: (data) => {
    //       if (data.type === 'reply') {
    //         const title = 'Reply to ' + data.to;
    //       }
    //
    //       return `${title} from ${data.page.date.toDateString()}`;
    //     },

    eleventyExcludeFromCollections: (data) => {
      return false;
    },
  },

  // Set the tag for collections
  tags: 'comment',

  // What layout to use
  layout: 'note.liquid',

  // Apply a class to the body tag
  bodyClass: 'checkin--single',
};
