import 'dotenv/config';

const indexNow = process.env.INDEX_NOW_KEY ? process.env.INDEX_NOW_KEY : 'dummy';
const mapBox = process.env.MAP_BOX_KEY ? process.env.MAP_BOX_KEY : 'dummy';

export default {
  indexNow: indexNow,
  mapBox: mapBox,
};
