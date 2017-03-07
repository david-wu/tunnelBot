const _ = require('lodash')
const redis = require('redis')
const spawn = require('child_process').spawn

const cpType = process.env.CP_TYPE || 'python'
const instanceId = process.env.INSTANCE_ID;
const channelIn = instanceId+'_IN'
const channelOut = instanceId+'_OUT'

const redisOptions = {
	port: 6379,
	domain: 'redis',
}

// // used for testing locally
// const redisOptions = {
// 	port: 6388,
// 	domain: 'localhost',
// }

const cpCommands = {
	node: {
		command: 'node',
		options: ['-i']
	},
	ruby: {
		command: 'irb',
	},
	python: {
		command: 'python',
		options: ['-i'],
	}
}

function CpSpawner(cpSpawner={}){
	_.defaults(cpSpawner, {

		init(){
			console.log('starting up cpType', cpType);
			cpSpawner.redisPub = redis.createClient(redisOptions.port, redisOptions.domain);
			cpSpawner.redisSub = redis.createClient(redisOptions.port, redisOptions.domain);
			return cpSpawner.spawnCp(cpCommands[cpType])
				.then(cpSpawner.attachRedisHandler)
				.catch(function(){
					console.log('failed to spawn Cp:', cpType);
					cpSpawner.destroy()
				})
		},

		attachRedisHandler(){
			return new Promise(function(resolve, reject){
				cpSpawner.redisSub.on('message', cpSpawner.messageHandler)
				cpSpawner.redisSub.on('subscribe', resolve)
				cpSpawner.redisSub.subscribe(channelIn)
			})
		},

		messageHandler(channel, messageStr){
			console.log('received message', messageStr);

			const message = JSON.parse(messageStr);
			if(message.type === 'kill'){
				return cpSpawner.destroy();
			}
			cpSpawner.cp.stdin.write(message.payload);
		},

		destroy(){
			if(cpSpawner.cp){
				cpSpawner.cp.kill();
			}
			if(cpSpawner.redisSub){
		        cpSpawner.redisSub.quit();
			}
			if(cpSpawner.redisPub){
		        cpSpawner.redisPub.quit();
			}
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

			// cp is ready when it returns something
			cpSpawner.setReady(payload);
			cpSpawner.publishPayload('stdOut', payload);
		},

		cpErrHandler(payload){
			payload = payload.toString();

			// python -i sends >>> and .. as errors, but it is ready
			if(cpType==='python'){
				cpSpawner.setReady(payload);
			}
			cpSpawner.publishPayload('stdErr', payload);
		},

		// tell connector that cp is ready
		setReady(payload){
			if(!cpSpawner.ready){
				cpSpawner.publishPayload('ready', payload);
				cpSpawner.ready = true;
			}
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
