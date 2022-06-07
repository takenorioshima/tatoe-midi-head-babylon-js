const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: path.resolve(appDirectory, "src/entry.ts"), //path to the main .ts file
  output: {
    filename: "js/main.js", //name for the javascript file that is created/compiled in memory
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    host: "0.0.0.0",
    port: 8080, //port that we're using for local host (localhost:8080)
    static: path.resolve(appDirectory, "public"), //tells webpack to serve from the public folder
    hot: true,
    devMiddleware: {
      publicPath: "/",
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(appDirectory, "public/index.html"),
    })
  ],
  mode: "development",
  devServer: {
    open: true,
    static: {
      directory: path.resolve(__dirname, 'dist')
    }
  }
};
