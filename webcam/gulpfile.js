const gulp = require('gulp');
// const gulpWebpack = require('gulp-webpack');
// const webpack = require('webpack');
// const MinifyPlugin = require("babel-minify-webpack-plugin");

// const webpackSettings = {
//   entry: {
//     powerup: './src/powerup.js',
//     section: './src/section.js'
//   },
//   output: {
//     path: require('path').join(__dirname, "dist"),
//     filename: "[name].js"
//   },
//   module: {
//     rules: [
//       { test: /\.(png|woff|woff2|eot|ttf|svg)([#\?]+.+)?$/, loader: 'url-loader?limit=100000' },
//       {
//         test: /\.css$/,
//         use: [
//           // 'style-loader',
//           'to-string-loader',
//           'css-loader'
//         ]
//       },
//       {
//         test: /\.scss$/,
//         use: [
//           // "style-loader", // creates style nodes from JS strings
//           // 'to-string-loader', 
//           // "css-loader", // translates CSS into CommonJS
//           "file-loader?name=[name].css",
//           "sass-loader" // compiles Sass to CSS
//         ]
//       }
//     ]
//   },
//   plugins: [
//     new MinifyPlugin()
//   ]
// };

// const inputFiles = Object.values(webpackSettings.entry);
gulp.task('compile', function () {
  // return gulp.src(inputFiles)
  //   .pipe(gulpWebpack(webpackSettings, webpack))
  //   .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['host']);
gulp.task('host', ['compile'], function(){
  const host = require('../_host/host');
  host(__dirname);

  return gulp.watch(['*'], ['compile']);
});