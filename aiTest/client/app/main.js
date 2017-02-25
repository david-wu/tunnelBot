global._ = require('lodash');
global.$ = require('jquery');
global.angular = require('angular');


angular.module('Main', []);
require('./main.controller.js');
require('./components/editor/noteEditor.directive.js');
require('./components/visualizer/visualizer.directive.js');




var socket = require('socket.io-client')('http://localhost:10001');

socket.on('connect', function(){
	console.log('connection')
	setInterval(function(){
		console.log("emitting")
		socket.send({
			type: 'stdIn',
			time: _.round((Date.now()-1487972972793)/1000),
			payload: 'console.log(\'yess\')\n'
		});
	},3000)

});

socket.on('event', function(data){
	console.log('got', data)
});

socket.on('message', function(data){
	console.log('message', data)
});

console.log('na')

socket.on('disconnect', function(){});



// const WebSocket = require('ws');

// const ws = new WebSocket('ws://localhost:10001/ws');

// ws.on('open', function open() {
//   ws.send('something');
// });

// ws.on('message', function incoming(data, flags) {
//   // flags.binary will be set if a binary data is received.
//   // flags.masked will be set if the data was masked.
// });