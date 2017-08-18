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


module.exports = {
	factory: FileFactory,
}

function FileFactory(file){
	return _.defaults(file, {
		type: 'file',

		get: function(){
			return request({
				method: 'GET',
				uri: `${uri}/${file.id}`,
				json: true,
			})
				.then(FileFactory)
		},

		post: function(){
			return request({
				method: 'POST',
				url: `${uri}`,
				body: file.getFormData(),
				json: true,
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
