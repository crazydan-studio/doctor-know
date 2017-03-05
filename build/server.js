var express = require('express');
var webpack = require('webpack');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

var config = require('./config');
var webpacks = require('./webpacks');
var compiler = webpack(webpacks);
var server = express();

// // http://expressjs.com/en/resources/middleware/compression.html
// var compression = require('compression');
// // compress all requests
// server.use(compression({
//     chunkSize: 5 * 1024 * 1024 // 5MB
// }));

// var hotMiddleware = require('webpack-hot-middleware')(compiler);
// // force page reload when html-webpack-plugin template changes
// var compilers = compiler.compilers || [compiler];
// compilers.forEach(function (compiler) {
//     compiler.plugin('compilation', function (compilation) {
//         compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//             hotMiddleware.publish({action: 'reload'});
//             cb();
//         });
//     });
// });
// // enable hot-reload and state-preserving compilation error display
// server.use(hotMiddleware);

// NOTE: Keep dev-middleware after hot-middleware
// to make sure the `compilation` plugin can work well.
// `share.startWatch()`(webpack-dev-middleware/lib/Shared.js:215)
// will trigger `compile` action.
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
});
// serve webpack bundle output
server.use(devMiddleware);

// handle fallback for HTML5 history API
// https://github.com/bripkens/connect-history-api-fallback
server.use(require('connect-history-api-fallback')());

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.server.proxyTable;
var proxyMiddleware = require('http-proxy-middleware');
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
        options = {target: options};
    }
    server.use(proxyMiddleware(context, options));
});

// serve content base
var serveIndex = require('serve-index');
var contentBase = config.contentBase || {};
Object.keys(contentBase).forEach(function (path) {
    [].concat(contentBase[path] || []).forEach(function (base) {
        server.use(path, express.static(base));
        server.use(path, serveIndex(base));
    });
});

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.server.port;
var ip = config.server.ip;
server.listen(port, ip, function (e) {
    if (e) {
        console.log(e);
    } else {
        console.log('Listening at http://' + ip + ':' + port + '\n');
    }
});
