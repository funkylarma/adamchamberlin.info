import path from 'node:path';

export const dir = {
  input: 'src',
  output: '_site',
  data: '../data',
  includes: '../includes',
  layouts: '../layouts',
  assets: '/src/assets',
  prefix: '/',
};

export const month_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const nth = function (d) {
  if (d > 3 && d < 21) {
    return 'th';
  }
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const imagePaths = {
  input: path.join(dir.input, dir.assets, 'images'),
  output: path.join(dir.output, dir.assets, 'images'),
};

export const scriptDirs = {
  input: path.join(dir.input, dir.assets, 'scripts'),
  output: path.join(dir.output, dir.assets, 'scripts'),
};
