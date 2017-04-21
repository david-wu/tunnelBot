const express = require('express');

module.exports = function Router(router){

	return _.defaults(router, {

		mount(app, parentRouter = express()){
			return _.reduce(router.getRoutes(app), function(router, route){
				return router[route.method](route.endPoint, route.handler)
			}, parentRouter)
		},

		// override
		getRoutes(app){
			return [];
		},

	})

}
