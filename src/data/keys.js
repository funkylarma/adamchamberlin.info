import 'dotenv/config';

const indexNow = process.env.INDEX_NOW_KEY ? process.env.INDEX_NOW_KEY : 'dummy';

export default {
  indexNow: indexNow,
};
