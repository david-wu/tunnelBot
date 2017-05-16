
// consider just using a singleton
let defaultDb;
const ObjectID = require('mongodb').ObjectID

class File{

	static setDefaultDb(db){
		defaultDb = db;
	}

	static get(file){
		return defaultDb.collection('files').findOne(file)
			.then(function(fileData){
				if(!fileData){
					throw 'no such file'
				}
				return new File(fileData);
			});
	}

	static getAll(db, filter){
		return db.collection('files')
			.find()
			.toArray()
			.then(function(results){
				return _.map(results, function(file){
					return new File(file);
				});
			});
	}

	constructor(options){
		_.extend(this, options);
		_.defaults(this, {
			db: defaultDb,
			keys: {
				overview: [
					'_id',
					'name',
					'title'
				],
				public: [
					'_id',
					'name',
					'content',
					'title'
				],
				db: [
					'_id',
					'name',
					'content',
					'title'
				]
			}
		})
	}

	get(){
		return defaultDb.collection('files')
			.findOne({
				_id: ObjectID(this._id)
			})
			.then((fileData)=>{
				if(!fileData){
					throw 'no such file'
				}
				return _.extend(this, fileData);
			});
	}

	delete(){
		return this.db.collection('files')
			.deleteOne({
				_id: ObjectID(this._id)
			})
			.then((fileData)=>{
				if(!fileData){
					throw 'no such file'
				}
				return _.extend(this, fileData.toJSON());
			})
			.catch(console.log);
	}

	save(){
		if(!this._id){
			return this.insert();
		}
		var data = this.json('db');
		return this.db.collection('files')
			.save(data)
			.then((fileData)=>{
				return _.extend(this, fileData.toJSON());
			});
	}

	insert(){
		var data = this.json('db');
		return this.db.collection('files')
			.insertOne(data)
			.then((result)=>{
				this._id = result.insertedId;
				return this;
			});
	}

	update(){
		var updateData = this.json('db');
		updateData._id = ObjectID(updateData._id);
		return this.db.collection('files')
			.update({
				_id: ObjectID(this._id)
			}, updateData)
			.then((fileData)=>{
				return _.extend(this, fileData.toJSON());
			})
	}

	json(keyGroup='public'){
		return _.pick(this, this.keys[keyGroup]);
	}

}

module.exports = File;
