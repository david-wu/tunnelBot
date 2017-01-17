angular.module('Main', [])
	.controller('mainController', ['$scope', 'userService', function($scope, userService){

		$scope.selectUserHandler = function(user){
			$scope.selectedAppIds = user.installedApps
		}

		userService.getAll()
			.then(function(users){
				$scope.allUsers = users;
			});

	}]);