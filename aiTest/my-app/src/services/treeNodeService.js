import _ from 'lodash';
import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';


/*
	models must have
		getChildren,
		delete,
*/

export default class TreeNode{

	static factory(treeNode){
		return new TreeNode(treeNode);
	}

	@observable childNodes
	@observable focused
	@observable selectedChildNode

	constructor(model){
		_.defaults(this, {
			id: model.id,
			model: model,
			childNodes: [],
			focused: false,
			selectedChildNode: undefined,
		})
	}

	async setChildNodes(){
		const children = await this.model.getChildren()
		this.childNodes = _.map(children, (child)=>{
			const childNode = TreeNode.factory(child)
			childNode.parent = this
			return childNode
		});
	}

	@autobind
	pushChildNode(childNode){
		childNode.parent = this;
		this.childNodes.push(childNode);
		return childNode;
	}

	@autobind
	unshiftChildNode(childNode){
		childNode.parent = this;
		this.childNodes.unshift(childNode);
		return childNode;
	}

	@autobind
	removeChildNode(node){
		if(this.selectedChildNode===node){
			this.selectChildNode(undefined);
		}
		node.parent = undefined;
		this.childNodes = _.filter(this.childNodes, function(childNode){
			return childNode !== node;
		})

		return node;
	}

	selectChildNode(childNode){
		// So everything gets unselected if you select a different parentNode
		if(this.selectedChildNode){
			this.selectedChildNode.selectChildNode(undefined);
		}
		this.selectedChildNode = childNode;
	}

	async destroy(){
		await this.model.delete()
		if(this.parent){
			this.parent.removeChildNode(this);
		}
	}

}
