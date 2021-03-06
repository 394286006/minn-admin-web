const path = require('path')
const root = __dirname
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
console.log(process.cwd()+',__dirname:'+path.resolve(root, 'dist') );
var EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
  mode: 'development',
  // 入口文件
  entry: path.resolve(root, 'app/main.js'),
  // 出口文件
  output: {
    path: path.join(root, 'dist'),
    filename: '[name].[chunkhash].js',
   // publicPath: 'js'
  },
  // loaders
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
      title: 'minn`s system',
       filename: 'index.html',
      template: path.resolve(root, 'template.html')
    }),
    new webpack.NamedModulesPlugin(),
    new EncodingPlugin('UTF8')
  ],
  devServer: {
    //open: true,
    contentBase: path.resolve(root, 'dist'),
    publicPath: '/',
    port: 8089,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: {
          'Access-Control-Allow-Origin': '*',
          'Cookie': 'session',
        }
   /* ,proxy: [{
        context: ["/locale/**","/admin/**"],
        target: "http://localhost:8080/admin",
        secure: false,
        changeOrigin: true,
        credentials:true
        },
        {
        context: ["/**"],
        target: "http://localhost:8080/admin",
        secure: false,
        changeOrigin: true,
        credentials:true
        }]
        */
  }
}