import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
const Io = require('socket.io-client');
const _ = require('lodash');
const $ = require('jquery');
declare const ace:any;

@Component({
	selector: 'project-viewer',
	template: require('./projectViewer.tpl.html'),
	styles: [require('./projectViewer.scss')],
})
export class ProjectViewerComponent {

	@Input('selectedProject') selectedProject;
	@Output() deleteProject = new EventEmitter();
	@Output() updateProject = new EventEmitter();

	constructor(
		@Inject('project') private projectService,
	){
		this.cpType = 'ruby';
		this.debouncedUpdateProject = _.debounce(this.updateProject.emit.bind(this.updateProject), 200);
	}

	// onProjectContentChange(){
	// 	this.debouncedUpdateProject(this.selectedProject)
	// }

    private projectList
    private debouncedUpdateProject
    private cpType:string

}