
module.exports = {

	getConfigs: function(env='production'){
		return {
			production: {
				domain: 'localhost',
				port: 6388,
				containerDomain: 'redis',
				containerPort: 6379,
			},
			development: {

			}
		}[env]
	}

}