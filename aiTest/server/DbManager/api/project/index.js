
const Router = rootRequire('./util/Router.js');
const Project = require('./Project.model.js');
// const ObjectID = require('mongodb').ObjectID


module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const db = app.mongo.db;
	Project.setDefaultDb(db);
	return [
		{
			method: 'get',
			endPoint: '/',
			handler: function(req, res){
				return Project.getAll(db)
					.then(function(projects){
						const projectListJson = _.map(projects, function(project){
							return project.json('public');
						});
						res.status(200).send(projectListJson);
					})
			}
		},
		{
			method: 'get',
			endPoint: '/:_id',
			handler: function(req, res){
				return new Project({_id: req.params._id})
					.get()
					.then(function(project){
						res.status(200).send(project.json('public'));
					})
			}
		},
		{
			method: 'get',
			endPoint: '/:_id/files',
			handler: function(req, res){
				return new Project({_id: req.params._id})
					.getFiles()
					.then(function(files){
						const data = _.map(files, function(file){
							return file.json('public');
						});
						res.status(200).send(data);
					})
			}
		},
		{
			method: 'post',
			endPoint: '/',
			handler: function(req, res){
				return new Project(req.body)
					.save()
					.then(function(project){
						res.status(200).send(project.json('public'));
					})
			}
		},
		{
			method: 'delete',
			endPoint: '/:_id',
			handler: function(req, res){
				return new Project({_id: req.params._id})
					.delete()
					.then(function(project){
						res.status(200).send(project.json('public'));
					})
			}
		},
		{
			method: 'put',
			endPoint: '/:_id',
			handler: function(req, res){
				return new Project(req.body)
					.update()
					.then(function(project){
						res.status(200).send(project.json('public'));
					})
			}
		},
	];
}

// function getFile(req, res, next){
// 	const FileId = req.params.FileId
// 	return File.get({
// 		_id: new ObjectID(FileId)
// 	})
// 		.catch(function(err){
// 			res.status(400).send(err)
// 		})
// 		.then(function(File){
// 			req.File = File;
// 			next();
// 		})
// }