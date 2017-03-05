// https://github.com/shelljs/shelljs
var shell = require('shelljs');
// https://gist.github.com/branneman/8048520#1-the-symlink
var path = require('path');
var minimist = require('minimist');

// https://github.com/substack/minimist
var argv = minimist(process.argv.slice(2));
var src = argv.path;
var name = argv.name || (src && path.basename(src));
if (!src || !name) {
    throw new Error('Module path or name must be specified!');
} else if (['.', '..'].indexOf(name) >= 0) {
    throw new Error('Module name can not be "." or ".."');
}

var modulesDir = path.resolve(__dirname, '../node_modules');
shell.mkdir('-p', modulesDir);

var dst = path.resolve(modulesDir, name);
shell.ln('-sf', src, dst);
console.log('Creating symbolic link: ' + src + ' -> ' + dst);
