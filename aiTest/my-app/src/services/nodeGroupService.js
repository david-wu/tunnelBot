import _ from 'lodash';
import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';


export default class NodeGroup{

	static factory(nodeGroup){
		return new NodeGroup(nodeGroup);
	}

	@observable openNodes
	@observable focusedNode
	@observable selectedNode

	constructor(model){
		_.defaults(this, {
			openNodes: [],
			focusedNode: undefined,
			selectedNode: undefined,
		})
	}

	addOpenNode(node){
		if(_.includes(this.openNodes, node)) return;
		this.openNodes.push(node);
	}

	removeOpenNode(node){
		if(this.selectedNode.id === node.id){
			this.selectedNode = undefined;
		}
		this.openNodes = _.filter(this.openNodes, function(openNode){
			return node !== openNode
		})
	}

	onPick(node){

		if(node){
			this.selectedNode = node;
		}

        if(this.focusedNode){
        	if(this.focusedNode.id===node.id){
	            this.addOpenNode(node)
	            return
        	}

        	if(this.focusedNode.id!==node.id){
	            this.focusedNode.focused = false
	            node.focused = true;
	            this.focusedNode = node
	            return
        	}

        }
        if(!this.focusedNode){
        	node.focused = true;
	        this.focusedNode = node;
        }
	}


}
