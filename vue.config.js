const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ["console.log"]
            }
          }
        })
      ]
    }
  }
};
