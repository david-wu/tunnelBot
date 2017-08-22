import { observable } from 'mobx';
// import/export makes it so you can't reference imports in debugger?
const request = require('request-promise-native')
const _ = require('lodash');

const apiEndpoint = 'http://localhost:10001/api'
const uri = apiEndpoint + '/file';


const apiKeyMap = {
	id: 'id',
	name: 'name',
	userId: 'userId',
	isRoot: 'isRoot',
	parentId: 'parentId',
	content: 'content',
	path: 'path',
}

// export default function File.factory(file){
// 	return new File(file);
// }

export default class File{

	static factory(file){
		return new File(file);
	}

	@observable name
	@observable content
	@observable focused

	constructor(file){
		_.defaults(this, file, {
			type: 'file'
		})
	}

	get(){
		return request({
			method: 'GET',
			uri: `${uri}/${this.id}`,
			json: true,
		})
			.then(File.factory)
	}

	post(){
		return request({
			method: 'POST',
			url: `${uri}`,
			body: this.getFormData(),
			json: true,
		})
			.then(File.factory)
	}

	put(){
		return request({
			method: 'PUT',
			uri: `${uri}/${this.id}`,
			body: this.getFormData(),
			json: true,
		})
			.then(File.factory)
	}

	delete(){
		return request({
			method: 'DELETE',
			uri: `${uri}/${this.id}`,
		})
	}

	getFormData(){
		return _.mapValues(apiKeyMap, (key)=>{
			return this[key];
		});
	}
}
