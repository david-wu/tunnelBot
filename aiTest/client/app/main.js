global._ = require('lodash');
global.$ = require('jquery');
global.angular = require('angular');


angular.module('Main', []);
require('./main.controller.js');
require('./components/editor/noteEditor.directive.js');
require('./components/visualizer/visualizer.directive.js');




var socket = require('socket.io-client')();

var sendInterval

socket.on('connect', function(){
	console.log('server connected!')

	socket.send({
		type: 'spawn',
		payload: {
			cpType: 'ruby',
		},
	})

	sendInterval = setInterval(function(){
		socket.send({
			type: 'stdIn',
			payload: 'p rand(0...10)\n'
		});
	}, 3000)

});

socket.on('message', function(message){
	console.log('message', message)
});

socket.on('disconnect', function(){
	console.log('server down!')
	clearInterval(sendInterval);
});

