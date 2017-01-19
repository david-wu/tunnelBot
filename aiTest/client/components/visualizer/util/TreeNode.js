const EventEmitter = require('events');

class TreeNode extends EventEmitter{

	constructor(options){
		super();
		_.extend(this, options)
		_.defaults(this, {
			nodeId: _.uniqueId,
			children: [],
		})
		this.setChildren(this.children)
	}

	getChildIndex(target){
		return _.findIndex(this.children, function(child){
			return child===target;
		});
	}

	addChild(target, index=0){
		target.parent = this;
		this.children.splice(index, 0, target);
	}

	removeChild(target){
		const index = this.getChildIndex(target);
		target.parent = undefined;
		return this.children.splice(index, 1)[0];
	}

	setChildren(children=[]){
		this.children = children
		_.each(this.children, (child)=>{
			child.parent = this
		});
	}

	getRoot(constructorName){
		let pointer = this
		if(pointer.constructor.name===constructorName){
			return pointer
		}
		while(pointer.parent){
			pointer = pointer.parent
			if(pointer.constructor.name===constructorName){
				return pointer
			}
		}
	}

	getLeaves(){
		const leaves = [];
		this.depthFirstTraverse(function(){
			if(!node.children.length){
				leaves.push(node);
			}
		})
		return leaves;
	}

	iterateUp(iteratee){
		iteratee(this)
		let pointer = this
		while(pointer.parent){
			pointer = pointer.parent
			iteratee(pointer, pointer.parent)
		}
	}

	iterateDown(iteratee){
		const nodes = []
		this.iterateUp(function(node){
			nodes.push(node)
		});
		for(var i=nodes.length-1; i>=0; i--){
			iteratee(nodes[i], nodes[i+1])
		}
	}

	// Skips undefined children
	depthFirstTraverse(iteratee){
		iteratee(this);
		_.each(this.children, function(child){
			if(!_.isUndefined(child)){
				child.depthFirstTraverse(iteratee);
			}
		})
	}

	breadthFirstTraverse(iteratee){
		iteratee(this);

		const stack = this.children.slice();
		const otherStack = [];
		while(stack.length){
			for(let i=0; i<stack.length; i++){
				iteratee(stack[i]);
				[].push.apply(otherStack, stack[i].children);
			}
			stack.length = 0;
			[].push.apply(stack, otherStack);
			otherStack.length=0;
		}
	}

}

module.exports = TreeNode