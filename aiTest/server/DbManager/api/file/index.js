
const Router = rootRequire('./util/Router.js');
const File = require('./File.model.js');
const ObjectID = require('mongodb').ObjectID


module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const db = app.mongo.db;
	File.setDefaultDb(db);
	return [
		{
			method: 'get',
			endPoint: '/',
			handler: function(req, res){
				return File.getAll(db)
					.then(function(files){
						const fileListJson = _.map(files, function(file){
							return file.json('public');
						});
						res.status(200).send(fileListJson);
					})
			}
		},
		{
			method: 'get',
			endPoint: '/:_id',
			handler: function(req, res){
				return new File({_id: req.params._id})
					.get()
					.then(function(file){
						res.status(200).send(file.json('public'));
					})
			}
		},
		{
			method: 'post',
			endPoint: '/',
			handler: function(req, res){
				return new File(req.body)
					.save()
					.then(function(file){
						res.status(200).send(file.json('public'));
					})
			}
		},
		{
			method: 'delete',
			endPoint: '/:_id',
			handler: function(req, res){
				return new File({_id: req.params._id})
					.delete()
					.then(function(file){
						res.status(200).send(file.json('public'));
					})
			}
		},
		{
			method: 'put',
			endPoint: '/:_id',
			handler: function(req, res){
				return new File(req.body)
					.update()
					.then(function(file){
						res.status(200).send(file.json('public'));
					})
			}
		},
	];
}

function getFile(req, res, next){
	const FileId = req.params.FileId
	return File.get({
		_id: new ObjectID(FileId)
	})
		.catch(function(err){
			res.status(400).send(err)
		})
		.then(function(File){
			req.File = File;
			next();
		})
}