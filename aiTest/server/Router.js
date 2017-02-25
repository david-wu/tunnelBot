const express = require('express');

function Router(router){
	_.defaults(router, {

		// Returns an express router
		mount(app, parentRouter = express()){
			return _.reduce(router.getRoutes(app), function(router, route){
				return router[route.method](route.endPoint, route.handler)
			}, parentRouter)
		},

		// overwride router
		getRoutes(app){
			return [];
		},

	})

	return router;
}

module.exports = Router;