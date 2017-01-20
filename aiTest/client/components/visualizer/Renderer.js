const TWEEN = require('tween.js');
const THREE = require('three-js')();

class Renderer{

	constructor(options={}){
		_.extend(this, options);

		_.defaults(this, {
			width: window.innerWidth,
			height: window.innerHeight,
			context: document.getElementById('root'),
		})

		_.defaults(this, {
			viewAngle: 45,
			aspect: this.width / this.height,
			near: 0.1,
			far: 2000,
		});

		this.initComponents();
		if(this.board){
			this.setBoard(this.board);
		}

	}

	setBoard(board){

		board.renderer = this;
		board.on('newMesh', (mesh)=>{
			this.components.scene.add(mesh);
		});
		board.on('removeMesh', (mesh)=>{
			this.components.scene.remove(mesh);
		});
		board.depthFirstTraverse((renderable)=>{
			if(!renderable || !renderable.mesh){return;}
			this.components.scene.add(renderable.mesh);
		});

		this.startRendering();
	}

	initComponents(){

		const components = this.components = {
			renderer: new THREE.CSS3DRenderer(),
			camera: new THREE.PerspectiveCamera(this.viewAngle, this.aspect, this.near, this.far),
			scene: new THREE.Scene(),
			tween: TWEEN,
		};

		this.context.appendChild(components.renderer.domElement);
		components.renderer.setSize(this.width, this.height)
		components.scene.add(components.camera)
		return components;
	}

	attachControls(){
		const components = this.components;
		components.controls = new THREE.TrackballControls(components.camera, components.renderer.domElement );
		components.controls.rotateSpeed = 1;
	}

	startRendering(){
		const components = this.components;

		clearInterval(this.renderInterval);
		this.renderInterval = setInterval(function(){
			if(components.controls){
				components.controls.update();
			}
			components.tween.update();
			components.renderer.render(components.scene, components.camera);
		}, 16);
	}

	dramaticEntry(){
		const camera = this.components.camera
		camera.position.x = 0
		camera.position.z = 50000
		camera.position.y = 0

		// camera.up.set(0, 0, 1);
		return new Promise((resolve)=>{
			new TWEEN.Tween(camera.position)
				.to({
					x: 0,
					y: 0,
					z: 12500,
				}, 3000)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onComplete(resolve)
				.start();
		});
	}

}

module.exports = Renderer;