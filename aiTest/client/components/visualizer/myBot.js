// types: 'berries', 'target', 'player'
// size: 0
// position: x,y

module.exports = function(board){

    board.on('requestMove', function(map){
        console.log(map);
        return board.emit('move', _.sample([
            'north',
            'east',
            'south',
            'west',
        ]));
    });

}