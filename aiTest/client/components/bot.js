


module.exports = function(board){

	const moves = [
		'north',
		'east',
		'south',
		'west',
	];

	board.on('requestMove', function(map){
		console.log(map)

		board.emit('move', _.sample(moves))
	})

}