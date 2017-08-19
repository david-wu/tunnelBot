import { observable } from 'mobx';
import File from './fileService.js';
// import/export makes it so you can't reference imports in debugger?
const request = require('request-promise-native')
const _ = require('lodash');
// const fileService = require('./fileService.js');

const apiEndpoint = 'http://localhost:10001/api'
const uri = apiEndpoint + '/dir';

const apiKeyMap = {
	id: 'id',
	name: 'name',
	userId: 'userId',
	isRoot: 'isRoot',
	parentId: 'parentId',
	description: 'description',
}



export default class Dir{

	static factory(dir){
		return new Dir(dir);
	}

	@observable name
	@observable children

	constructor(dir){
		_.defaults(this, dir, {
			name: '',
			children: [],
			type: 'dir',
		})
	}

	get(){
		return request({
			method: 'GET',
			uri: `${uri}/${this.id}`,
			json: true,
		})
			.then(Dir.factory)
	}

	post(){
		return request({
			method: 'POST',
			uri: `${uri}`,
			body: this.getFormData(),
			json: true,
		})
			.then(Dir.factory)
	}

	put(){
		return request({
			method: 'PUT',
			uri: `${uri}/${this.id}`,
			body: this.getFormData(),
			json: true,
		})
			.then(Dir.factory)
	}

	delete(){
		return request({
			method: 'DELETE',
			uri: `${uri}/${this.id}`,
		})
	}

	findOne(){
		return request({
			method: 'GET',
			uri: uri,
			qs: this.getFormData(),
			json: true,
		})
			.then(function(dirs){
				if(dirs.length){
					return Dir.factory(dirs[0]);
				}
			})
	}

	getChildren(){
		return request({
			method: 'GET',
			uri: `${uri}/${this.id}/children`,
			json: true,
		})
			.then(function(response){
				const dirs = _.map(response.dirs, Dir.factory)
				const files = _.map(response.files, File.factory)
				return dirs.concat(files);
			})
			.then((children)=>{
				this.children.length = 0;
				this.children.push.apply(this.children, children);
				this.children;
			})
	}

	getFormData(){
		return _.mapValues(apiKeyMap, (key)=>{
			return this[key];
		});
	}

	// })
}
