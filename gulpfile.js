const gulp = require('gulp');
const concat = require('gulp-concat');

const Builder = require('systemjs-builder');
const builder = new Builder('./', 'config.js');

gulp.task('compile', () => 
  builder.buildStatic('index.js', 'build/lib-shell.js', {
    format: 'cjs',
    minify: false,
    externals: [
      'path',
      'child_process',
      'process',
      'os'
    ]
  }));

gulp.task('build', ['compile'], () => {
  return gulp.src([
    './LICENSE',
    './build/lib-shell.js'
  ]).
  pipe(concat('lib-shell.js')).
  pipe(gulp.dest('dist/'));
});