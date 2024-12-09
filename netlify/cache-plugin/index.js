export default {
  async onBuild({ utils }) {
    console.log('Restoring ./.cache/ folder');
    await utils.cache.restore('./.cache');
  },
  async onPostBuild({ utils }) {
    console.log('Saving ./.cache folder for future builds');
    await utils.cache.save('./.cache');
  },
};
