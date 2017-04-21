
// consider just using a singleton
let defaultDb;

class Post{

	static setDefaultDb(db){
		defaultDb = db;
	}

	static getAll(db, filter){
		return db.collection('posts').find(filter)
			.toArray()
			.then(function(results){
				return _.map(results, function(post){
					return new Post(post);
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
					'userId',
				]
			}
		})
	}

	save(){
		var data = this.json('db');
		return this.db.collection('posts')
			.save(data)
			.then(function(postData){
				return new Post(postData);
			});
	}

	json(keyGroup='public'){
		return _.pick(this, this.keys[keyGroup]);
	}

}

module.exports = Post;
