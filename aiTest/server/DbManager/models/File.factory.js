const Sequelize = require('sequelize')

module.exports = function FileFactory(sequelize){
	return sequelize.define('file', {
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