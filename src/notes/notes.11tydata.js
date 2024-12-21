export default {
  eleventyComputed: {
    // Modify the permalink
    permalink: (data) => {
      const d = new Date(data.page.date);
      const year = d.getFullYear();
      const month = d.getMonth() +1;
      return `/${year}/${month}/${data.page.filePathStem.replace('/notes', '/')}/`;
    },

    title: (data) => {

      if (data.type === 'reply') {
        const title = "Reply to "
      }

      return `${data.type} from ${data.page.date.toDateString()}`;
    },

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
