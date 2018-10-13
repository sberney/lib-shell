const gulp = require('gulp');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const { exec } = require('./polyfill-index');

const licenseArray = [
  './src/COMMENT/BEGIN',
  './LICENSE',
  './src/COMMENT/LODASH',
  './node_modules/lodash/LICENSE',
  './src/COMMENT/END',
];

gulp.task('compile', () =>
   exec('yarn rollup'));

gulp.task('distribute', ['compile'], () => {

  return merge([
    gulp.src(licenseArray.concat([
      './build/lib-shell.js'
    ])).
    pipe(concat('lib-shell.js')),

    gulp.src(licenseArray.concat([
      './build/lib-shell.min.js'
    ])).
    pipe(concat('lib-shell.min.js')),

    gulp.src(licenseArray.concat([
      './build/lib-shell.cjs.js'
    ])).
    pipe(concat('lib-shell.cjs.js')),

    gulp.src(licenseArray.concat([
      './build/lib-shell.es5.js'
    ])).
    pipe(concat('lib-shell.es5.js')),
  ]).
  pipe(gulp.dest('dist/'));
});


gulp.task('build', [
  'distribute',
]);