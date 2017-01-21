const express = require('express');

class Router{

	// Each instance overwrites getRoutes
	constructor(options){
		_.extend(this, options)
	}

	// Returns an express router
	mount(app, parentRouter = express()){
		return _.reduce(this.getRoutes(app), function(router, route){
			return router[route.method](route.endPoint, route.handler)
		}, parentRouter)
	}

	getRoutes(app){
		return [];
	}

}

module.exports = Router;