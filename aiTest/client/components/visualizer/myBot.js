
module.exports = function(board){


	board.on('requestMove', function(map){

		return board.emit('move', _.sample([
			'north',
			'east',
			'south',
			'west',
		]));
		board.emit('move', bestNeighbor.key)
	})

}