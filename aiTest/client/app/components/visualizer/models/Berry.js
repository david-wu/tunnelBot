const Renderable = require('../util/Renderable.js');
const THREE = require('three-js')();


class Berry extends Renderable{

	constructor(options){
		super(options);
		_.extend(this, options);
		_.defaults(this, {
			type: 'berry',
			width: this.size*10,
			height: this.size*10,
			color: 'purple',
			children: [],
			tweenStyle: 'dramatic',
		});
		_.defaults(this.pos, {
			x: 0,
			y: 0,
			z: 0,
			angle: 0,
		})
	}

	makeMesh(){
		const radius = Math.pow(this.size, 0.5)*20;

		const geometry = new THREE.BoxGeometry(radius, radius, 0);
		const material = new THREE.MeshBasicMaterial({
			color: 0x228b22
		});
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

module.exports = Berry;