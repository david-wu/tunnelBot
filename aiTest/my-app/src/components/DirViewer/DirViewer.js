import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';

import './DirViewer.css';

const Terminal = require('./lib/terminal.js')
const socketService = require('../../services/socketService');

@observer
class DirViewer extends Component {

    constructor(props){
        super(props);
        this.state = {
            dir: undefined
        }
        this.debouncedPutDir = _.debounce(this.putDir, 200)
    }

    componentDidMount(){

    }

    @autobind
    onConsoleContainer(element){
        this.consoleContainer = element
    }

    componentWillReceiveProps(newProps){
        if(newProps.dirNode.model.id !== this.props.dirNode.model.id){
            this.instanceId = undefined;
            this.removeHandlers();
            this.emptyTerminal();
            this.setState(function(oldState){
                oldState.dir = newProps.dirNode.model
                return oldState
            })
        }
    }

    @autobind
    async spawnProcess(){
        this.setState({
            awaitingSpawn: true,
        })

        this.instanceId = undefined;
        this.removeHandlers()
        this.emptyTerminal();

        const socket = await socketService.getConnection()
        this.removeHandlers = this.addHandlers(socket)

        this.instanceId = await this.spawnDir(socket, this.props.dirNode.model.id);

        this.showTerminal(socket)

        this.setState({
            awaitingSpawn: false,
        })
    }

    addHandlers(socket){
        const messageHandler = this.messageHandler.bind(this);
        const disconnectHandler = this.disconnectHandler.bind(this);
        socket.on('message', messageHandler)
        socket.on('disconnect', disconnectHandler);
        return function(){
            socket.removeListener('message', messageHandler);
            socket.removeListener('disconnect', disconnectHandler);
        }
    }

    spawnDir(socket, id){
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
    }


    showTerminal(socket){
        this.terminal = this.setTerminal();
        this.promptInput(socket);
    }

    async promptInput(socket){
        this.terminal.input('> ', async (input)=>{
            await socket.send({
                instanceId: this.instanceId,
                type: 'stdIn',
                payload: input+'\n',
            });
            this.promptInput(socket);
        })
    }

    setTerminal(){
        const terminal = new Terminal('my-console')
        this.emptyTerminal();
        this.consoleContainer.appendChild(terminal.html)

        return terminal
    }

    emptyTerminal(){
        const container = this.consoleContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    messageHandler(message){
        if(!this.terminal){return;}
        if(message.type === 'stdOut'){
            if(message.instanceId === this.instanceId){
                this.terminal.print(message.payload);
            }
        }else if(message.type === 'stdErr'){
            this.terminal.printError(message.payload);
        }
    }

    @autobind
    deleteDir(){
        this.props.dirNode.destroy();
    }

    @autobind
    onDirNameChange(e){
        this.props.dirNode.model.name = e.target.value
        this.debouncedPutDir()
    }

    @autobind
    putDir(){
        this.props.dirNode.model.put()
    }


    disconnectHandler(){
        console.log('connection lost!')
    }

    removeHandlers(){

    }

    @autobind
    showPublicAccessUrl(){
        const baseUrl = window.location.protocol + '//' + window.location.host;
        this.setState({
            publicAccessUrl: `${baseUrl}?rootNodeId=${this.props.dirNode.model.id}`
        })
    }

    render(){
        const createdAgo = moment(new Date(this.props.dirNode.model.createdAt)).fromNow()
        const updatedAgo = moment(new Date(this.props.dirNode.model.updatedAt)).fromNow()
        return (
            <div>
                <div>
                    <button disabled>Set Permissions</button>
                    <button onClick={this.showPublicAccessUrl}>Get Public Access Url</button>
                    <button onClick={this.deleteDir}>Delete</button>
                </div>
                <div>
                    <div>
                        {this.state.publicAccessUrl ? <input value={this.state.publicAccessUrl}/> : ''}
                    </div>
                </div>
                <div>
                    <div>
                        created {createdAgo}
                    </div>
                    <div>
                        last updated {updatedAgo}
                    </div>
                </div>
                <div>
                    <input value={this.props.dirNode.model.name} type="text" onChange={this.onDirNameChange} />
                    <button onClick={this.spawnProcess}>Spawn instance</button>
                </div>
                <div>
                    <div>
                        {this.state.awaitingSpawn ? <FontAwesome name="cog" spin /> : ''}
                    </div>
                    <div style={{width:'500px', height:'500px', position:'relative', flex: '1 0 0'}} ref={this.onConsoleContainer}>
                    </div>
                </div>
            </div>
        );
    }

}

export default DirViewer;
