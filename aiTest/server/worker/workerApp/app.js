
const _ = require('lodash');
const express = require('express');
const http = require('http');
const redis = require('redis');

const app = express();
app.use('/', express.static('./'))


// const port = 8081
// const server = http.createServer(this.express);
// server.listen(port, (err, response)=>{
// 	console.log('listening on '+port)
// 	// if(err){
// 	// 	rej(err)
// 	// }else{
// 	// 	res('listening on '+80, response);
// 	// }
// });


// function attachRedisHandler(){
// 	console.log('worker subscribing to random')

// 	const connections = {
// 		sub: redis.createClient(),
// 		pub: redis.createClient()
// 	};

// 	connections.sub.subscribe('random');
// 	connections.sub.on('subscribe', function(a,b,c){
// 		console.log('got subscription', a,b,c)
// 		connections.pub.publish('a nice connections', 'messsage');
// 	})
// }

// attachRedisHandler(channel)

const pub = redis.createClient(6379, 'redis');

console.log('worker is publishing to all')
pub.publish('all', 'hello from worker'+ _.uniqueId())

setTimeout(function(){
	console.log('done')
}, 1000)

// redis.createClient().subscribe('asdf')