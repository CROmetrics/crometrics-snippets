var gulp = require('gulp');
var webpack = require('gulp-webpack');

let filename = 'esper.src.js';

gulp.task('compile', function() {
  return gulp.src(filename)
    .pipe(webpack(require('./webpack.config.js'), require('webpack')))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['compile'], function() {
  return gulp.watch([filename], ['compile']);
});