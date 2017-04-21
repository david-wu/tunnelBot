import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
const Io = require('socket.io-client');
const _ = require('lodash');
const $ = require('jquery');
declare const ace:any;

@Component({
	selector: 'file-viewer',
	template: require('./fileViewer.tpl.html'),
	styles: [`
		:host{
			display: block;
			width: 100%;
			height: 250px;
		}
	`],
})
export class FileViewerComponent {

	@Input('selectedFile') selectedFile;
	@Output() deleteFile = new EventEmitter();
	@Output() updateFile = new EventEmitter();

	constructor(
		@Inject('file') private fileService,
	){

		setInterval(()=>{
			this.updateFile.emit(this.selectedFile)
		}, 1000)

		// Todo, ace editor should accept text
		// call this debounced update in ngOnChange
		this.debouncedUpdateFile = _.debounce(this.updateFile.emit, 1000);

	}


    private fileList;
    private debouncedUpdateFile

}
