const path = require('path'),
      slugify = require('slugify');

/** Maps a config of attribute-value pairs to an HTML string
 * representing those same attribute-value pairs.
 */
const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

/** Converts the given string to a slug form. */
const slugifyString = (str) => {
  return slugify(str, {
    lower: true,
    strict: true,
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
  });
};

/**
 * @param {string} pathString
 */
const withoutBaseDirectory = (pathString) => pathString.substring(pathString.indexOf(path.sep));

module.exports = {
  stringifyAttributes,
  slugifyString,
  withoutBaseDirectory
};