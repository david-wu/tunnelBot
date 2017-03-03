function linkFunc($q, scope, element){

	var Io = require('socket.io-client');

	_.defaults(scope, {

		cpType: 'node',
		socket: undefined,
		termContainer: element.find('.terminal-container'),

		cpTypes: {
			node: {
				greetings: 'Interactive JavaScript',
				prompt: 'js> ',
			},
			ruby: {
				greetings: 'Interactive Ruby',
				prompt: 'ruby> '
			},
			python: {
				greetings: 'python',
				prompt: 'python> '
			}
		},

		connect: function(){
			if(scope.socket){
				return $q.resolve(scope.socket)
			}
			return $q(function(resolve, reject){
				var socket = Io();
				socket.on('connect', function(){
					scope.attachHandlers(socket);
					resolve(scope.socket = socket)
				})
			})
		},

		attachHandlers: function(socket){
			socket.on('message', scope.messageHandler)
			socket.on('disconnect', scope.disconnectHandler);
			return socket;
		},

		spawn: function(socket){
			return new Promise(function(resolve, reject){
				socket.send({
					type: 'spawn',
					payload: {
						cpType: scope.cpType,
					},
				}, function(err, res){
					return err ? reject(err) : resolve(socket);
				})
			})
		},

		showTerminal: function(socket){
			if(!scope.cpType){return;}
			var terminalOptions = scope.cpTypes[scope.cpType];
			_.defaults(terminalOptions, {
				height: 400
			})

			scope.termContainer.empty();
			scope.termEl = $('<div/>');
			scope.termContainer.append(scope.termEl);

			scope.termEl.terminal(function(command, terminal) {
				if(command === ''){
					return terminal.echo('');
				}
				scope.currentTerminal = terminal
	        	socket.send({
	        		type: 'stdIn',
	        		payload: command+'\n'
	        	});
		    }, terminalOptions);
		},

		messageHandler: function(message){
			if(!scope.currentTerminal){return;}
			if(message.type === 'stdOut'){
				scope.currentTerminal.echo(message.payload);
			}
		},

		disconnectHandler: function(){
			console.log('server down!')
		},

	})

	scope.$watch('cpType', function(cpType){
		scope.connect()
			.then(scope.spawn)
			.then(scope.showTerminal)
			.catch(console.log)
	})
}

angular.module('Main')
	.directive('terminal', [
		'$q',
		function($q){
			return {
	            scope: {
	                cpType: '=?',
	            },
	            link: _.partial(linkFunc, $q),
	            template: require('./terminal.tpl.html')
			}
		}
	]);

