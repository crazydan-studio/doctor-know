var express = require('express');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

var config = require('./config');
var server = express();

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
