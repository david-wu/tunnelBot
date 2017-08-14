const Sequelize = require('sequelize')

const db = new Sequelize('code_together', null, null, {
	dialect: 'postgres',
	logging: false
})
const File = require('./File.factory.js')(db)
const Dir = require('./Dir.factory.js')(db)
// const System = require('./System.factory.js')(db)

const FileDir = db.define('file_dir', {
	fileId: Sequelize.UUID,
	dirId: Sequelize.UUID
});

async function ModelsFactory(){
	await Promise.all([
		File.sync(),
		Dir.sync(),
		// System.sync(),
		FileDir.sync(),
	])

	File.belongsToMany(Dir, {
		through: FileDir
	})
	Dir.belongsToMany(File, {
		through: FileDir
	})

	return {
		File,
		Dir,
		// System,
	};
}

module.exports = ModelsFactory();
