import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

import './FilePicker.scss';
import File from '../../services/fileService';
import Dir from '../../services/dirService';
import TreeNode from '../../services/treeNodeService';

const FontAwesome = require('react-fontawesome');

@observer
class FilePicker extends Component {

    constructor(props){

        super(props);

        this.state = {
            newDir: {
                name: '',
            },
            newFile: {
                name: '',
            },
            selectedChild: undefined,
        }

    }


    componentDidMount(){
        this.props.parentNode.setChildNodes();
        // this.setChildren(this.props.parentNode)
    }

    componentWillReceiveProps(newProps){
        if(newProps.parentNode.model.id !== this.props.parentNode.model.id){
            newProps.parentNode.setChildNodes();
        }
    }

    // setChildren(parentNode){
    //     if(!parentNode) return;
    //     return parentNode.getChildren()
    //         .then(()=>{
    //             this.setState({
    //                 selectedChild: undefined,
    //             })
    //         })
    // }

    @autobind
    onCreateFile(){
        return File.factory({
            name: this.state.newFile.name,
            parent: this.props.parentNode,
            parentId: this.props.parentNode.id,
        })
            .post()
            .catch(console.log)
            .then(TreeNode.factory)
            .then(this.props.parentNode.pushChildNode)
            .then(()=>{
                this.setState(function(prevState){
                    prevState.newFile.name = ''
                    return prevState;
                })
            })
    }

    @autobind
    onCreateDir(){
        return Dir.factory({
            name: this.state.newDir.name,
            parent: this.props.parentNode,
            parentId: this.props.parentNode.id,
        })
            .post()
            .catch(console.log)
            .then(TreeNode.factory)
            .then(this.props.parentNode.unshiftChildNode)
            .then(()=>{
                this.setState(function(prevState){
                    prevState.newDir.name = ''
                    return prevState;
                })
            })
    }

    @autobind
    changeFileNameHandler(event){
        this.setState({
            newFile: {
                name: event.target.value,
            }
        })
    }

    @autobind
    changeDirNameHandler(event){
        this.setState({
            newDir: {
                name: event.target.value,
            }
        })
    }

    @autobind
    onChildClick(childNode){
        this.props.parentNode.selectChildNode(childNode);
        this.props.onPick(childNode);
    }

    render(){
        return (
            <div className="inline-block">
                <div className="inline-block">
                    <div>
                        <button onClick={this.onCreateFile}>
                            + Create File
                        </button>
                        <input value={this.state.newFile.name}
                            type="text"
                            onChange={this.changeFileNameHandler}
                            placeholder="fileName"
                        ></input>
                    </div>
                    <div>
                        <button onClick={this.onCreateDir}>
                            + Create Dir
                        </button>
                        <input value={this.state.newDir.name}
                            type="text"
                            onChange={this.changeDirNameHandler}
                            placeholder="dirName"
                        ></input>
                    </div>
                    <div className="child-container">
                        {this.renderChildren()}
                    </div>
                </div>
                {_.get(this, 'props.parentNode.selectedChildNode.model.type')==='dir' ? <FilePicker parentNode={this.props.parentNode.selectedChildNode} onPick={this.props.onPick} /> : ''}
            </div>
        );
    }

    renderChildren(){
        return this.props.parentNode.childNodes.map(this.renderChildNode);
    }

    @autobind
    renderChildNode(childNode){
        const model = childNode.model;

        const fileClass = this.getChildClass(childNode)
        const iconClassesByType = {
            file: 'file',
            dir: 'folder'
        }
        const iconClass = iconClassesByType[model.type];
        return (
            <div className={fileClass} key={model.id} onClick={_.partial(this.onChildClick, childNode)}>
                <FontAwesome name={iconClass} />
                <div>
                    {model.name}
                </div>
            </div>
        )
    }

    getChildClass(childNode){
        if(childNode.focused){
            return 'file-item clickable focused';
        }
        if(_.get(this, 'props.parentNode.selectedChildNode.id')===childNode.model.id){
            return 'file-item clickable selected-file'
        }else{
            return 'file-item clickable '
        }

    }

}

export default FilePicker;
