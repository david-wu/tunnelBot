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
				if(message.type === 'spawnSystem'){
					spawnPromise = socketConnector.spawnSystem(message.payload.systemId)
						.then(function(instance){
							callback(false, {
								id: instance.id
							})
						})
						.catch(callback);

				}else if(message.type === 'spawnProject'){
					spawnPromise = socketConnector.spawnProject(message.payload.projectId)
						.then(function(instance){
							callback(false, {
								id: instance.id
							})
						})
						.catch(callback);

				}else if(message.type === 'spawn'){
					spawnPromise = socketConnector.spawn(message.payload.cpType, message.payload.fileIds)
						.then(function(instance){
							callback(false, {
								id: instance.id
							})
						})
						.catch(callback)

				}else{
					// messages from socket need to include an instanceId
					const instance = socketConnector.instances[message.instanceId]// || _.last(_.values(socketConnector.instances))
					// spawnPromise = spawnPromise.then(function(){
						instance.sendMessage(message);
					// })
				}
			});

			ioConnection.on('disconnect', async function(){
				await spawnPromise;
				_.each(socketConnector.instances, function(instance){
					instance.kill();
				})
			})
		},

		spawnSystem: async function(systemId){
			const response = await axios.get(`http://localhost:10001/api/system/${systemId}`);
			const nodes = response.data;



		},

		spawnProject: async function(projectId){
			const response = await axios.get(`http://localhost:10001/api/project/${projectId}/files`);
			const files = response.data
			const instance = Instance({
				messageHandler: socketConnector.ioConnection.send.bind(socketConnector.ioConnection)
			})
			socketConnector.instances[instance.id] = instance

			await instance.init('generic')
			await instance.sendFiles(files);
			await instance.runProcess()
			return instance;
		},

		spawn: async function(cpType='generic', fileIds=[]){
			if(!socketConnector.canSpawn()){return}
			const instance = Instance({
				messageHandler: socketConnector.ioConnection.send.bind(socketConnector.ioConnection)
			})
			socketConnector.instances[instance.id] = instance

			await instance.init(cpType)
			await instance.mountFiles(fileIds)
			await instance.runProcess()

			return instance
		},

		canSpawn: function(){
			return _.keys(socketConnector.instances).length < 15;
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
		messageHandler: function(message){
			console.log('provide a message handler for instance', instance.id)
		},
		kill: function(){
			instance.sendMessage({
				type: 'kill'
			})
		},
	})
}


module.exports = SocketConnector;