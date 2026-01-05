const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    // 打包后的文件名
    filename: 'index.js',
    // 输出目录路径
    path: path.resolve(__dirname, 'dist'),
    // 库的全局变量名，在浏览器中可以通过 window.MapUtils 访问
    library: 'MapUtils',
    // 库的输出格式，umd 是一种兼容多种模块系统的格式（CommonJS、AMD、ES modules）
    libraryTarget: 'umd',
    // 浏览器: window node.js:global  Web Worker: self
    globalObject: 'this',
    // 为 UMD 模块命名，提高可读性
    umdNamedDefine: true,
    // 构建前清理输出目录
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
/*   externals: {
    '@amap/amap-jsapi-loader': { // 外部依赖，不打包进 bundle
      commonjs: '@amap/amap-jsapi-loader',
      commonjs2: '@amap/amap-jsapi-loader',
      amd: '@amap/amap-jsapi-loader',
      root: 'AMapLoader'
    }
  }, */
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Map Utils Demo',
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html'
    })
  ],
  devtool: 'source-map',
  mode: 'production'
};