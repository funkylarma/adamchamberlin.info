import 'dotenv/config';

const isDev = process.env.ELEVENTY_ENV === 'development';
const baseUrl = isDev ? `http://localhost:8080/` : `https://adamchamberlin.info/`;

export default {
  title: 'Adam Chamberlin',
  tagline: 'The online playground of Adam Chamberlin.',
  repo: 'https://github.com/funkylarma/adamchamberlin.info',
  locale: 'en-GB',
  language: 'en',
  description: 'The online playground of Adam Chamberlin, a consummate athlete And DOM Element Wrangler from the UK.',
  author: {
    name: 'Adam Chamberlin',
    email: 'hello@adamchamberlin.info',
    image: baseUrl + 'assets/images/headshot.jpg',
    url: baseUrl + 'about/',
  },
};
