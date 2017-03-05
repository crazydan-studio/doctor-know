var path = require('path');
var merge = require('webpack-merge');

var baseWebpackConfig = require('./webpack.base.config');
var config = require('./config');

var root = config.projectRoot;
var src = path.resolve(root, 'src');

module.exports = merge(baseWebpackConfig, {
    name: 'Dr. Know',
    entry: {
        'index': [path.resolve(src, 'index.js')]
    },
    output: {
        // filename is used solely for naming the individual files.
        // `[name]` references key of `entry`
        filename: '[name].js'
    }
});
