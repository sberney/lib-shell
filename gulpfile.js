const gulp = require('gulp');
const concat = require('gulp-concat');
const merge = require('merge-stream');

const licenseArray = [
  './src/COMMENT/BEGIN',
  './LICENSE',
  './src/COMMENT/LODASH',
  './node_modules/lodash/LICENSE',
  './src/COMMENT/END',
];

const distributions = [
  'lib-shell.js',
  'lib-shell.min.js',
  'lib-shell.cjs.min.js',
  'lib-shell.es5.min.js'
];

gulp.task('distribute', () => {
  return merge(
    distributions.
    map(distribution => {
      return gulp.src(licenseArray.concat([
        `./build/${distribution}`
      ])).
      pipe(concat(distribution));
    })
  ).
  pipe(gulp.dest('dist/'));
});


gulp.task('build', gulp.series('distribute'));