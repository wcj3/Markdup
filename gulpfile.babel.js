import gulp from 'gulp';
import browserSync from 'browser-sync';


gulp.task("browersync", () => {
    browserSync({
        notify: false,
        files: ['docs/index.html'],
        port: 1234,
        server: {
            baseDir: ['docs']
        },
        browser: "google chrome"
    });

    gulp.watch('lib/markdup.js', ["mover", browserSync.reload]);
});

gulp.task("mover", () => {
    return gulp.src('lib/markdup.js')
        .pipe(gulp.dest('docs'))
})
