import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'file-list-viewer',
	template: require('./fileListViewer.tpl.html'),
	styles: [require('./fileListViewer.scss')],
})
export class FileListViewerComponent {

	@Input() fileList:any;
	@Input() selectedFile:any;
	@Output() selectedFileChange = new EventEmitter();
	@Output() createFile = new EventEmitter();

	constructor(){
		this.newFile = {};
	}

	onFileSelect(file){
		if(this.selectedFile === file){
			this.selectedFileChange.emit(undefined);
		}else{
			this.selectedFileChange.emit(file);
		}
	}

	createFileHandler(){
		this.createFile.emit(this.newFile);
		this.newFile = {};
	}

	private newFile:any;
}
