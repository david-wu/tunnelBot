const http = require('http')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const MongoClient = require('mongodb').MongoClient
const Io = require('socket.io')

const api = require('./api')
const DockerSpawner = require('./CpManager/DockerSpawner.js')
const SocketConnector = require('./CpManager/SocketConnector.js')

function App(app={}){

	_.defaults(app, {
		mongo: {},
		port: 10001,
		express: express(),
	})

	_.defaults(app.mongo, {
		domain: 'localhost',
		port: '27017',
		dbName: 'myproject',
		db: undefined,
		getUrl: function(){
			return `mongodb://${this.domain}:${this.port}/${this.dbName}`
		},
	})

	_.defaults(app, {

		async init(){
			app.mongo.db = await app.connectMongo()
			app.strapMiddleware()
			app.mount(app.express)
			app.server = http.createServer(app.express)
			await app.attachSocketConnector()
			await app.serve(app.port)
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
				rebuild: true
			})
			const io = Io(app.server);
			io.on('connection', app.spawnConnector)
		},

		spawnConnector(connection){
			const socketConnector = SocketConnector()

			let spawnPromise = Promise.resolve();
			connection.on('message', function(message){
				if(message.type === 'spawn'){
					spawnPromise = socketConnector.init(message.payload.cpType)
				}else{
					spawnPromise = spawnPromise.then(function(){
						socketConnector.sendMessage(message);
					})
				}
			});

			socketConnector.messageHandler = function(message){
				connection.send(message)
			}

			connection.on('disconnect', function(){
				spawnPromise.then(function(){
					socketConnector.sendMessage({
						type: 'kill',
					})
				})
			})
		},

		serve(port=app.port){
			return new Promise((res, rej)=>{
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

module.exports = App;
