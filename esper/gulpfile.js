const gulp = require('gulp');
// const scssLint = require('gulp-scss-lint');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config.js');

let filename = 'esper.src.js';

// gulp.task('build-style', () => (
//   gulp.src('./src/scss/**/*.scss')
//   .pipe(sass({
//     outputStyle: 'expanded',
//   }).on('error', sass.logError))
//   .pipe(autoprefixer({
//     browsers: ['last 2 versions'],
//   }))
//   .pipe(gulp.dest('./dist/css'))
//   .pipe(browserSync.stream())
// ));

gulp.task('build-script', () => (
  gulp.src(filename)
  .pipe(webpackStream(webpackConfig, webpack))
  .pipe(gulp.dest('.'))
  .pipe(browserSync.stream())
));

// gulp.task('build-html', () => (
//   gulp.src('./src/index.html')
//   .pipe(gulp.dest('./dist'))
//   .pipe(browserSync.stream())
// ));

// gulp.task('default', ['build-style', 'build-script', 'build-html'], () => {
gulp.task('default', ['build-script'], () => {
  browserSync.init({
    server: {
      baseDir: '.',
      cors: true,
      // middleware: function (req, res, next) {
      //   res.setHeader('Access-Control-Allow-Origin', '*');
      //   next();
      // }
    }
  });

  gulp.watch(['./*.js', './*.scss'], ['build-script']);
  // gulp.watch(['./*.scss'], ['build-style']);
  // gulp.watch(['./*.html'], ['build-html']).on('change', browserSync.reload);
});