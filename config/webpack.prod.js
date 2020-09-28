const webpack = require('webpack')
const dotenv = require('dotenv')
const fs = require('fs') // to check if the file exists
const path = require('path') // to get the current path
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const cssnano = require('cssnano')
const WorkboxPlugin = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(__dirname, '..', 'src')
const distDir = path.resolve(__dirname, '..', 'dist')

module.exports = () => {

    return {
    // where to find the source code
    context: srcDir,
    stats: {
        colors: true,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: false
    },
    entry: './index.js',
    module: {
        rules: [
            {
            test: /\.(js|jsx)$/,
            exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
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
        },
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
        filename: '[name].[hash].js'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                removeAll: true
                },
                // Run cssnano in safe mode to avoid
                // potentially unsafe transformations.
                safe: true
            },
            canPrint: false
            })
        ],
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
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebPackPlugin({
            // where to find the html template
            template: path.join(rootDir, 'index.html'),
            // where to put the generated file
            title: 'Trevorblades',
            favicon: '../favicon.ico',
            path: distDir,
            // the output file name
            filename: 'index.html',
            minify: {
                html5: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: false,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributese: true,
                useShortDoctype: true
            }
        }),
        new MinifyPlugin(),
        // Put all css code in this file
        new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: '[name].[hash].css'
        }),

        // copy external files form source to dist
        new CopyWebpackPlugin([
        {
            from: `${rootDir}/manifest.json`,
            to: `${distDir}/manifest.json`
        },
        {
            from: `${rootDir}/favicon.ico`,
            to: `${distDir}/favicon.ico`
        }
        ]),
        new WebpackPwaManifest({
            name: 'Trevorblades',
            short_name: 'Trevorblades',
            description: 'Find Countries',
            background_color: '#fff',
            theme_color: '#182b3a',
            display: 'standalone',
            crossorigin: 'use-credentials',
            start_url: './',
            icons: [
            {
                src: path.resolve('./logo192.png'),
                sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
            },
            {
                src: path.resolve('./logo512.png'),
                size: '1024x1024' // you can also use the specifications pattern
            }
            ]
        }),
        new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        swDest: distDir + '/service-worker.js'
        })
        ]
    }
}
