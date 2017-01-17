angular.module('Main')
	.directive('appList', ['appService', function(appService){
		return {
			scope: {
				ids: '=',
			},
			templateUrl: './templates/appList.html',
			link: function(scope, el, attrs){

				scope.$watchCollection('ids', function(ids){
					appService.get(ids)
						.then(function(apps){
							scope.apps = apps;
						})
				})

			}
		}
	}])
