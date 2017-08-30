/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const axios = require('axios')
const Instance = require('./Instance.js')


class SocketConnector{

	static factory(ioConnection){
		return new SocketConnector(ioConnection)
	}

	constructor(ioConnection){
		_.defaults(this, {
			instances: {},
			spawnPromises: [],
			ioConnection: ioConnection,
		})

		this.ioConnection.on('message', this.messageHandler.bind(this))
		this.ioConnection.on('disconnect', this.disconnectHandler.bind(this))
	}

	messageHandler(message, callback){
		if(message.type === 'spawnDir'){
			const spawnPromise = this.spawnDir(message.payload.id)
				.then(function(instance){
					// arg[0] is for errors
					callback(false, {
						id: instance.id
					})
				})
				.catch(callback)
			this.spawnPromises.push(spawnPromise)
		}else if(message.typpe === 'stdIn'){
			const instance = this.instances[message.instanceId]
			instance.sendMessage(message)
		}else{
			const instance = this.instances[message.instanceId]
			instance.sendMessage(message)
		}
	}

	async disconnectHandler(message){
		await Promise.all(this.spawnPromises)
		await Promise.all(_.map(this.instances, function(instance){
			return instance.kill()
		}))
	}

	async spawnDir(dirId){
		if(!this.canSpawn()){return}

		const response = await axios.get(`http://localhost:10001/api/dir/${dirId}/filesDeep`)
		const files = response.data.files
		const instance = Instance({
			messageHandler: this.ioConnection.send.bind(this.ioConnection)
		})
		this.instances[instance.id] = instance

		await instance.init('generic')
		await instance.sendFiles(files)
		await instance.runProcess()
		return instance
	}

	canSpawn(){
		return _.keys(this.instances).length < 15
	}

}

module.exports = SocketConnector
