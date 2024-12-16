import Image from '@11ty/eleventy-img';

export default {
  currentBuildDate: function () {
    return new Date().toISOString();
  },

  year: function () {
    return `${new Date().getFullYear()}`;
  },

  galleryImage: async function (src, alt) {
    const GALLERY_IMAGE_WIDTH = 250;
    const LANDSCAPE_LIGHTBOX_IMAGE_WIDTH = 2000;
    const options = {
      formats: ['jpeg'],
      widths: [GALLERY_IMAGE_WIDTH, LANDSCAPE_LIGHTBOX_IMAGE_WIDTH],
      urlPath: '/gallery/',
      outputDir: './_site/gallery/',
    };
    const genMetadata = await Image(src, options);
    return `
        <a href="${genMetadata.jpeg[1].url}"
        data-pswp-width="${genMetadata.jpeg[1].width}"
        data-pswp-height="${genMetadata.jpeg[1].height}"
        target="_blank">
            <img src="${genMetadata.jpeg[0].url}" eleventy:ignore />
        </a>
    `.replace(/(\r\n|\n|\r)/gm, '');
  },
};
