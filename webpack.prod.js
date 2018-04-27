const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlCriticalPlugin = require('html-critical-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer');
const WebpackBar = require('webpackbar');

module.exports = {
  entry: './src/index.tsx',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        options: {
          plugins: ['react-loadable/babel'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: require('./package.json').webpack.browsers
                },
                useBuiltIns: 'usage'
              }
            ],
            '@babel/preset-react',
            ['@babel/preset-stage-0', { decoratorsLegacy: true }],
            '@babel/preset-typescript'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1, souceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: require('./package.json').webpack.browsers
                })
              ]
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    new UglifyJSPlugin(),
    new HtmlCriticalPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      // extract: true, // TODO Investigate why this breaks SW
      width: 1920,
      height: 1080,
      penthouse: {
        blockJSRequests: false
      }
    }),
    new WebpackPwaManifest({
      name: 'My Progressive Web App',
      short_name: 'MyPWA',
      description: 'My awesome Progressive Web App!',
      background_color: '#ffffff',
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128, 192, 256 /*, 384, 512*/]
        }
        // {
        //   src: path.resolve('src/assets/large-icon.png'),
        //   size: '1024x1024' // you can also use the specifications pattern
        // }
      ]
    }),
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: require('./package.json').webpack.prerender.routes
    }),
    new OfflinePlugin({
      appShell: '/',
      autoUpdate: true, // one hour
      ServiceWorker: {
        events: true
      }
    }),
    new WebpackBar()
  ],

  mode: 'production',

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      name: false,

      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all'
        }
      }
    }
  }
};
