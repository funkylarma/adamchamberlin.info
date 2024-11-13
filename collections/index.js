import fs from "node:fs";
import writingStats from "writing-stats";
import moment from "moment";

function processPostFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    // remove front matter
    content = content.replace(/---\n.*?\n---/s, '')
    // remove empty lines
    content = content.replace(/^\s*[\r\n]/gm, '')
    const codeBlockMatches = content.match(/```(.*?)```/gis)
    const codeBlocks = codeBlockMatches ? codeBlockMatches.length : 0
    // remove code blocks
    content = content.replace(/(```.+?```)/gms, '')
    const stats = writingStats(content)
    return {
      characterCount: stats.characterCount,
      codeBlockCount: codeBlocks,
      paragraphCount: stats.paragraphCount,
      wordCount: stats.wordCount
    }
  }
  catch (err) {
    console.error(err)
    return {
      characterCount: 0,
      codeBlockCount: 0,
      paragraphCount: 0,
      wordCount: 0
    }
  }
}

function makeYearStats(currentYear, yearPostCount, yearWordCount, yearCodeBlockCount, avgDays, yearCharacterCount, yearParagraphCount) {

  const daysInYear = ((currentYear % 4 === 0 && currentYear % 100 > 0) || currentYear % 400 == 0) ? 366 : 365;

  return {
    year: currentYear,
    daysInYear: daysInYear,
    postCount: yearPostCount,
    wordCount: yearWordCount,
    codeBlockCount: yearCodeBlockCount,
    avgDays: parseFloat(avgDays.toFixed(2)),
    avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
    avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
    avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
    avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))
  }
}

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

  eleventyConfig.addCollection("postStats", (collectionApi) => {
    const oneDayMilliseconds = 1000 * 60 * 60 * 24;
    let avgDays = 0;
    let totalDays = 0;
    let totalPostCount = 0;
    let totalCharacterCount = 0;
    let totalCodeBlockCount = 0;
    let totalParagraphCount = 0;
    let totalWordCount = 0;
    let yearCharacterCount = 0;
    let yearCodeBlockCount = 0;
    let yearParagraphCount = 0;
    let yearWordCount = 0;
    let yearPostCount = 0;
    let yearPostDays = 0;
    let highPostCount = 0;

    // Initialize the data object returned by the plugin
    let statsObject = {
      avgDays: 0,
      avgCharacterCount: 0,
      avgCodeBlockCount: 0,
      avgParagraphCount: 0,
      avgWordCount: 0,
      totalWordCount: 0,
      totalCodeBlockCount: 0,
      postCount: 0,
      firstPostDate: new Date(),
      lastPostDate: new Date(),
      highPostCount: 0,
      years: [],
      postsByDay: {},
    }

    const posts = collectionApi.getFilteredByTag("post").sort((a, b) => {
        return a.date - b.date
    });
    let postCount = posts.length;
    if (postCount < 1) {
      log.info(`No articles found for tag(s): ${tags.join(', ')}`);
      // return the empty stats object
      return statsObject;
    }

    statsObject.postCount = postCount;
    statsObject.firstPostDate = posts[0].data.page.date;
    statsObject.lastPostDate = posts[postCount - 1].data.page.date;

    let prevPostDate = posts[0].data.page.date;
    let currentYear = prevPostDate.getFullYear();

    for (let post of posts) {

      let postDate = post.data.page.date;
      let dateIndexKey = `${moment(postDate).year()}-${moment(postDate).dayOfYear()}`;

      if (!statsObject.postsByDay[dateIndexKey]) {
        statsObject.postsByDay[dateIndexKey] = 0
      }

      statsObject.postsByDay[dateIndexKey]++
      let daysBetween = (postDate - prevPostDate) / oneDayMilliseconds;
      let thisYear = postDate.getFullYear();

      if (thisYear != currentYear) {
        avgDays = yearPostDays / yearPostCount;
        highPostCount = Math.max(highPostCount, yearPostCount);
        statsObject.years.push(
          makeYearStats(currentYear, yearPostCount, yearWordCount, yearCodeBlockCount, avgDays, yearCharacterCount, yearParagraphCount)
        );
        yearCharacterCount = 0;
        yearCodeBlockCount = 0;
        yearParagraphCount = 0;
        yearWordCount = 0;
        yearPostCount = 0;
        yearPostDays = 0;
        currentYear = thisYear;
      }
      prevPostDate = postDate;
      totalDays += daysBetween;
      yearPostDays += daysBetween;
      totalPostCount++;
      yearPostCount++;

      let postStats = processPostFile(post.page.inputPath);
      totalCharacterCount += postStats.characterCount;
      yearCharacterCount += postStats.characterCount;
      totalCodeBlockCount += postStats.codeBlockCount;
      yearCodeBlockCount += postStats.codeBlockCount;
      totalParagraphCount += postStats.paragraphCount;
      yearParagraphCount += postStats.paragraphCount;
      totalWordCount += postStats.wordCount;
      yearWordCount += postStats.wordCount;
    }

    if (yearPostCount > 0) {
      avgDays = yearPostDays / yearPostCount;
      highPostCount = Math.max(highPostCount, yearPostCount);
      statsObject.years.push(
        makeYearStats(currentYear, yearPostCount, yearWordCount, yearCodeBlockCount, avgDays, yearCharacterCount, yearParagraphCount)
      );
    }
    statsObject.avgDays = parseFloat((totalDays / totalPostCount).toFixed(2));
    statsObject.avgCharacterCount = parseFloat((totalCharacterCount / totalPostCount).toFixed(2));
    statsObject.avgCodeBlockCount = parseFloat((totalCodeBlockCount / totalPostCount).toFixed(2));
    statsObject.avgParagraphCount = parseFloat((totalParagraphCount / totalPostCount).toFixed(2));
    statsObject.avgWordCount = parseFloat((totalWordCount / totalPostCount).toFixed(2));
    statsObject.totalWordCount = totalWordCount;
    statsObject.totalCodeBlockCount = totalCodeBlockCount;
    statsObject.highPostCount = highPostCount;

    return statsObject;
  });
}
