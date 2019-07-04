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

module.exports = {
  entry: {
    'index.js': './client/src/index.js',
    ...getJSONFiles()
  },
  mode: 'development',
  output: {
    path: path.resolve(PUBLIC_DIR),
    publicPath: '/',
    filename: 'scripts/[name]',
    chunkFilename: 'scripts/[name]',
  },
  devServer: {
    port: 8000,
    proxy: {
      '*': {
        target: 'http://localhost:8000/public',
        secure: false
      }
    }
  },
  plugins: [
    ...pages.map(page => (
      new HtmlWebpackPlugin(page)
    )),
  ],
}
