require('babel-register')({});
require('babel-polyfill');
global._ = require('lodash');
global.rootRequire = function(path){
	return require(__dirname+'/'+path);
};
require.extensions['.txt'] = function(module, filename){
    module.exports = fs.readFileSync(filename, 'utf8');
};

const fs = require('fs');

require('./app.js')