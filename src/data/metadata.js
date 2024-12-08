import 'dotenv/config';

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';
const indexNow = process.env.INDEX_NOW_KEY ? process.env.INDEX_NOW_KEY : 'dummy';
const baseUrl = isDev ? `http://localhost:8080/` : `https://adamchamberlin.info/`;

export default {
  env: process.env.ELEVENTY_ENV,
  domain: 'adamchamberlin.info',
  indexNow: indexNow,
  title: 'Adam Chamberlin',
  tagline: 'The online playground of Adam Chamberlin.',
  url: baseUrl,
  repo: 'https://github.com/funkylarma/adamchamberlin.info',
  locale: 'en-GB',
  language: 'en',
  description: 'Welcome to the online playground of Adam Chamberlin. Consummate Athlete And DOM Element Wrangler.',
  author: {
    name: 'Adam Chamberlin',
    email: '',
    image: baseUrl + 'assets/images/headshot.jpeg',
    url: baseUrl + 'about/',
  },
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
  navigation_primary: [
    {
      label: 'Home',
      class: 'home',
      title: 'Back home',
      url: '/',
    },
    {
      label: 'About',
      class: 'about',
      title: 'All about me',
      url: '/about/',
    },
    {
      label: 'Archives',
      class: 'archive',
      title: 'History',
      url: '/archive/',
    },
    {
      label: 'Social',
      class: 'social',
      title: 'Lets get social',
      url: '/social/',
    },
  ],
  navigation_footer: [
    {
      label: 'Home',
      class: 'home',
      title: 'Back home',
      url: '/',
    },
    {
      label: 'About',
      class: 'about',
      title: 'All about me',
      url: '/about/',
    },
    {
      label: 'Privacy Policy',
      class: 'privacy',
      title: 'All the legal stuff',
      url: '/privacy-policy/',
    },
    {
      label: 'RSS',
      class: 'rss',
      title: 'Long live the RSS feed',
      url: '/feed/feed.xml',
    },
  ],
};
