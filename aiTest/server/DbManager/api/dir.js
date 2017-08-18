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
				const dirs = await Dir.findAll({
					where: req.query
				});
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
			method: 'post',
			endPoint: '/',
			handler: async function(req, res){
				const dir = await Dir.create(req.body);
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
			method: 'get',
			endPoint: '/:id/children',
			handler: async function(req, res){

				const dirs = await Dir.findAll({
					where: {
						parentId: req.params.id
					}
				});
				const files = await File.findAll({
					where: {
						parentId: req.params.id
					}
				});

				res.status(200).send({
					files: files,
					dirs: dirs,
				});
			}
		},
	];
}
