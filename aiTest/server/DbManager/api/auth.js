const Router = require('../../util/Router.js');
const passport = require('../services/passport.js')

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){

	return [
		{
			method: 'get',
			endPoint: '/google',
			handler: passport.authenticate('google', {scope : ['profile', 'email'] })
		},
		{
			method: 'get',
			endPoint: '/google/callback',
			handler: passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/'
            }),
		},

	];
}
