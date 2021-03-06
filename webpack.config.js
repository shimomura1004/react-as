const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = (_, argv) => {
  const isDevelopmentMode = argv.mode === 'development';

  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, isDevelopmentMode ? 'dist' : 'prod')
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "index.html"
      }),
      new CopyPlugin([
        { from: 'public/**/*', to: '.', flatten: true }
      ]),
      new InjectManifest({
        swSrc: './src/service-worker.js',
        swDest: 'service-worker.js'
      })
    ]
  }
};
