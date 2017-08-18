const Io = require('socket.io-client');
const endpoint = 'http://localhost:10001'

class SocketService{

	constructor(){}

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