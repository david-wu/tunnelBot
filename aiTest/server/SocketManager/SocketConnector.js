/*
    SocketConnectors are 1:1 with websocket connections
    They can submit multiple spawn requests and manage multiple child processes
*/

const _ = require('lodash')
const axios = require('axios')
const DockerConnector = require('./DockerConnector/DockerConnector.js')


class SocketConnector{

    static factory(options){
        return new SocketConnector(options)
    }

    constructor(options){
        _.defaults(this, options)
        _.defaults(this, {
            modelEmitter: undefined,
            dockerConnector: DockerConnector.factory({
                output: this.ioConnection.send.bind(this.ioConnection)
            }),
        })

        this.ioConnection.on('message', this.messageHandler.bind(this))
        this.ioConnection.on('disconnect', this.disconnectHandler.bind(this))
    }

    messageHandler(message, callback){
        if(message.type === 'listen'){
            this.modelEmitter.on(message.ref, (payload)=>{
                if(payload.originSocketId === this.ioConnection.id) return
                this.ioConnection.send(message.ref, payload)
            });
        }else if(message.type === 'stopListening'){

        }else if(message.type === 'emit'){
            message.payload.originSocketId = this.ioConnection.id;
            this.modelEmitter.emit(message.ref, message.payload)
        }else if(message.type === 'spawnDir'){
            this.dockerConnector.spawnDir(message.payload.id)
                .then(function(instance){
                    callback(false, {
                        id: instance.id
                    })
                })
        }else if(message.type === 'stdIn'){
            this.dockerConnector.sendMessage(message)
                .then(callback)
        }else{
            this.dockerConnector.sendMessage(message)
                .then(callback)
        }
    }

    disconnectHandler(){
        this.dockerConnector.killInstances()
    }

}



module.exports = SocketConnector
