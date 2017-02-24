const Renderable = require('../util/Renderable.js');
const THREE = require('three-js')();



class Player extends Renderable{

	constructor(options){
		super(options);
		_.extend(this, options);
		_.defaults(this, {
			type: 'player',
			width: this.size*10,
			height: this.size*10,
			color: 'green',
			children: [],
			spentSize: 0
		});
		_.extend(this, {
			tweenStyle: 'normal',
		});
		_.extend(this.pos, {
			z: 10,
		})
	}

	makeMesh(){
		const element = document.createElement('div');

		const radius = Math.pow(this.size, 0.5)*20;


		_.extend(element.style, {
			'width': radius+'px',
			'height': radius+'px',
			'border-radius': radius+'px',
			'background-color': this.color
		})

		const mesh = new THREE.CSS3DObject(element)

		const board = this.getRoot('Board');
		board.emit('newMesh', mesh);

		return mesh;
	}

	setMeshPosition(){
		this.mesh = this.mesh || this.makeMesh();
		this.tweenToAbsPos();
		this.tweenRotation();
	}

}


module.exports = Player