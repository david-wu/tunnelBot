const _ = require('lodash');
const exec = require('./exec.js');
const fs = require('fs');
const redis = require('redis');
const guid = require('guid');

const dockerContext = __dirname + '/workerApp/';
const dockerFilePath = dockerContext + 'Dockerfile';

const images = {
	redis: {
		build: _.partial(exec, `docker pull redis`),
		// --net "redisDomain" declares the name of the network that the containers will share
		// -p 6379:6379 binds this container's exposed port to the outside port
		start: _.partial(exec, `docker run -d --net "redisDomain" -p 6379:6379 --name redis-container redis`),
	},
	worker: {
		build: _.partial(exec, `docker build -t worker_image -f ${dockerFilePath} ${dockerContext}`),
		// --net "redisDomain" declares the name of the network that the containers will share
		// --link redis-container:redis makes the two containers share the "redis" domain?
		start: function(i){
			return exec(`docker run -d --net "redisDomain" --link redis-container:redis --restart=always --name worker_${i} worker_image`)
		}
	},
};


const docker = {
	purgeContainers: function(){
		return exec('docker rm -f $(docker ps -a -q)')
			.catch(function(err){
				console.log('failed or skipped purgingContainers')
			});
	},
	prepareNetwork: function(){
		return exec('docker network create redisDomain')
			.catch(function(err){
				console.log('failed or skipped prepareNetwork')
			});
	}
}

class WorkManager{

	constructor(){
		_.defaults(this, {
			jobs: [],
			idleWorkerIds: [],
			ioConnections: [],
		});
	}

	setup(){
		return this.initDocker()
			.then(images.redis.build)
			.then(images.redis.start)
			.then(this.attachRedisHandler.bind(this))
			.then(this.addWorkers.bind(this))
	}

	addWorkers(workerCount=2){
		return images.worker.build()
			.then(function(){
				const startingWorkersPromises = _.times(workerCount, images.worker.start);
				return Promise.all(startingWorkersPromises)
			})
	}

	initDocker(){
		return docker.purgeContainers()
			.then(docker.prepareNetwork)
	}

	attachRedisHandler(){
		_.extend(this, {
			sub: redis.createClient(),
			pub: redis.createClient(),
		})

		this.sub.on('subscribe', (channel)=>{
			this.sub.on('message', this.messageHandler.bind(this));
		});
		this.sub.subscribe('all');
	}

	messageHandler(channel, message){
		message = JSON.parse(message);
	    console.log(message.type, 'channel: ' + channel + ', id: ' + message.id);

	    if(message.type === 'requestWork'){
	    	this.requestWorkHandler(message);
	    }else if(message.type === 'update'){
	    	this.updateHandler(message);
	    }else{

	    }
	}

	requestWorkHandler(message){
    	if(this.jobs.length){
	    	this.sendJob(message.id)
    	}else{
    		this.idleWorkerIds.push(message.id);
    	}
	}
	addJob(job, ioConnection){
		if(this.jobs.length > 100){
			console.log('WARN: over 100 jobs!');
		}
		this.jobs.push(job);
		if(this.idleWorkerIds.length){
			this.sendJob(this.idleWorkerIds.pop())
		}
	}
	sendJob(workerId, handle){
		// const channelId = guid.raw();
    	this.pub.publish('all', JSON.stringify({
    		id: workerId,
    		type: 'doWork',
    		payload: this.jobs.shift()
    		// channelId: channelId
    	}))

    	// this.sub.subscribe(channelId);
	}

	updateHandler(message){
		const ioConnection = _.find(this.ioConnections, {
			workerId: message.id
		});
		ioConnection.emit('update', message.payload);
	}

}

class Job{

	constructor(data){
		this.data = data
	}



	toString(){
		return JSON.stringify(this.data)
	}
}


class Worker{
	constructor(options){
		_.extend(this, options);
		_.defaults(this, {

		})
	}

}


const workManager = new WorkManager();

workManager.setup()
	.then(function(){
		setInterval(function(){
			const jobCount = _.random(5)
			console.log(`adding ${jobCount} jobs`)
			_.times(jobCount, function(){
				workManager.addJob(getFakeJob())
			})
		}, 5000)
	})


function getFakeJob(){
	return {
		map: {
			grid: [
				[{},{},{},{},{},{},{},{},],
				[{},{},{},{},{},{},{},{},],
				[{},{},{},{},{},{},{},{},],
			]
		},
		players: [
			{
				id: 'i1j21-20d',
				scripts: {
					getMove: `console.log('cat');`,
				}
			},
			{
				id: 'fa9102i3',
				scripts: {
					getMove: `console.log('dog')`,
				}
			}
		]
	};
}

module.exports = WorkManager;
