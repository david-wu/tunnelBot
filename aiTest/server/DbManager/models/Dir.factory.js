const Sequelize = require('sequelize')

module.exports = function DirFactory(db){
	return db.define('dir', {
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
