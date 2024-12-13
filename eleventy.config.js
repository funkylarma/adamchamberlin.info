// Node imports
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

// Web imports
import * as sass from 'sass';
import htmlmin from 'html-minifier';

// 11ty Imports
import { HtmlBasePlugin as pluginHtmlBase, EleventyRenderPlugin as pluginEleventyRender } from '@11ty/eleventy';
import pluginRss from '@11ty/eleventy-plugin-rss';
import pluginNavigation from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin as pluginImageTransform } from '@11ty/eleventy-img';

// 3rd Party Imports
import pluginPostGraph from '@rknightuk/eleventy-plugin-post-graph';
import pluginYouTube from 'eleventy-plugin-youtube-embed';

// Import the local functions
import events from './utils/events.js';
import collections from './utils/collections.js';
import filters from './utils/filters.js';
import shortcodes from './utils/shortcodes.js';
import transforms from './utils/transforms.js';
import { markdown } from './utils/markdown.js';
import viteHelpers from './utils/vite.js';

// Environmental
const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';
const INPUT_DIR = 'src';
const OUTPUT_DIR = '_site';
const DATA_DIR = 'data';
const INCLUDES_DIR = 'includes';
const PATH_PREFIX = '/';

export default async function (eleventyConfig) {
  eleventyConfig.addGlobalData('env', process.env);

  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: true,
  });

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({
    './src/assets/fonts': '/assets/fonts',
    './src/assets/images': '/assets/images',
    './src/assets/icons': '/assets/icons',
    './src/assets/templates': '/assets/templates',
    './src/assets/js/**/*.min.js': '/assets/js',
    './src/assets/css/**/*.min.css': '/assets/css',
  });

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget('./src/assets/images/**/*.{svg,webp,png,jpeg}');
  eleventyConfig.watchIgnores.add('./src/assets/ogi/**/*');

  // Plugins
  eleventyConfig.addPlugin(pluginEleventyRender);
  eleventyConfig.addPlugin(pluginHtmlBase);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginImageTransform, {
    extensions: 'html',
    formats: ['jpg', 'webp'],
    widths: ['auto', 400, 600, 800],
    urlPath: '/images/',
    outputDir: './_site/images/',
    defaultAttributes: {
      loading: 'lazy',
      sizes: '(min-width: 880px) 640px, calc(76.07vw - 14px)',
      decoding: 'async',
    },
  });
  eleventyConfig.addPlugin(pluginYouTube, {
    lite: {
      responsive: true,
      css: {
        enabled: true,
        path: '/assets/css/lite-yt-embed.min.css',
      },
      js: {
        enabled: true,
        path: '/assets/js/lite-yt-embed.min.js',
      },
    },
    modestBranding: true,
  });
  eleventyConfig.addPlugin(pluginPostGraph, {
    highlightColorLight: 'var(--main-color-secondary)',
    highlightColorDark: 'var(--main-color-quinary)',
    dayBoxTitle: true,
    dayBoxTitleFormat: 'MMM D, YYYY',
    sort: 'desc',
  });

  // Markdown
  eleventyConfig.setLibrary('md', markdown);

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Vite Shortcodes
  Object.keys(viteHelpers).forEach((shortcodeName) => {
    eleventyConfig.addLiquidShortcode(shortcodeName, viteHelpers[shortcodeName]);
  });

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Collections
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });

  // Transforms
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName]);
  });

  // After build to copy all the OpenGraph images
  eleventyConfig.on('afterBuild', events.afterBuild);

  // Base config
  return {
    // Control which files Eleventy will process
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    pathPrefix: PATH_PREFIX,
    passthroughFileCopy: true,

    // Inputs and outputs:
    dir: {
      input: INPUT_DIR,
      includes: INCLUDES_DIR,
      data: DATA_DIR,
      output: OUTPUT_DIR,
    },
  };
}
