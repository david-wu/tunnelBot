const Router = rootRequire('./util/Router.js');

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const models = app.models;
	const Dir = models.Dir;
	const File = models.File;

	return [
		{
			method: 'get',
			endPoint: '/',
			handler: async function(req, res){
				const dirs = await Dir.findAll();
				res.status(200).send(dirs);
			}
		},
		{
			method: 'get',
			endPoint: '/:id',
			handler: async function(req, res){
				const dir = await Dir.findOne({
					where: {
						id: req.params.id
					}
				});
				res.status(200).send(dir);
			}
		},
		{
			method: 'get',
			endPoint: '/:id/files',
			handler: async function(req, res){
				const dir = await Dir.findOne({
					where: {
						id: req.params.id
					}
				});
				const files = await dir.getFiles();
				res.status(200).send(files);
			}
		},
		{
			method: 'post',
			endPoint: '/',
			handler: async function(req, res){
				const dir = await Dir.create(req.body);
				if(req.body.fileIds){
					dir.addFiles(req.body.fileIds);
				}
				res.status(200).send(dir);
			}
		},
		{
			method: 'post',
			endPoint: '/:id/linkFiles',
			handler: async function(req, res){
				const dir = await Dir.findOne({
					where: {
						id: req.params.id
					}
				});
				var fileIds = req.params.fileIds
				await dir.addFiles(fileIds);
				res.status(200).send(dir);
			}
		},
		{
			method: 'delete',
			endPoint: '/:id',
			handler: async function(req, res){
				const dir = await Dir.findOne({
					where: {
						id: req.params.id
					}
				});
				await dir.destroy();
				res.status(200).send(dir);
			}
		},
		{
			method: 'put',
			endPoint: '/:id',
			handler: async function(req, res){
				const dir = await Dir.findOne({
					where: {
						id: req.params.id
					}
				});
				await dir.update(req.body);
				res.status(200).send(dir);
			}
		},
	];
}
