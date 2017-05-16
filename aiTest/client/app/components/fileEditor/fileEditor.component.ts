import {Component, Input, Output, EventEmitter, ViewChild, Inject} from '@angular/core';
const _ = require('lodash');

@Component({
	selector: 'file-editor',
	template: require('./fileEditor.tpl.html'),
	styles: [``],
})
export class FileEditorComponent {

	@Input('selectedProject') selectedProject;

	constructor(
		@Inject('file') private fileService,
		@Inject('project') private projectService,
	){

	}

	ngOnInit(){
		// console.log(changes)
		// if(changes.selectedProject){
			if(this.selectedProject){
				this.getFiles(this.selectedProject)
			}else{
				this.getAllFiles();
			}
		// }
	}


	getAllFiles(){
		return this.fileService.get().toPromise()
			.then((response)=>{
				this.fileList = {
					items: response.json(),
				}
			});
	}

	getFiles(project){

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


// class File{
//     content = '';
//     access = 'private';
//     tags = [];

//     stringable(){
//         var clone = _.clone(this);
//         delete clone.parent;
//         delete clone.children;
//         return clone;
//     }

//     setContent(content){
//         if(this.content === content){return;}
//         this.content = content;
//         this.lastModified = Date.now();
//         this.updateTags();
//         this.parent.syncTo();
//     }

//     updateTags(){
//         this.tags = this.content.match(/#(\S+)/gm);
//     }

//     delete(){
//         this.parent.remove(this);
//         this.parent.syncTo();
//         console.log(this.parent)
//     }

//     private parent;
//     private lastModified
// }
