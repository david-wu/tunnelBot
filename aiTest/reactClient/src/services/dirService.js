// import/export makes it so you can't reference imports in debugger?
const request = require('request-promise-native')
const _ = require('lodash');
const fileService = require('./fileService.js');

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



module.exports = {
	factory: DirFactory,
}

function DirFactory(dir){
	return _.defaults(dir, {
		type: 'dir',

		get: function(){
			return request({
				method: 'GET',
				uri: `${uri}/${dir.id}`,
				json: true,
			})
				.then(DirFactory)
		},

		post: function(){
			return request({
				method: 'POST',
				uri: `${uri}`,
				body: dir.getFormData(),
				json: true,
			})
				.then(DirFactory)
		},

		put: function(){
			return request({
				method: 'PUT',
				uri: `${uri}/${dir.id}`,
				body: dir.getFormData(),
				json: true,
			})
				.then(DirFactory)
		},

		delete: function(){
			return request({
				method: 'DELETE',
				uri: `${uri}/${dir.id}`,
			})
		},

		findOne: function(){
			return request({
				method: 'GET',
				uri: uri,
				qs: dir.getFormData(),
				json: true,
			})
				.then(function(dirs){
					if(dirs.length){
						return DirFactory(dirs[0]);
					}
				})
		},

		getChildren: function(){
			return request({
				method: 'GET',
				uri: `${uri}/${dir.id}/children`,
				json: true,
			})
				.then(function(response){
					const dirs = _.map(response.dirs, DirFactory)
					const files = _.map(response.files, fileService.factory)
					return dirs.concat(files);
				})
		},

		getFormData: function(){
			return _.mapValues(apiKeyMap, function(key){
				return dir[key];
			});
		},

	})
}
