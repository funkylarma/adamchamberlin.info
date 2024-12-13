import 'dotenv/config';

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';
const indexNow = process.env.INDEX_NOW_KEY ? process.env.INDEX_NOW_KEY : 'dummy';
const baseUrl = isDev ? `http://localhost:8080/` : `https://adamchamberlin.info/`;

export default {
  env: process.env.ELEVENTY_ENV,
  domain: 'adamchamberlin.info',
  url: baseUrl,
  feed: {
    filename: 'feed.xml',
    path: '/feed/feed.xml',
    url: baseUrl + 'feed/feed.xml',
    id: baseUrl,
  },
  jsonfeed: {
    path: '/feed/feed.json',
    url: baseUrl,
  },
};
