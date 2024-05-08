const path = require('path');

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

/**
 * @param {string} pathString
 */
const withoutBaseDirectory = (pathString) => pathString.substring(pathString.indexOf(path.sep));

module.exports = {
  stringifyAttributes,
  withoutBaseDirectory
};