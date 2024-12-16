import Image from '@11ty/eleventy-img';

export default {
  currentBuildDate: function () {
    return new Date().toISOString();
  },

  year: function () {
    return `${new Date().getFullYear()}`;
  },
};
