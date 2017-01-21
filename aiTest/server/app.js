
global._ = require('lodash');
global.rootRequire = function(path){
	return require(__dirname+'/'+path);
};
require.extensions['.txt'] = function(module, filename){
    module.exports = fs.readFileSync(filename, 'utf8');
};

const fs = require('fs');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;

const api = require('./api');
const Router = require('./Router.js');

class App extends Router{

	constructor(options){
		super(options);
		_.extend(this, options);
		_.defaults(this, {
			port: 10001,
			express: express(),
			mongo: {}
		});

		_.defaults(this.mongo, {
			domain: 'localhost',
			port: '27017',
			dbName: 'myproject',
			getUrl: function(){
				return `mongodb://${this.domain}:${this.port}/${this.dbName}`
			},
			db: undefined,
		});
	}

	init(){
		return this.connectMongo()
			.then((app, db)=>{
				this.strapMiddleware();
				this.mount(this, this.express);
				return this.serve();
			})
			.then(console.log)
			.catch(console.log);
	}

	connectMongo(){
		return new Promise((resolve, reject)=>{
			MongoClient.connect(this.mongo.getUrl(), (err, db)=>{
				if(err){
					return reject(err);
				}
				this.mongo.db = db;
				resolve(this, db);
			});
		});
	}

	strapMiddleware(){
	    this.express.use(bodyParser.urlencoded({extended:true}));
	    this.express.use(bodyParser.json());
	    this.express.use(cookieParser());
	    this.express.use(cors());
	}

	getRoutes(app){
		return [
			{
				method: 'use',
				endPoint: '/',
				handler: express.static('../client/dist')
			},
			{
				method: 'use',
				endPoint: '/api',
				handler: api.mount(app)
			}
		]
	}

	serve(port=this.port){
		return new Promise((res, rej)=>{
			const server = http.createServer(this.express);
			server.listen(port, (err, response)=>{
				if(err){
					rej(err)
				}else{
					res('listening on '+this.port, response);
				}
			})
		})
	}
}

new App().init();

