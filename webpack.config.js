var defaults = require('lodash/defaults');
var path = require('path');
var webpack = require('webpack');
var base = require('./webpack.base.config');

module.exports = defaults({
    // https://webpack.github.io/docs/configuration.html#devtool
    devtool: '#eval',
    entry: {
        index: ['./src/index.js']
    },
    output: {
        // path option determines the location on disk the files are written to.
        path: path.join(__dirname, 'dist'),
        // filename is used solely for naming the individual files.
        // `[name]` references key of `entry`
        filename: 'dist/[name].js',
        // The publicPath specifies the public URL address
        // of the output files when referenced in a browser.
        // https://webpack.github.io/docs/configuration.html#output-publicpath
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ].concat(base.plugins || [])
}, base);
