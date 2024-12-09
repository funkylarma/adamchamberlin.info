import { inspect } from 'node:util';
import sanitizeHTML from 'sanitize-html';
import { DateTime } from 'luxon';
import metadata from '../src/data/metadata.js';

export default {
  debug: function (content) {
    return `<pre>${inspect(content)}</pre>`;
  },
  metaTitle: function (title) {
    title.trim();
    if (this.page.url) {
      if (this.page.url == '/' || this.page.url.includes('page')) {
        title = metadata.tagline;
      } else {
        title = title + ' | ' + metadata.title;
      }
    }
    return title;
  },

  metaKeywords: function (tags) {
    return tags.join(', ');
  },

  metaDescription: function (title) {
    if (this.page.url) {
      if (this.page.url == '/' || this.page.url.includes('page')) {
        return metadata.description;
      }

      if (/\d{4}\//.test(this.page.url)) {
        return title + ' - an article posted by Adam Chamberlin on ' + this.page.date.toDateString();
      }
    }

    return title + ' | ' + metadata.title;
  },

  postExcerpt: function (post) {
    const content = post.replace(/(<([^>]+)>)/gi, '');
    return content.substr(0, content.lastIndexOf(' ', 400)) + '...';
  },

  splitLines: function (input) {
    const parts = input.split(' ');
    const lines = parts.reduce(function (prev, current) {
      if (!prev.length) {
        return [current];
      }

      let lastOne = prev[prev.length - 1];

      if (lastOne.length + current.length > 19) {
        return [...prev, current];
      }

      prev[prev.length - 1] = lastOne + ' ' + current;

      return prev;
    }, []);

    return lines;
  },

  dateReadable: function (dateObj, format, zone) {
    return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toFormat(format || 'dd LLLL yyyy');
  },

  readableDateFromISO: function (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") {
    return DateTime.fromISO(dateStr).toFormat(formatStr);
  },

  dateHtmlString: function (dateObj) {
    return DateTime.fromJSDate(dateObj, 'utc').toFormat('yyyy-LL-dd');
  },

  dateISO: function (dateObj) {
    return DateTime.fromJSDate(dateObj).toISO();
  },

  dateParse: function (dateObj) {
    if (typeof dateObj !== 'undefined') {
      if (dateObj instanceof Date) {
        return Date.parse(dateObj);
      } else {
        let date = new Date(dateObj);
        return Date.parse(date);
      }
    } else {
      return 'not-set';
    }
  },

  timeReading: function (content) {
    const minutes = Math.ceil(content.trim().split(/\s+/).length / 200);
    return `${minutes} min read`;
  },

  absoluteUrl: function (url) {
    return new URL(url, metadata.url).href;
  },

  stripIndex: function (path) {
    if (!path) return '';
    return path.replace('/index.html', '/');
  },

  fileHash: function (url) {
    const [urlPart, paramPart] = url.split('?');
    const params = new URLSearchParams(paramPart || '');
    params.set('v', DateTime.local().toFormat('X'));
    return `${urlPart}?${params}`;
  },

  webmentionsByUrl: function (webmentions, url) {
    const allowedTypes = {
      likes: ['like-of'],
      reposts: ['in-reply-to'],
      comments: ['mention-of', 'in-reply-to'],
    };

    const allowedHTML = {
      allowedTags: ['b', 'i', 'em', 'strong', 'a'],
      allowedAttributes: {
        a: ['href'],
      },
    };

    const orderByDate = (a, b) => new Date(a.published) - new Date(b.published);

    const checkRequiredFields = (entry) => {
      const { author, published, content } = entry;
      return !!author && !!author.name && !!published && !!content;
    };

    const sanitize = (entry) => {
      if (entry.content && entry.content.html) {
        entry.content = sanitizeHTML(entry.content.html, allowedHTML);
      }
      return entry;
    };

    const clean = (entry) => {
      const { html, text } = entry.content;

      if (html) {
        // really long html mentions, usually newsletters or compilations
        entry.content.value =
          html.length > 2000
            ? `mentioned this in <a href="${entry['wm-source']}">${entry['wm-source']}</a>`
            : sanitizeHTML(html, allowedHTML);
      } else {
        entry.content.value = sanitizeHTML(text, allowedHTML);
      }

      return entry;
    };

    const pageWebMentions = webmentions.children
      .filter((mention) => mention['wm-target'] === url)
      .sort(orderByDate)
      .map(sanitize);

    const likes = pageWebMentions
      .filter((mention) => allowedTypes.likes.includes(mention['wm-property']))
      .filter((like) => like.author)
      .map((like) => like.author);

    const reposts = pageWebMentions
      .filter((mention) => allowedTypes.reposts.includes(mention['wm-property']))
      .filter((repost) => repost.author)
      .map((repost) => repost.author);

    const comments = pageWebMentions
      .filter((mention) => allowedTypes.comments.includes(mention['wm-property']))
      .filter((comment) => {
        const { author, published, content } = comment;
        return author && author.name && published && content;
      });

    const mentionCount = likes.length + reposts.length + comments.length;
    const data = { likes, reposts, comments, mentionCount };
    return data;
  },
};
