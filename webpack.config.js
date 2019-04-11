var webpack = require('webpack');
var path = require('path');

const PATHS = {
    app: './src/app.js',
    dist: path.join(__dirname, './public')
};

module.exports = {
    devtool: 'source-map',
    context: __dirname,
    entry: ['whatwg-fetch', PATHS.app],
    output: {
        path: PATHS.dist,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ],
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
    externals: {
        //fs: 'fs',
        //path: 'path'
    },
    optimization: {
        minimize: false
    },
    node: {
    __dirname: false,
    __filename: false
    },
    target: 'electron-renderer'
};