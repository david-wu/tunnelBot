import _ from 'lodash';
import React, { Component } from 'react';

import './reset.css';
import './App.css';
import FilePicker from './components/FilePicker/FilePicker';
import DirViewer from './components/DirViewer/DirViewer';
import FileViewer from './components/FileViewer/FileViewer';
import Dir from './services/dirService';
import TreeNode from './services/treeNodeService';

class App extends Component {

    constructor(props){
        super(props)
        const scope = this

        _.defaults(scope, {

            state: {
                rootNode: undefined,
                selectedChild: undefined,
            },

            componentDidMount: function(){
                return scope.getRootNode()
                    .then(function(rootNode){
                        scope.setState({
                            rootNode: rootNode,
                            selectedChild: scope.state.selectedChild,
                        })
                    })
            },

            getRootNode: function(){
                return Dir.factory({
                    isRoot: true,
                    userId: 'billyBo',
                })
                    .findOne()
                    .then(TreeNode.factory)
            },

            onCreateRootNode: function(){
                return Dir.factory({
                    isRoot: true,
                    userId: 'billyBo',
                })
                    .post()
                    .then(TreeNode.factory)
                    .then(function(rootNode){
                        scope.setState({
                            rootNode: rootNode,
                            selectedChild: scope.state.selectedChild
                        })
                    })
            },

            onPick: function(childNode){
                if(scope.focusedChild){
                    scope.focusedChild.focused = false;
                }
                scope.focusedChild = childNode;
                if(childNode){
                    scope.focusedChild.focused = true;
                }
                scope.setState({
                    selectedChild: scope.state.selectedChild === childNode ? undefined : childNode
                })
            },

            render: function(){
                if(!scope.state.rootNode){
                    return (
                        <div>
                            <button onClick={scope.onCreateRootNode}>
                                + Create Root Node
                            </button>
                        </div>
                    )
                }
                return (
                    <div>
                        <div className="file-picker-container">
                            <FilePicker parentNode={scope.state.rootNode} onPick={scope.onPick} />
                        </div>
                        <div>
                            {scope.renderChildNode(scope.state.selectedChild)}
                        </div>
                    </div>
                )
            },

            renderChildNode: function(childNode){
                if(!childNode) return;

                if(childNode.model.type === 'dir'){
                    return (
                        <DirViewer dirNode={childNode}/>
                    )
                }else if(childNode.model.type === 'file'){
                    return (
                        <div>
                            <FileViewer fileNode={childNode}/>
                        </div>
                    )
                }
            }

        })

    }

}

export default App;
