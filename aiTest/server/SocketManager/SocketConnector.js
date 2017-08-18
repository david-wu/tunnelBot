/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const axios = require('axios')
const Instance = require('./Instance.js')


function SocketHandler(scope={}){

	return _.defaults(scope, {

		instances: {},
		spawnPromises: [],

		init: function(){

		},

		setIoConnection: function(ioConnection){
			scope.ioConnection = ioConnection
			ioConnection.on('message', scope.messageHandler)
			ioConnection.on('disconnect', scope.disconnectHandler)
		},

		messageHandler: function(message, callback){
			if(message.type === 'spawnDir'){
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
			if(!scope.canSpawn()){return}

			const response = await axios.get(`http://localhost:10001/api/dir/${dirId}/children?filesDeep=true`)
			const files = response.data.files
			const instance = Instance({
				messageHandler: scope.ioConnection.send.bind(scope.ioConnection)
			})
			scope.instances[instance.id] = instance

			await instance.init('generic')
			await instance.sendFiles(files)
			await instance.runProcess()
			return instance
		},

		canSpawn: function(){
			return _.keys(scope.instances).length < 15
		},
	})
}


module.exports = SocketHandler;