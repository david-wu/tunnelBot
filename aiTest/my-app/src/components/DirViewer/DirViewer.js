import React, { Component } from 'react';
import './DirViewer.css';

const _ = require('lodash');

const FontAwesome = require('react-fontawesome');
const Terminal = require('./lib/terminal.js')
const socketService = require('../../services/socketService');


class DirViewer extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
            },

            componentDidMount: function(){

            },

            onConsoleContainer: function(element){
                scope.consoleContainer = element
            },

            componentWillReceiveProps: function(newProps){
                if(newProps.dirNode.model.id !== scope.props.dirNode.model.id){
                    scope.instanceId = undefined;
                    scope.removeHandlers();
                    scope.emptyTerminal();
                    scope.setState(function(oldState){
                        oldState.dir = newProps.dirNode.model
                    })
                }
            },

            spawnProcess: async function(){
                scope.setState({
                    awaitingSpawn: true,
                })

                scope.instanceId = undefined;
                scope.removeHandlers()
                scope.emptyTerminal();

                const socket = await socketService.getConnection()
                scope.removeHandlers = scope.addHandlers(socket)

                scope.instanceId = await scope.spawnDir(socket, scope.props.dirNode.model.id);

                scope.showTerminal(socket)

                scope.setState({
                    awaitingSpawn: false,
                })
            },

            addHandlers: function(socket){
                const messageHandler = scope.messageHandler.bind(scope);
                const disconnectHandler = scope.disconnectHandler.bind(scope);
                socket.on('message', messageHandler)
                socket.on('disconnect', disconnectHandler);
                return function(){
                    socket.removeListener('message', messageHandler);
                    socket.removeListener('disconnect', disconnectHandler);
                }
            },

            spawnDir: function(socket, id){
                return new Promise((resolve, reject)=>{
                    socket.send({
                        type: 'spawnDir',
                        payload: {
                            id: id
                        },
                    }, function(err, res){
                        return err ? reject(err) : resolve(res.id);
                    })
                })
                .catch(function(err){
                    console.log('failed to spawn', err)
                })
            },


            showTerminal: function(socket){
                scope.terminal = scope.setTerminal();
                scope.promptInput(socket);
            },

            promptInput: async function(socket){
                scope.terminal.input('> ', async (input)=>{
                    await socket.send({
                        instanceId: scope.instanceId,
                        type: 'stdIn',
                        payload: input+'\n',
                    });
                    scope.promptInput(socket);
                })
            },

            setTerminal: function(){
                const terminal = new Terminal('my-console')
                scope.emptyTerminal();
                scope.consoleContainer.appendChild(terminal.html)

                return terminal
            },

            emptyTerminal: function(){
                const container = scope.consoleContainer;
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            },

            messageHandler: function(message){
                if(!scope.terminal){return;}
                if(message.type === 'stdOut'){
                    if(message.instanceId === scope.instanceId){
                        scope.terminal.print(message.payload);
                    }
                }else if(message.type === 'stdErr'){
                    scope.terminal.printError(message.payload);
                }
            },

            deleteDir: function(){
                scope.props.dirNode.destroy();
            },

            disconnectHandler: function(){
                console.log('connection lost!')
            },

            removeHandlers: _.noop,

            render: function(){
                return (
                    <div>
                        <button disabled>Set Permissions</button>
                        <button disabled>Get Public Access Url</button>
                        <button onClick={scope.deleteDir}>Delete</button>
                        <button onClick={scope.spawnProcess}>Spawn instance</button>
                        <div>
                            {scope.state.awaitingSpawn ? <FontAwesome name="cog" spin /> : ''}
                        </div>
                        <div style={{width:'500px', height:'500px', position:'relative', flex: '1 0 0'}} ref={scope.onConsoleContainer}>
                        </div>
                    </div>
                );
            },



        })
    }

}

export default DirViewer;
