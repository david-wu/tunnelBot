global._ = require('lodash');
global.$ = require('jquery');
global.angular = require('angular');


angular.module('Main', []);
require('./main.controller.js');
require('./components/editor/noteEditor.directive.js');
require('./components/visualizer/visualizer.directive.js');