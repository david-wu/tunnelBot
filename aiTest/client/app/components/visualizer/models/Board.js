const Renderable = require('../util/Renderable.js');
const TWEEN = require('tween.js');
const THREE = require('three-js')();

const Berry = require('./Berry.js');
const Player = require('./Player.js');
const Target = require('./Target.js')

class Board extends Renderable{

	constructor(options){
		super(options)
		_.extend(this, options);
		_.defaults(this, {
			turn: 0,
			width: 20,
			height: 20,
		});
	}

	createGrid(){
		this.grid = _.times(this.height, (y)=>{
			return _.times(this.width, (x)=>{
				const loc = {
					x: x,
					y: y,
				};
				return new Berry({
					size: this.randomBerrySize(),
					loc: loc,
					pos: this.getPos(loc),
				});
			});
		});
		this.seedPlayer();
		this.seedTarget();
		this.setChildren(_.flatten(this.grid));
	}

	seedPlayer(){
		const loc = this.randomLoc();
		const player = new Player({
			size: 100,
			loc: loc,
			pos: this.getPos(loc)
		});
		this.player = player;
		this.setCell(loc, player);
	}

	// Need to first seedPlayer
	seedTarget(){
		const loc = this.randomLoc();
		const minDist = (this.width+this.height)/4
		if(this.locDist(loc, this.player.loc) < minDist){
			return this.seedTarget();
		}
		const target = new Target({
			size: 100,
			loc: loc,
			pos: this.getPos(loc)
		});
		this.target = target;
		this.setCell(loc, target);
	}

	requestMove(){
		this.once('move', this.moveHandler.bind(this))
		this.emit('requestMove', this.getGridData());
	}

	getGridData(){
		return _.map(this.grid, function(row){
			return _.map(row, function(cell){
				return {
					type: cell.type,
					x: cell.loc.x,
					y: cell.loc.y,
					size: cell.size
				};
			})
		})
	}

	moveHandler(moveKey){
		if(!moveKey){return;}
		this.removeAllListeners('move');

		this.movePlayer(moveKey);

		if(this.gameOver){
			this.restartGame();
			return;
		}

		this.setMeshPositionDeep()
		setTimeout(()=>{
			this.requestMove();
		}, 600)
	}

	restartGame(){
		_.each(this.grid, function(row){
			_.each(row, function(cell){
				if(cell.removeMesh){
					cell.removeMesh();
				}
			})
		})
		this.createGrid();
		this.gameOver = undefined;
		this.setMeshPositionDeep()
		setTimeout(()=>{
			this.requestMove();
		}, 3000)
		return;
	}

	isOutOfBounds(loc){
		return loc.x > this.width-1 || loc.x < 0 || loc.y > this.height-1 || loc.y < 0
	}

	movePlayer(moveKey){

		const move = allMoves[moveKey]
		if(!move){return console.log('invalid key', moveKey);}

		const newLoc = {
			x: this.player.loc.x + move.x,
			y: this.player.loc.y + move.y,
		}

		if(this.isOutOfBounds(newLoc)){
			return console.log('out of bounds, can not move to ', newLoc);
		}

		const target = this.getTile(newLoc)
		if(target.type==='target'){
			return this.gameOver = {
				state: 'playerWin'
			};
		}
		if(target.type==='berry'){
			this.player.spentSize += target.size;
			target.size = 0;
			this.swapCells(target, this.player);

			setTimeout(()=>{
				target.removeMesh();
			}, 500)
		}

		_.extend(this.player.loc, newLoc);
		this.player.moveTo(this.getPos(newLoc));

		return newLoc;
	}

	getTile(loc){
		return this.grid[loc.y][loc.x];
	}

	setCell(loc, obj){
		this.grid[loc.y][loc.x] = obj;
	}

	getPos(loc){
		const width = (this.width*300)-150
		const height = (this.height*300)-150
		return {
			x: (loc.x*300) - width/2,
			y: -((loc.y*300) - height/2),
 		}
	}

	swapCells(obj1, obj2){
		var loc1 = _.clone(obj1.loc);
		var loc2 = _.clone(obj2.loc);

		_.extend(obj2.loc, loc1);
		_.extend(obj1.loc, loc2);

		this.setCell(obj2.loc, obj2);
		this.setCell(obj1.loc, obj1);
	}

	randomBerrySize(){
		return _.random(1)*_.random(1)*_.random(1)*50;
		// return _.ceil(Math.pow(_.random(1,100), 3)/10000);
	}

	randomLoc(){
		return {
			x: _.random(0, this.width-1),
			y: _.random(0, this.height-1)
		};
	}

	locDist(loc1, loc2){
		return Math.abs(loc1.x-loc2.x) + Math.abs(loc1.y-loc2.y);
	}

}

const allMoves = {
	north: {
		x: 0,
		y: -1
	},
	east: {
		x: 1,
		y: 0
	},
	south: {
		x: 0,
		y: 1
	},
	west: {
		x: -1,
		y: 0
	}
};

module.exports = Board