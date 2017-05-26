import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'system-list-viewer',
	template: require('./systemListViewer.tpl.html'),
	styles: [`
		.selected{
			background-color: black;
			color: white;
		}
	`],
})
export class SystemListViewerComponent {

	@Input() systemList:any;
	@Input() selectedSystem:any;
	@Output() selectedSystemChange = new EventEmitter();
	@Output() createSystem = new EventEmitter();

	constructor(
		@Inject('system') private systemService,
	){
		this.newSystem = {};
	}

	onSystemSelect(system){
		if(this.selectedSystem===system){
			this.selectedSystemChange.emit(undefined);
		}else{
			this.selectedSystemChange.emit(system);
		}
	}

	createSystemHandler(){
		this.createSystem.emit(this.newSystem);
	}

	private newSystem:any;
}
