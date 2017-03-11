import gulp from 'gulp';
import browserSync from 'browser-sync';
import size from 'gulp-size';


gulp.task('browsersync', () => {
  browserSync({
    notify: false,
    files: ['tmp/index.html'],
    port: 1234,
    server: {
      baseDir: ['tmp'],
    },
    browser: 'google chrome',
  });
  gulp.watch('tmp/markdup.min.js', [browserSync.reload]);
});

gulp.task('browersync-github', () => {
  browserSync({
    notify: false,
    files: ['lib/index.html'],
    port: 4040,
    server: {
      baseDir: ['docs'],
    },
    browser: 'google chrome',
  });
  gulp.watch('lib/markdup.min.js', [browserSync.reload]);
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
