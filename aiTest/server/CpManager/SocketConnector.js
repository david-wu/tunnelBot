const _ = require('lodash')
const redis = require('redis')
const guid = require('guid')

const redisOptions = {
	domain: 'redis',
	port: 6388,
	containerPort: 6379,
}


function SocketConnector(socketConnector={}){

	_.defaults(socketConnector, {

		init: async function(cpType='node'){
			const instanceId = guid.raw()
			_.extend(socketConnector, {
				instanceId: instanceId,
				channelIn: instanceId+'_IN',
				channelOut: instanceId+'_OUT',
			})

			await socketConnector.spawn(cpType)
		},

		sendMessage: function(message){
			socketConnector.pub.publish(socketConnector.channelIn, JSON.stringify(message))
		},

		messageHandler: function(message){
			console.log(message)
		},

		spawn: function(cpType='node'){
			return new Promise(function(resolve){
				_.extend(socketConnector, {
					pub: redis.createClient(redisOptions.port, 'localhost'),
					sub: redis.createClient(redisOptions.port, 'localhost'),
				})

				socketConnector.pub.publish('spawnRequest', JSON.stringify({
					spawnId: socketConnector.instanceId,
					cpType: cpType,
				}))

				socketConnector.sub.subscribe(socketConnector.channelOut)
				socketConnector.sub.on('message', function(channel, messageStr){
					const message = JSON.parse(messageStr)
					if(message.type==='ready'){
						resolve()
					}else{
						socketConnector.messageHandler(message);
					}
				})
			})
		}
	})

	return socketConnector

}

module.exports = SocketConnector;