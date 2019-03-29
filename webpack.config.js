var webpack = require('webpack')
var path = require('path')
var CONFIG = require('./config')
var ENV = process.env.NODE_ENV
var utils = require('./utils')
const entries = utils.getEntry(utils.resolve('/src/**/index.js'))

module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname, CONFIG.outputDir),
    publicPath: path.join(__dirname, CONFIG.outputDir),
    filename: ENV === 'prod' ? '[name].[chunkhash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
  },
  devServer: {
    historyApiFallback: false,
    noInfo: true,
    overlay: true,
    publicPath: CONFIG.outputDir,
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (ENV === 'prod') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"prod"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
