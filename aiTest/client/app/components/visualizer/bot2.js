// types: 'target', 'player', 'berries'
// position: {x,y}
// size: 0

module.exports = function(board){

    board.on('requestMove', function(map){
        // console.log(map);
        return board.emit('move', _.sample([
            'north',
            'east',
            'south',
            'west',
        ]));
    });

}