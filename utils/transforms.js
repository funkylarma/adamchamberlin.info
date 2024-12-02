import htmlmin from "html-minifier";

export default {
  htmlmin: function (content, outputPath) {
    if (process.env.ELEVENTY_ENV === "production") {
      if ((this.page.outputPath || "").endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeComments: true,
          sortClassName: true,
          sortAttributes: true,
          html5: true,
          decodeEntities: true,
          removeOptionalTags: true,
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
