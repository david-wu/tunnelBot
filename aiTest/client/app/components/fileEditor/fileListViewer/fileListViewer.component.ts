import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'file-list-viewer',
	template: require('./fileListViewer.tpl.html'),
	styles: [``],
})
export class FileListViewerComponent {

	@Input() fileList:any;
	@Input() selectedFile:any;
	@Output() selectedFileChange = new EventEmitter();
	@Output() createFile = new EventEmitter();

	constructor(
		@Inject('file') private fileService,
	){
		this.newFile = {};
	}

	onFileSelect(file){
		this.selectedFileChange.emit(file);
	}

	createFileHandler(){
		this.createFile.emit(this.newFile);
	}

	private newFile:any;
}
