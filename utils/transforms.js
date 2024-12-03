import htmlmin from "html-minifier";

export default {
  htmlmin: function (content, outputPath) {
    if (process.env.ELEVENTY_ENV === "production") {
      if ((this.page.outputPath || "").endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          removeOptionalTags: true,
          sortAttributes: true,
          sortClassName: true,
        });
        return minified;
      }
      return content;
    } else {
      return content;
    }

    return content;
  },
};
