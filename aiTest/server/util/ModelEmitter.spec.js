const ModelEmitter = require('./ModelEmitter.js')
const _ = require('lodash')

const modelEmitter = new ModelEmitter()

const removeEmitter = modelEmitter.on({type: 'file', id: 1234, eventName: 'change'}, function(change){
    if(change.type === 'addChild'){
        console.log('adding child to file:1234')
    }else if(change.type === 'updateName'){
        console.log('updating file name for file:1234 to '+change.value)
    }
})

modelEmitter.emit({type: 'file', id: 1234, eventName: 'change'}, {type: 'updateName', value: 'awefq'})
modelEmitter.emit({type: 'file', id: 1234, eventName: 'change2'}, {type: 'updateName', value: 'awef21q'})

removeEmitter();

modelEmitter.emit({type: 'file', id: 1234}, {type: 'updateName', value: 'awefq'})
