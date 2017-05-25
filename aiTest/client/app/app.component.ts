import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
  selector: 'app',
  template: require('./app.tpl.html'),
})
export class AppComponent{

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
