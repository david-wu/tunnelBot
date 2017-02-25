const _ = require('lodash');
const redis = require('redis');
const guid = require('guid');
const SocketIo = require('socket.io');

const redisOptions = {
	domain: 'redis',
	port: 6388,
	containerPort: 6379
}


function SocketConnector(socketConnector={}){

	_.defaults(socketConnector, {

		init: async function(){
			await socketConnector.spawn('node');
			// socketConnector.sendMessage('console.log(\'first\', Math.random())\n');
			// setInterval(function(){
			// 	socketConnector.sendMessage('console.log(\'cat\', Math.random())\n');
			// 	// socketConnector.sendMessage('p 34\n');
			// }, 5000)
		},

		sendMessage: function(message){
			socketConnector.pub.publish(socketConnector.channelIn, JSON.stringify({
				payload: message.payload
			}))
		},

		messageHandler: function(message){
			console.log(message)
		},

		spawn: function(cpType='node'){
			return new Promise(function(resolve){
				const instanceId = guid.raw();

				_.extend(socketConnector, {
					instanceId: instanceId,
					channelIn: instanceId+'_IN',
					channelOut: instanceId+'_OUT',
					pub: redis.createClient(redisOptions.port, 'localhost'),
					sub: redis.createClient(redisOptions.port, 'localhost'),
				})

				socketConnector.pub.publish('spawnRequest', JSON.stringify({
					spawnId: socketConnector.instanceId,
					cpType: cpType
				}));

				socketConnector.sub.subscribe(socketConnector.channelOut)
				socketConnector.sub.on('message', function(channel, messageStr){
					const message = JSON.parse(messageStr);
					if(message.type==='ready'){
						resolve();
					}else{
						socketConnector.messageHandler(message);
					}
				});
			})
		}
	});

	return socketConnector

}

module.exports = SocketConnector;