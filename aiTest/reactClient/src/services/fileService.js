// import/export makes it so you can't reference imports in debugger?
const request = require('request-promise-native')
const _ = require('lodash');

const apiEndpoint = 'http://localhost:10001/api'
const uri = apiEndpoint + '/file';

const apiKeyMap = {
	'content': 'content',
	'id': 'id',
	'name': 'name',
	'path': 'path',
	'dirIds': 'dirIds',
}

module.exports = {
	factory: FileFactory,
	getAll: function(params){
		return request({
			method: 'GET',
			uri: uri,
			qs: params
		})
			.then(function(fileData){
				return JSON.parse(fileData).map(FileFactory);
			})
	}
}

function FileFactory(file){

	return _.defaults(file, {

		get: function(){
			return request({
				method: 'GET',
				uri: `${uri}/${file.id}`,
			})
				.then(FileFactory)
		},

		post: function(){
			return request({
				method: 'POST',
				url: `${uri}`,
				// body: JSON.stringify(file.getFormData()),
				json: file.getFormData(),
			})
				.then(FileFactory)
		},

		put: function(){
			return request({
				method: 'PUT',
				uri: `${uri}/${file.id}`,
				body: file.getFormData(),
				json: true,
			})
				.then(FileFactory)
		},

		delete: function(){
			return request({
				method: 'DELETE',
				uri: `${uri}/${file.id}`,
			})
		},

		getFormData: function(){
			return _.mapValues(apiKeyMap, function(key){
				return file[key];
			});
		},

	})
}
