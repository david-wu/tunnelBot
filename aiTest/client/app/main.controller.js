
const Note = require('./models/Note.js');

angular.module('Main')
	.controller('mainController', ['$scope', function($scope){
		_.extend($scope, {

			noteExpanded: false,
			note: new Note({
				content: ''
			}),

		})
	}]);
