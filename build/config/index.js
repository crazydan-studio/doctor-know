// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');
var url = require('url');
var merge = require('lodash/merge');

var projectRoot = path.resolve(__dirname, '../..');
var outputPath = path.resolve(projectRoot, 'dist');

var packageJSON = require(path.resolve(projectRoot, 'package.json'));
var version = packageJSON.version;
var license = packageJSON.license;
var banner = shell.cat(path.resolve(__dirname, 'banner.txt'))
                  .replace(/(\$\{([-_\w.]+)})/g, function ($0, $1, $2) {
                      var data = {
                          version: version,
                          year: new Date().getFullYear(),
                          license: license
                      };
                      return data[$2] !== undefined ? data[$2] : $1;
                  });
var server = process.env.NODE_ENV !== 'production'
    ? require('./server.json')
    : require('./server-site.json');

var config = {
    banner: banner,
    projectRoot: projectRoot,
    outputPath: outputPath,
    // NOTE: 1. The tail slash can not be skipped;
    //       2. When using `@font-face` in iframe(whose location is `about:blank`),
    //          the font path should be an absolute url,
    //          otherwise, the iframe will not load it;
    publicPath: server.url + '/',
    // NOTE: If some path should be matched at first, keep it before other.
    contentBase: {
        '/': [
            path.resolve(projectRoot, 'src')
        ],
        '/node_modules': path.resolve(projectRoot, 'node_modules'),
        '/lib': path.resolve(projectRoot, 'lib')
    },
    // NOTE: The `server.url` represents the access url for public network,
    // if `server.port` is specified, the local server will bind to it.
    server: merge({}, url.parse(server.url), server, {
        proxyTable: {}
    }),
    env: {
        VERSION: JSON.stringify(version)
    }
};

switch (process.env.NODE_ENV) {
    case 'development':
        merge(config, {
            dev: true,
            env: require('./dev.env')
        });
        break;
    case 'production':
        merge(config, {
            prod: true,
            env: require('./prod.env'),
            // NOTE: If some path should be matched at first, keep it before other.
            contentBase: {
                '/': outputPath,
                '/node_modules': path.resolve(projectRoot, 'node_modules'),
                '/lib': path.resolve(projectRoot, 'lib')
            }
        });
        break;
    case 'testing':
        merge(config, {
            test: true,
            env: require('./test.env')
        });
        break;
}

module.exports = config;
