/**
 * module alias definitions
 *
 * [Document](https://github.com/benbria/aliasify#configuration)
 */
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
    aliases: {
    },
    // An object mapping RegExp strings with RegExp replacements,
    // or a function that will return a replacement.
    // For inner libraries and modules
    replacements: {
        '^core/': './src/core/',
        '^lib/': './src/lib/',
        '^assets/': './src/assets/',
        '^ui/([^\\./]+)$': './src/ui/$1.vue',
        '^ui/knowledge/([^\\./]+)$': './src/ui/knowledge/$1.vue',
        '^ui/todo/([^\\./]+)$': './src/ui/todo/$1.vue',
        '^ui/': './src/ui/'
    }
};
