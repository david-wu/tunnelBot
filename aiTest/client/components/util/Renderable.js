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

}

module.exports = Renderable;

