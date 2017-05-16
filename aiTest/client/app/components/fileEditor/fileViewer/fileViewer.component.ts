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
		this.debouncedUpdateFile = _.debounce(this.updateFile.emit.bind(this.updateFile), 300);
	}

	onFileContentChange(){
		this.debouncedUpdateFile(this.selectedFile)
	}

    private fileList;
    private debouncedUpdateFile

}
