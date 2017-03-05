// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');
var webpack = require('webpack');

process.env.NODE_ENV = 'production';

var config = require('./config');
var webpacks = require('./webpacks');

var root = config.projectRoot;
var src = path.resolve(root, 'src');
var outputPath = config.outputPath;
shell.rm('-rf', outputPath);
shell.mkdir('-p', outputPath);

webpack(webpacks, function (e, stats) {
    if (e) {
        throw e;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }));
    process.stdout.write('\n');
});
