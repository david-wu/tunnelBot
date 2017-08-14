const Router = rootRequire('./util/Router.js');
const fileRouter = require('./file.js');
const dirRouter = require('./dir.js');
const systemRouter = require('./system.js');
const authRouter = require('./auth.js');

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
				endPoint: '/dir',
				handler: dirRouter.mount(app)
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
