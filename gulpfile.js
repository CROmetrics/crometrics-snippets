'use strict'; /* jshint esversion: 6 */
const gulp = require('gulp');

gulp.task('compile', () => {
  const babel = require('gulp-babel');
  const rename = require('gulp-rename');

  let compilation_options = {
    minify: true
  };

  return new Promise(function(resolve /*, reject*/ ) {
    gulp.src(['*/!(_|bookmarklet)*.js'])
      .pipe(babel({
          presets: ['es2015', 'babili']
      }))
      .pipe(rename({suffix: ".min",}))
      .pipe(gulp.dest('.'))
      .on('end', function(){
        resolve();
      });
  }).catch(console.error);
});