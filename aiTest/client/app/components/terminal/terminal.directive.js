function TerminalController(scope, $q){

	var socket = require('socket.io-client')();

	var sendInterval


	_.defaults(scope, {

		loaded: function(){
			return false;
		},

		connectHandler: function(){

			socket.send({
				type: 'spawn',
				payload: {
					cpType: 'ruby',
				},
			})
			scope.showTerminal();
		},

		messageHandler: function(message){
			console.log('message', message)
			if(!scope.currentTerminal){return;}
			if(message.type === 'stdOut'){
				scope.currentTerminal.echo(message.payload);
			}
		},

		disconnectHandler: function(){
			console.log('server down!')
		},

		showTerminal: function(){

			var terminal = $('.terminal').terminal(function(command, terminal) {
				if(command === ''){
					return terminal.echo('');
				}
				scope.currentTerminal = terminal
	        	socket.send({
	        		type: 'stdIn',
	        		payload: command+'\n'
	        	});
		    }, {
		        greetings: 'Ruby Interpreter',
		        name: 'ruby_demo',
		        height: 400,
		        prompt: 'ruby> '
		    });
		}

	})

	var currentEntry = Promise.resolve()
	socket.on('connect', scope.connectHandler)
	socket.on('message', scope.messageHandler)
	socket.on('disconnect', scope.disconnectHandler);

}
TerminalController.$inject = ['$scope', '$q'];

function linkFunc(){

}

angular.module('Main')
	.controller('TerminalController', TerminalController)
	.directive('terminal', function(){
		return {
            scope: {
                onDone: '=',
                wizardName: '=',
                data: '='
            },
            link: linkFunc,
            controller: TerminalController,
            template: require('./terminal.tpl.html')
		}
	});

