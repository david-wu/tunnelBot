
const Router = rootRequire('./util/Router.js');
const User = require('./User.js');
const post = require('./post')

module.exports = new Router({
	getRoutes: getRoutes
})

function getRoutes(app){
	const db = app.mongo.db;
	User.setDefaultDb(db);
	return [
		{
			method: 'use',
			endPoint: '/:userId/posts',
			handler: [
				getUser,
				post.mount(app)
			]
		},
		{
			method: 'get',
			endPoint: '/',
			handler: function(req, res){
				return User.getAll(db)
					.then(function(users){
						const userData = _.map(users, function(user){
							return user.json('public');
						});
						res.status(200).send(userData);
					})
			}
		},
		{
			method: 'post',
			endPoint: '/',
			handler: function(req, res){
				const user = new User({
					name: Math.random(),
				});

				user.save()
					.then(function(user){
						res.status(200).send(user.json('public'));
					})
			}
		},
	];
}

const ObjectID = require('mongodb').ObjectID

function getUser(req, res, next){
	const userId = req.params.userId
	return User.get({
		_id: new ObjectID(userId)
	})
		.catch(function(err){
			res.status(400).send(err)
		})
		.then(function(user){
			req.user = user;
			next();
		})
}