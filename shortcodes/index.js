const imageShortcode = require('./image');

const currentBuildDate =  () => {
  return (new Date()).toISOString();
};

const year = () => {
  return `${new Date().getFullYear()}`;
};

module.exports = {
  imageShortcode,
  currentBuildDate,
  year
};