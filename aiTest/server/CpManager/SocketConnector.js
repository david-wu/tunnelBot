/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

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
		instances: {},
		pub: redis.createClient(redisOptions.port, 'localhost'),

		init: function(options={}){
		},

		setIoConnection: function(ioConnection){
			socketConnector.ioConnection = ioConnection;

			let spawnPromise = Promise.resolve();
			ioConnection.on('message', function(message, callback){
				if(message.type === 'spawn'){
					spawnPromise = socketConnector.spawn(message.payload.cpType)
						.then(function(instance){
							callback(false, {
								id: instance.id
							})
						})
				}else{
					// messages from socket need to include an instanceId
					const instance = socketConnector.instances[message.instanceId] || _.last(_.values(socketConnector.instances))
					spawnPromise = spawnPromise.then(function(){
						instance.send(message);
					})
				}
			});

			ioConnection.on('disconnect', async function(){
				await spawnPromise;
				_.each(socketConnector.instances, function(instance){
					instance.kill();
				})
			})
		},

		spawn: function(cpType='node'){
			const instance = socketConnector.Instance({
				messageHandler: function(message){
					socketConnector.ioConnection.send(message);
				}
			})
			socketConnector.instances[instance.id] = instance;
			return instance.init(cpType);
		},

		Instance: function(instance){
			const instanceId = guid.raw()
			return _.defaults(instance, {
				id: instanceId,
				channelIn: instanceId+'_IN',
				channelOut: instanceId+'_OUT',
				pub: redis.createClient(redisOptions.port, 'localhost'),
				sub: redis.createClient(redisOptions.port, 'localhost'),
				init: function(cpType){
					instance.pub.publish('spawnRequest', JSON.stringify({
						spawnId: instance.id,
						cpType: cpType,
					}))
					return new Promise(function(resolve){
						instance.sub.subscribe(instance.channelOut)
						instance.sub.on('message', function(channel, messageStr){
							const message = JSON.parse(messageStr)
							message.instanceId = instance.id
							if(message.type==='ready'){
								resolve(instance)
							}else{
								instance.messageHandler(message)
							}
						})
					})
				},
				send: function(message){
					instance.pub.publish(instance.channelIn, JSON.stringify(message))
				},
				messageHandler: function(message){
					console.log('message handler for instance', instanceId)
				},
				kill: function(){
					instance.send({
						type: 'kill'
					})
				}
			})
		},

	})

	return socketConnector

}

module.exports = SocketConnector;