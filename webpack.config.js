const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  mode: 'development',
  // watch: true,
  output: {
    path: path.resolve(__dirname, './client/dist'),
    publicPath: '/scripts/',
    filename: 'index.js'
  },
  devServer: {
    port: 8000,
    proxy: {
      '/.netlify/functions/*': {
        target: 'http://localhost:9000/',
        secure: false
      },
      '/styles/*': {
        target: 'http://localhost:8000/client',
        secure: false
      }
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
}
