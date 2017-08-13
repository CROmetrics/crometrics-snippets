var gulp = require('gulp');
var webpack = require('gulp-webpack');

const { exec } = require('child_process');

let filename = 'esper.src.js';

gulp.task('compile', function() {
  // return gulp.src(filename)
  //   .pipe(webpack(require('./webpack.config.js'), require('webpack')))
  //   .pipe(gulp.dest('./'));
  new Promise((resolve)=>{
    exec('webpack', (err, stdout, stderr) => {
      console.log(stdout);
      resolve();
    });
  });
});

gulp.task('default', ['compile'], function() {
  return gulp.watch([filename, '*.css', '*.scss'], ['compile']);
});