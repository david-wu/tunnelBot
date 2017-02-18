const _ = require('lodash');
const redis = require('redis');
const guid = require('guid');


const redisOptions = {
	domain: 'redis',
	port: 6388,
	containerPort: 6379
}


setTimeout(function(){
	const pub = redis.createClient(redisOptions.port, 'localhost')
	const sub = redis.createClient(redisOptions.port, 'localhost')
	const instanceId = guid.raw()
	const channelIn = instanceId+'_IN'
	const channelOut = instanceId+'_OUT'

	pub.publish('spawnRequest', JSON.stringify({
		spawnId: instanceId
	}))
	sub.on('message', function(channel, message){
		console.log(message);
	})
	sub.subscribe(channelOut)

	setInterval(function(){
		pub.publish(channelIn, JSON.stringify({
			payload: 'console.log(\'cat\', Math.random())'
		}))
	}, 5000)
}, 5000)
