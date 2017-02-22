require('babel-register')({});
require('babel-polyfill');

async function test(){
	await new Promise(function(){})
	console.log('cat')
	return 'test'
}

