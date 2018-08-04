const gulp = require('gulp');
const concat = require('gulp-concat');
const { exec } = require('./index');

const Builder = require('systemjs-builder');

gulp.task('compile', () => {
  const builder = new Builder('./', 'config.js');
  return builder.buildStatic('index.js', 'build/lib-shell.js', {
    format: 'cjs',
    minify: false,
    externals: [
      'path',
      'child_process',
      'process',
      'os'
    ]
  })
});

gulp.task('build-es6', ['compile'], () => {
  return gulp.src([
    './src/COMMENT/BEGIN',
    './LICENSE',
    './src/COMMENT/LODASH',
    './node_modules/lodash/LICENSE',
    './src/COMMENT/SYSTEMJS',
    './node_modules/systemjs/LICENSE',
    './src/COMMENT/END',
    './build/lib-shell.js'
  ]).
  pipe(concat('lib-shell.js')).
  pipe(gulp.dest('dist/'));
});

gulp.task('transpiled-compile', ['compile'], () =>
   exec('yarn babel'));

gulp.task('build-es5', ['transpiled-compile'], () => {
  return gulp.src([
    './src/COMMENT/BEGIN',
    './LICENSE',
    './src/COMMENT/LODASH',
    './node_modules/lodash/LICENSE',
    './src/COMMENT/SYSTEMJS',
    './node_modules/systemjs/LICENSE',
    './src/COMMENT/END',
    './build/lib-shell.es5.js'
  ]).
  pipe(concat('lib-shell.es5.js')).
  pipe(gulp.dest('dist/'));
});

gulp.task('build', [
  'build-es6',
  'build-es5'
]);