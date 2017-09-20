import _ from 'lodash';
import { autobind } from 'core-decorators';
const EventEmitter = require('events');

const socketService = require('./socketService');
const socketP = socketService.getConnection();

export default class ModelConnector extends EventEmitter{

    static factory(modelConnector){
        return new ModelConnector(modelConnector);
    }

    constructor(){
        super();

    }

    connectModel(model){
        this.model = model;
        return socketP.then((socket)=>{
            if(model.type === 'file'){
                this.registerFileListeners(socket, model)
            }else if(model.type === 'dir'){
                this.registerDirListeners(socket, model)
            }

            socket.on('message', (emitterRef, payload)=>{
                if(emitterRef.id !== model.id) return
                if(emitterRef.type !== model.type) return

                this.emit(emitterRef.eventName, payload);
            })
        })
    }


    emitAll(eventName, payload){
        socketP.then((socket)=>{
            socket.send({
                type: 'emit',
                ref: {
                    type: this.model.type,
                    id: this.model.id,
                    eventName: eventName
                },
                payload: payload
            })
        })
    }

    registerFileListeners(socket, file){
        const emitterConfigs = [
            {
                type: 'file',
                id: file.id,
                eventName: 'changeName'
            },
            {
                type: 'file',
                id: file.id,
                eventName: 'changeContent'
            },
            {
                type: 'file',
                id: file.id,
                eventName: 'contentDiff'
            },
        ]
        _.each(emitterConfigs, _.partial(this.registerDbListener, socket))
        return function(){
            _.each(emitterConfigs, _.partial(this.unregisterDbListener, socket))
        }
    }

    registerDirListeners(socket, dir){
        const emitterConfigs = [
            {
                type: 'dir',
                id: dir.id,
                eventName: 'changeName'
            },
            {
                type: 'dir',
                id: dir.id,
                eventName: 'addChild'
            },
            {
                type: 'dir',
                id: dir.id,
                eventName: 'removeChild'
            },
        ]
        _.each(emitterConfigs, _.partial(this.registerDbListener, socket))
        return function(){
            _.each(emitterConfigs, _.partial(this.unregisterDbListener, socket))
        }
    }

    registerDbListener(socket, emitterRef){
        socket.send({
            type: 'listen',
            ref: emitterRef
        })
    }

    unregisterDbListener(socket, emitterRef){
        socket.send({
            type: 'stopListening',
            ref: emitterRef
        })
    }

}


