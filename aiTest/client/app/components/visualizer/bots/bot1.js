
module.exports = function(board){

	const fronts = [
		{
			key: 'north',
			x: 0,
			y: -1
		},
		{
			key: 'east',
			x: 1,
			y: 0,
		},
		{
			key: 'south',
			x: 0,
			y: 1,
		},
		{
			key: 'west',
			x: -1,
			y: 0
		}
	];


	board.on('requestMove', function(map){

		_.times(20, setCosts)

		const player = getCell(map, 'player');
		const neighbors = getNeighbors(player);
		const bestNeighbor = _.minBy(neighbors, 'minCost');

		board.emit('move', bestNeighbor.key)


		function setCosts(){
			const height = map.length;
			const width = map[0].length;

			for(var i=0; i<height; i++){

				var front = {
					cost: Infinity
				};
				for(var j=0; j<width; j++){
					setFront(front, map[i][j])
				}

				var front = {
					cost: Infinity
				};
				for(var j=width-1; j>=0; j--){
					setFront(front, map[i][j])
				}
			}

			for(var i=0; i<width; i++){

				var front = {
					cost: Infinity
				};
				for(var j=0; j<height; j++){
					setFront(front, map[j][i])
				}

				var front = {
					cost: Infinity
				};
				for(var j=height-1; j>=0; j--){
					setFront(front, map[j][i])
				}
			}

		}

		function setFront(front, cell){

			if(cell.type === 'target'){
				front.cost = 0;
			}else{
				front.cost += 0.001
				front.cost += cell.size;
			}

			if(_.isUndefined(cell.minCost)){
				cell.minCost = front.cost;
				return;
			}

			if(cell.minCost > front.cost){
				cell.minCost = front.cost;
			}else{
				front.cost = cell.minCost;
			}

		}

		function getNeighbors(loc, key){
			const neighbors = _.map(fronts, function(front){
				var neighbor = _.get(map, [loc.y + front.y, loc.x + front.x]);
				if(neighbor){
					neighbor.key = front.key;
					return neighbor;
				}
			});
			return _.compact(neighbors);
		}

		function getCell(map, type){
			for(var i=0; i<map.length; i++){
				var row = map[i]
				for(var j=0; j<row.length; j++){
					var cell = row[j];
					if(cell.type === type){
						return cell;
					}
				}
			}
		}

	})

}