const webpack = require('webpack');

module.exports = {
  // entry: "./esper.src.js",
  output: {
    path: __dirname,
    filename: "esper.min.js"
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     // 'style-loader',
      //     'to-string-loader',
      //     'css-loader'
      //   ]
      // },
      {
        test: /\.scss$/,
        use: [
          // "style-loader",
          'to-string-loader',
          "css-loader",
          "sass-loader" // compiles Sass to CSS
        ]
      }
    ]
  },
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: 500
  // },
  // plugins:[
  //   // new webpack.optimize.UglifyJsPlugin(),
  //   // new webpack.LoaderOptionsPlugin({
  //   //   minimize: true,
  //   //   debug: false,
  //   // })
  // ]
};