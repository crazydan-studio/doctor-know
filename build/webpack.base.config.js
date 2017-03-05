var webpack = require('webpack');
var path = require('path');
var merge = require('webpack-merge');

var config = require('./config');

var __root__ = process.env.ROOT = config.projectRoot;
var styleLoader = {
    css: 'css?minimize=' + (config.prod ? 'true' : 'false') + '!postcss',
    less: 'css?minimize=' + (config.prod ? 'true' : 'false') + '!postcss!less'
};
module.exports = {
    debug: true,
    cache: true,
    // https://webpack.github.io/docs/configuration.html#devtool
    devtool: config.prod ? '#cheap-module-source-map' : '#eval',
    output: {
        // path option determines the location on disk the files are written to.
        path: config.outputPath,
        // filename is used solely for naming the individual files.
        // `[name]` references key of `entry`
        filename: '[name].js',
        // The publicPath specifies the public URL address
        // of the output files when referenced in a browser.
        // https://webpack.github.io/docs/configuration.html#output-publicpath
        // e.g. https://ui-designer.cn
        publicPath: config.publicPath
    },
    // https://webpack.github.io/docs/library-and-externals.html
    externals: {
        // NOTE: embedded Vue.js for separating all designer instance
        'vue': 'Vue',
        // require('jquery') is external and available
        // on the global `var jQuery`
        'jquery': 'jQuery'
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            // transform alias of module
            // NOTE: Keep `babel` to be declared in two places
            // for supporting `export * from '';` clause.
            loader: 'transform?aliasify!babel',
            exclude: [
                path.resolve(__root__, 'node_modules'),
                path.resolve(__root__, 'dist'),
                path.resolve(__root__, 'lib')
            ]
        }, {
            test: /\.js$/,
            // , then parse es6 syntax
            loader: 'babel!eslint',
            exclude: [
                path.resolve(__root__, 'node_modules'),
                path.resolve(__root__, 'dist'),
                path.resolve(__root__, 'lib')
            ]
        }, {
            // https://github.com/webpack/css-loader
            test: /\.css$/,
            exclude: /\.useable\.css$/,
            loader: 'style!' + styleLoader.css
        }, {
            // https://github.com/webpack/less-loader
            test: /\.less$/,
            exclude: /\.useable\.less$/,
            loader: 'style!' + styleLoader.less
        }, {
            // Support to use api to inject style dynamically
            // See detail: https://github.com/webpack/style-loader/issues/44
            //             https://github.com/webpack/style-loader/pull/126
            // https://github.com/flytreeleft/style-loader#unofficial-feature
            test: /\.useable\.css$/,
            loader: 'style?loadable=true!' + styleLoader.css
        }, {
            test: /\.useable\.less$/,
            loader: 'style?loadable=true!' + styleLoader.less
        }, {
            // edit this for additional asset file types
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url',
            query: {
                // inline files smaller then 10kb as base64 dataURL
                limit: 10000,
                // fallback to file-loader with this naming scheme
                name: '[name].[ext]?[hash]'
            }
        }, {
            // https://shellmonger.com/2016/01/22/working-with-fonts-with-webpack
            // Filename templates: https://github.com/webpack/file-loader#filename-templates
            test: /\.(woff|woff2)$/,
            loader: 'url?limit=65000&mimetype=application/font-[ext]&name=[path][name].[ext]'
        }, {
            test: /\.[ot]tf$/,
            loader: 'url?limit=65000&mimetype=application/octet-stream&name=[path][name].[ext]'
        }, {
            test: /\.eot$/,
            loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=[path][name].[ext]'
        }, {
            test: /\.svg/,
            loader: 'url?limit=65000&mimetype=image/svg+xml&name=[path][name].[ext]'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    // Fix [Cannot resolve module 'fs'](https://github.com/postcss/postcss-js#cannot-resolve-module-fs)
    node: {
        fs: 'empty'
    },
    // https://github.com/postcss/autoprefixer#webpack
    postcss: [],
    // vue-loader config:
    // lint all JavaScript inside *.vue files with ESLint
    // make sure to adjust your .eslintrc
    // https://github.com/vuejs/vue-loader-example
    vue: {
        loaders: {
            // resolve module path by aliasify.
            js: 'transform?aliasify!babel!eslint'/*,
             css: ExtractTextPlugin.extract('css')*/
        }
    },
    babel: {
        presets: ['es2015'],
        // http://stackoverflow.com/questions/33505992/babel-6-changes-how-it-exports-default
        // NOTE: keep the order
        plugins: [
            'transform-runtime',
            // Object rest spread transform
            // Examples: `var z = {a: 1, b: 2}; var n = {x: -1, y: -2, ...z};`
            // http://babeljs.io/docs/plugins/transform-object-rest-spread/
            'transform-object-rest-spread',
            // Export extensions transform
            // Examples: `export * as ns from 'mod'; export v from 'mod';`
            // http://babeljs.io/docs/plugins/transform-export-extensions/
            'transform-export-extensions',
            'add-module-exports'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.env
        })
    ]
};

if (config.dev) {
    module.exports = merge(module.exports, {
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
} else if (config.prod) {
    module.exports = merge(module.exports, {
        output: {
            // Export to AMD, CommonJS2 or as property in root
            // http://webpack.github.io/docs/configuration.html#output-librarytarget
            libraryTarget: 'umd'
        },
        plugins: [
            // NOTE: Disable DedupePlugin. It will discard unused css style.
            // new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                test: /(\.min)?\.js($|\?)/i,
                fromString: true,
                output: {
                    screw_ie8: true,
                    ascii_only: true
                },
                compress: {
                    pure_funcs: ['makeMap'],
                    keep_fnames: true
                },
                mangle: {
                    keep_fnames: true
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.BannerPlugin(config.banner, {
                test: /\.(less|css|js)($|\?)/i
            })
        ]
    });
}
