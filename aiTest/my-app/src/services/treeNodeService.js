import _ from 'lodash';
import { autobind } from 'core-decorators';
import { observable, action } from 'mobx';
import Dir from './dirService';
import File from './fileService';
import ModelConnector from './ModelConnector';

/*
	models must have
		type: 'file' || 'dir',
		getChildren,
		delete,
*/
export default class TreeNode{

	static factory(model){
		return new TreeNode(model);
	}

	@observable childNodes
	@observable focused
	@observable selectedChildNode

	constructor(model){

		_.defaults(this, {
			id: model.id,
			model: model,
			modelConnector: ModelConnector.factory(),
			childNodes: [],
			focused: false,
			selectedChildNode: undefined,
		})

		this.modelConnector.connectModel(model)

		if(model.type === 'file'){
			this.modelConnector
				.on('changeName', (payload)=>{
					model.name = payload
				})
				.on('changeContent', (payload)=>{
					model.content = payload
				})
		}
		if(model.type === 'dir'){
			this.modelConnector
				.on('changeName', (payload)=>{
					model.name = payload
				})
				.on('addChild', (payload)=>{
					if(payload.type === 'dir'){
						this.unshiftChildNode(TreeNode.factory(Dir.factory(payload)))
					}else if(payload.type === 'file'){
						this.pushChildNode(TreeNode.factory(File.factory(payload)))
					}
				})
				.on('removeChild', (payload)=>{
					this.childNodes = _.filter(this.childNodes, function(childNode){
						return childNode.model.id !== payload
					})
				})
		}

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
