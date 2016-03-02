'use strict';

var angular = require('angular');

CardService.$inject = [];

function CardService() {

	var service = {
		newDeck: newDeck,
		Deck: Deck,
		Card: Card
	};

	// Deck Object

	function Deck() {
		var deck = this;
		this.cards = [];
		this.dealt = [];

		deck.suits.forEach(function(suit) {
			deck.ranks.forEach(function(rank) {
				var card = new Card(rank, suit, deck.rankValue[rank]);
				deck.cards.push(card);
			});
		});

		deck.shuffle();
	}

	Deck.prototype.suits = ['Club', 'Diamond', 'Spade', 'Heart'];

	Deck.prototype.ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

	Deck.prototype.rankValue = {
		'A': 11,
		'2': 2,
		'3': 3,
		'4': 4,
		'5': 5,
		'6': 6,
		'7': 7,
		'8': 8,
		'9': 9,
		'10': 10,
		'J': 10,
		'Q': 10,
		'K': 10
	};

	Deck.prototype.deal = function() {
		var card = this.cards.shift();
		if (angular.isDefined(card)) {
			this.dealt.push(card);
			return card;
		} else {
			return false;
		}
	};

	Deck.prototype.shuffle = function() {
		/*
		 * Using Knuth Shuffle Implementation
		 * https://github.com/coolaj86/knuth-shuffle
		 */
		var currentIndex = this.cards.length;
		var temporaryValue, randomIndex;

		// While there are remaining elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this.cards[currentIndex];
			this.cards[currentIndex] = this.cards[randomIndex];
			this.cards[randomIndex] = temporaryValue;
		}
	};

	Deck.prototype.reset = function() {
		this.cards = this.cards.concat(this.dealt);
		this.dealt = [];
		this.shuffle();
	};

	// Card Object

	function Card(rank, suit, value) {
		this.rank = rank;
		this.suit = suit;
		this.value = value;
	}

	Card.prototype.name = function() {
		return this.rank + ' ' + this.suit;
	};

	Card.prototype.class = function() {
		return this.suit + '-' + this.rank;
	};

	function newDeck() {
		var deck = new Deck();
		return deck;
	}

	return service;
}

module.exports = CardService;
