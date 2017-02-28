global._ = require('lodash');
global.$ = global.jQuery = require('jquery');
global.angular = require('angular');



angular.module('Main', []);
require('./main.controller.js');
require('./components/editor/noteEditor.directive.js');
require('./components/visualizer/visualizer.directive.js');
require('./components/terminal/terminal.directive.js');


