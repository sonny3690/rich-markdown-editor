// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
var webpack = require("webpack");
var dotenv = require("dotenv");

module.exports = {
  mode: "development",

  resolve: {
    mainFields: ["browser", "main"],
    extensions: [".ts", ".tsx", ".js"],
  },

  entry: path.resolve(__dirname, "src", "index.js"),

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
