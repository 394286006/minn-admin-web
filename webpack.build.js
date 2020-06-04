// auth:minn QQ:394286006
var path = require('path');
const root = __dirname;
var webpack = require('webpack'); 
var TerserWebpackPlugin = require('terser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports  = {
	mode: 'development',
	entry: path.resolve(root, 'app/main.js')
          ,
    output: {
      path: path.join(root, 'dist'),
      filename: '[name].[chunkhash].js'
   },
    optimization: {
        minimizer: [
            new HtmlWebpackPlugin({
                cache: true, /
                parallel: true, 
                sourceMap: true,
            }),
        ]
    },
    module: {
    rules: [
      {test: /\.jsx?$/, use: ['babel-loader'], 
      // exclude: /node_modules/,
       include: [
          path.resolve(__dirname, "app"),
        ]
      },
      {test: /\.js?$/, use: ['babel-loader'], 
      // exclude: /node_modules/,
       include: [
          path.resolve(__dirname, "app")        ]
      }
    ]
  },
  plugins: [
    
    new HtmlWebpackPlugin({ 
      filename: 'index.html',
      template: 'template.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    })
    
  ],
   devServer: {
    open: true,
    contentBase: path.resolve(root, 'dist'),
    publicPath: '/',
    port: 8089,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: {
          'Access-Control-Allow-Origin': '*',
          'Cookie': 'session',
        }
    }
};