import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

import './FilePicker.css';
import File from '../../services/fileService';
import Dir from '../../services/dirService';

const FontAwesome = require('react-fontawesome');

@observer
class FilePicker extends Component {

    constructor(props){

        super(props);

        this.state = {
            childNodes: [],
            newDir: {
                name: '',
            },
            newFile: {
                name: '',
            }
        }

    }


    componentDidMount(){
        this.setChildren(this.props.parentNode)
    }

    componentWillReceiveProps(newProps){
        if(newProps.parentNode.id !== this.props.parentNode.id){
            this.setChildren(newProps.parentNode);
        }
    }

    setChildren(parentNode){
        if(!parentNode) return;
        return parentNode.getChildren()
            .then((childNodes)=>{
                this.setState({
                    childNodes: parentNode.children,
                    selectedChild: undefined,
                })
            })
    }

    @autobind
    onCreateFile(){
        return File.factory({
            name: this.state.newFile.name,
            parentId: this.props.parentNode.id,
        })
            .post()
            .catch(console.log)
            .then((file)=>{
                this.setState(function(prevState){
                    prevState.newFile.name = ''
                    prevState.childNodes.push(file)
                    return prevState;
                })
            })
    }

    @autobind
    onCreateDir(){
        return Dir.factory({
            name: this.state.newDir.name,
            parentId: this.props.parentNode.id,
        })
            .post()
            .catch(console.log)
            .then((dir)=>{
                this.setState(function(prevState){
                    prevState.newDir.name = ''
                    prevState.childNodes.unshift(dir)
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
    onChildClick(child){
        // if(this.state.selectedChild === child){
        //     child = undefined;
        // }

        this.setState(function(prevState){
            prevState.selectedChild = child;
        })

        this.props.onPick(child);
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
                {_.get(this, 'state.selectedChild.type')==='dir' ? <FilePicker parentNode={this.state.selectedChild} onPick={this.props.onPick} /> : ''}
            </div>
        );
    }

    renderChildren(){
        return this.state.childNodes.map(this.renderChild.bind(this));
    }

    renderChild(child){

        const fileClass = this.getChildClass(child)
        const iconClassesByType = {
            file: 'file',
            dir: 'folder'
        }
        const iconClass = iconClassesByType[child.type];
        return (
            <div className={fileClass} key={child.id} onClick={_.partial(this.onChildClick, child)}>
                <FontAwesome name={iconClass} />
                <div>
                    {child.name}
                </div>
            </div>
        )
    }

    getChildClass(child){
        if(child.focused){
            return 'file-item clickable focused';
        }
        if(_.get(this, 'state.selectedChild.id')===child.id){
            return 'file-item clickable selected-file'
        }else{
            return 'file-item clickable '
        }

    }

}

export default FilePicker;
