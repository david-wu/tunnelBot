const Tweenable = require('./Tweenable.js');


class Renderable extends Tweenable{

	constructor(options){
		super(options);
		_.extend(this, options)
		_.defaults(this, {
		})
	}

	setMeshPositionDeep(){
		this.setRelativePositionDeep();
		this.setAbsolutePositionDeep();
		this.depthFirstTraverse(function(node){
			node.setMeshPosition();
		})
	}
	setMeshPosition(){}

	removeMesh(){
		const board = this.getRoot('Board');
		board.emit('removeMesh', this.mesh)
	}

}

module.exports = Renderable;

