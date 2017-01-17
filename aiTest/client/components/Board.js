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
			width: 10,
			height: 10
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

	createGrid(){
		this.grid = _.times(this.height, (y)=>{
			return _.times(this.width, (x)=>{
				return new Berry({
					size: _.random(1, 100),
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

	getPos(loc){

		const width = this.renderer.width;
		const height = this.renderer.height;

		// return {
		// 	x: 0,
		// 	y: 0
		// }

		return {
			x: (loc.x*300) - (width/2) - 800,
			y: -((loc.y*300) - (width/2) - 800),
 		}
	}


	seedPlayer(){
		const loc = {
			x: _.random(0, 9),
			y: _.random(0, 9)
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
			x: _.random(0, 9),
			y: _.random(0, 9)
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
		camera.position.z = 10000
		camera.position.y = 0

		// camera.up.set(0, 0, 1);
		return new Promise((resolve)=>{
			new TWEEN.Tween(camera.position)
				.to({
					x: 0,
					y: 0,
					z: 5000,
				}, 3000)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onComplete(resolve)
				.start();
		});
	}

	requestMove(){
		this.once('move', this.moveHandler.bind(this))
		this.emit('requestMove', this.grid);
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
			setTimeout(function(){
				target.removeMesh();
			},800)
			console.log(this.player.spentSize);
		}else if(target.type==='target'){
			console.log('winner!');
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


		this.setMeshPositionDeep()
		setTimeout(()=>{
			this.requestMove();
		},1000)
	}

}

module.exports = Board