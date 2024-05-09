const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const site = require('../_data/site');

// Filters
// TODO: Put all the filters into external file
const excerpt = (post) => {
  const content = post.replace(/(<([^>]+)>)/gi, "");
  return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
};

const readableDate = (dateObj, format, zone) => {
  // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
};

const htmlDateString = (dateObj) => {
  // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
};

const dateISO = (dateObj) => {
  return DateTime.fromJSDate(dateObj).toISO();
};

const dateRSS = (dateObj) => {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('ddd, D MMM YYYY HH:mm:ss ZZ');
};

const absoluteUrl = (url) => {
  return new URL(url, site.url).href;
};

const absoluteImageUrl = async (src, width = null) => {
  const imageOptions = {
    // We only need the original width and format
    widths: [width],
    formats: [null],
    // Where the generated image files get saved
    outputDir: '_site/images',
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: '/images',
  };
  const stats = await Image(src, imageOptions);
  const imageUrl = Object.values(stats)[0][0].url;
  return new URL(imageUrl, site.url).href;
};


module.exports =  {
  excerpt,
  readableDate,
  htmlDateString,
  dateISO,
  dateRSS,
  absoluteUrl,
  absoluteImageUrl
};