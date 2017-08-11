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
		const radius = Math.pow(this.size, 0.5)*20*(2/3);

		var geometry = new THREE.CircleGeometry(radius, 32);
		var material = new THREE.MeshBasicMaterial({
			color: parseInt((Math.random()/2+1) * 0xffffff),
			side: THREE.DoubleSide,
		});
		// material.side = THREE.DoubleSide;
		const mesh = this.mesh = new THREE.Mesh(geometry, material);

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