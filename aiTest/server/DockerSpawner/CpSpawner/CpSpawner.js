/*
	agent inside docker container
	listens for messages on ${instanceId}_IN
	responds on ${instanceId}_OUT
	handles 'fileWrite', 'runProcess', 'kill', and 'stdin' message types
*/

const _ = require('lodash')
const redis = require('redis')
const childProcess = require('child_process');
const spawn = childProcess.spawn
const fs = require('fs')
const mkdirp = require('mkdirp')

const redisService = require('./redis.service.js');

const instanceId = process.env.INSTANCE_ID;
const channelIn = instanceId+'_IN'
const channelOut = instanceId+'_OUT'
const redisOptions = {
	port: 6379,
	domain: 'redis',
}
// used for testing outside container
// const redisOptions = {
// 	port: 6388,
// 	domain: 'localhost',
// }


function CpSpawner(cpSpawner={}){
	_.defaults(cpSpawner, {

		init(){
			cpSpawner.redisPub = redis.createClient(redisOptions.port, redisOptions.domain);
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
				return cpSpawner.runChildProcess()
			}else if(message.type === 'kill'){
				return cpSpawner.destroy();
			}else if(message.type === 'stdin'){
				return cpSpawner.cp.stdin.write(message.payload);
			// todo: always send a message.type and remove this
			}else{
				return cpSpawner.cp.stdin.write(message.payload);
			}
		},

		writeFile(file){
			return new Promise(function(resolve, reject){
				if(file.path){
					mkdirp(`/workerApp/context/${file.path}`, function(){
						fs.writeFile(`./context/${file.path}/${file.name}`, file.content, resolve);
					})
				}else{
					fs.writeFile(`./context/${file.name}`, file.content, resolve);
				}
			})
		},

		runChildProcess(){
			cpSpawner.ready = false;
			childProcess.execSync('chmod +x ./context/start.sh')
			cpSpawner.cp = spawn('./start.sh', [instanceId], {cwd: 'context'})
			cpSpawner.cp.stdin.setEncoding('utf-8')
			cpSpawner.cp.stdout.on('data', cpSpawner.cpOutHandler)
			cpSpawner.cp.stderr.on('data', cpSpawner.cpErrHandler)
			cpSpawner.cp.on('close', cpSpawner.cpCloseHandler)
			cpSpawner.cp.on('exit', cpSpawner.cpExitHandler)
			return true;
		},

		cpOutHandler(payload){
			cpSpawner.publishPayload('stdOut', payload);
		},

		cpErrHandler(payload){
			cpSpawner.publishPayload('stdErr', payload);
		},

		cpCloseHandler(){
			cpSpawner.publishPayload('close', payload);
		},

		cpExitHandler(){
			cpSpawner.publishPayload('exit', payload);
		},

		emitRedisReady(){
			cpSpawner.publishPayload('redisReady', 'cp is listening on redis');
		},

		destroy(){
			if(cpSpawner.cp){
				cpSpawner.cp.kill();
			}
			if(cpSpawner.redisPub){
		        cpSpawner.redisPub.quit();
			}
			return true;
		},

		publishPayload(type, payload={}){
			cpSpawner.redisPub.publish(channelOut, JSON.stringify({
				type: type,
				payload: payload.toString(),
			}));
		},

	});

	return cpSpawner;
}

module.exports = CpSpawner;
