'use strict'; /* jshint esversion: 6 */
const gulp = require('gulp');

gulp.task('compile', () => {
  const babel = require('gulp-babel');
  const rename = require('gulp-rename');

  let compilation_options = {
    minify: true
  };

  return new Promise(function(resolve /*, reject*/ ) {
    gulp.src(['*/*.es6'])
      .pipe(babel({
          presets: ['babili'],//'es2015', 
          plugins: ['transform-es2015-template-literals']
      }))
      .pipe(rename({suffix: ".min",extname: '.js'}))
      .pipe(gulp.dest('.'))
      .on('end', function(){
        resolve();
      });
  }).catch(console.error);
});