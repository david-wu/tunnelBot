import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'project-list-viewer',
	template: require('./projectListViewer.tpl.html'),
	styles: [require('./projectListViewer.scss')],
})
export class ProjectListViewerComponent {

	@Input() projectList:any;
	@Input() selectedProject:any;
	@Output() selectedProjectChange = new EventEmitter();
	@Output() createProject = new EventEmitter();

	constructor(
		@Inject('project') private projectService,
	){
		this.newProject = {};
	}

	onProjectSelect(project){
		if(this.selectedProject===project){
			this.selectedProjectChange.emit(undefined);
		}else{
			this.selectedProjectChange.emit(project);
		}
	}

	createProjectHandler(){
		this.createProject.emit(this.newProject);
	}

	private newProject:any;
}
