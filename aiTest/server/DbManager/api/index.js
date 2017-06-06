const Router = rootRequire('./util/Router.js');
const fileRouter = require('./file.js');
const projectRouter = require('./project.js');
const systemRouter = require('./system.js');
const authRouter = require('./auth.js');
console.log(authRouter);
module.exports = new Router({
	getRoutes: function(app){
		return [
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
			{
				method: 'use',
				endPoint: '/system',
				handler: systemRouter.mount(app)
			},
			{
				method: 'use',
				endPoint: '/auth',
				handler: authRouter.mount(app)
			},
		];
	}
});
