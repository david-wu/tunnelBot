/*
	DbManager provides a set of APIs to access the database
	It also serves the client
*/

// const MongoClient = require('mongodb').MongoClient
const api = require('./api')
const express = require('express')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

module.exports = function DbManager(dbManager={}){

	return _.defaults(dbManager, {

		express: express(),
		// mongo: {
		// 	db: undefined,
		// 	domain: 'localhost',
		// 	port: '27017',
		// 	dbName: 'myproject',
		// 	getUrl: function(){
		// 		return `mongodb://${this.domain}:${this.port}/${this.dbName}`
		// 	},
		// },

		async init(options){
			dbManager.models = await require('./models')
			// dbManager.mongo.db = await dbManager.getMongoConnection()
			dbManager.strapMiddleware()
			dbManager.mount(dbManager.express)
			options.server.on('request', dbManager.express)

			return dbManager;
		},

		// getMongoConnection(){
		// 	return new Promise((resolve, reject)=>{
		// 		MongoClient.connect(dbManager.mongo.getUrl(), function(err, db){
		// 			if(err){
		// 				reject(err)
		// 			}else{
		// 				resolve(db);
		// 			}
		// 		});
		// 	});
		// },

		strapMiddleware(){
		    dbManager.express.use(bodyParser.urlencoded({extended:true}));
		    dbManager.express.use(bodyParser.json());
		    dbManager.express.use(cookieParser());
		    dbManager.express.use(cors());
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
					handler: express.static('../client/dist')
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