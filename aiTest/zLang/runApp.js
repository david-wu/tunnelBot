require('babel-register')({});
require('babel-polyfill');


const fs = require('fs');
const minimist = require('minimist');


global._ = require('lodash');
global.rootRequire = function(path){
	return require(__dirname+'/'+path);
};

require.extensions['.txt'] = function(module, filename){
    module.exports = fs.readFileSync(filename, 'utf8');
};

const argv = _.defaults(minimist(process.argv.slice(2)), {
	r: false,
	rebuild: false,
});

var App = require('./app.js')
App({
	rebuild: argv.r || argv.rebuild
}).init();