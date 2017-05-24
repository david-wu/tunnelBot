const Sequelize = require('sequelize')

const db = new Sequelize('code_together', null, null, {
	dialect: 'postgres',
	logging: false
})
const File = require('./File.factory.js')(db)
const Project = require('./Project.factory.js')(db)

const FileProject = db.define('file_project', {
	fileId: Sequelize.UUID,
	projectId: Sequelize.UUID
});

async function ModelsFactory(){
	await [
		File.sync(),
		Project.sync(),
		FileProject.sync(),
	]

	File.belongsToMany(Project, {
		through: FileProject
	})
	Project.belongsToMany(File, {
		through: FileProject
	})

	return {
		File,
		Project,
	};
}

module.exports = ModelsFactory();
