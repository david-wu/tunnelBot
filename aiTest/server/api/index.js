const Router = rootRequire('./Router.js');
const user = require('./user');

module.exports = new Router({
	getRoutes: function(app){
		return [
			{
				method: 'use',
				endPoint: '/user',
				handler: user.mount(app)
			},
		];
	}
});
