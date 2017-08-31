const _ = require('lodash');
const Router = rootRequire('./util/Router.js');

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const models = app.models;
	const Dir = models.Dir;
	const File = models.File;
console.log('emitter', app.dbEmitter)

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
		{
			method: 'get',
			endPoint: '/:id/filesDeep',
			handler: async function(req, res){
				const deepFiles = await getFilesDeep(req.params.id);
				res.status(200).send({
					files: deepFiles,
				});
			}
		},

		{
			method: 'post',
			endPoint: '/',
			handler: async function(req, res){
				const dir = await Dir.create(req.body);


				if(req.body.parentId){
					app.dbEmitter.emit({
						type: 'dir',
						id: req.body.parentId,
						eventName: 'addChild'
					}, req.body)
				}


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


				if(dir.name !== req.body.name){
					app.dbEmitter.emit({
						type: 'dir',
						id: dir.id,
						eventName: 'changeName'
					}, req.body.name)
				}
				if(dir.description !== req.body.description){
					app.dbEmitter.emit({
						type: 'dir',
						id: dir.id,
						eventName: 'changeDescription'
					}, req.body.description)
				}


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


				app.dbEmitter.emit({
					type: 'dir',
					id: dir.id,
					eventName: 'destroy'
				}, true)
				if(dir.parentId){
					app.dbEmitter.emit({
						type: 'dir',
						id: dir.parentId,
						eventName: 'removeChild'
					}, dir.id)
				}


				await dir.destroy();
				res.status(200).send(dir);
			}
		},
	];

	// SHOWCASE: async await
	async function getFilesDeep(parentId, path=[]){

		const dirs = await Dir.findAll({
			where: {
				parentId: parentId
			}
		})

		const files = await File.findAll({
			where: {
				parentId: parentId
			}
		})
		_.each(files, function(file){
			file.path = path.join('/')
		})

		const deepFiles = await Promise.all(_.map(dirs, function(dir){
			return getFilesDeep(dir.id, path.concat([dir.name]));
		}))

		return files.concat(_.flatten(deepFiles));
	}
}
