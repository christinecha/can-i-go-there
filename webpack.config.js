const path = require('path')
const fs = require('fs-extra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pages = require('./pages-config')

const JSON_FOLDER = path.resolve(__dirname, 'data/visa-requirements')
const PUBLIC_DIR = path.resolve(__dirname, 'public')

const getJSONFiles = () => {
  const files = fs.readdirSync(JSON_FOLDER)
  
  return files.reduce((obj, file) => {
    const name = path.basename(file)
    return { ...obj, [name]: path.resolve(JSON_FOLDER, file) }
  }, {});
}

const shared = {
  entry: {
    'index.js': './client/src/index.js',
    ...getJSONFiles()
  },
  output: {
    path: path.resolve(PUBLIC_DIR),
    publicPath: '/',
    filename: 'scripts/[name]',
    chunkFilename: 'scripts/[name]',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
    ]
  }
}

const production = {
  ...shared,
  mode: 'production',
  plugins: [
    ...pages.map(page => (
      new HtmlWebpackPlugin(page)
    )),
  ],
}

const development = {
  ...shared,
  mode: 'development',
  devServer: {
    port: 8000,
    proxy: {
      '/styles/*': {
        target: 'http://localhost:8000/public',
        secure: false
      },
      '/scripts/*': {
        target: 'http://localhost:8000/public',
        secure: false
      }
    }
  },
  plugins: [
    ...pages
    .filter((p, i) => i < 10)
    .map(page => (
      new HtmlWebpackPlugin(page)
    )),
  ],
}

module.exports = process.env.NODE_ENV === 'production'
  ? production
  : development