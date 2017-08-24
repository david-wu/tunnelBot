import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import * as moment from 'moment';

import './FileViewer.css';

const ace = window.ace;

@observer
class FileViewer extends Component{

    constructor(props){
        super(props)
        this.debouncedPutFile = _.debounce(this.putFile, 300)
    }

    @autobind
    onEditorElement(element){
        this.aceEditor = ace.edit(element)
        this.aceEditor.$blockScrolling = Infinity
        this.aceEditor.setOptions(editorOptions)
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        const fileSession = new ace.EditSession(props.fileNode.model.content)
        fileSession.setMode('ace/mode/javascript')
        fileSession.on('change', ()=>{
            this.onEditorValueChange(this.aceEditor.getValue(), props.fileNode.model)
        })
        this.aceEditor.setSession(fileSession)
    }

    @autobind
    onEditorValueChange(editorContent, file){
        if(file.content !== editorContent){
            file.content = editorContent
            this.debouncedPutFile()
        }
    }

    @autobind
    onFileNameChange(e){
        this.props.fileNode.model.name = e.target.value
        this.debouncedPutFile()
    }

    @autobind
    putFile(){
        this.props.fileNode.model.put()
    }

    @autobind
    deleteFile(){
        this.props.fileNode.destroy();
    }

    render(){
        const created = moment(new Date(this.props.fileNode.model.createdAt)).fromNow()
        const lastUpdated = moment(new Date(this.props.fileNode.model.updatedAt)).fromNow()
        return (
            <div>
                <div>
                    <button onClick={this.deleteFile}>Delete</button>
                </div>
                <div>
                    <div>
                        created: {created}
                    </div>
                    <div>
                        last updated: {lastUpdated}
                    </div>
                </div>
                <div>
                    <input value={this.props.fileNode.model.name} type="text" onChange={this.onFileNameChange} />
                </div>
                <div>
                    <div style={{width:'500px', height:'500px', position:'relative', flex: '1 0 0'}} ref={this.onEditorElement}></div>
                </div>
            </div>
        )
    }

}

const editorOptions = {
    theme: 'ace/theme/monokai',
    maxLines: Infinity,
    showGutter: true,
    showPrintMargin: false,
}

export default FileViewer;
