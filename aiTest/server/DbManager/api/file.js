const Router = rootRequire('./util/Router.js');

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const models = app.models;
	const Project = models.Project;
	const File = models.File;
	const Dir = models.Dir;

	return [
		{
			method: 'get',
			endPoint: '/',
			handler: async function(req, res){
				const files = await File.findAll({
					where: req.query
				});
				res.status(200).send(files);
			}
		},
		{
			method: 'get',
			endPoint: '/:id',
			handler: async function(req, res){
				const file = await File.findOne({
					where: {
						id: req.params.id
					}
				});
				res.status(200).send(file);
			}
		},
		{
			method: 'post',
			endPoint: '/',
			handler: async function(req, res){
				const file = await File.create(req.body);
				res.status(200).send(file);
			}
		},
		{
			method: 'put',
			endPoint: '/:id',
			handler: async function(req, res){
				const file = await File.findOne({
					where: {
						id: req.params.id
					}
				});
				await file.update(req.body);
				res.status(200).send(file);
			}
		},
		{
			method: 'delete',
			endPoint: '/:id',
			handler: async function(req, res){
				const file = await File.findOne({
					where: {
						id: req.params.id
					}
				});
				await file.destroy();
				res.status(200).send(file);
			}
		},
	];
}
