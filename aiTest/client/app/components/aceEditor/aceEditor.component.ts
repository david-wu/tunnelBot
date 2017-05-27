import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
const _ = require('lodash');
const $ = require('jquery');
declare const ace:any;

@Component({
	selector: 'ace-editor',
	template: require('./aceEditor.tpl.html'),
	styles: [require('./aceEditor.scss')],
})
export class AceEditorComponent {

	@Input('selectedFile') selectedFile
	@Output() selectedFileContentChange = new EventEmitter()

	constructor(
		elementRef: ElementRef,
	){
		const context = elementRef.nativeElement
	    this.aceEditor = ace.edit(context)

	    this.aceEditor.$blockScrolling = Infinity;
	    this.aceEditor.setOptions({
	        theme: 'ace/theme/monokai',
	        maxLines: Infinity,
	        showGutter: true,
	        showPrintMargin: false,
	    })

	    var editSession = this.aceEditor.getSession()
	    editSession.setMode('ace/mode/javascript')
	    editSession.on('change', ()=>{
        	this.selectedFile.content = this.aceEditor.getValue()
        	this.selectedFileContentChange.emit(this.selectedFile)
	    });
	}

	ngOnChanges(change){
		// this.aceEditor.resize(true);
		if(change.selectedFile){
            this.aceEditor.setValue(change.selectedFile.currentValue.content || '')
            this.aceEditor.clearSelection()
		}
	}

	private title:string;
	private files:any;
	private errors:any;
	private currentTerminal:any;
	private cpTypes:any;
	private socket:any;
	private terminalContainerEl:any;
	private aceEditor: any;
    private fileList;

}
