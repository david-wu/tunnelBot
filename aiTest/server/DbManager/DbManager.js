/*
	DbManager provides a set of APIs to access the database
	It also serves the client
*/

const api = require('./api')
const express = require('express')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')
// const passport = require('./services/passport.js')

module.exports = function DbManager(dbManager={}){

	return _.defaults(dbManager, {

		express: express(),

		async init(options){
			_.defaults(dbManager, options);

			dbManager.models = await require('./models')
			dbManager.strapMiddleware()
			dbManager.mount(dbManager.express)
			options.server.on('request', dbManager.express)

			return dbManager;
		},

		strapMiddleware(){
		    dbManager.express.use(bodyParser.urlencoded({extended:true}));
		    dbManager.express.use(bodyParser.json());
		    dbManager.express.use(cookieParser());
		    dbManager.express.use(cors());
			dbManager.express.use(session({
				secret: 'keyboard cat',
				resave: true,
				saveUninitialized: true
			}));
			// dbManager.express.use(passport.initialize());
			// dbManager.express.use(passport.session());

		},

		mount(parentRouter = express()){
			return _.reduce(dbManager.getApiRoutes(dbManager), function(router, route){
				return router[route.method](route.endPoint, route.handler)
			}, parentRouter)
		},

		getApiRoutes(dbManager){
			return [
				{
					method: 'use',
					endPoint: '/',
					handler: express.static('../my-app/build')
				},
				{
					method: 'use',
					endPoint: '/api',
					handler: api.mount(dbManager)
				}
			]
		},

	})


}