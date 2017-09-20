/*
    DockerConnector connects socketIO with a docker instancesById
*/
const _ = require('lodash')
const axios = require('axios')
const Instance = require('./Instance.js')


class DockerConnector{

    static factory(options){
        return new DockerConnector(options)
    }

    constructor(options){
        _.defaults(this, options)
        _.defaults(this, {
            instancesById: {},
            spawnPromises: [],
            output: _.noop
        })
    }

    spawnDir(dirId){
        const spawnPromise = this.spawnDirInner(dirId)
        this.spawnPromises.push(spawnPromise)
        return spawnPromise
    }

    sendMessage(message){
        const instance = this.instancesById[message.instanceId]
        if(!instance){
            return console.log('no such instance', message.instanceId)
        }
        return instance.sendMessage(message)
    }

    async killInstances(){
        await Promise.all(this.spawnPromises)
        await Promise.all(_.map(this.instancesById, function(instance){
            return instance.kill()
        }))
    }

    async spawnDirInner(dirId){
        if(!this.canSpawn()){return}

        const response = await axios.get(`http://localhost:10001/api/dir/${dirId}/filesDeep`)
        const files = response.data.files
        const instance = Instance({
            messageHandler: this.output
        })
        await instance.init({})
        await instance.sendFiles(files)
        await instance.runProcess()

        this.instancesById[instance.id] = instance
        return instance
    }

    canSpawn(){
        return _.keys(this.instancesById).length < 15
    }

}



module.exports = DockerConnector
