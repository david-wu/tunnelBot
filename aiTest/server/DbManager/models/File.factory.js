const Sequelize = require('sequelize')

module.exports = function FileFactory(db){
	return db.define('file', {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		path: {
			type: Sequelize.STRING,
			validate: {
				len: [1, 200]
			}
		},
		name: {
			type: Sequelize.STRING,
			defaultValue: '',
		},
		content: {
			type: Sequelize.TEXT,
			defaultValue: '',
		},
	})
}