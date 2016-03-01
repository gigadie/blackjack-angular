'use strict';

config.$inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {
	$stateProvider.
		state('initial', {
			url: '/',
			templateUrl: './js/main.html'
		});

	$urlRouterProvider.otherwise('/');
}

module.exports = config;
