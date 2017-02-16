const _ = require('lodash')
const redis = require('redis')
const spawn = require('child_process').spawn
const guid = require('guid')


const instanceId = process.env.INSTANCE_ID;
const options = {
	redisPort: 6379,
	redisDomain: 'redis',
}


console.log('Docker instanceId:', instanceId);


const cpSpawner = CpSpawner();
cpSpawner.init();


function CpSpawner(cpSpawner={}){
	_.defaults(cpSpawner, {

		init(){
			return cpSpawner.attachRedisHandler()
				.then(_.partial(cpSpawner.spawnCp, 'node'));
		},

		attachRedisHandler(){
			return new Promise(function(resolve, reject){
				cpSpawner.redisConnection = {
					sub: redis.createClient(options.redisPort, options.redisDomain),
					pub: redis.createClient(options.redisPort, options.redisDomain),
				}
				cpSpawner.redisConnection.sub.on('message', cpSpawner.messageHandler)
				cpSpawner.redisConnection.sub.subscribe(instanceId)
				resolve();
			})
		},

		messageHandler(channel, messageStr){
			const message = JSON.parse(messageStr);
			cpSpawner.cp.stdin.write(message.payload);
			cpSpawner.cp.stdin.end();
		},

		spawnCp(command){
			return new Promise(function(resolve, reject){
				cpSpawner.cp = spawn(command);
				cpSpawner.cp.stdin.setEncoding('utf-8');
				cpSpawner.cp.stdout.on('data', cpSpawner.cpOutHandler);
				cpSpawner.cp.stderr.on('data', cpSpawner.cpErrHandler);
				cpSpawner.cp.on('close', cpSpawner.cpCloseHandler);
				resolve();
			})
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

		publishPayload(type, payload){
			const message = {
				type: type,
				payload: payload.toString()
			};
			cpSpawner.redisConnection.pub.publish(instanceId, JSON.stringify(message));
		},

	});

	return cpSpawner;
}


// Redis to CP connector
// function Connector(connector){

// 	_.defaults(connector, {

// 		id: guid.raw(),

// 		// repls: {
// 		// 	node: 'node',
// 		// 	ruby: 'irb'
// 		// },

// 		subscribeHandler(){
// 			return connector.startCp('node')
// 				.then(connector.emitReady);
// 		},

// 		startCp(command){
// 			return new Promise((resolve, reject)=>{
// 				connector.cp = spawn(command);
// 				connector.cp.stdin.setEncoding('utf-8');
// 				connector.cp.stdout.on('data', connector.cpOutHandler);
// 				connector.cp.stderr.on('data', connector.cpErrHandler);
// 				connector.cp.on('close', connector.cpCloseHandler);
// 				resolve();
// 			});
// 		},

// 		emitReady(){
// 			const message = {
// 				id: connector.id,
// 				type: 'ready',
// 			}
// 			connector.pub.publish('all', JSON.stringify(message))
// 		},

// 		cpOutHandler(payload){
// 			console.log('sending:', payload.toString())
// 			connector.publishPayload('stdOut', payload);
// 		},

// 		cpErrHandler(payload){
// 			connector.publishPayload('stdErr', payload);
// 		},

// 		cpCloseHandler(payload){
// 			connector.publishPayload('close', payload);
// 		},

// 		cpIn(payload){
// 			console.log('received:', payload)
// 			connector.cp.stdin.write(payload);
// 			connector.cp.stdin.end();
// 		},

// 		publishPayload(type, payload){
// 			const message = {
// 				id: connector.id,
// 				type: type,
// 				payload: payload.toString()
// 			};
// 			connector.pub.publish('all', JSON.stringify(message));
// 		},


// 	});

// 	connector.sub.on('message', function(channel, message){
// 		parsedMessage = JSON.parse(message);
// 		if(parsedMessage.id === connector.id && parsedMessage.type==='stdIn'){
// 			connector.cpIn(parsedMessage.payload);
// 		}
// 	});
// 	connector.sub.on('subscribe', connector.subscribeHandler);
// 	connector.sub.subscribe('all');

// 	return connector;
// }

// const connector = Connector({
// 	pub: pub,
// 	sub: sub,
// });

