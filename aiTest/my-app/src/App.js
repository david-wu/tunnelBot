import _ from 'lodash';
import React, { Component } from 'react';

import './App.css';
import FilePicker from './components/FilePicker/FilePicker';
import DirViewer from './components/DirViewer/DirViewer';
import FileViewer from './components/FileViewer/FileViewer';
import Dir from './services/dirService';


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
            },

            onCreateRootNode: function(){
                return Dir.factory({
                    isRoot: true,
                    userId: 'billyBo',
                })
                    .post()
                    .then(function(rootNode){
                        scope.setState({
                            rootNode: rootNode,
                            selectedChild: scope.state.selectedChild
                        })
                    })
            },

            onPick: function(child){
                if(scope.focusedChild){
                    scope.focusedChild.focused = false;
                }
                scope.focusedChild = child;
                if(child){
                    scope.focusedChild.focused = true;
                }
                scope.setState({
                    selectedChild: scope.state.selectedChild === child ? undefined : child
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
                            {scope.renderChild(scope.state.selectedChild)}
                        </div>
                    </div>
                )
            },

            renderChild: function(child){
                if(!child) return;
                if(child.type === 'dir'){
                    return (
                        <DirViewer dir={child}/>
                    )
                }else if(child.type === 'file'){
                    return (
                        <div>
                            <FileViewer file={child}/>
                        </div>
                    )
                }
            }

        })

    }

}

export default App;
