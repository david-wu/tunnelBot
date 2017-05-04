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
					spawnPromise = socketConnector.spawn(message.payload.cpType, message.payload.fileIds)
						.then(function(instance){
							callback(false, {
								id: instance.id
							})
						})
						.catch(function(errs){
							console.log('gots', errs)
							throw errs;
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

		spawn: async function(cpType='node', fileIds=['58f93c1f43cdd43c6821309b']){
			if(!socketConnector.canSpawn()){
				return;
			}
			const instance = Instance({
				messageHandler: function(message){
					socketConnector.ioConnection.send(message);
				}
			})
			socketConnector.instances[instance.id] = instance;
			await instance.init(cpType, fileIds)
			return instance
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

		init: async function(cpType, fileIds){

			redisService.emitP('spawnRequest', {
				spawnId: instance.id,
				cpType: cpType,
			})

			await new Promise(function(resolve){
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
			await instance.mountFiles(fileIds)
			await instance.runProcess
			return instance
		},

		mountFiles: function(fileIds){
			return Promise.all(_.map(fileIds, instance.mountFile));
		},
		mountFile: async function(fileId){
			const file = await instance.fetchFile(fileId);
			await instance.sendFile(file);
		},
		fetchFile: async function(fileId){
			const response = await axios.get(`http://localhost:10001/api/file/${fileId}`)
			return response.data
		},
		sendFile: async function(file){
			await instance.send({
				type: 'fileWrite',
				file: file
			})
		},
		runProcess: function(){
			return instance.send({
				type: 'runProcess'
			});
		},

		send: function(message){
			return redisService.emitP(instance.channelIn, message);
		},
		messageHandler: function(message){
			console.log('provide a message handler for instance', instanceId)
		},
		kill: function(){
			instance.send({
				type: 'kill'
			})
		},
	})
}


module.exports = SocketConnector;