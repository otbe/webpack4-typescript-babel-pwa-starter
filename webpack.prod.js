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
const ImageminPlugin = require('imagemin-webpack-plugin').default;

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
                useBuiltIns: 'usage',
                modules: false
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
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              importLoaders: 1,
              souceMap: true,
              namedExport: true,
              camelCase: true
            }
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
      },
      {
        test: /\.(gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: 'responsive-loader',
        options: {
          adapter: require('responsive-loader/sharp'),
          placeholder: true,
          ...require('./package.json').webpack.images
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: require('./package.json').name
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    new UglifyJSPlugin(),
    new ImageminPlugin({
      pngquant: {
        quality: '85'
      }
    }),
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: require('./package.json').webpack.prerender.routes
    }),
    ...require('./package.json').webpack.prerender.routes.map(
      route =>
        new HtmlCriticalPlugin({
          base: path.resolve(__dirname, 'dist'),
          src: path.join(route.slice(1), 'index.html'),
          dest: path.join(route.slice(1), 'index.html'),
          inline: true,
          minify: true,
          width: 1920,
          height: 1080
        })
    ),
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
    new OfflinePlugin({
      appShell: '/',
      autoUpdate: true, // one hour
      externals: [...require('./package.json').webpack.prerender.routes],
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
