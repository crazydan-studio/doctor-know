// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');

var config = require('./config');
var webpackConfig = config.dev ? require('./webpack.dev.config') : require('./webpack.prod.config');

function searchWebpacks(dirs) {
    dirs = [].concat(dirs || []);

    var files = dirs.length > 0 ? shell.find(dirs) : [];

    return files.filter(function (file) {
        return file.match(/webpack.(config|conf).js$/);
    }).map(function (file) {
        return require(file);
    });
}

var root = config.projectRoot;
var webpackSearchPaths = [
    path.resolve(root, 'src')
];

module.exports = [
    webpackConfig
].concat(
    searchWebpacks(webpackSearchPaths)
).map(function (webpack) {
    if (config.dev) {
        if (typeof webpack.entry === 'string') {
            webpack.entry = [].concat(webpack.entry);
        }

        // var hotClientPath = path.resolve(root, 'build/hot-client.js');
        // // add hot-reload related code to entry chunks
        // webpack.entry && Object.keys(webpack.entry).forEach(function (name) {
        //     webpack.entry[name] = [hotClientPath].concat(webpack.entry[name]);
        // });
    }
    return webpack;
});
