import 'dotenv/config';

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';
const baseUrl = isDev ? `http://localhost:8080/` : `https://adamchamberlin.info/`;

export default {
  env: process.env.ELEVENTY_ENV,
  domain: 'adamchamberlin.info',
  url: baseUrl,
};
