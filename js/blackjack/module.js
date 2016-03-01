'use strict';

var angular = require('angular');
var playerService = require('../services/player.factory');
var cardService = require('../services/card.factory');
var blackjackBoard = require('./blackjack.board.directive');

angular.module('BlackJack', [])
	.constant('BlackJackConfig', {
		partialPath: './js/blackjack/',
		maxPlayers: 7
	})
	.config(config)
	.factory('playerService', playerService)
	.factory('cardService', cardService)
	.directive('blackjackBoard', blackjackBoard);

config.$inject = [
	'$stateProvider',
	'BlackJackConfig'
];

function config($stateProvider, BlackJackConfig) {
	$stateProvider.
		state('blackjack', {
			url: '/blackjack',
			templateUrl: BlackJackConfig.partialPath.concat('main.html')
		});
}
