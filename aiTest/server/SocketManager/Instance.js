const guid = require('guid')

const redis = require('redis')
const redisService = rootRequire('services/redis.service.js');
const redisConfigs = redisService.getConfigs('production');


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

module.exports = Instance;