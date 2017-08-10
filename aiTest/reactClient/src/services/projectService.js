// import/export makes it so you can't reference imports in debugger?
const request = require('request-promise-native')
const _ = require('lodash');

const apiEndpoint = 'http://localhost:10001/api'
const uri = apiEndpoint + '/project';

const apiKeyMap = {
	'id': 'id',
	'description': 'description',
	'name': 'name',
}

module.exports = {
	factory: ProjectFactory,
	getAll: function(){
		return request({
			method: 'GET',
			uri: uri,
		})
			.then(function(projectData){
				return JSON.parse(projectData).map(ProjectFactory);
			})
	}
}

function ProjectFactory(project){

	return _.defaults(project, {

		get: function(){
			return request({
				method: 'GET',
				uri: `${uri}/${project.id}`,
			})
				.then(ProjectFactory)
		},

		post: function(){
			return request({
				method: 'POST',
				uri: `${uri}`,
				body: project.getFormData(),
				json: true,
			})
		},

		put: function(){
			return request({
				method: 'PUT',
				uri: `${uri}/${project.id}`,
				body: project.getFormData(),
				json: true,
			})
		},

		delete: function(){
			return request({
				method: 'DELETE',
				uri: `${uri}/${project.id}`,
			})
		},

		getFormData: function(){
			return _.mapValues(apiKeyMap, function(key){
				return project[key];
			});
		},

	})
}
