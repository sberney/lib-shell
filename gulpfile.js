const gulp = require('gulp');
const concat = require('gulp-concat');

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

gulp.task('build', ['compile'], () => {
  return gulp.src([
    './LICENSE',
    './build/lib-shell.js'
  ]).
  pipe(concat('lib-shell.js')).
  pipe(gulp.dest('dist/'));
});

gulp.task('transpiled-compile', () => {
  const builder = new Builder('./', 'jspm.config.js');
  builder.loadConfig('./config.js');
  return builder.buildStatic('index.js', 'build/lib-shell.es5.js', {
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

gulp.task('transpile', ['transpiled-compile'], () => {
  return gulp.src([
    './LICENSE',
    './build/lib-shell.es5.js'
  ]).
  pipe(concat('lib-shell.es5.js')).
  pipe(gulp.dest('dist/'));
});