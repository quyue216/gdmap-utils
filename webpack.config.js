const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// 获取命令行参数，判断当前模式
const isProduction = process.env.NODE_ENV === 'production';

// 配置对象
const config = {
  entry: './src/index.ts',
  output: {
    // 打包后的文件名
    filename: isProduction ? 'index.js' : 'bundle.js',
    // 输出目录路径
    path: path.resolve(__dirname, 'dist'),
    // 库的全局变量名，在浏览器中可以通过 window.MapUtils 访问
    library: 'MapUtils',
    // 库的输出格式，生产模式使用umd，开发模式使用window
    libraryTarget: isProduction ? 'umd' : 'window',
    // 浏览器: window node.js:global  Web Worker: self
    globalObject: isProduction ? 'this' : 'window',
    // 为 UMD 模块命名，提高可读性
    umdNamedDefine: true,
    // 构建前清理输出目录
    clean: true,
    // 开发模式下输出到内存，生产模式下输出到 dist 目录
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  externals: {
    '@amap/amap-jsapi-loader': {
      commonjs: '@amap/amap-jsapi-loader',
      commonjs2: '@amap/amap-jsapi-loader',
      amd: '@amap/amap-jsapi-loader',
      root: 'AMapLoader'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          compilerOptions: { noEmit: true },
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ],
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  mode: isProduction ? 'production' : 'development',
};

// 开发模式下添加开发服务器和HTML模板配置
if (!isProduction) {
  config.devServer = {
    static: {
      directory: path.join(__dirname, 'examples'),
      watch: true,
    },
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true,
  };

  // 添加HTML模板插件
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'examples', '3_MarkerLayer.html'),
      filename: 'index.html',
      inject: { // 精确控制脚本的注入位置
        tagName: 'script',
        insertBefore: 'body > script:first-of-type' // 将库脚本注入到body内第一个script标签之前
      },
      scriptLoading: 'blocking', // 使用阻塞加载方式确保脚本按顺序执行
    })
  );
  //开发模式无需排除
  delete config.externals

  // 添加热模块替换插件
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
