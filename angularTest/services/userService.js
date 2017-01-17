angular.module('Main')
	.service('userService', ['$q', function($q){

		var allUsers = {
			'938b5a0d': {
				name: 'Bill',
				favoriteColor: 'green',
				installedApps: [
					'1e793d1d',
					'fd339a6a'
				]
			},
			'71bad36c': {
				name: 'Bob',
				favoriteColor: 'purple',
				installedApps: []
			},
			'1f69c7ad': {
				name: 'Maggie',
				favoriteColor: 'blue',
				installedApps: [
					'fd339a6a'
				]
			},
			'3efb64e9': {
				name: 'Jill',
				favoriteColor: 'orange',
				installedApps: [
					'1e793d1d',
				]
			}
		};

		return {
			getAll: function(){
				var ids = [];
				for(var id in allUsers){
					ids.push(id);
				}
				return $q.resolve(ids);
			},
			get: function(ids){
				var users = ids.map(function(id){
					return allUsers[id]
				})
				return $q.resolve(users);
			}
		};

	}])
