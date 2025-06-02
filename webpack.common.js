const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/scripts/index.js"),
  },
  output: {
    filename: "[name].bundle.js", // Pastikan ini sesuai dengan yang Anda referensikan di service-worker.js
    path: path.resolve(__dirname, "dist"),
    clean: true, // Menambahkan clean: true untuk membersihkan folder dist sebelum build (opsional, tapi baik)
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          // Menambahkan generator untuk memastikan path output di folder 'dist' benar
          filename: "images/[name][ext][query]",
        },
      },
      // Aturan lain mungkin ada di webpack.dev.js atau webpack.prod.js (mis. untuk CSS, Babel)
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", // Nama file output di folder dist
      template: path.resolve(__dirname, "src/index.html"), // Path ke template HTML Anda
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/public/"), // Menyalin semua dari src/public/
          to: path.resolve(__dirname, "dist/"), // Ke root folder dist/
          // Ini sudah menangani manifest.json, favicon.png, images/
        },
        {
          // Aturan baru untuk menyalin service-worker.js
          from: path.resolve(__dirname, "src/service-worker.js"),
          to: path.resolve(__dirname, "dist/service-worker.js"), // Menyalin ke dist/service-worker.js
        },
      ],
    }),
  ],
};
