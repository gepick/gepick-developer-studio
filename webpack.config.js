/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default

const styledComponentsTransformer = createStyledComponentsTransformer()

const basePath = __dirname

const isProduction = false

module.exports = function(env, arg) {
  const base = {
    context: path.join(basePath, 'src'),
    entry: ['./index.tsx'],
    output: {
      path: path.join(basePath, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            getCustomTransformers: () => ({
              before: [styledComponentsTransformer],
            }),
          },
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              }, // compiles Less to CSS
            },
          ],
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
	  include: /node_modules/
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader', query: { modules: true } }],
	  exclude: /node_modules/
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.tsx', '.ts', '.js'],
      alias: {
        react: path.resolve(__dirname, 'node_modules', 'react'),
        '~': path.resolve('./src'),
      },
    },
    devtool: 'source-map',
    externals: {
      React: 'react',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      inline: true,
      compress: true,
      historyApiFallback: true,
      proxy: {
        '/graphql': {
          secure: false,
          target: 'http://gepick.com:4002/graphql',
          changeOrigin: true,
        },
        '/predict': {
          secure: false,
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html', //Name of template in ./src
        inject: true,
      }),
    ],
  }

  return base
}
