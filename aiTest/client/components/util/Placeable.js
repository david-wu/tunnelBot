const TreeNode = require('./TreeNode.js');

class Placeable extends TreeNode{

	constructor(options){
		super(options);
		_.extend(this, options)
		_.defaults(this, {
			pos: {
				x: 0,
				y: 0,
				z: 0,
				angle: 0,
			},
			absPos: {
				x: 0,
				y: 0,
				z: 0,
			}
		})
	}

	moveTo(pos){
		_.extend(this.pos, pos);
	}

	setRelativePositionDeep(){
		this.depthFirstTraverse(function(node){
			node.setRelativePosition();
		})
	}
	setRelativePosition(){}

	setAbsolutePositionDeep(){

		// Set rotation matrices
		this.depthFirstTraverse(function(node){
			node.absPos = {
				x: 0,
				y: 0,
				z: 0,
				angle: node.parent ? node.parent.absPos.angle+node.pos.angle : node.pos.angle,
			};
			node.rotationMatrix = false;

			// Reuse rotationMatrix if no change to absAngle
			if(!node.pos.angle && node.parent){
				node.rotationMatrix = node.parent.rotationMatrix
			}else{
				node.rotationMatrix = getRotationMatrix(node.absPos.angle)
			}
		});

		// Use rotation matrices
		this.depthFirstTraverse(function(node){
			node.getAbsPos(node.pos, node.absPos);
		});
	}

	getAbsPos(relativePos, absPos={}){
		rotatePos(relativePos, this.rotationMatrix, absPos);
		if(this.parent){
			sumPos(absPos, this.parent.absPos, absPos);
		}
		return absPos
	}

}

function getRotationMatrix(angle){
	const theta = angle*Math.PI/180;
	const sinTheta = Math.sin(theta);
	const cosTheta = Math.cos(theta);
	return [
		[cosTheta, -sinTheta],
		[sinTheta, cosTheta]
	];
}

function rotatePos(pos, rotationMatrix, recycle={}){
	const x = pos.x*rotationMatrix[0][0] + pos.y*rotationMatrix[0][1];
	const y = pos.x*rotationMatrix[1][0] + pos.y*rotationMatrix[1][1];
	const z = pos.z;
	recycle.x = x;
	recycle.y = y;
	recycle.z = z;
	return recycle;
}

function sumPos(pos1, pos2, recycle={}){
	recycle.x = pos1.x + (pos2.x || 0);
	recycle.y = pos1.y + (pos2.y || 0);
	recycle.z = pos1.z + (pos2.z || 0);
	return recycle;
}

module.exports = Placeable;
