require('babel-register')({});
require('babel-polyfill');

const fs = require('fs');
global._ = require('lodash');

global.rootRequire = function(path){
	return require(__dirname+'/'+path);
};
require.extensions['.txt'] = function(module, filename){
    module.exports = fs.readFileSync(filename, 'utf8');
};


var App = require('./app.js')
App().init();