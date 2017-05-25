import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
const _ = require('lodash');
const $ = require('jquery');

@Component({
	selector: 'console',
	template: require('./console.tpl.html'),
	styles: [`
	`],
})
export class ConsoleComponent {

	@Input('project') project;
	@ViewChild('consoleContainer') consoleContainer;
	terminal:any;

	constructor(
		@Inject('project') private projectService,
		@Inject('socket') private socketService,
		@Inject('file') private fileService,
	){
	}

	ngOnChanges(changes){
		if(changes.project){
			this.clearSpawn();
		}
	}

	async spawnProcess(){
		this.clearSpawn()
		const socket = await this.socketService.getConnection()
		this.removeHandlers = this.addHandlers(socket)
		this.instanceId = await this.spawn(socket)
		this.showTerminal(socket)
	}

	clearSpawn(){
		this.instanceId = undefined;
		this.removeHandlers()
		this.removeTerminal();
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

	spawn(socket){
		return this.projectService.getFiles(this.project.id).toPromise()
			.then(function(res){
				return res.json();
			})
			.then(function(files){
				const fileIds = _.map(files, 'id');
				return new Promise((resolve, reject)=>{
					socket.send({
						type: 'spawn',
						payload: {
							cpType: 'generic',
							fileIds: fileIds
						},
					}, function(err, res){
						return err ? reject(err) : resolve(res.id);
					})
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
		this.terminal.input('', async (input)=>{
			await socket.send({
				instanceId: this.instanceId,
				type: 'stdIn',
				payload: input+'\n',
			});
			this.promptInput(socket);
		})
	}

	removeTerminal(){
		$(this.consoleContainer.nativeElement).empty()
	}

	setTerminal(){
		const terminal = new Terminal('my-console')
		this.removeTerminal();
		this.consoleContainer.nativeElement.appendChild(terminal.html)

		return terminal
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

	disconnectHandler(){
		console.log('server down!')
	}

	removeHandlers(){

	}

	ngOnDestroy(){


	}

	private instanceId:any;

}


declare const Terminal:any;
