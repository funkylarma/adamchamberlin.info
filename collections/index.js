export default function (eleventyConfig) {
  eleventyConfig.addCollection("categoryList", (collection) => {
    let catSet = {};
    collection.getAll().forEach((item) => {
      if (!item.data.categories) return;
      item.data.categories
        .filter((cat) => !["posts", "all"].includes(cat))
        .forEach((cat) => {
          if (!catSet[cat]) {
            catSet[cat] = [];
          }
          catSet[cat].push(item);
        });
    });
    return catSet;
  });

  eleventyConfig.addCollection("tagList", (collection) => {
    const tagsSet = {};
    collection.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags
        .filter((tag) => !["posts", "all"].includes(tag))
        .forEach((tag) => {
          if (!tagsSet[tag]) {
            tagsSet[tag] = [];
          }
          tagsSet[tag].push(item);
        });
    });
    return tagsSet;
  });

  eleventyConfig.addCollection("postsByYear", (collection) => {
    const posts = collection.getFilteredByTag("post").reverse();
    const years = posts.map((post) => post.date.getFullYear());
    const uniqueYears = [...new Set(years)];

    const postsByYear = uniqueYears.reduce((prev, year) => {
      const filteredPosts = posts.filter(
        (post) => post.date.getFullYear() === year
      );

      return [...prev, [year, filteredPosts]];
    }, []);

    return postsByYear;
  });
}
