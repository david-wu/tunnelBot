import React, { Component } from 'react';
import './FilePicker.css';

const _ = require('lodash');
const fileService = require('../../services/fileService');
const dirService = require('../../services/dirService');
const FontAwesome = require('react-fontawesome');

class FilePicker extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
                childNodes: [],
                newDir: {
                    name: '',
                },
                newFile: {
                    name: '',
                }
            },

            componentDidMount: function(){
                scope.setChildren(scope.props.parentNode)
            },

            componentWillReceiveProps: function(newProps){
                if(newProps.parentNode.id !== scope.props.parentNode.id){
                    scope.setChildren(newProps.parentNode);
                }
            },

            setChildren: function(parentNode){
                if(!parentNode) return;
                return parentNode.getChildren()
                    .then((childNodes)=>{
                        scope.setState({
                            childNodes: childNodes,
                            selectedChild: undefined,
                        })
                    })
            },

            onCreateFile: function(){
                return fileService.factory({
                    name: scope.state.newFile.name,
                    parentId: scope.props.parentNode.id,
                })
                    .post()
                    .catch(console.log)
                    .then(function(file){
                        scope.setState(function(prevState){
                            prevState.newFile.name = ''
                            prevState.childNodes.push(file)
                            return prevState;
                        })
                    })
            },
            onCreateDir: function(){
                return dirService.factory({
                    name: scope.state.newDir.name,
                    parentId: scope.props.parentNode.id,
                })
                    .post()
                    .catch(console.log)
                    .then(function(dir){
                        scope.setState(function(prevState){
                            prevState.newDir.name = ''
                            prevState.childNodes.unshift(dir)
                            return prevState;
                        })
                    })
            },

            changeFileNameHandler: function(event){
                scope.setState({
                    newFile: {
                        name: event.target.value,
                    }
                })
            },
            changeDirNameHandler: function(event){
                scope.setState({
                    newDir: {
                        name: event.target.value,
                    }
                })
            },

            onChildClick: function(child){
                if(scope.state.selectedChild === child){
                    child = undefined;
                }

                scope.setState(function(prevState){
                    prevState.selectedChild = child;
                })

                scope.props.onPick(child);
            },

            render: function(){
                return (
                    <div className="inline-block">
                        <div className="inline-block">
                            <div>
                                {scope.renderSelectionHeader(scope.state.selectedChild)}
                                <button onClick={scope.onCreateFile}>
                                    + Create File
                                </button>
                                <input value={scope.state.newFile.name}
                                    type="text"
                                    onChange={scope.changeFileNameHandler}
                                    placeholder="fileName"
                                ></input>
                            </div>
                            <div>
                                <button onClick={scope.onCreateDir}>
                                    + Create Dir
                                </button>
                                <input value={scope.state.newDir.name}
                                    type="text"
                                    onChange={scope.changeDirNameHandler}
                                    placeholder="dirName"
                                ></input>
                            </div>
                            <div className="child-container">
                                {scope.renderChildren()}
                            </div>
                        </div>
                        {_.get(scope, 'state.selectedChild.type')==='dir' ? <FilePicker parentNode={scope.state.selectedChild} onPick={scope.props.onPick} /> : ''}
                    </div>
                );
            },

            renderSelectionHeader: function(selection){
                if(selection){
                    return (
                        <div className="selection selected">
                            {selection.name}
                        </div>
                    )
                }else{
                    return <div className="selection"></div>
                }
            },

            renderChildren: function(){
                return scope.state.childNodes.map(scope.renderChild);
            },

            renderChild: function(child){
                const fileClass = _.get(scope, 'state.selectedChild.id') === child.id ? 'file-item clickable selected-file' : 'file-item clickable';
                const iconClassesByType = {
                    file: 'file',
                    dir: 'folder'
                }
                const iconClass = iconClassesByType[child.type];
                return (
                    <div className={fileClass} key={child.id} onClick={_.partial(scope.onChildClick, child)}>
                        <FontAwesome name={iconClass} />
                        <div>
                            {child.name}
                        </div>
                    </div>
                )
            },


        })
    }

}

export default FilePicker;
