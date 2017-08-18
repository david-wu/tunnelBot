/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const axios = require('axios')

const Instance = require('./Instance.js');

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
			}else if(message.type === 'spawnDir'){
				console.log('spawningDir', message.payload.id)
				const spawnPromise = scope.spawnDir(message.payload.id)
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

		spawnDir: async function(dirId){
			if(!scope.canSpawn()){return;}
			console.log('dirId', dirId)

			const response = await axios.get(`http://localhost:10001/api/dir/${dirId}/children?deep=true`);
			const files = response.data.files;
			console.log('files', files)
			const instance = Instance({
				messageHandler: scope.ioConnection.send.bind(scope.ioConnection)
			})
			scope.instances[instance.id] = instance

			await instance.init('generic')
			await instance.sendFiles(files);
			await instance.runProcess()
			return instance;
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


module.exports = SocketHandler;