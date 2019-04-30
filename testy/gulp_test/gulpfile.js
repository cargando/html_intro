var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var curPath = process.cwd();

console.log('curPath = ', curPath);

// Static Server + watching scss/html files
gulp.task('server', ['sass'], function() {

  browserSync.init({
    server: "./src"
  });

  gulp.watch("src/scss/*.scss", ['sass']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("src/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['server']);

gulp.task("css", function () {
  condole.log();
  return gulp.src("./src/css/*.css").pipe(gulp.dest("dist/css"));
});

