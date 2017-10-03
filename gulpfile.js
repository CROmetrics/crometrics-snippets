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


gulp.task('default', ['host']);
gulp.task('host', ['compile'], function(){
  const fs = require('fs');
  const express = require('express');
  const app = express();
  
  const ssl_credentials = {
    key: fs.readFileSync("../ssl/server.key", 'utf8'),
    cert: fs.readFileSync("../ssl/server.crt", 'utf8')
  };

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
      return res.send(200);
    } else {
      return next();
    }
  });

  // app.use(cors());

  app.set('port', (process.env.PORT || 8123));

  app.use(express.static(__dirname + '/dist'));

  // app.listen(app.get('port'), function() {
  //   console.log('http://local.host:'+app.get('port')+'/manifest.json');
  // });

  require('https').createServer(ssl_credentials, app).listen(app.get('port'), function () {
    console.log('https://local.host:' + app.get('port') + '/manifest.json');
  }).on('error', function(e){
    console.error('ERROR', e);
  });

  return gulp.watch('./src/*', ['compile']);
});