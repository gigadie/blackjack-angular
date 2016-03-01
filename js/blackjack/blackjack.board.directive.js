'use strict';

var _ = window._ || require('lodash');

BlackJackBoard.$inject = [
	'BlackJackConfig'
];

function BlackJackBoard(BlackJackConfig) {
	var directive = {
		restrict: 'E',
		replace: true,
		templateUrl: BlackJackConfig.partialPath.concat('blackjack.board.template.html'),
		scope: {},
		bindToController: {},
		controllerAs: 'ctrl',
		controller: BlackJackBoardController
	};

	BlackJackBoardController.$inject = [
		'$state',
		'playerService',
		'BlackJackConfig'
	];

	function BlackJackBoardController($state, playerService, BlackJackConfig) {
		var vm = this;

		vm.started = null;
		vm.playerturn = null;
		vm.newPlayerName = null;
		vm.players = [];

		vm.goto = goto;
		vm.start = start;
		vm.addPlayer = addPlayer;
		vm.removePlayer = removePlayer;
		vm.canAddMorePlayers = canAddMorePlayers;

		return init();

		function init() {
			vm.started = false;
		}

		function goto(game) {
			$state.go(game);
		}

		function start() {
			vm.started = true;

			// create the dealer and add it
			// shuffle deck
			// hit 2 cards for each player
		}

		function addPlayer() {
			vm.players.push(playerService.newPlayer(vm.newPlayerName, 0));
			vm.newPlayerName = null;
		}

		function removePlayer(player) {
			vm.players = _.without(vm.players, player);
		}

		function canAddMorePlayers() {
			return vm.players.length < BlackJackConfig.maxPlayers;
		}
	}

	return directive;
}

module.exports = BlackJackBoard;
