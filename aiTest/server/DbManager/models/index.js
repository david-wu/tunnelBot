const Sequelize = require('sequelize')

const psqlUser = process.env.PSQL_USER || null;
const psqlPassword = process.env.PSQL_PASSWORD || null;

const sequelize = new Sequelize('code_together', psqlUser, psqlPassword, {
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
