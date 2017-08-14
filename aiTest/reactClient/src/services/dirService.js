// import/export makes it so you can't reference imports in debugger?
const request = require('request-promise-native')
const _ = require('lodash');

const apiEndpoint = 'http://localhost:10001/api'
const uri = apiEndpoint + '/dir';

const apiKeyMap = {
	'id': 'id',
	'description': 'description',
	'name': 'name',
}

module.exports = {
	factory: DirFactory,
	getAll: function(){
		return request({
			method: 'GET',
			uri: uri,
		})
			.then(function(dirData){
				return JSON.parse(dirData).map(DirFactory);
			})
	}
}

function DirFactory(dir){

	return _.defaults(dir, {

		get: function(){
			return request({
				method: 'GET',
				uri: `${uri}/${dir.id}`,
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

		getFormData: function(){
			return _.mapValues(apiKeyMap, function(key){
				return dir[key];
			});
		},

	})
}
