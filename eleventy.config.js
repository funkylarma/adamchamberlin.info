/** @format */

// Node imports
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

// 11ty Imports
import { HtmlBasePlugin as pluginHtmlBase, EleventyRenderPlugin as pluginEleventyRender } from '@11ty/eleventy';
import rssPlugin from '@11ty/eleventy-plugin-rss';
import pluginNavigation from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin as pluginImageTransform } from '@11ty/eleventy-img';

// 3rd Party Imports
import pluginPostGraph from '@rknightuk/eleventy-plugin-post-graph';
import pluginYouTube from 'eleventy-plugin-youtube-embed';
import pluginTOC from 'eleventy-plugin-nesting-toc';

// Import the local functions
import collections from './utils/collections.js';
import filters from './utils/filters.js';
import shortcodes from './utils/shortcodes.js';
import pairedShortcodes from './utils/shortcodes-paired.js';
import liquidShortcodes from './utils/shortcodes-liquid.js';
import transforms from './utils/transforms.js';
import { md } from './utils/markdown.js';

// Environmental
const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';
import { dir } from './utils/constants.js';

export default async function (eleventyConfig) {
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addGlobalData('env', process.env);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
  });

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy({
    './src/assets/fonts': '/assets/fonts',
    './src/assets/images': '/assets/images',
    './src/geojson': '/geojson',
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
  eleventyConfig.addPlugin(pluginTOC);
  eleventyConfig.addPlugin(rssPlugin);
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
    highlightColorDark: 'var(--main-color-tertiary)',
    dayBoxTitle: true,
    dayBoxTitleFormat: 'MMM D, YYYY',
    sort: 'desc',
  });

  // Markdown
  eleventyConfig.setLibrary('md', md);

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Paired Shortcodes
  Object.keys(pairedShortcodes).forEach((shortcodeName) => {
    eleventyConfig.addPairedShortcode(shortcodeName, pairedShortcodes[shortcodeName]);
  });

  // Liquid Shortcodes
  Object.keys(liquidShortcodes).forEach((shortcodeName) => {
    eleventyConfig.addLiquidShortcode(shortcodeName, liquidShortcodes[shortcodeName]);
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
  // Object.keys( transforms ).forEach( ( transformName ) => {
  //   eleventyConfig.addTransform( transformName, transforms[ transformName ] );
  // } );

  // Base config
  return {
    // Control which files Eleventy will process
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    pathPrefix: dir.prefix,
    passthroughFileCopy: true,

    // Inputs and outputs:
    dir: {
      input: dir.input,
      includes: dir.includes,
      data: dir.data,
      output: dir.output,
    },
  };
}
