const _ = require('lodash')
const redis = require('redis')
const spawn = require('child_process').spawn
const guid = require('guid')

const instanceId = process.env.INSTANCE_ID;
const channelIn = instanceId+'_IN'
const channelOut = instanceId+'_OUT'

const redisOptions = {
	port: 6379,
	domain: 'redis',
}

const cpCommands = {
	node: {
		command: 'node',
		options: ['-i']
	}
}

function CpSpawner(cpSpawner={}){
	_.defaults(cpSpawner, {

		init(){
			return cpSpawner.spawnCp(cpCommands.node)
				.then(cpSpawner.attachRedisHandler)
		},

		attachRedisHandler(){
			return new Promise(function(resolve, reject){
				cpSpawner.redisPub = redis.createClient(redisOptions.port, redisOptions.domain);
				cpSpawner.redisSub = redis.createClient(redisOptions.port, redisOptions.domain);
				cpSpawner.redisSub.on('message', cpSpawner.messageHandler)
				cpSpawner.redisSub.on('subscribe', resolve)
				cpSpawner.redisSub.subscribe(channelIn)
			})
		},

		messageHandler(channel, messageStr){
			console.log('get message', Date.now())
			const message = JSON.parse(messageStr);
			cpSpawner.cp.stdin.write(message.payload);
			if(message.end){
				cpSpawner.cp.stdin.end();
			}
		},

		spawnCp(cpCommand){
			return new Promise(function(resolve, reject){
				cpSpawner.cp = spawn(cpCommand.command, cpCommand.options);
				cpSpawner.cp.stdin.setEncoding('utf-8');
				cpSpawner.cp.stdout.on('data', cpSpawner.cpOutHandler);
				cpSpawner.cp.stderr.on('data', cpSpawner.cpErrHandler);
				cpSpawner.cp.on('close', cpSpawner.cpCloseHandler);
				cpSpawner.cp.on('exit', cpSpawner.cpExitHandler);
				resolve();
			})
		},

		publishPayload(type, payload){
			const message = {
				type: type,
				payload: payload.toString()
			};
			cpSpawner.redisPub.publish(channelOut, JSON.stringify(message));
		},

		cpOutHandler(payload){
			cpSpawner.publishPayload('stdOut', payload);
		},

		cpErrHandler(payload){
			cpSpawner.publishPayload('stdErr', payload);
		},

		cpCloseHandler(payload){
			cpSpawner.publishPayload('close', payload);
		},

		cpExitHandler(payload){
			cpSpawner.publishPayload('exit', payload);
		},

	});

	return cpSpawner;
}

module.exports = CpSpawner;
