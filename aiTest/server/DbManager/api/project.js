const Router = rootRequire('./util/Router.js');

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const models = app.models;
	const Project = models.Project;
	const File = models.File;

	return [
		{
			method: 'get',
			endPoint: '/',
			handler: async function(req, res){
				const projects = await Project.findAll();
				res.status(200).send(projects);
			}
		},
		{
			method: 'get',
			endPoint: '/:id',
			handler: async function(req, res){
				const project = await Project.findOne({
					where: {
						id: req.params.id
					}
				});
				res.status(200).send(project);
			}
		},
		{
			method: 'get',
			endPoint: '/:id/files',
			handler: async function(req, res){
				const project = await Project.findOne({
					where: {
						id: req.params.id
					}
				});
				const files = await project.getFiles();
				res.status(200).send(files);
			}
		},
		{
			method: 'post',
			endPoint: '/',
			handler: async function(req, res){
				const project = await Project.create(req.body);
				if(req.body.fileIds){
					project.addFiles(req.body.fileIds);
				}
				res.status(200).send(project);
			}
		},
		{
			method: 'post',
			endPoint: '/:id/linkFiles',
			handler: async function(req, res){
				const project = await Project.findOne({
					where: {
						id: req.params.id
					}
				});
				var fileIds = req.params.fileIds
				await project.addFiles(fileIds);
				res.status(200).send(project);
			}
		},
		{
			method: 'delete',
			endPoint: '/:id',
			handler: async function(req, res){
				const project = await Project.findOne({
					where: {
						id: req.params.id
					}
				});
				await project.destroy();
				res.status(200).send(project);
			}
		},
		{
			method: 'put',
			endPoint: '/:id',
			handler: async function(req, res){
				const project = await Project.findOne({
					where: {
						id: req.params.id
					}
				});
				await project.update(req.body);
				res.status(200).send(project);
			}
		},
	];
}
