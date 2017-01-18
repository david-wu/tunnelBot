const Renderable = require('./util/Renderable.js');
const TWEEN = require('tween.js');
const THREE = require('three-js')();

const Berry = require('./Berry.js');
const Player = require('./Player.js');
const Target = require('./Target.js')

class Board extends Renderable{

	constructor(options){
		super()

		_.extend(this, options);
		_.defaults(this, {
			turn: 0,
			width: 25,
			height: 25
		});

	}


	createSimpleGrid(){
		this.grid = _.times(this.height, (y)=>{
			return _.times(this.width, (x)=>{
				return new Berry({
					size: 50,
					loc: {
						x: x,
						y: y,
					},
					pos: this.getPos({
						x: x,
						y: y
					})
				});
			});
		});
		this.seedPlayer();
		this.seedTarget();
		this.setChildren(_.flatten(this.grid))
	}

	generateSize(){
		return _.ceil(Math.pow(_.random(1,100), 3)/10000);
	}

	createGrid(){
		this.grid = _.times(this.height, (y)=>{
			return _.times(this.width, (x)=>{
				return new Berry({
					size: this.generateSize(),//_.random(1, 100),
					loc: {
						x: x,
						y: y,
					},
					pos: this.getPos({
						x: x,
						y: y
					})
				});
			});
		});
		this.seedPlayer();
		this.seedTarget();
		this.setChildren(_.flatten(this.grid))
	}

	getTile(loc){
		return this.grid[loc.y][loc.x]
	}

	setTile(loc, obj){
		this.grid[loc.y][loc.x] = obj
	}

	getPos(loc){

		// const width = this.renderer.width;
		// const height = this.renderer.height;

		const width = (this.width*300)-150
		const height = (this.height*300)-150

		// return {
		// 	x: 0,
		// 	y: 0
		// }

		return {
			x: (loc.x*300) - width/2,
			y: -((loc.y*300) - height/2),
 		}
	}


	seedPlayer(){
		const loc = {
			x: _.random(0, this.width-1),
			y: _.random(0, this.height-1)
		}

		const player = new Player({
			size: 100,
			loc: loc,
			pos: this.getPos(loc)
		});
		console.log('player loc', loc)
		this.player = player;
		this.grid[loc.y][loc.x] = player
	}

	seedTarget(){
		const loc = {
			x: _.random(0, this.width-1),
			y: _.random(0, this.height-1)
		}

		if(this.grid[loc.y][loc.x].type === 'player'){
			this.seedTarget();
			return;
		}

		const target = new Target({
			size: 100,
			loc: loc,
			pos: this.getPos(loc)
		});
		console.log('target loc', loc)
		this.target = target;
		this.grid[loc.y][loc.x] = target
	}


	dramaticEntry(){
		const camera = this.renderer.components.camera

		camera.position.x = 0
		camera.position.z = 30000
		camera.position.y = 0

		// camera.up.set(0, 0, 1);
		return new Promise((resolve)=>{
			new TWEEN.Tween(camera.position)
				.to({
					x: 0,
					y: 0,
					z: 10000,
				}, 3000)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onComplete(resolve)
				.start();
		});
	}

	requestMove(){
		this.once('move', this.moveHandler.bind(this))
		this.emit('requestMove', this.getSimpleGrid());
	}

	getSimpleGrid(){
		const simpleGrid = []
		_.each(this.grid, function(row){
			const simpleRow = [];
			_.each(row, function(cell){
				simpleRow.push({
					type: cell.type,
					x: cell.loc.x,
					y: cell.loc.y,
					size: cell.size
				});
			})
			simpleGrid.push(simpleRow)
		})
		return simpleGrid;
	}

	movePlayer(moveKey){
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
		}

		const move = allMoves[moveKey]

		if(!move){
			return;
		}

		const newLoc = _.clone(this.player.loc);

		newLoc.x += move.x
		newLoc.y += move.y

		if(newLoc.x > this.width-1 || newLoc.x < 0){
			console.log('out of bounds, can not move to ', newLoc);
			return;
		}
		if(newLoc.y > this.height-1 || newLoc.y < 0){
			console.log('out of bounds, can not move to ', newLoc);
			return;
		}

		const target = this.getTile(newLoc)
		if(target.type==='berry'){
			this.player.spentSize += target.size;
			target.size = 0;
			setTimeout(()=>{
				target.removeMesh();
				this.setTile(newLoc, {
					type: 'empty',
					size: 0,
					loc: newLoc
				})
			}, 500)
		}else if(target.type==='target'){
			this.gameOver = {
				state: 'playerWin'
			};
		}

		_.extend(this.player.loc, newLoc);
		this.player.moveTo(this.getPos(newLoc));


		return newLoc;
	}

	moveHandler(moveKey){
		if(!moveKey){return;}

		this.movePlayer(moveKey)

		this.turn++;
		this.removeAllListeners('move');

		if(this.gameOver){
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
			}, 2000)
			return;
		}

		this.setMeshPositionDeep()
		setTimeout(()=>{
			this.requestMove();
		},500)
	}

}

module.exports = Board