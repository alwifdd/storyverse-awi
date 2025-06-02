// webpack.prod.js
const path = require("path"); // Diperlukan untuk path.resolve jika Anda mendefinisikan ulang output.path
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // Anda sudah punya ini
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Anda sudah punya ini

module.exports = merge(common, {
  mode: "production",
  output: {
    // Nama file JavaScript bundle dengan contenthash untuk caching
    filename: "static/js/[name].[contenthash].bundle.js",
    // Path di mana aset akan disajikan di server.
    // Untuk GitHub Pages: '/<NAMA-REPOSITORY>/'
    publicPath: "/storyverse-pwa/",
    // path: path.resolve(__dirname, 'dist'), // Ini sudah ada di webpack.common.js, jadi tidak perlu diulang kecuali ingin override total
    // clean: true, // Bisa juga di sini jika tidak di common, atau gunakan CleanWebpackPlugin
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Membersihkan folder 'dist' sebelum build
    new MiniCssExtractPlugin({
      // Nama file CSS output dengan contenthash
      filename: "static/css/[name].[contenthash].css",
    }),
  ],
  // Anda bisa menambahkan optimization di sini nanti jika perlu
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
});
