// https://github.com/shelljs/shelljs
var shell = require('shelljs');
var path = require('path');

/**
 * module alias definitions
 *
 * [Document](https://github.com/benbria/aliasify#configuration)
 */
var root = path.resolve(__dirname, '..');
module.exports = {
    // If true, then aliasify will print modifications it is making to stdout.
    verbose: false,
    // An absolute path to resolve relative paths against.
    // If you're using package.json, this will automatically be filled
    // in for you with the directory containing package.json.
    // If you're using a .js file for configuration, set this to __dirname.
    configDir: __dirname,
    // Controls which files will be transformed.
    // By default, only JS type files will be transformed ('.js', '.coffee', etc...).
    appliesTo: {
        includeExtensions: ['.js', '.vue', '.css']
    },
    // An object mapping aliases to their replacements.
    // For 3rd-party libraries
    aliases: {},
    // An object mapping RegExp strings with RegExp replacements,
    // or a function that will return a replacement.
    // For inner libraries and modules
    replacements: {
        // View alias
        'doctor-know/(.+)/(([A-Z][a-z\d]*)+)$': function (alias, regexMatch, regexObject) {
            var view = alias.replace(regexObject, '$1/$2');
            var viewPath = path.resolve(root, 'src', view);

            if (shell.test('-f', viewPath + '.vue') && shell.test('-f', viewPath + '.js')) {
                return viewPath + '.vue';
            } else {
                return null; // null to make sure other plugins can process
            }
        },
        // Semantic UI
        'semantic-ui': path.resolve(root, 'lib/semantic-ui/dist/semantic.js')
    }
};
