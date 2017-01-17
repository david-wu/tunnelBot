


module.exports = function(board){

	const moves = [
		'north',
		'east',
		'south',
		'west',
	];


	board.on('requestMove', function(map){
		board.emit('move', _.sample(moves))
	})

}