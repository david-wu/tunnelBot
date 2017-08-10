/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const redis = require('redis')
const guid = require('guid')
const axios = require('axios')

const redisService = rootRequire('services/redis.service.js');
const redisConfigs = redisService.getConfigs('production');

function SocketHandler(scope={}){

	return _.defaults(scope, {

		instances: {},
		spawnPromises: [],

		init: function(options={}){

		},

		setIoConnection: function(ioConnection){
			scope.ioConnection = ioConnection
			ioConnection.on('message', scope.messageHandler)
			ioConnection.on('disconnect', scope.disconnectHandler)
		},

		messageHandler: function(message, callback){
			if(message.type === 'spawnProject'){
				const spawnPromise = scope.spawnInstance(message.payload.projectId)
					.then(function(instance){
						// arg[0] is for errors
						callback(false, {
							id: instance.id
						})
					})
					.catch(callback)
				scope.spawnPromises.push(spawnPromise)
			}else{
				const instance = scope.instances[message.instanceId]
				instance.sendMessage(message)
			}
		},

		disconnectHandler: async function(message){
			await Promise.all(scope.spawnPromises)
			await Promise.all(_.map(scope.instances, function(instance){
				return instance.kill()
			}))
		},

		spawnInstance: async function(projectId){
			if(!scope.canSpawn()){return;}

			const response = await axios.get(`http://localhost:10001/api/project/${projectId}/files`);
			const files = response.data
			const instance = Instance({
				messageHandler: scope.ioConnection.send.bind(scope.ioConnection)
			})
			scope.instances[instance.id] = instance

			await instance.init('generic')
			await instance.sendFiles(files);
			await instance.runProcess()
			return instance;
		},

		canSpawn: function(){
			return _.keys(scope.instances).length < 15;
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
		sub: redis.createClient(redisConfigs.port, 'localhost'),

		init: async function(cpType){
			redisService.emitP('spawnRequest', {
				spawnId: instance.id,
				cpType: cpType,
			})
			await instance.ensureRedisReady()
			return instance
		},

		ensureRedisReady: function(){
			return new Promise(function(resolve){
				instance.sub.subscribe(instance.channelOut)
				instance.sub.on('message', function(channel, messageStr){
					const message = JSON.parse(messageStr)
					message.instanceId = instance.id
					if(message.type==='redisReady'){
						resolve(instance)
					}else{
						instance.messageHandler(message)
					}
				})
			})
		},

		sendFiles: function(files){
			return Promise.all(_.map(files, instance.sendFile))
		},

		sendFile: async function(file){
			await instance.sendMessage({
				type: 'fileWrite',
				file: file
			})
		},

		runProcess: function(){
			return instance.sendMessage({
				type: 'runProcess'
			});
		},

		sendMessage: function(message){
			return redisService.emitP(instance.channelIn, message);
		},

		kill: function(){
			return instance.sendMessage({
				type: 'kill'
			})
		},

		messageHandler: function(message){
			console.log('provide a message handler for instance', instance.id)
		},
	})
}


module.exports = SocketHandler;