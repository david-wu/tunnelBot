const _ = require('lodash');
const redis = require('redis');

const myId = require('guid').raw();
const sub = redis.createClient(6379, 'redis');
const pub = redis.createClient(6379, 'redis');

function requestWork(){
	pub.publish('all', JSON.stringify({
		id: myId,
		type: 'requestWork',
	}));
}

sub.on('subscribe', function(){
	requestWork();
});

sub.on('message', function(channel, message){
	message = JSON.parse(message);
	if(message.id !== myId){return;}
	if(message.type === 'doWork'){

		setTimeout(function(){
			console.log('work done', message.payload);
			requestWork();
		}, 2000)
	}
})


sub.subscribe('all');


