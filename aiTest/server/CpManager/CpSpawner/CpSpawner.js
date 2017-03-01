const _ = require('lodash')
const redis = require('redis')
const spawn = require('child_process').spawn

const cpType = process.env.CP_TYPE || 'node'
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
	},
	ruby: {
		command: 'irb'
	},
	python: {
		command: 'python',
		options: ['-i']
	}
}

function CpSpawner(cpSpawner={}){
	_.defaults(cpSpawner, {

		init(){
			cpSpawner.redisPub = redis.createClient(redisOptions.port, redisOptions.domain);
			cpSpawner.redisSub = redis.createClient(redisOptions.port, redisOptions.domain);
			return cpSpawner.spawnCp(cpCommands[cpType])
				.then(cpSpawner.attachRedisHandler)
		},

		attachRedisHandler(){
			return new Promise(function(resolve, reject){
				cpSpawner.redisSub.on('message', cpSpawner.messageHandler)
				cpSpawner.redisSub.on('subscribe', resolve)
				cpSpawner.redisSub.subscribe(channelIn)
			})
		},

		messageHandler(channel, messageStr){
			const message = JSON.parse(messageStr);

			if(message.type === 'kill'){
				return cpSpawner.destroy();
			}

			cpSpawner.cp.stdin.write(message.payload);
		},

		destroy(){
			cpSpawner.cp.kill();
	        cpSpawner.redisSub.quit();
	        cpSpawner.redisPub.quit();
		},

		spawnCp(cpCommand){
			return new Promise(function(resolve, reject){
				cpSpawner.ready = false;
				cpSpawner.cp = spawn(cpCommand.command, cpCommand.options);
				cpSpawner.cp.stdin.setEncoding('utf-8');
				cpSpawner.cp.stdout.on('data', cpSpawner.cpOutHandler);
				cpSpawner.cp.stderr.on('data', cpSpawner.cpErrHandler);
				cpSpawner.cp.on('close', cpSpawner.cpCloseHandler);
				cpSpawner.cp.on('exit', cpSpawner.cpExitHandler);
				resolve();
			})
		},

		publishPayload(type, payload={}){
			const message = {
				type: type,
				payload: payload && payload.toString()
			};
			cpSpawner.redisPub.publish(channelOut, JSON.stringify(message));
		},

		cpOutHandler(payload){
			payload = payload.toString();
			if(!cpSpawner.ready){
				cpSpawner.publishPayload('ready', payload);
				cpSpawner.ready = true;
			}
			cpSpawner.publishPayload('stdOut', payload);
		},

		cpErrHandler(payload){
			cpSpawner.publishPayload('stdErr', payload);
		},

		cpCloseHandler(){
			console.log('close event');
		},

		cpExitHandler(){
			console.log('exit event');
		},

	});

	return cpSpawner;
}

module.exports = CpSpawner;
