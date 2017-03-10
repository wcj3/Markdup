import gulp from 'gulp';
import browserSync from 'browser-sync';
import size from 'gulp-size';
import strip from 'gulp-strip-comments';


gulp.task('browersync', () => {
  browserSync({
    notify: false,
    files: ['docs/index.html'],
    port: 1234,
    server: {
      baseDir: ['docs'],
    },
    browser: 'google chrome',
  });
  gulp.watch('lib/markdup.min.js', ['mover', browserSync.reload]);
});

gulp.task('mover', () => {
  return gulp.src(['lib/markdup.min.js', 'lib/markdup.min.js.map'])
    .pipe(size())
    .pipe(gulp.dest('docs'));
});

gulp.task('file-size', () => {
  gulp.src('lib/markdup.min.js')
  .pipe(size());
});
