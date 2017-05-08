import {Component, Input, Output, EventEmitter, ViewChild, Inject} from '@angular/core';
const Io = require('socket.io-client');
const _ = require('lodash');
const $ = require('jquery');


@Component({
	selector: 'terminal',
	template: require('./terminal.tpl.html'),
	styles: [`
		:host{
			display: flex;
			flex-direction: column;
			max-width: 400px;
		}
	`]
})
export class TerminalComponent {

	@Input() cpType:string;
	@Output() cpTypeChange = new EventEmitter();
	@ViewChild('terminalContainer') terminalContainer;

	constructor(
		@Inject('api') private api,
		@Inject('socket') private socketService,
		@Inject('file') private fileService,
	){
		_.defaults(this, {
			cpTypes: [
				{
					displayName: 'JavaScript',
					key: 'node',
					greetings: 'Interactive JavaScript',
					prompt: 'js> ',
				},
				{
					displayName: 'Ruby',
					key: 'ruby',
					greetings: 'Interactive Ruby',
					prompt: 'ruby> '
				},
				{
					displayName: 'Python',
					key: 'python',
					greetings: 'Interactive Python',
					prompt: 'python> '
				},
				{
					displayName: 'Maze',
					key: 'maze',
					greetings: 'Maze',
					prompt: 'maze> '
				},
			],
		})
	}

	ngOnInit(){
		_.defaults(this, {
			cpType: 'node',
			terminalContainerEl: $(this.terminalContainer.nativeElement),
		});
	}
	async ngOnChanges(change){
		if(change.cpType){
			// this.removeHandlers();
			// const socket = await this.socketService.getConnection();
			// this.removeHandlers = this.addHandlers(socket);
			// const spawnId = await this.spawn(socket);
			// this.showTerminal(socket);
		}
	}

	ngOnDestroy(){

	}

	async spawnProcess(){
		this.removeHandlers()
		const socket = await this.socketService.getConnection()
		this.removeHandlers = this.addHandlers(socket)
		this.showTerminal(socket)
		const spawnId = await this.spawn(socket)

		console.log('spawned', socket)
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
		return this.fileService.get().toPromise()
			.then(function(res){
				return res.json();
			})
			.then(function(files){
				const fileIds = _.map(files, '_id');
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
		if(!this.cpType){return;}
		var terminalOptions = _.find(this.cpTypes, {key: this.cpType});
		_.defaults(terminalOptions, {
			height: 400,
			echoCommand: false,
			greetings: 'hello',
		})

		this.terminalContainerEl.empty();
		const termEl = $('<div/>');
		this.terminalContainerEl.append(termEl);

		termEl.terminal((command, terminal)=>{
			if(command === ''){
				return terminal.echo('');
			}
			this.currentTerminal = terminal
        	socket.send({
        		type: 'stdIn',
        		payload: command+'\n'
        	});
	    }, terminalOptions);
	}

	messageHandler(message){
		console.log('get message', message)
		if(!this.currentTerminal){return;}
		if(message.type === 'stdOut'){
			this.currentTerminal.echo(message.payload);
		}
	}

	disconnectHandler(){
		console.log('server down!')
	}

	removeHandlers(){

	}

	private title:string;
	private currentTerminal:any;
	private cpTypes:any;
	private socket:any;
	private terminalContainerEl:any;

}
