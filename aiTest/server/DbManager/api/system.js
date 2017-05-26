const Router = rootRequire('./util/Router.js');

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const models = app.models;
	// const Project = models.Project;
	// const File = models.File;
	const System = models.System;

	return [
		{
			method: 'get',
			endPoint: '/',
			handler: async function(req, res){
				const systems = await System.findAll();
				res.status(200).send(systems);
			}
		},
		{
			method: 'get',
			endPoint: '/:id',
			handler: async function(req, res){
				const system = await System.findOne({
					where: {
						id: req.params.id
					}
				});
				res.status(200).send(system);
			}
		},
		// {
		// 	method: 'get',
		// 	endPoint: '/:id/projects',
		// 	handler: async function(req, res){
		// 		const system = await System.findOne({
		// 			where: {
		// 				id: req.params.id
		// 			}
		// 		});
		// 		const projects = await system.getFiles();
		// 		res.status(200).send(files);
		// 	}
		// },
		{
			method: 'post',
			endPoint: '/',
			handler: async function(req, res){
				const system = await System.create(req.body);
				res.status(200).send(system);
			}
		},
		// {
		// 	method: 'post',
		// 	endPoint: '/:id/linkFiles',
		// 	handler: async function(req, res){
		// 		const project = await Project.findOne({
		// 			where: {
		// 				id: req.params.id
		// 			}
		// 		});
		// 		var fileIds = req.params.fileIds
		// 		await project.addFiles(fileIds);
		// 		res.status(200).send(project);
		// 	}
		// },
		{
			method: 'delete',
			endPoint: '/:id',
			handler: async function(req, res){
				const system = await System.findOne({
					where: {
						id: req.params.id
					}
				});
				await system.destroy();
				res.status(200).send(system);
			}
		},
		{
			method: 'put',
			endPoint: '/:id',
			handler: async function(req, res){
				const system = await System.findOne({
					where: {
						id: req.params.id
					}
				});
				await system.update(req.body);
				res.status(200).send(system);
			}
		},
	];
}
