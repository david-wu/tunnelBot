const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;

const api = require('./api');
const Router = require('./Router.js');
const DockerSpawner = require('./CpManager/DockerSpawner.js');
const SocketConnector = require('./CpManager/SocketConnector.js');

function App(app={}){

	_.defaults(app, {
		port: 10001,
		express: express(),
		mongo: {}
	});

	_.defaults(app.mongo, {
		domain: 'localhost',
		port: '27017',
		dbName: 'myproject',
		db: undefined,
		getUrl: function(){
			return `mongodb://${this.domain}:${this.port}/${this.dbName}`
		},
	});

	_.defaults(app, {

		async init(){
			app.mongo.db = await app.connectMongo();
			app.strapMiddleware();
			app.mount(app.express);
			app.server = http.createServer(app.express);
			await app.attachSocketConnector();
			await app.serve(app.port);
			console.log('serving on', app.port)
		},

		connectMongo(){
			return new Promise((resolve, reject)=>{
				MongoClient.connect(app.mongo.getUrl(), function(err, db){
					if(err){
						reject(err)
					}else{
						resolve(db);
					}
				});
			});
		},

		strapMiddleware(){
		    app.express.use(bodyParser.urlencoded({extended:true}));
		    app.express.use(bodyParser.json());
		    app.express.use(cookieParser());
		    app.express.use(cors());
		},

		// Returns an express router
		mount(parentRouter = express()){
			return _.reduce(app.getRoutes(app), function(router, route){
				return router[route.method](route.endPoint, route.handler)
			}, parentRouter)
		},

		getRoutes(app){
			return [
				{
					method: 'use',
					endPoint: '/',
					handler: express.static('../client/dist')
				},
				{
					method: 'use',
					endPoint: '/api',
					handler: api.mount(app)
				}
			]
		},

		async attachSocketConnector(){


			await DockerSpawner().init({
				// rebuild: true
			})

			// const SocketIo = require('socket.io');
			const io = require('socket.io')(app.server);
			io.on('connection', function(connection){

				const socketConnector = SocketConnector();
				let spawnPromise = socketConnector.init();

				connection.on('message', function(message){
					spawnPromise = spawnPromise.then(function(){
						console.log('sending to cp:', message);
						socketConnector.sendMessage(message);
					})
				});

				socketConnector.messageHandler = function(message){
					console.log('returning', message)
					connection.send(message)
				}

			})

			// const Ws = require('ws');
			// app.wss = new Ws.Server({
			// 	server: app.server,
			// 	path: '/ws'
			// });

			// app.wss.on('connection', function(connection){

			// 	const socketConnector = SocketConnector();
			// 	let spawnPromise = socketConnector.init();

			// 	ws.on('message', function incoming(message) {
			// 		console.log('received:', message);
			// 		spawnPromise = spawnPromise.then(function(){
			// 			socketConnector.sendInput(message.payload);
			// 		})
			// 	});

			// 	socketConnector.messageHandler = function(messageStr){
			// 		const message = JSON.parse(messageStr);
			// 		ws.send(message)
			// 	}
			// })

		},

		serve(port=app.port){
			return new Promise((res, rej)=>{
				// app.server = http.createServer(app.express);
				app.server.listen(port, (err, response)=>{
					if(err){
						rej(err)
					}else{
						res(response);
					}
				})
			})
		},

	})

	return app;
}


App().init();

