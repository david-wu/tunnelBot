const Sequelize = require('sequelize')

module.exports = function ProjectFactor(db){
	return db.define('project', {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		name: {
			type: Sequelize.STRING,
			defaultValue: '',
		},
		description: {
			type: Sequelize.TEXT,
			defaultValue: '',
		},
	})
}
