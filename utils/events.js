import fs from 'node:fs';
import Image from '@11ty/eleventy-img';

export default {
  afterBuild: function () {
    const ogiDir = './src/assets/ogi/';
    fs.readdir(ogiDir, function (err, files) {
      if (err) console.log(err);
      else {
        console.log('\nCurrent directory filenames:');
        if (files.length > 0) {
          files.forEach(function (filename) {
            console.log(filename);
            if (filename.endsWith('.svg')) {
              let imageUrl = ogiDir + filename;
              Image(imageUrl, {
                formats: ['jpeg'],
                outputDir: './_site/assets/ogi/',
                filenameFormat: function (id, src, width, format, options) {
                  let outputFilename = filename.substring(0, filename.length - 4);
                  return `${outputFilename}.${format}`;
                },
              });
            }
          });
        }
      }
    });
  },
};
