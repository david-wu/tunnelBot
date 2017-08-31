/*
	SocketConnectors are 1:1 with websocket connections
	They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const axios = require('axios')
const Instance = require('./Instance.js')



class SocketConnector{

	static factory(options){
		return new SocketConnector(options)
	}

	constructor(options){
		_.defaults(this, options)
		_.defaults(this, {
			instances: {},
			spawnPromises: [],
		})

		this.ioConnection.send = this.ioConnection.send.bind(this.ioConnection);

		this.ioConnection.on('message', this.messageHandler.bind(this))
		this.ioConnection.on('disconnect', this.disconnectHandler.bind(this))
	}

	messageHandler(message, callback){
		if(message.type === 'spawnDir'){
			const spawnPromise = this.spawnDir(message.payload.id)
				.catch(callback)
				.then((instance)=>{
					this.instances[instance.id] = instance
					callback(false, {
						id: instance.id
					})
				})
			this.spawnPromises.push(spawnPromise)
		}else if(message.type === 'registerDbEmitter'){

			var eventHandler = (event)=>{
				this.ioConnection.send(message.on, event)
			}

			if(message.on){
				this.dbEmitter.on(message.on, eventHandler)
			}
			if(message.removeListener){
				this.dbEmitter.removeListener(message.removeListener, eventHandler)
			}


		}else if(message.type === 'stdIn'){
			const instance = this.instances[message.instanceId]
			if(!instance){callback('no such instance')}
			instance.sendMessage(message)
		}else{
			const instance = this.instances[message.instanceId]
			if(!instance){callback('no such instance')}
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
			messageHandler: this.ioConnection.send
		})
		await instance.init({})
		await instance.sendFiles(files)
		await instance.runProcess()
		return instance
	}

	canSpawn(){
		return _.keys(this.instances).length < 15
	}

}



module.exports = SocketConnector
