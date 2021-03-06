const gulp = require('gulp');
const scssLint = require('gulp-scss-lint');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config.js');

gulp.task('build-style', () => (
  gulp.src('./src/scss/**/*.scss')
      .pipe(scssLint())
      .pipe(scssLint.failReporter())
      .pipe(sass({
          outputStyle: 'expanded',
      }).on('error', sass.logError))
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
      }))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream())
));

gulp.task('build-script', () => (
  gulp.src(['./src/js/index.js'])
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream())
));

gulp.task('build-html', () => (
  gulp.src('./src/index.html')
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream())
));

gulp.task('default', ['build-style', 'build-script', 'build-html'], () => {
  browserSync.init({ server: './dist' });

  gulp.watch(['./src/**/*.js', './src/**/*.js'], ['build-script']);
  gulp.watch(['./src/scss/**/*.scss'], ['build-style']);
  gulp.watch(['./src/**/*.html'], ['build-html']).on('change', browserSync.reload);
});