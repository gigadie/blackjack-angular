'use strict';

var angular = require('angular');
var cards = require('../services/cards.factory');

angular.module('BlackJack', [])
	.constant('gameConfig', {
		partialPath: './js/blackjack/'
	})
	.config(config)
	.factory('cards', cards);

config.$inject = [
	'$stateProvider',
	'gameConfig'
];

function config($stateProvider, gameConfig) {
	$stateProvider.
		state('blackjack', {
			url: '/blackjack',
			templateUrl: gameConfig.partialPath.concat('main.html')
		});
}
