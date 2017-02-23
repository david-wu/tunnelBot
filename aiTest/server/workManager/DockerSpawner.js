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
				start: _.partial(execp, `docker run -d --net "${redisOptions.domain}" -p ${redisOptions.port}:6379 --name redis-container redis`),
			},
			worker: {
				build: _.partial(execp, `docker build -t worker_image -f ${dockerFilePath} ${dockerContext}`),
				start: function(instanceId){
					return execp(`docker run -d -e "INSTANCE_ID=${instanceId}" --net "${redisOptions.domain}" --link redis-container:redis --restart=always --name worker_${instanceId} worker_image`)
				}
			},
		},

		init(){
			return dockerSpawner.initDocker()
				.then(dockerSpawner.images.redis.start)
				.then(dockerSpawner.attachRedisHandler)
		},

		initDocker(){
			return dockerSpawner.purgeContainers()
				.then(dockerSpawner.prepareNetwork)
				.then(dockerSpawner.images.redis.build)
				.then(dockerSpawner.images.worker.build)
				.catch(_.partial(console.log, 'failed to init docker:'))

		},

		purgeContainers: async function(){
			const dockerIds = await dockerSpawner.getDockerIds()
			if(dockerIds){
				console.log('purging docker instances:', dockerIds)
				await execp(`docker rm -f ${dockerIds}`)
				await dockerSpawner.ensurePurge()
				console.log('docker instance purged')
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

		getDockerIds: async function(){
			const dockerIds = await execp('docker ps -a -q')
			if(dockerIds){
				return dockerIds.replace('\n', ' ')
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
			return redis.createClient(redisOptions.port, 'localhost')
				.on('message', dockerSpawner.messageHandler)
				.subscribe('spawnRequest');
		},

		messageHandler: async function(channel, messageStr){
			console.log('dockerSpawner got:', channel, messageStr)
			const message = JSON.parse(messageStr);
			await dockerSpawner.images.worker.start(message.spawnId);
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
