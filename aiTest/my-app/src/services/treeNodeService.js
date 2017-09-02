import _ from 'lodash';
import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';
import Dir from './dirService';
import File from './fileService';
const socketService = require('./socketService');

// const Dir = require('./dirService');
// const File = require('./fileService');

const socketP = socketService.getConnection();


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

		if(this.model.type === 'file'){
			socketP.then((socket)=>{
				socket.send({
					type: 'registerDbEmitter',
					on: {
						type: 'file',
						id: this.model.id,
						eventName: 'changeName'
					}
				})
				socket.send({
					type: 'registerDbEmitter',
					on: {
						type: 'file',
						id: this.model.id,
						eventName: 'changeContent'
					}
				})
				socket.on('message', (emitterRef, payload)=>{
					if(emitterRef.id === this.model.id){
						if(emitterRef.eventName === 'changeContent'){
							this.model.content = payload;
						}
						if(emitterRef.eventName === 'changeName'){
							this.model.name = payload;
						}
					}
				})
			})
		}

		if(this.model.type === 'dir'){
			socketP.then((socket)=>{
				socket.send({
					type: 'registerDbEmitter',
					on: {
						type: 'dir',
						id: this.model.id,
						eventName: 'changeName'
					}
				})
				socket.send({
					type: 'registerDbEmitter',
					on: {
						type: 'dir',
						id: this.model.id,
						eventName: 'addChild'
					}
				})
				socket.send({
					type: 'registerDbEmitter',
					on: {
						type: 'dir',
						id: this.model.id,
						eventName: 'removeChild'
					}
				})
				socket.on('message', (emitterRef, payload)=>{
					if(emitterRef.id === this.model.id){
						console.log('mymessage', payload)
						if(emitterRef.eventName === 'changeName'){
							this.model.name = payload;
						}
						if(emitterRef.eventName === 'addChild'){
							console.log('py', payload)
							if(payload.type === 'dir'){
								this.unshiftChildNode(TreeNode.factory(Dir.factory(payload)))
							}else if(payload.type === 'file'){
								this.pushChildNode(TreeNode.factory(File.factory(payload)))
							}
							console.log('adding child', this.childNodes.peek())
						}
						if(emitterRef.eventName === 'removeChild'){
							console.log(payload, this.childNodes.peek())
							this.childNodes = _.filter(this.childNodes, function(childNode){
								return childNode.model.id !== payload
							})
						}
					}
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
