const _ = require('lodash')
const redis = require('redis')
const childProcess = require('child_process');
const spawn = childProcess.spawn
const fs = require('fs')

const cpType = process.env.CP_TYPE || 'maze'
const instanceId = process.env.INSTANCE_ID;
const channelIn = instanceId+'_IN'
const channelOut = instanceId+'_OUT'

const redisOptions = {
	port: 6379,
	domain: 'redis',
}
const redisService = require('./redis.service.js');

// used for testing locally
// const redisOptions = {
// 	port: 6388,
// 	domain: 'localhost',
// }

const cpCommands = {
	node: {
		command: 'node',
		args: ['-i']
	},
	ruby: {
		command: 'irb',
	},
	python: {
		command: 'python',
		args: ['-i'],
	},
	maze: {
		command: 'node ./games/maze/index.js',
	},
	generic: {
		command: './start.sh',
		args: [],
		options: {
			cwd: 'context'
		}
	}
}

function CpSpawner(cpSpawner={}){
	_.defaults(cpSpawner, {

		init(){
			cpSpawner.redisPub = redis.createClient(redisOptions.port, redisOptions.domain);
			cpSpawner.redisSub = redis.createClient(redisOptions.port, redisOptions.domain);
			return cpSpawner.startListening()
				.then(cpSpawner.emitRedisReady)
		},

		startListening(){
			return redisService.onP(channelIn, cpSpawner.messageHandler);
		},

		messageHandler(message){
			if(message.type === 'fileWrite'){
				return cpSpawner.writeFile(message.file);
			}else if(message.type === 'runProcess'){
				return cpSpawner.runChildProcess(cpType)
			}else if(message.type === 'kill'){
				return cpSpawner.destroy();
			}
			if(message.payload){
				return cpSpawner.cp.stdin.write(message.payload);
			}
		},

		writeFile(file){
			return new Promise(function(resolve, reject){
				fs.writeFile(`./context/${file.name}`, file.content, resolve);
			})
		},

		runChildProcess(cpType){
			cpSpawner.ready = false;
			if(cpType==='generic'){
				childProcess.execSync('chmod +x ./context/start.sh')
			}

			const cpCommand = cpCommands[cpType]
			cpSpawner.cp = spawn(cpCommand.command, cpCommand.args, cpCommand.options)
			cpSpawner.cp.stdin.setEncoding('utf-8')
			cpSpawner.cp.stdout.on('data', cpSpawner.cpOutHandler)
			cpSpawner.cp.stderr.on('data', cpSpawner.cpErrHandler)
			cpSpawner.cp.on('close', cpSpawner.cpCloseHandler)
			cpSpawner.cp.on('exit', cpSpawner.cpExitHandler)
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


		cpOutHandler(payload){
			payload = payload.toString();
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
		setReady(payload){
			if(!cpSpawner.ready){
				cpSpawner.publishPayload('ready', payload);
				cpSpawner.ready = true;
			}
		},
		emitRedisReady(){
			cpSpawner.publishPayload('redisReady', 'cp is listening on redis');
		},
		publishPayload(type, payload={}){
			const message = {
				type: type,
				payload: payload && payload.toString()
			};
			cpSpawner.redisPub.publish(channelOut, JSON.stringify(message));
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
