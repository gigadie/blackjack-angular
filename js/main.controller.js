'use strict';

var inject = [
	'$state'
];

function Main($state) {
	var vm = this;

	vm.goto = goto;

	function goto(game) {
		$state.go(game);
	}
}

Main.$inject = inject;

module.exports = Main;
