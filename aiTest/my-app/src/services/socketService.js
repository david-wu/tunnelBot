const Io = require('socket.io-client');
const env = require('../env.js');
const endpoint = env.url()

class SocketService{

	getConnection(){
		if(this.connectionPromise){
			return this.connectionPromise;
		}
		return this.connectionPromise = new Promise((resolve, reject)=>{
			this.socket = Io(endpoint);
			this.socket.on('connect', ()=>{
				resolve(this.socket)
			})
		})
	}

}

module.exports = new SocketService();
