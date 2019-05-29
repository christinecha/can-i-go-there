const path = require('path')
const fs = require('fs-extra')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const JSON_FOLDER = path.resolve(__dirname, 'data/visa-requirements')

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
  // watch: true,
  output: {
    path: path.resolve(__dirname, './client/scripts'),
    publicPath: '/scripts/',
    filename: '[name]',
    chunkFilename: '[name]',
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
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader'
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
}
