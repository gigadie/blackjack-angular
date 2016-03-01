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
		'cardService',
		'BlackJackConfig'
	];

	function BlackJackBoardController($state, playerService, cardService, BlackJackConfig) {
		var vm = this;

		vm.started = null;
		vm.playerturn = null;
		vm.newPlayerName = null;
		vm.players = [];
		vm.losers = [];
		vm.dealer = null;
		vm.deck = null;

		vm.goto = goto;
		vm.start = start;
		vm.addPlayer = addPlayer;
		vm.removePlayer = removePlayer;
		vm.canAddMorePlayers = canAddMorePlayers;
		vm.hit = hit;
		vm.stick = stick;
		vm.checkScore = checkScore;

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
			vm.dealer = playerService.newPlayer('Dealer', 0);

			// shuffle deck
			vm.deck = cardService.newDeck();

			// hit 2 cards for each player
			_.forEach(vm.players, function(player) {
				vm.hit(player);
				vm.hit(player);
			});

			// hit 1 card for the dealer
			vm.hit(vm.dealer);

			// check the game
			_.forEach(vm.players, function(player) {
				vm.hit(player);
				vm.hit(player);
			});

			// if no one won already
			// current player will be the first still in the game
			vm.stick(-1);
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

		function hit(player) {
			var card = vm.deck.deal();
			if (card) {
				player.addScore(card.value);
				vm.checkScore();
			}
		}

		function stick(playerIndex) {
			// advance current player
			var playerTemp = _.find(vm.players, function(player) {
				return	playerTemp.score < 21 &&
						vm.players.indexOf(player) > playerIndex;
			});
			if (playerTemp) {
				vm.currentPlayer = playerTemp;
			}
		}

		function checkScore(player) {
			if (player.score > 21) {
				vm.losers.push(player);
			}
		}
	}

	return directive;
}

module.exports = BlackJackBoard;
