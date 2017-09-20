const _ = require('lodash')
const EventEmitter = require('events').EventEmitter;

/*
    emitterRef: {
        type: 'file',
        id: 'i2j2o3i4-3ij12-3kj23',
        eventName: 'changeContent'
    }
*/
class ModelEmitter{

    static factory(options){
        return new ModelEmitter(options);
    }

    constructor(options){
        _.defaults(this, options);
        _.defaults(this, {
            allEmitters: {}
        })
    }

    on(emitterRef, changeRunner){
        const emitter = this.getEmitter(emitterRef);
        emitter.on(emitterRef.eventName, changeRunner);

        return ()=>{
            this.off(emitterRef, changeRunner);
        }
    }

    off(emitterRef, changeRunner){
        const emitter = this.getEmitter(emitterRef);
        emitter.removeListener(emitterRef.eventName, changeRunner);
    }

    emit(emitterRef, event){
        this.getEmitter(emitterRef).emit(emitterRef.eventName, event)
    }

    getEmitter(emitterRef){
        this.allEmitters[emitterRef.type] = this.allEmitters[emitterRef.type] || {}
        const emitterGroup = this.allEmitters[emitterRef.type]
        return emitterGroup[emitterRef.id] = emitterGroup[emitterRef.id] || new EventEmitter()
    }

}

module.exports = ModelEmitter