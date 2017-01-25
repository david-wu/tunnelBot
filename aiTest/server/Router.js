const express = require('express');

class Router{

	constructor(options){
		_.extend(this, options)
	}

	// Returns an express router
	mount(app, parentRouter = express()){
		return _.reduce(this.getRoutes(app), function(router, route){
			return router[route.method](route.endPoint, route.handler)
		}, parentRouter)
	}

	// overwride this
	getRoutes(app){
		return [];
	}

}

module.exports = Router;