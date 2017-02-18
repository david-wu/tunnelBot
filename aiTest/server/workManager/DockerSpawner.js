const _ = require('lodash');
const exec = require('./exec.js');
// const fs = require('fs');
const redis = require('redis');
// const guid = require('guid');

const dockerContext = __dirname + '/CpSpawner/';
const dockerFilePath = dockerContext + 'Dockerfile';

const redisOptions = {
	domain: 'redis',
	port: 6388,
	containerPort: 6379
}

const docker = {

	// --net "${redisOptions.domain}" declares the name of the network that the containers will share
	// -p 6388:6379 exposes this container's redis port to the outside port
	// --link redis-container:redis makes the two containers share the domain
	images: {
		redis: {
			build: _.partial(exec, `docker pull redis`),
			start: _.partial(exec, `docker run -d --net "${redisOptions.domain}" -p ${redisOptions.port}:6379 --name redis-container redis`),
		},
		worker: {
			build: _.partial(exec, `docker build -t worker_image -f ${dockerFilePath} ${dockerContext}`),
			start: function(instanceId){
				return exec(`docker run -d -e "INSTANCE_ID=${instanceId}" --net "${redisOptions.domain}" --link redis-container:redis --restart=always --name worker_${instanceId} worker_image`)
			}
		},
	},

	purgeContainers: function(){
		return exec('docker ps -a -q')
			.then(function(instanceIds){
				instanceIds = instanceIds.replace('\n', ' ')
				if(!instanceIds.length){
					return Promise.resolve()
				}else{
					return exec(`docker rm -f ${instanceIds}`)
				}
			})
			.catch(function(err){
				console.log('failed or skipped purgingContainers')
			});
	},

	prepareNetwork: function(){
		return exec(`docker network create ${redisOptions.domain}`)
			.catch(function(err){
				console.log('failed or skipped prepareNetwork step')
			});
	}
}



const dockerSpawner = DockerSpawner()
dockerSpawner.init()


// setTimeout(function(){
// 	const pub = redis.createClient(redisOptions.port, 'localhost')
// 	const sub = redis.createClient(redisOptions.port, 'localhost')
// 	const instanceId = guid.raw()
// 	const channelIn = instanceId+'_IN'
// 	const channelOut = instanceId+'_OUT'

// 	pub.publish('spawnRequest', JSON.stringify({
// 		spawnId: instanceId
// 	}))
// 	sub.on('message', function(channel, message){
// 		console.log(message);
// 	})
// 	sub.subscribe(channelOut)

// 	setInterval(function(){
// 		pub.publish(channelIn, JSON.stringify({
// 			payload: 'console.log(\'cat\', Math.random())'
// 		}))
// 	}, 5000)
// }, 5000)

function DockerSpawner(dockerSpawner={}){

	_.defaults(dockerSpawner, {

		init(){
			return dockerSpawner.initDocker()
				.then(docker.images.redis.start)
				.then(dockerSpawner.attachRedisHandler)
		},

		initDocker(){
			return docker.purgeContainers()
				.then(docker.prepareNetwork)
				.then(docker.images.redis.build)
				.then(docker.images.worker.build)
		},

		attachRedisHandler(){
			dockerSpawner.redisConnection = {
				sub: redis.createClient(redisOptions.port, 'localhost')
			}
			dockerSpawner.redisConnection.sub.on('message', dockerSpawner.messageHandler);
			dockerSpawner.redisConnection.sub.subscribe('spawnRequest');
		},

		messageHandler: function(channel, messageStr){
			console.log('got', channel, messageStr)
			const message = JSON.parse(messageStr);
			return docker.images.worker.build()
				.then(function(){
					return docker.images.worker.start(message.spawnId)
				});
		},

	});

	return dockerSpawner;
}

module.exports = DockerSpawner;
