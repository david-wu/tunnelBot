angular.module('Main')
	.service('appService', ['$q', function($q){

		var allApps = {
			'fd339a6a': {
				name: 'Furious Birds',
				rating: 3,
				platforms: [
					'IOS',
					'ANDROID',
				],
			},
			'1e793d1d': {
				name: 'TempNote',
				rating: 5,
				platforms: [
					'IOS',
				],
			},
			'aebf4ad4': {
				name: 'Giggle',
				rating: 4,
				platforms: [
					'ANDROID',
				],
			}
		};

		return {
			getAll: function(){
				var ids = [];
				for(var id in allApps){
					ids.push(id);
				}
				return $q.resolve(ids);
			},
			get: function(ids){
				var apps = ids.map(function(id){
					return allApps[id]
				});
				return $q.resolve(apps);
			}
		};

	}])
