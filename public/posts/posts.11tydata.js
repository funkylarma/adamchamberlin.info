module.exports = {
  
  layout: 'post.liquid',
  tags: "posts",

  eleventyComputed: {
    permalink: data => data.page.filePathStem.match(/.*\/(?:\d{1,}-){0,3}(.*)/)[1] + '/'
  }
};