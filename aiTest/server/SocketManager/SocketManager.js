const Io = require('socket.io')
const SocketConnector = require('./SocketConnector.js')


module.exports = function SocketManager(socketManager={}){

	return _.defaults(socketManager, {

		async init(options){
			const io = Io(options.server)
			io.on('connection', function(ioConnection){
				SocketConnector.factory({
					ioConnection: ioConnection,
					modelEmitter: options.modelEmitter
				})
			})
		},

	})

}