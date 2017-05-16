import {Component, Input, Output, EventEmitter, ViewChild, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'project-editor',
	template: require('./projectEditor.tpl.html'),
	styles: [``],
})
export class ProjectEditorComponent {

	constructor(
		@Inject('file') private fileService,
		@Inject('project') private projectService,
	){
		this.getProjects()
		// this.getFiles();
		// console.log('projectService', this.projectService)
		// const fakeProject = {
		// 	name: 'myProj'
		// 	fileIds: [
		// 		'58f9438a01ff2f49a31922ca',
		// 		'58f94a4001ff2f49a31922d4',
		// 		'590b6ec51d420891bf53ca32'
		// 	]
		// }
		// this.projectService.save(fakeProject).toPromise()
		// 	.then(console.log)
		// 	.catch(function(err){
		// 		console.log('err', err)
		// 	})
	}

	getProjects(){
		return this.projectService.get().toPromise()
			.then((response)=>{
				this.projectList = {
					items: response.json()
				}
			})
	}

	// getFiles(){
	// 	return this.fileService.get().toPromise()
	// 		.then((response)=>{
	// 			this.fileList = {
	// 				items: response.json(),
	// 			}
	// 		});
	// }

	onCreateProject(project){
		_.defaults(project, {
			name: 'default project name',
			fileIds: []
		})
		return this.projectService.save(project).toPromise()
			.then(this.getProjects.bind(this))
	}

	// onCreateFile(file){
	// 	_.defaults(file, {
	// 		title: 'default title',
	// 		name: 'default name',
	// 		content: 'default content'
	// 	})
	// 	return this.fileService.save(file).toPromise()
	// 		.then(this.getFiles.bind(this))
	// }

	onUpdateProject(project){
		return this.fileService.update(project).toPromise()
	}
	// onUpdateFile(file){
	// 	return this.fileService.update(file).toPromise()
	// 		// .then(this.getFiles.bind(this))
	// }

	onDeleteProject(project){
		return this.projectService.delete(project._id).toPromise()
			.then(()=>{
				if(project === this.selectedProject){
					this.selectedProject = undefined
				}
			})
			.then(this.getProjects.bind(this))
	}
	// onDeleteFile(file){
	// 	return this.fileService.delete(file._id).toPromise()
	// 		.then(()=>{
	// 			if(file === this.selectedFile){
	// 				this.selectedFile = undefined;
	// 			}
	// 		})
	// 		.then(this.getFiles.bind(this))
	// }

    private selectedProject;
    private projectList;

}
