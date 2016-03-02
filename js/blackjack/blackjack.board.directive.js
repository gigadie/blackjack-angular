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
		'$timeout',
		'playerService',
		'cardService',
		'BlackJackConfig'
	];

	function BlackJackBoardController($state, $timeout, playerService, cardService, BlackJackConfig) {
		var vm = this;

		vm.started = null;
		vm.ended = null;
		vm.playerturn = null;
		vm.newPlayerName = null;
		vm.players = [];
		vm.losers = [];
		vm.dealer = null;
		vm.deck = null;

		vm.goto = goto;
		vm.start = start;
		vm.end = end;
		vm.addPlayer = addPlayer;
		vm.removePlayer = removePlayer;
		vm.canAddMorePlayers = canAddMorePlayers;
		vm.canPlay = canPlay;
		vm.hit = hit;
		vm.stick = stick;
		vm.checkScore = checkScore;
		vm.checkGame = checkGame;
		vm.dealerPlay = dealerPlay;

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
			vm.dealer.cards = [];

			// shuffle deck
			vm.deck = cardService.newDeck();

			// hit 2 cards for each player
			_.forEach(vm.players, function(player) {
				vm.hit(player, true);
				vm.hit(player, true);
			});

			// hit 1 card for the dealer
			vm.hit(vm.dealer, true);

			// check the game
			vm.checkGame();

			// current player will be the first still in the game
			vm.stick(-1);
		}

		function end() {
			vm.ended = true;
		}

		function addPlayer() {
			var player = playerService.newPlayer(vm.newPlayerName, 0);
			player.cards = [];
			vm.players.push(player);
			vm.newPlayerName = null;
		}

		function removePlayer(player) {
			vm.players = _.without(vm.players, player);
		}

		function canAddMorePlayers() {
			return vm.players.length < BlackJackConfig.maxPlayers;
		}

		function canPlay() {
			return vm.currentPlayer && vm.currentPlayer !== vm.dealer;
		}

		function hit(player, firstHand) {
			var card = vm.deck.deal();
			if (card) {
				player.cards.push(card);
				player.addScore(card.value);
				if (!firstHand) {
					vm.checkScore(player);
					if ((player.busted || player.blackjack) && player !== vm.dealer) {
						vm.stick(player);
					}
				}
			} else {
				// new deck?
			}
		}

		function stick(player) {
			var playerIndex = vm.players.indexOf(player);
			if ((playerIndex + 1) >= vm.players.length) {
				// dealer's turn
				vm.currentPlayer = vm.dealer;
				vm.dealerPlay();
			} else {
				// advance current player
				var playerTemp = _.find(vm.players, function(player) {
					return	player.score < 21 &&
							player.busted === false &&
							player.blackjack !== true &&
							vm.players.indexOf(player) > playerIndex;
				});
				if (playerTemp) {
					vm.currentPlayer = playerTemp;
				} else {
					// dealer's turn
					vm.currentPlayer = vm.dealer;
					vm.dealerPlay();
				}
			}
		}

		function checkGame() {
			_.forEach(vm.players, function(player) {
				vm.checkScore(player);
			});
		}

		function checkScore(player) {
			player.busted = player.score > 21 ? true : false;
			player.blackjack = !player.busted && player.score === 21 && player.cards.length === 2;
			player.wins = !player.busted && !player.blackjack && player.score > vm.dealer.score && vm.dealer.busted !== true;
			player.tie = !player.busted && !player.blackjack && !player.wins && player.score === vm.dealer.score;
		}

		function dealerPlay() {
			// hit 1 card for the dealer
			vm.hit(vm.dealer);
			vm.checkGame();

			if (vm.dealer.score < 17) {
				$timeout(vm.dealerPlay, 500);
			} else {
				if (vm.dealer.score > 21) {
					vm.dealer.busted = true;
				}
				vm.end();
			}
		}
	}

	return directive;
}

module.exports = BlackJackBoard;
