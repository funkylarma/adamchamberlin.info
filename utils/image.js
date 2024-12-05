import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

const imageOptions = {
  // which file extensions to process
  extensions: 'html',
  // optional, output image formats
  formats: ['jpg', 'webp'],
  // optional, output image widths
  widths: ['auto', 400, 900],
  // output directory
  urlPath: '/images/',
  outputDir: './_site/images/',
  // optional, attributes assigned on <img> override these values.
  defaultAttributes: {
    loading: 'lazy',
    sizes: '900',
    decoding: 'async',
  },
};

export { imageOptions };
