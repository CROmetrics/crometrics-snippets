const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config.js');

gulp.task('build-style', () => (
  gulp.src('./src/scss/**/*.scss')
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

gulp.task('compile', ['build-style', 'build-script', 'build-html']);

gulp.task('default', ['compile'], () => {
  browserSync.init({ 
    server: {
      baseDir: './dist',
      cors: true,
      // middleware: function (req, res, next) {
      //   res.setHeader('Access-Control-Allow-Origin', '*');
      //   next();
      // }
    }
  });

  gulp.watch(['./src/**/*.js', './src/**/*.js'], ['build-script']);
  gulp.watch(['./src/scss/**/*.scss'], ['build-style']);
  gulp.watch(['./src/**/*.html'], ['build-html']).on('change', browserSync.reload);
});