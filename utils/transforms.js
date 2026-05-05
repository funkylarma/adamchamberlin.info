/** @format */

import { minify } from 'html-minifier-terser';

export default {
  htmlmin: async function (content) {
    if (process.env.ELEVENTY_ENV === 'production') {
      if ((this.page.outputPath || '').endsWith('.html')) {
        return minify(content, {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        });
      }
    }
    return content;
  },
};
