'use strict';

// Angular dependency
var angular = require('angular');

// Angular material dependencies
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-messages');

// Restangular expects underscore or lodash
window._ = require('lodash');
require('angular-route/angular-route.min');
require('angular-ui-router/release/angular-ui-router.min');

// Load modules
require('./blackjack/module');

// Load config
var routeConfig = require('./config/$route.config');

// Body controller
var mainController = require('./main.controller');

// Run Block
var runDependencies = ['$rootScope'];
function run($rootScope) {
	$rootScope.$on('$stateChangeStart', onStateChange);

	/**
	 * On state change set the root scope's return to state values,
	 * which are used on successful login to load next state.
	 * @param  {event} ev
	 * @param  {Object} toState
	 * @param  {string[]} toParams
	 */
	function onStateChange(ev, toState, toParams) {
		$rootScope.returnToState = toState;
		$rootScope.returnToStateParams = toParams;
	}
}
run.$inject = runDependencies;

// App
angular
	.module('CardGame', [
		'ngRoute',
		'ui.router',
		'ngMaterial',
		'BlackJack'
	])
	.controller('MainController', mainController)
	// conf
	.config(routeConfig)
	// run
	.run(run);
