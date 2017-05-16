import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
  selector: 'app',
  template: require('./app.tpl.html'),
})
export class AppComponent{
	cpType = 'ruby';

	constructor(
		@Inject('file') private fileService,
		@Inject('project') private projectService,
	){
		this.getProjects()
		this.getAllFiles()
	}

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
			fileIds: ['58f9438a01ff2f49a31922ca', '58f94a4001ff2f49a31922d4'],
			// TODO
			// fileIds: [],
		})
		return this.projectService.save(project).toPromise()
			.then(this.getProjects.bind(this))
	}

	onUpdateProject(project){
		return this.fileService.update(project).toPromise()
	}

	onDeleteProject(project){
		return this.projectService.delete(project._id).toPromise()
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

		return this.projectService.getFiles(project._id).toPromise()
		// return this.fileService.get().toPromise()
			.then((response)=>{
				this.fileList = {
					items: response.json(),
				}
			});
	}

	onCreateFile(file){
		_.defaults(file, {
			title: 'default title',
			name: 'default name',
			content: 'default content',
			projectId: this.selectedProject._id
		})
		return this.fileService.save(file).toPromise()
			.then(this.getFiles.bind(this))
	}

	onUpdateFile(file){
		return this.fileService.update(file).toPromise()
			// .then(this.getFiles.bind(this))
	}

	onDeleteFile(file){
		return this.fileService.delete(file._id).toPromise()
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
