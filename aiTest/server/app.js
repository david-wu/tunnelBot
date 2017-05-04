const http = require('http')

const DbManager = require('./DbManager/DbManager.js')
const DockerSpawner = require('./DockerSpawner/DockerSpawner.js')
const SocketManager = require('./SocketManager/SocketManager.js')

function App(app={}){

	_.defaults(app, {
		port: 10001,
		server: undefined,
		redisConfigs: {
			domain: 'redis',
			port: 6388,
			containerPort: 6379
		}
	})

	return _.defaults(app, {

		async init(){
			const server = http.createServer()

			// Connect to db and provide access through APIs
			await DbManager().init({
				server: server
			})

			// Provide docker spawning service through redis
			await DockerSpawner().init({
				redisConfigs: app.redisConfigs,
				rebuild: false,
			})

			// Connects to redis through webSockets
			await SocketManager().init({
				redisConfigs: app.redisConfigs,
				server: server,
			})

			await app.serve(server, app.port)
			console.log('serving on', app.port)
		},

		serve(server, port){
			return new Promise((res, rej)=>{
				server.listen(port, (err, response)=>{
					return err ? rej(err) : res(response);
				})
			})
		},

	})
}

module.exports = App;
