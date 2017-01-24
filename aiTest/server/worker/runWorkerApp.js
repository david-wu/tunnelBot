const _ = require('lodash');
const exec = require('./exec.js');
const redis = require('redis');
const fs = require('fs');

const images = {
	redis: {
		build: function(){
			return exec('docker pull redis');
		},
		start: function(){
			// -p 6379:6379 binds this container's exposed port to the outside port
			// --net "redis" declares a network domain name that is specific to inside docker containers
			return exec('docker run -d -p 6379:6379 --net "redis" --name redis-container redis');
		}
	},
	worker: {
		build: function(){
			const dockerContext = __dirname + '/workerApp/';
			const dockerFilePath = dockerContext + 'Dockerfile';
			return exec(`docker build -t worker_image -f ${dockerFilePath} ${dockerContext}`);
		},
		start: function(redisId){
			// --net "redis" declares a network domain name that is specific to inside docker containers
			// --link redis-container:redis makes the two containers share the "redis" networkInterface
			return exec('docker run --net "redis" --link redis-container:redis --name some-app -d worker_image');
		}
	},
}

function purgeContainers(){
	return exec('docker rm -f $(docker ps -a -q)')
		.catch(function(err){
			console.log('failed to purge')
		});
}

function compose(){
	return exec('docker network create redis')
		.catch(function(err){
			console.log('failed to compose')
		});
}

function attachRedisHandler(){
	console.log('attaching Redis Handler');
	const sub = redis.createClient();
	const pub = redis.createClient();

	// sub.on('subscribe', function(channel, count){
	// 	console.log('got subscription', channel, count)
	// })

	sub.on('message', function (channel, message) {
	    console.log('got message from channel: ' + channel + ', message: ' + message);
	});

	sub.subscribe('all');
}

var redisId
purgeContainers()
	.then(compose)
	.then(images.redis.build)
	.then(images.redis.start)
	.then(attachRedisHandler)
	.then(images.worker.removeImage)
	.then(images.worker.build)
	.then(images.worker.start)
	.then(console.log)
	.catch(console.log);

