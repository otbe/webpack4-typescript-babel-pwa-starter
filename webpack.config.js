const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/index.tsx',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel', 'react-loadable/babel'],
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
          {
            loader: 'style-loader',

            options: {
              sourceMap: true
            }
          },
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
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  mode: 'development',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    historyApiFallback: true,
    port: 8080
  },

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      name: true,

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
