// https://github.com/webpack/css-loader/issues/144#issuecomment-145097899
// ReferenceError: Promise is not defined
require('es6-promise').polyfill();

var path = require('path');

module.exports = {
    debug: true,
    // https://webpack.github.io/docs/library-and-externals.html
    externals: {
        'vue': 'Vue',
        // require('jquery') is external and available
        // on the global `var jQuery`
        'jquery': 'jQuery'
    },
    module: {
        // To avoid "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
        // see https://github.com/AtomLinter/linter-eslint/issues/462
        preLoaders: [{
            test: /\.(js|vue)$/,
            loader: 'eslint',
            exclude: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, 'dist')
            ]
        }],
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
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, 'dist')
            ]
        }, {
            test: /\.js$/,
            // , then parse es6 syntax
            loader: 'babel',
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test')
            ]
        }, {
            // https://github.com/webpack/css-loader
            test: /\.css$/,
            loader: 'style!css'
        }, {
            // https://github.com/webpack/less-loader
            test: /\.less$/,
            loader: 'style!css!less'
        }, {
            // edit this for additional asset file types
            test: /\.(png|jpg|gif)$/,
            loader: 'url',
            query: {
                // inline files smaller then 10kb as base64 dataURL
                limit: 10000,
                // fallback to file-loader with this naming scheme
                name: '[name].[ext]?[hash]'
            }
        }]
    },
    // vue-loader config:
    // lint all JavaScript inside *.vue files with ESLint
    // make sure to adjust your .eslintrc
    // https://github.com/vuejs/vue-loader-example
    vue: {
        loaders: {
            // resolve module path by aliasify. No eslint!!
            js: 'transform?aliasify!babel'
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
    }
};
