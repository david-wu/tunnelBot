
const Router = rootRequire('./Router.js');
const Post = require('./Post.js');

module.exports = new Router({
	getRoutes: getRoutes
})


function getRoutes(app){
	const db = app.mongo.db;
	Post.setDefaultDb(db);
	return [
		{
			method: 'get',
			endPoint: '/',
			handler: function(req, res){
				const userId = req.params.userId
				return Post.getAll(db, {
					userId: userId
				})
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
				const userId = req.params.userId
				const post = new Post({
					userId: userId,
					content: 'asdf',
					name: Math.random(),
				});

				post.save()
					.then(function(post){
						res.status(200).send(post.json('public'));
					})
			}
		},
	];
}
