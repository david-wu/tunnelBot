const _ = require('lodash');
const exec = require('./exec.js');
const fs = require('fs');
const redis = require('redis');
const guid = require('guid');

const dockerContext = __dirname + '/workerApp/';
const dockerFilePath = dockerContext + 'Dockerfile';

const options = {
	redisDomain: 'redis',
	redisPort: 6388,
	// redisContainerPort: 6379
}

const images = {
	redis: {
		build: _.partial(exec, `docker pull redis`),
		// --net "${options.redisDomain}" declares the name of the network that the containers will share
		// -p ____:6379 exposes this container's redis port to the outside port
		start: _.partial(exec, `docker run -d --net "${options.redisDomain}" -p ${options.redisPort}:6379 --name redis-container redis`),
	},
	worker: {
		build: _.partial(exec, `docker build -t worker_image -f ${dockerFilePath} ${dockerContext}`),
		// --link redis-container:redis makes the two containers share the domain
		start: function(guid){
			return exec(`docker run -d -e "INSTANCE_ID=${guid}" --net "${options.redisDomain}" --link redis-container:redis --restart=always --name worker_${guid} worker_image`)
		}
	},
};


const docker = {
	purgeContainers: function(){
		return exec('docker ps -a -q')
			.then(function(processes){
				processes = processes.replace('\n', ' ')
				console.log(processes)
				return exec(`docker rm -f ${processes}`)
			})
		// return exec('docker rm -f $(docker ps -a -q)')
			.catch(function(err){
				console.log('failed or skipped purgingContainers')
			});
	},
	prepareNetwork: function(){
		return exec(`docker network create ${options.redisDomain}`)
			.catch(function(err){
				console.log('failed or skipped prepareNetwork step')
			});
	}
}



const spawner = Spawner()
spawner.init()


setTimeout(function(){
	const pub = redis.createClient(options.redisPort, 'localhost')
	const sub = redis.createClient(options.redisPort, 'localhost')
	const containerId = guid.raw()

	pub.publish('spawnRequest', JSON.stringify({
		spawnId: containerId
	}))
	sub.on('message', function(channel, message){
		console.log(message);
	})
	sub.subscribe(containerId)

	setTimeout(function(){
		pub.publish(containerId, JSON.stringify({
			payload: 'console.log(\'cat\')'
		}))
	}, 5000)
}, 5000)


function Spawner(spawner={}){

	_.defaults(spawner, {

		init(){
			return spawner.initDocker()
				.then(images.redis.start)
				.then(spawner.attachRedisHandler)
		},

		initDocker(){
			return docker.purgeContainers()
				.then(docker.prepareNetwork)
				.then(images.redis.build)
				.then(images.worker.build)
		},

		attachRedisHandler(){
			spawner.redisConnection = {
				sub: redis.createClient(options.redisPort, 'localhost')
				// pub: redis.createClient(options.redisPort, 'localhost'),
			}
			spawner.redisConnection.sub.on('message', spawner.messageHandler);
			spawner.redisConnection.sub.subscribe('spawnRequest');
		},

		messageHandler: function(channel, messageStr){
			console.log('got', channel, messageStr)
			const message = JSON.parse(messageStr);
			return images.worker.build()
				.then(function(){
					return images.worker.start(message.spawnId)
				});
		},

	});

	return spawner;
}

