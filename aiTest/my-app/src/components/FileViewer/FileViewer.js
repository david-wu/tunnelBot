import React, { Component } from 'react';
import './FileViewer.css';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

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
        const fileSession = new ace.EditSession(props.file.content)
        fileSession.setMode('ace/mode/javascript')
        fileSession.on('change', ()=>{
            this.onEditorValueChange(this.aceEditor.getValue(), props.file)
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
        this.props.file.name = e.target.value
        this.debouncedPutFile()
    }

    @autobind
    putFile(){
        this.props.file.put()
    }

    render(){
        return (
            <div>
                <input value={this.props.file.name} type="text" onChange={this.onFileNameChange} />
                <div style={{width:'500px', height:'500px', position:'relative', flex: '1 0 0'}} ref={this.onEditorElement}></div>
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
