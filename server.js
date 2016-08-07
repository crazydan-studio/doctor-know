var defaults = require('lodash/defaults');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var ip = 'localhost';
var port = parseInt(process.env.SERVER_PORT);

config = defaults({}, config);

config.entry.index = config.entry.index || [];
if (typeof config.entry.index === 'string') {
    config.entry.index = [config.entry.index];
}
config.entry.index.unshift(
    'webpack-dev-server/client?http://localhost:' + port,
    'webpack/hot/only-dev-server'
);

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.
    hot: true,
    quiet: false,
    noInfo: false,
    historyApiFallback: true
}).listen(port, ip, function (err, result) {
    if (err) {
        console.log('Web server start failed: ', err);
    } else {
        console.log('Listening at ' + ip + ':' + port);
    }
});
