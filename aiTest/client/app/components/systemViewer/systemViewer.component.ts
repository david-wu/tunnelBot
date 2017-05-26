import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'system-viewer',
	template: require('./systemViewer.tpl.html'),
	styles: [`
	`],
})
export class SystemViewerComponent {

	@Input('selectedSystem') selectedSystem;
	@Output() deleteSystem = new EventEmitter();
	@Output() updateSystem = new EventEmitter();

	constructor(
		@Inject('system') private systemService,
	){
		this.debouncedUpdateSystem = _.debounce(this.updateSystem.emit.bind(this.updateSystem), 200);
	}

	// onSystemContentChange(){
	// 	this.debouncedUpdateSystem(this.selectedSystem)
	// }

    private systemList
    private debouncedUpdateSystem
    private cpType:string

}
