const Sequelize = require('sequelize')

const sequelize = new Sequelize('code_together', null, null, {
	dialect: 'postgres',
	logging: false
})

const File = require('./File.factory.js')(sequelize)
const Dir = require('./Dir.factory.js')(sequelize)



async function ModelsFactory(){

	Dir.hasMany(File, {
		as: 'children',
		foreignKey: 'parentId',
		onDelete: 'cascade',
	})
	File.belongsTo(Dir, {
		foreignKey: 'parentId',
	});


	Dir.hasMany(Dir, {
		as: 'children',
		foreignKey: 'parentId',
		onDelete: 'cascade',
	})
	Dir.belongsTo(Dir, {
		foreignKey: 'parentId',
	});

	return sequelize.sync({
		force: true
	})
	.then(function(){
		return {
			File,
			Dir,
		}
	})
}

module.exports = ModelsFactory();
