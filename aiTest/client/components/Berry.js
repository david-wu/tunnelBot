const Renderable = require('./util/Renderable.js');
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
		const element = document.createElement('div');

		const radius = Math.pow(this.size, 0.5)*20;


		_.extend(element.style, {
			'width': radius+'px',
			'height': radius+'px',
			'border-radius': radius+'px',
			'background-color': this.color
		})

		var number = document.createElement( 'div' );
		number.textContent = this.name;
		element.appendChild(number);
		const mesh = this.mesh = new THREE.CSS3DObject(element)

		const board = this.getRoot('Board');
		board.emit('newMesh', mesh);

		return mesh;
	}

	removeMesh(){
		const board = this.getRoot('Board');
		board.emit('removeMesh', this.mesh)
	}

	setMeshPosition(){
		this.mesh = this.mesh || this.makeMesh();
		this.tweenToAbsPos();
		this.tweenRotation();
	}

}

module.exports = Berry;