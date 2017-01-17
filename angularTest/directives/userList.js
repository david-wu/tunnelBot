angular.module('Main')
	.directive('userList', ['userService', function(userService){
		return {
			scope: {
				ids: '=',
				onSelect: '=',
			},
			templateUrl: './templates/userList.html',
			link: function(scope, el, attrs){

				scope.$watchCollection('ids', function(ids){
					userService.get(ids)
						.then(function(users){
							scope.users = users;
						})
				})

			}
		}
	}])
