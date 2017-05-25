const Io = require('socket.io-client');


export class SocketService{

	private connectionPromise;
	private socket;

	constructor(){}

	getConnection(){
		if(this.connectionPromise){
			return this.connectionPromise;
		}
		return this.connectionPromise = new Promise((resolve, reject)=>{
			this.socket = Io();
			this.socket.on('connect', ()=>{
				resolve(this.socket)
			})
		})
	}

}