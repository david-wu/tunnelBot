/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const redis = require('redis')
const guid = require('guid')
const redisConfigs = rootRequire('services/redis.service.js').getConfigs('production');

function SocketConnector(socketConnector={}){

	return _.defaults(socketConnector, {
		instances: {},

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
						.catch(callback)
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

		canSpawn: function(){
			return _.keys(socketConnector.instances).length < 15;
		},

		spawn: function(cpType='node'){
			if(!socketConnector.canSpawn()){
				return;
			}
			const instance = Instance({
				messageHandler: function(message){
					socketConnector.ioConnection.send(message);
				}
			})
			socketConnector.instances[instance.id] = instance;
			return instance.init(cpType);
		},
	})
}

// Represents a child process instance all hooked up by redis and message handler
function Instance(instance={}){
	const instanceId = guid.raw()
	return _.defaults(instance, {
		id: instanceId,
		channelIn: instanceId+'_IN',
		channelOut: instanceId+'_OUT',
		pub: redis.createClient(redisConfigs.port, 'localhost'),
		sub: redis.createClient(redisConfigs.port, 'localhost'),
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
			console.log('provide a message handler for instance', instanceId)
		},
		kill: function(){
			instance.send({
				type: 'kill'
			})
		}
	})
}


module.exports = SocketConnector;