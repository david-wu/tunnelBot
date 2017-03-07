/*
	todo: make this 1:1 with child processes
*/

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
		@Inject('note') private note,
		@Inject('api') private api,
		@Inject('socket') private socketService,
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
				}
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
			const socket = await this.socketService.getConnection();
			const removeHandlers = this.addHandlers(socket);
			const spawnId = await this.spawn(socket);
			this.showTerminal(socket);
		}
	}
	ngOnDestroy(){

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

		return new Promise((resolve, reject)=>{
			socket.send({
				type: 'spawn',
				payload: {
					cpType: this.cpType,
				},
			}, function(err, res){
				return err ? reject(err) : resolve(res.id);
			})
		})
	}


	showTerminal(socket){
		if(!this.cpType){return;}
		var terminalOptions = _.find(this.cpTypes, {key: this.cpType});
		_.defaults(terminalOptions, {
			height: 400
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
		if(!this.currentTerminal){return;}
		if(message.type === 'stdOut'){
			console.log(message)
			this.currentTerminal.echo(message.payload);
		}
	}

	disconnectHandler(){
		console.log('server down!')
	}

	private title:string;
	private currentTerminal:any;
	private cpTypes:any;
	private socket:any;
	private terminalContainerEl:any;

}
