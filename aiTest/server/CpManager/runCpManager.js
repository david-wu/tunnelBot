// // sample usage

// require('babel-register')({});
// require('babel-polyfill');
// global._ = require('lodash');

// // const http = require('http');
// // const server = http.createServer();


// const DockerSpawner = require('./DockerSpawner.js');
// const SocketConnector = require('./SocketConnector.js');

// const dockerSpawner = DockerSpawner();
// const socketConnector = SocketConnector();

// dockerSpawner
// 	.init({
// 		// rebuild: true
// 	})
// 	.then(_.partial(socketConnector.init, server))
// 	.then(function(){
// 		server.listen(10000)
// 	});



// function CpManager(){

// }

// module.exports = CpManager;