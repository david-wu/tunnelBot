
// consider just using a singleton
let defaultDb;

class User{

	static setDefaultDb(db){
		defaultDb = db;
	}

	static get(user){
			console.log(user)
		return defaultDb.collection('users').findOne(user)
			.then(function(userData){
				if(!userData){
					throw 'no such user'
				}
				return new User(userData);
			});
	}

	static getAll(db, filter){
		return db.collection('users').find()
			.toArray()
			.then(function(results){
				return _.map(results, function(user){
					return new User(user);
				});
			});
	}

	constructor(options){
		_.extend(this, options);
		_.defaults(this, {
			db: defaultDb,
			keys: {
				public: [
					'_id',
					'name',
				],
				db: [
					'_id',
					'name',
				]
			}
		})
	}

	save(){
		var data = this.json('db');
		return this.db.collection('users')
			.save(data)
			.then(function(userData){
				return new User(userData);
			});
	}

	makePost(post){
		return this.db.collection('posts')
			.save(post);
	}

	getPosts(){
		return this.db.collection('posts')
			.find({
				parentId: this._id
			});
	}

	json(keyGroup='public'){
		return _.pick(this, this.keys[keyGroup]);
	}

}

module.exports = User;
