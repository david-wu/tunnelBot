require('babel-register')({});
require('babel-polyfill');


const fs = require('fs');
const minimist = require('minimist');
const env = require('./env.js');

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
    port: env.port,
	rebuild: argv.r || argv.rebuild
}).init();