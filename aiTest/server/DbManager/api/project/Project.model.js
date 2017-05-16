
// consider just using a singleton
let defaultDb;
const ObjectID = require('mongodb').ObjectID
const File = require('../file/File.model.js')

class Project{

	static setDefaultDb(db){
		defaultDb = db;
	}

	static get(project){
		return defaultDb.collection('projects').findOne(project)
			.then(function(projectData){
				if(!projectData){
					throw 'no such project'
				}
				return new Project(projectData);
			});
	}

	static getAll(db, filter){
		return db.collection('projects')
			.find()
			.toArray()
			.then(function(results){
				return _.map(results, function(projectData){
					return new Project(projectData);
				});
			});
	}

	constructor(options){
		_.extend(this, options);
		_.defaults(this, {
			db: defaultDb,
			fileIds: [],
			keys: {
				overview: [
					'_id',
					'name',
				],
				public: [
					'_id',
					'name',
					'fileIds',
				],
				db: [
					'_id',
					'name',
					'fileIds',
				]
			}
		})
	}

	get(){
		if(!this._id){
			throw 'can not get project with no _id'
		}
		return defaultDb.collection('projects')
			.findOne({
				_id: ObjectID(this._id)
			})
			.then((projectData)=>{
				if(!projectData){
					throw `can not find project: ${this._id}`
				}
				return _.extend(this, projectData)
			});
	}

	async linkFiles(fileIds){
		const project = await this.get();

		const fileIdList = _.map(fileIds, function(fileId){
			return ObjectID(fileId)
		})
		this.fileIds = this.fileIds.concat(fileIdList)
		return this.update();
	}

	async getFiles(){
		const project = await this.get();
		const fileIds = _.map(project.fileIds, function(fileId){
			return ObjectID(fileId)
		})
		const files = await new Promise((resolve, reject)=>{

			defaultDb.collection('files')
				.find({
					_id: {
						'$in': fileIds
					}
				})
				.toArray(function(err, fileListData){
					if(err){
						return reject(err)
					}
					resolve(_.map(fileListData, function(fileData){
						return new File(fileData)
					}))
				})
		})
		return files;
	}

	delete(){
		return this.db.collection('projects')
			.deleteOne({
				_id: ObjectID(this._id)
			})
			.then((projectData)=>{
				if(!projectData){
					throw 'no such Project'
				}
				return _.extend(this, projectData)
			})
			.catch(console.log);
	}

	save(){
		if(!this._id){
			return this.insert();
		}
		var data = this.json('db');
		return this.db.collection('projects')
			.save(data)
			.then((projectData)=>{
				return _.extend(this, projectData)
			});
	}

	insert(){
		var data = this.json('db');
		return this.db.collection('projects')
			.insertOne(data)
			.then((result)=>{
				this._id = result.insertedId;
				return this;
			});
	}

	update(){
		var updateData = this.json('db');
		updateData._id = ObjectID(updateData._id);
		return this.db.collection('projects')
			.update({
				_id: ObjectID(this._id)
			}, updateData)
			.then(()=>{
				return this;
			})
	}

	json(keyGroup='public'){
		return _.pick(this, this.keys[keyGroup]);
	}

}

module.exports = Project;
