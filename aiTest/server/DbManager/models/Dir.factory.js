const Sequelize = require('sequelize')

module.exports = function DirFactory(db){
	return db.define('dir', {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		userId: {
			type: Sequelize.STRING,
			defaultValue: undefined,
		},
		isRoot: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
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
