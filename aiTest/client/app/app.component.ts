import {Component, Input, Output, EventEmitter, Inject, ViewEncapsulation} from '@angular/core';
const _ = require('lodash');

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'app',
	template: require('./app.tpl.html'),
	styles: [require('./app.scss')]
})
export class AppComponent{

	constructor(
		@Inject('system') private systemService,
		@Inject('project') private projectService,
		@Inject('fileService') private fileService,
	){
		this.getSystems()
		this.getProjects()
		this.getAllFiles()
		_.defaults(this, {
			selectionState: {
				system: undefined,
				project: undefined,
				file: undefined
			}
		})
	}

	getSystems(){
		this.systemService.get().toPromise()
			.then((response)=>{
				this.systemList = {
					items: response.json()
				}
			})
	}

	onCreateSystem(system){
		_.defaults(system, {
			name: 'default system name',
			description: 'default system desc',
			mappingsJson: [
				{
					test: 'yes'
				}
			]
		});
		return this.systemService.save(system).toPromise()
			.then(this.getSystems.bind(this));
	}

	onUpdateSystem(system){
		return this.systemService.update(system).toPromise()
	}

	onDeleteSystem(system){
		return this.systemService.delete(system.id).toPromise()
			.then(()=>{
				if(system === this.selectedSystem){
					this.selectedSystem = undefined
				}
			})
			.then(this.getSystems.bind(this))
	}

	onSelectSystem(system){
		this.selectedSystem = system;
	}

	private selectedSystem;
    private systemList;


	getProjects(){
		return this.projectService.get().toPromise()
			.then((response)=>{
				this.projectList = {
					items: response.json()
				}
			})
	}

	onCreateProject(project){
		_.defaults(project, {
			name: 'default project name',
			description: 'default project description'
		})
		return this.projectService.save(project).toPromise()
			.then(this.getProjects.bind(this))
	}

	onUpdateProject(project){
		return this.projectService.update(project).toPromise()
	}

	onDeleteProject(project){
		return this.projectService.delete(project.id).toPromise()
			.then(()=>{
				if(project === this.selectedProject){
					this.selectedProject = undefined
				}
			})
			.then(this.getProjects.bind(this))
	}

    onSelectProject(project){
    	this.selectedProject = project
    	if(!project){
    		this.getAllFiles()
    	}else{
    		this.getFiles(project)
    	}
    }

    private selectedProject;
    private projectList;

	getAllFiles(){
		return this.fileService.get().toPromise()
			.then((response)=>{
				this.fileList = {
					items: response.json(),
				}
			});
	}

	getFiles(project){
		if(!project){
			return this.getAllFiles();
		}

		return this.projectService.getFiles(project.id).toPromise()
			.then((response)=>{
				project.fileList = {
					items: response.json(),
				}
				this.fileList = project.fileList
			});
	}

	onCreateFile(file){
		var parentProject = this.selectedProject
		if(!parentProject || !parentProject.id){
			throw 'need a parent project';
		}
		_.defaults(file, {
			title: '',
			name: '',
			content: '',
			projectIds: [parentProject.id]
		})
		return this.fileService.save(file).toPromise()
			.then((response)=>{
				const savedFile = response.json();
				parentProject.fileList.items.push(savedFile);
				this.selectedFile = savedFile;
			})
	}

	onUpdateFile(file){
		return this.fileService.update(file).toPromise()
			.then(function(res){
				return _.extend(file, res.json());
			})
	}

	onDeleteFile(file){
		return this.fileService.delete(file.id).toPromise()
			.then(()=>{
				if(file === this.selectedFile){
					this.selectedFile = undefined;
				}
			})
			.then(this.getFiles.bind(this))
	}

    private selectedFile;
    private fileList;
}
