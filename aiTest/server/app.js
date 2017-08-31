const http = require('http')

const DbManager = require('./DbManager/DbManager.js')
const DockerSpawner = require('./DockerSpawner/DockerSpawner.js')
const SocketManager = require('./SocketManager/SocketManager.js')
const DbEmitter = require('./DbManager/DbEmitter.js')

function App(app={}){

	_.defaults(app, {
		port: 10001,
		server: undefined,
		rebuild: false,
	})

	return _.defaults(app, {

		async init(){
			const server = http.createServer()
			const dbEmitter = DbEmitter.factory();

			// access db through APIs
			await DbManager().init({
				server: server,
				dbEmitter: dbEmitter,
			})

			// access docker spawning service through redis
			await DockerSpawner().init({
				rebuild: app.rebuild,
			})

			// access redis through webSockets
			await SocketManager().init({
				server: server,
				dbEmitter: dbEmitter,
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
