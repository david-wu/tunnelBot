const Router = rootRequire('./util/Router.js');
const userRouter = require('./user');
const fileRouter = require('./file');
const projectRouter = require('./project');

module.exports = new Router({
	getRoutes: function(app){
		return [
			{
				method: 'use',
				endPoint: '/user',
				handler: userRouter.mount(app)
			},
			{
				method: 'use',
				endPoint: '/file',
				handler: fileRouter.mount(app)
			},
			{
				method: 'use',
				endPoint: '/project',
				handler: projectRouter.mount(app)
			},
		];
	}
});
