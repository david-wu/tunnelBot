const _ = require('lodash')
const redis = require('redis')
const spawn = require('child_process').spawn

const guid = require('guid')
const options = {
	redisPort: 6388
}
const sub = redis.createClient(options.redisPort, 'localhost')
const pub = redis.createClient(options.redisPort, 'localhost')


function Connector(connector){

	_.defaults(connector, {

		id: guid.raw(),

		// repls: {
		// 	node: 'node',
		// 	ruby: 'irb'
		// },

		subscribeHandler(){
			return connector.startCp('node')
				.then(connector.emitReady);
		},

		startCp(command){
			return new Promise((resolve, reject)=>{
				connector.cp = spawn(command);
				connector.cp.stdin.setEncoding('utf-8');
				connector.cp.stdout.on('data', connector.cpOutHandler);
				connector.cp.stderr.on('data', connector.cpErrHandler);
				connector.cp.on('close', connector.cpCloseHandler);
				resolve();
			});
		},

		emitReady(){
			const message = {
				id: connector.id,
				type: 'ready',
			}
			connector.pub.publish('all', JSON.stringify(message))
		},

		cpOutHandler(payload){
			console.log('sending:', payload.toString())
			connector.publishPayload('stdOut', payload);
		},

		cpErrHandler(payload){
			connector.publishPayload('stdErr', payload);
		},

		cpCloseHandler(payload){
			connector.publishPayload('close', payload);
		},

		cpIn(payload){
			console.log('received:', payload)
			connector.cp.stdin.write(payload);
			connector.cp.stdin.end();
		},

		publishPayload(type, payload){
			const message = {
				id: connector.id,
				type: type,
				payload: payload.toString()
			};
			connector.pub.publish('all', JSON.stringify(message));
		},


	});

	connector.sub.on('message', function(channel, message){
		parsedMessage = JSON.parse(message);
		if(parsedMessage.id === connector.id && parsedMessage.type==='stdIn'){
			connector.cpIn(parsedMessage.payload);
		}
	});
	connector.sub.on('subscribe', connector.subscribeHandler);
	connector.sub.subscribe('all');

	return connector;
}

const connector = Connector({
	pub: pub,
	sub: sub,
});

