const _ = require('lodash');
const execp = require('execp');
const redis = require('redis');

const dockerContext = __dirname + '/CpSpawner/';
const dockerFilePath = dockerContext + 'Dockerfile';

const redisOptions = {
	domain: 'redis',
	port: 6388,
	containerPort: 6379
}

function DockerSpawner(dockerSpawner={}){

	_.defaults(dockerSpawner, {

		// --net "${redisOptions.domain}" declares the name of the network that the containers will share
		// -p 6388:6379 exposes this container's redis port to the outside port
		// --link redis-container:redis makes the two containers share the domain
		images: {
			redis: {
				build: _.partial(execp, `docker pull redis`),
				delete: _.partial(execp, 'docker rmi -f redis;'),
				start: _.partial(execp, `docker run -d --net "${redisOptions.domain}" -p ${redisOptions.port}:6379 --name redis-container redis`),
			},
			worker: {
				build: _.partial(execp, `docker build -t worker_image -f ${dockerFilePath} ${dockerContext}`),
				delete: _.partial(execp, 'docker rmi -f worker_image;'),
				start: function(instanceId, cpType){
					return execp(`docker run -d -e "INSTANCE_ID=${instanceId}" -e "CP_TYPE=${cpType}" --net "${redisOptions.domain}" --link redis-container:redis --name worker_${instanceId} worker_image`)
				}
			},
		},

		init(options={}){
			return dockerSpawner.initDocker(options.rebuild)
				.then(dockerSpawner.images.redis.start)
				.then(dockerSpawner.attachRedisHandler)
				.catch(_.partial(console.log, 'failed to init dockerSpawner:'))
		},

		async initDocker(rebuild=false){
			await dockerSpawner.purgeContainers()
			await dockerSpawner.prepareNetwork()
			if(rebuild){
				console.log('rebuilding docker images..')
				await dockerSpawner.rebuildRedisImage()
				await dockerSpawner.rebuildWorkerImage()
				console.log('rebuilt docker images')
			}
		},

		purgeContainers: async function(){
			const dockerIds = await dockerSpawner.getDockerIds()
			if(dockerIds){
				console.log('purging docker instances:', dockerIds, '..')
				await execp(`docker rm -f ${dockerIds}`)
				await dockerSpawner.ensurePurge()
				console.log('purged docker instances')
			}
		},

		prepareNetwork: async function(){
			console.log('creating docker network..');
			const networks = await dockerSpawner.getDockerNetworks();
			if(!_.find(networks, {name: redisOptions.domain})){
				await execp(`docker network create ${redisOptions.domain}`)
			}
			console.log('created docker network', redisOptions.domain);
		},

		rebuildRedisImage: async function(){
			return dockerSpawner.images.redis.delete()
				.catch(_.noop)
				.then(dockerSpawner.images.redis.build)
		},

		rebuildWorkerImage: async function(){
			return dockerSpawner.images.worker.delete()
				.catch(_.noop)
				.then(dockerSpawner.images.worker.build)
		},

		getDockerIds: async function(){
			let dockerIds = await execp('docker ps -a -q')
			if(dockerIds){
				dockerIds = dockerIds.split('\n');
				dockerIds = dockerIds.join(' ');
				return dockerIds
			}
		},

		ensurePurge: async function(){
			let dockerIds = await dockerSpawner.getDockerIds();
			while(dockerIds){
				await delay(1000)
				dockerIds = await dockerSpawner.getDockerIds();
			}
		},

		getDockerNetworks: async function(){
			let networksString = await execp('docker network ls');
			networksString = networksString.split('\n');
			networksString.shift();
			return _.map(networksString, function(networkString){
				const network = /(\S+) +(\S+) +(\S+) +(\S+)/.exec(networkString);
				return {
					id: network[1],
					name: network[2],
					driver: network[3],
					scope: network[4],
				}
			})
		},

		attachRedisHandler(){
			return new Promise(function(resolve, reject){
				redis.createClient(redisOptions.port, 'localhost')
					.on('message', dockerSpawner.redisMessageHandler)
					.on('subscribe', resolve)
					.subscribe('spawnRequest');
			})
		},

		redisMessageHandler: async function(channel, messageStr){
			console.log('dockerSpawner got:', channel, messageStr)
			const message = JSON.parse(messageStr);
			await dockerSpawner.images.worker.start(message.spawnId, message.cpType);
		},

	});

	return dockerSpawner;
}


function delay(time){
	return new Promise(function(resolve){
		setTimeout(resolve, time)
	})
}

module.exports = DockerSpawner;
