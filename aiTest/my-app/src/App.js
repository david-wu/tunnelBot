import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

import './reset.css';
import './App.scss';
import FilePicker from './components/FilePicker/FilePicker';
import DirViewer from './components/DirViewer/DirViewer';
import FileViewer from './components/FileViewer/FileViewer';
import Dir from './services/dirService';
import TreeNode from './services/treeNodeService';
import NodeGroup from './services/nodeGroupService'
const FontAwesome = require('react-fontawesome');

const queryString = require('query-string');


@observer
class App extends Component {

    constructor(props){
        super(props)

        _.defaults(this, {
            openNodeGroup: NodeGroup.factory(),
        })

        this.state = {
            rootNode: undefined,
        }
    }

    componentDidMount(){

        const rootNodeId = queryString.parse(this.props.location.search).rootNodeId
        if(rootNodeId){
            return this.getRootNodeById(rootNodeId)
                .then((rootNode)=>{
                    this.setState({
                        rootNode: rootNode,
                    })
                })
        }

        return this.getRootNode()
            .then((rootNode)=>{
                this.setState({
                    rootNode: rootNode,
                })
            })
    }

    getRootNodeById(rootId){
        return Dir.factory({
            id: rootId,
        })
            .findOne()
            .then(function(dir){
                return dir ? TreeNode.factory(dir) : undefined;
            })
    }

    getRootNode(){
        return Dir.factory({
            isRoot: true,
            userId: 'billyBo',
        })
            .findOne()
            .then(function(dir){
                return dir ? TreeNode.factory(dir) : undefined;
            })
    }

    @autobind
    onCreateRootNode(){
        return Dir.factory({
            isRoot: true,
            userId: 'billyBo',
        })
            .post()
            .then(TreeNode.factory)
            .then((rootNode)=>{
                this.setState({
                    rootNode: rootNode,
                })
            })
    }

    @autobind
    onPick(childNode){
        this.openNodeGroup.onPick(childNode);
        // this.openNodeGroup.addOpenNode(childNode);
    }

    @autobind
    removeOpenNode(node, e){
        e.stopPropagation();
        this.openNodeGroup.removeOpenNode(node);
    }

    @autobind
    selectOpenNode(node){
        this.openNodeGroup.selectedNode = node
    }

    render(){
        if(!this.state.rootNode){
            return (
                <div>
                    <button onClick={this.onCreateRootNode}>
                        + Create Root Node
                    </button>
                </div>
            )
        }
        return (
            <div>
                <div className="clickable" onClick={this.onPick.bind(this, this.state.rootNode)}>
                    {this.state.rootNode.model.name}
                </div>
                <div className="file-picker-container">
                    <FilePicker parentNode={this.state.rootNode} onPick={this.onPick} />
                </div>

                <div>
                    {this.renderOpenNodeGroup()}
                </div>
            </div>
        )
    }

    renderOpenNodeGroup(){
        const tabNodes = this.openNodeGroup.openNodes;
        return (
            <div>
                <div style={{display: 'flex'}}>
                    {_.map(tabNodes, this.renderNodeTab)}
                </div>
                {this.renderNode(this.openNodeGroup.selectedNode)}
            </div>
        )
    }

    @autobind
    renderNodeTab(node){
        const className = 'flex clickable' + ((node===this.openNodeGroup.selectedNode) ? ' selected' : '')
        const style = {padding: '5px', margin: '5px', border: '1px solid whitesmoke', height: '40px'}

        return (
            <div style={style} className={className} key={node.model.id} onClick={_.partial(this.selectOpenNode, node)}>
                <div className="align-center">{node.model.name}</div>
                <FontAwesome onClick={_.partial(this.removeOpenNode, node)} name='times' style={{marginLeft: '5px'}} className="align-start"/>
            </div>
        )
    }

    renderNode(node){
        if(!node) return;

        if(node.model.type === 'dir'){
            return (
                <DirViewer dirNode={node}/>
            )
        }else if(node.model.type === 'file'){
            return (
                <div>
                    <FileViewer fileNode={node}/>
                </div>
            )
        }
    }

}

export default App;
