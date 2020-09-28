const webpack = require('webpack')
const dotenv = require('dotenv')
const fs = require('fs') // to check if the file exists
const path = require('path') // to get the current path
const HtmlWebPackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(__dirname, '..', 'src')
const distDir = path.resolve(__dirname, '..', 'dist')

module.exports = () => {
  return {
    // where to find the source code
    context: rootDir,
    devtool: 'cheap-module-source-map',
    entry: './index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ],
          include: srcDir
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    output: {
      // The destination file name concatenated with hash (generated whenever you change your code).
      // The hash is really useful to let the browser knows when it should get a new bundle
      // or use the one in cache

      path: distDir,
      publicPath: '/',
      filename: '[name].[hash:8].js'
    },
    optimization: {
      splitChunks: {
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          default: false,
          vendors: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          common: {
            chunks: 'async',
            minChunks: 2,
            name: 'common',
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new HtmlWebPackPlugin({
        // where to find the html template
        template: path.join(rootDir, 'index.html'),
        // where to put the generated file
        path: distDir,
        // the output file name
        filename: 'index.html'
      }),

      new WebpackPwaManifest({
        name: 'Trevorblades',
        short_name: 'Trevorblades',
        description: 'Find Countries',
        background_color: '#ffffff',
        theme_color: '#182b3a',
        display: 'standalone',
        crossorigin: 'use-credentials',
        start_url: './'
      })
    ],
    devServer: {
      contentBase: rootDir,
      publicPath: '/',
      historyApiFallback: true,
      hot: true,
      port: 3000,
      open: true
    }
  }
}
