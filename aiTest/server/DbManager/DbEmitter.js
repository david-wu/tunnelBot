const _ = require('lodash')
const EventEmitter = require('events').EventEmitter;

/*
	emitterRef: {
		type: 'file',
		id: 'i2j2o3i4-3ij12-3kj23'
	}
*/

// communication between db and sockets
class DbEmitter{

	static factory(options){
		return new DbEmitter(options);
	}

	constructor(options){
		_.defaults(this, options);
		_.defaults(this, {
			fileEmittersById: {},
			dirEmittersById: {},
		})
	}

	on(emitterRef, changeRunner){
		const emitter = this.getEmitter(emitterRef);
		emitter.on(emitterRef.eventName, changeRunner);

		return ()=>{
			this.removeListener(emitterRef, changeRunner);
		}
	}

	removeListener(emitterRef, changeRunner){
		const emitter = this.getEmitter(emitterRef);
		emitter.removeListener(emitterRef.eventName, changeRunner);
	}

	getEmitter(emitterRef){
		if(emitterRef.type === 'file'){
			this.fileEmittersById[emitterRef.id] = this.fileEmittersById[emitterRef.id] || new EventEmitter()
			return this.fileEmittersById[emitterRef.id];
		}else if(emitterRef.type === 'dir'){
			this.dirEmittersById[emitterRef.id] = this.dirEmittersById[emitterRef.id] || new EventEmitter()
			return this.dirEmittersById[emitterRef.id];
		}
	}

	emit(emitterRef, event){
		console.log(emitterRef, event)
		if(emitterRef.type === 'file'){
			const fileEmitter = this.fileEmittersById[emitterRef.id]
			if(fileEmitter){
				fileEmitter.emit(emitterRef.eventName, event)
			}
		}else if(emitterRef.type === 'dir'){
			const dirEmitter = this.dirEmittersById[emitterRef.id]
			if(dirEmitter){
				dirEmitter.emit(emitterRef.eventName, event)
			}

		}
	}

}

module.exports = DbEmitter