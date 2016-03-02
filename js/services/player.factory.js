'use strict';

var angular = require('angular');

Player.$inject = [];

function Player() {

	var service = {
		newPlayer: newPlayer,
		Player: Player
	};

	// Player Object

	function Player(playerName, playerScore) {
		this.score = playerScore;
		this.initialScore = playerScore;
		this.name = playerName;
	}

	Player.prototype.addScore = function(scoreToAdd) {
		if (!angular.isDefined(this.score)) {
			this.resetScore();
		}

		this.score += scoreToAdd;
	};

	Player.prototype.resetScore = function() {
		this.score = this.initialScore;
	};

	function newPlayer(playerName, playerScore) {
		var player = new Player(playerName, playerScore);
		return player;
	}

	return service;
}

module.exports = Player;
