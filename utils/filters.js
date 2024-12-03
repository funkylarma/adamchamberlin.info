import { DateTime } from "luxon";
import metadata from "../data/metadata.js";

export default {
  metaTitle: function (title) {
    title.trim();
    if (this.page.url) {
      if (this.page.url == "/" || this.page.url.includes("page")) {
        title = metadata.tagline;
      } else {
        title = title + " | " + metadata.title;
      }
    }

    return title;
  },

  metaKeywords: function (tags) {
    return tags.join(", ");
  },

  metaDescription: function (title) {
    if (this.page.url) {
      if (this.page.url == "/" || this.page.url.includes("page")) {
        return metadata.description;
      }

      if (/\d{4}\//.test(this.page.url)) {
        return (
          title +
          " - an article posted by Adam Chamberlin on " +
          this.page.date.toDateString()
        );
      }
    }

    return title + " | " + metadata.title;
  },

  postExcerpt: function (post) {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 400)) + "...";
  },

  splitLines: function (input) {
    const parts = input.split(" ");
    const lines = parts.reduce(function (prev, current) {
      if (!prev.length) {
        return [current];
      }

      let lastOne = prev[prev.length - 1];

      if (lastOne.length + current.length > 19) {
        return [...prev, current];
      }

      prev[prev.length - 1] = lastOne + " " + current;

      return prev;
    }, []);

    return lines;
  },

  dateReadable: function (dateObj, format, zone) {
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy"
    );
  },

  dateHtmlString: function (dateObj) {
    return DateTime.fromJSDate(dateObj, "utc").toFormat("yyyy-LL-dd");
  },

  dateISO: function (dateObj) {
    return DateTime.fromJSDate(dateObj).toISO();
  },

  dateParse: function (dateObj) {
    if (typeof dateObj !== "undefined") {
      if (dateObj instanceof Date) {
        return Date.parse(dateObj);
      } else {
        let date = new Date(dateObj);
        return Date.parse(date);
      }
    } else {
      return "not-set";
    }
  },

  timeReading: function (content) {
    const minutes = Math.ceil(content.trim().split(/\s+/).length / 200);

    return `${minutes} min read`;
  },

  absoluteUrl: function (url) {
    return new URL(url, metadata.url).href;
  },

  fileHash: function (url) {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", DateTime.local().toFormat("X"));
    return `${urlPart}?${params}`;
  },
};
